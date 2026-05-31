<?php

namespace App\Http\Controllers\Frontend;

use App\Traits\ApiResponse;
use App\Models\Order;
use App\Models\OrderLine;
use App\Models\Product\Product;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\ShoppingCart;
use App\Models\Cart as ModelsCart;
use App\Models\Customer;
use Inertia\Inertia;
use App\Services\VNPayService;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use App\Models\Config;
use App\Models\Product\FlashSale;
use Illuminate\Support\Facades\Notification;
use App\Notifications\CommonNotification;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;

final class OrderController extends Controller
{
    use ApiResponse;

    public $model = Order::class;

    public function index()
    {
        $items = $this->getCart();

        if (count($items) < 1) {
            return $this->empty();
        }

        return Inertia::render('Checkout/Index', [
            'modelForm' => form(new $this->model),
        ]);
    }

    public function calculateTotalCost(Request $request)
    {
        // Nhận dữ liệu từ client
        $customerType = $request->input('customer_type');
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $products = $this->getContent()['items'];

        // Gọi hàm tính chi phí đã được tạo ở phần trước
        $result = $this->calculateTotalCostWithDeposit($products, $startDate, $endDate, $customerType);

        // Trả về kết quả
        return response()->json($result);
    }

    public function calculateTotalCostWithDeposit($products, $startDate, $endDate, $customerType)
    {
        try {
            // Gán giá trị mặc định nếu $startDate hoặc $endDate không có
            $startDate = $startDate ?? Carbon::now()->format('Y-m-d');
            $endDate = $endDate ?? Carbon::now()->addDay()->format('Y-m-d');

            $totalCost = 0;
            $totalDeposit = 0;
            $productDetails = [];

            foreach ($products as $item) {
                $product = Product::query()->active()
                    ->where('id', $item['product']['id'])
                    ->first();

                $productId = $product['id'];
                $normalPricePerDay = $product['price']; // Giá thông thường mỗi ngày
                $quantity = $item['qty']; // Số lượng thuê

                // Lấy thông tin Flash Sale cho sản phẩm
                $flashSale = FlashSale::where('product_id', $productId)
                    ->whereDate('start_time', '<=', $endDate)
                    ->whereDate('end_time', '>=', $startDate)
                    ->first();

                // Giá Flash Sale mỗi ngày (nếu có)
                $flashSalePrice = $flashSale ? $flashSale->flash_sale_price : null;

                // Lặp qua từng ngày trong khoảng thuê
                $start = Carbon::parse($startDate);
                $end = Carbon::parse($endDate);
                $productTotalCost = 0;

                for ($date = $start->copy()->addDay(); $date->lte($end); $date->addDay()) {
                    if ($flashSale && $date->between($flashSale->start_time, $flashSale->end_time)) {
                        // Ngày trong khoảng Flash Sale
                        $productTotalCost += $flashSalePrice * $quantity;
                    } else {
                        // Ngày không trong Flash Sale
                        $productTotalCost += $normalPricePerDay * $quantity;
                    }
                }

                // Tính chi phí cọc nếu là khách thuê cá nhân
                if ($customerType == 'individual') {
                    $deposit = $productTotalCost * 0.30; // Cọc 30% cho khách cá nhân
                } else {
                    $deposit = 0; // Không có cọc cho đoàn phim
                }

                // Cộng dồn chi phí
                $totalCost += $productTotalCost;
                $totalDeposit += $deposit;

                // Lưu thông tin chi tiết sản phẩm
                $productDetails[] = [
                    'product_id' => $productId,
                    'quantity' => $quantity,
                    'normal_price_per_day' => $normalPricePerDay,
                    'flash_sale_price' => $flashSalePrice,
                    'product_total_cost' => $productTotalCost,
                    'deposit' => $deposit
                ];
            }

            $data = [
                'products' => $products,
                'total_cost' => $totalCost,
                'total_deposit' => $totalDeposit,
                'startDate' => $startDate,
                'endDate' => $endDate
            ];

            return response()->json($data);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }


    public function checkout(Request $request)
    {
        try {
            $params = $request->all();
            $items = $this->getCart();
            $infoCart = $this->getContent();
            $productKey = config('cart.cart_form.store.product_key');

            if (count($items) < 1) {
                return redirect()->back()->withErrors('Giỏ hàng trống, vui lòng thêm sản phẩm vào giỏ hàng.');
            }

            DB::beginTransaction();

            $rules = config('cart.order_form.rules');
            $validator = Validator::make($params, $rules);

            if ($validator->fails()) {
                return redirect()->back()->withErrors($validator->errors());
            }

            if (count($items) > 0) {
                $dataInsertOrder = [
                    'order_number' => Order::generateIdByPrefix(config('cart.order_number'), 'order_number'),
                    'status' => Order::STATUS_NEW,
                ];

                $columns = config('cart.order_form.all_columns');
                foreach ($columns as $column) {
                    $dataInsertOrder[$column] = $params[$column] ?? '';
                }

                $dataOrderLines = [];

                if ($productKey == 'product_id') {
                    foreach ($items as $item) {
                        $product = Product::active()->findOrFail($item['id']);

                        if ($product->stock_quantity <= 0) {
                            $product->is_stock = false;
                        }

                        $price = $product->is_flash_sale ? $product->sale_price :  $product->price;

                        $dataOrderLines[] = new OrderLine([
                            'product_id' => $product->id,
                            'title' => $product->title,
                            'quantity' => $item['qty'],
                            'price' => $price,
                            'total_discount' => 0,
                            'sku' => $product->sku,
                        ]);

                        $product->save();
                    }
                }

                $customer = $this->storeCustomer($params);

                $totalSubPrice = $params['total_price'];
                $depositFee = $params['total_deposit'];

                $dataInsertOrder['deposit_fee'] = $depositFee;
                $dataInsertOrder['total_price'] = $totalSubPrice;
                $dataInsertOrder['subtotal_price'] = $totalSubPrice;
                $dataInsertOrder['customer_id'] =  $customer->id;
                $dataInsertOrder['financial_status'] = Order::FINANCIAL_STATUS_ANY;
                $dataInsertOrder['payment_status'] = Order::STATUS_UNPAID;

                $order = Order::query()->create($dataInsertOrder);
                $order->orderLines()->saveMany($dataOrderLines);

                $params['vnp_Amount'] = $order->total_price;
                $params['vnp_TxnRef'] = $order->id;
                $params['vnp_ReturnUrl'] = route('checkout.payment.check_payment');

                $order = Order::query()->with('orderLines.product')->find($order->id)->transformDetails();
            }

            DB::commit();

            $data = [
                'status' => count($items) > 0,
                'order' => $order ?? [],
                'error' => count($items) === 0 ? 'error_cart_empty' : '',
            ];

            // $this->sendEmail($order);
            ModelsCart::empty();

            if (request()->wantsJson()) {
                return $data;
            }

            return $this->success($data);
        } catch (\Throwable $th) {
            dd($th);
        }
    }

    public function storeCustomer($data = [])
    {
        $customer = Customer::updateOrCreate([
            'phone' => $data['phone']
        ], [
            'name' => $data['name'],
            'email' => $data['email'],
        ]);

        $customer->increment('total_order');

        return $customer;
    }

    public function sendEmail($order)
    {
        try {
            $emails = explode(',', notification_to());
            $data['mail_title'] = 'Bạn nhận được đơn hàng mới';

            $data = [
                'mail_title' => 'Bạn nhận được đơn hàng mới',
                'order_number' => $order['order_number'],
                'name' => $order['name'],
                'email' => $order['email'],
                'phone' => $order['phone'],
                'total_price' => $order['total_price'],
                'link' => route('checkout.payment.tracking', ['orderNumber' => $order['order_number']])
            ];

            // Gửi mail về admin
            foreach ($emails as $email) {
                Notification::route('mail', $email)
                    ->notify(new CommonNotification($data));
            }

            // Gửi mail cho khách hàng
            if (!empty($order['email'])) {
                $data['mail_title'] = 'Bạn đã đặt hàng thành công';
                $data['link'] = route('checkout.payment.tracking', ['orderNumber' => $order['order_number']]);
                if (isset($data['email'])) {
                    $emailTo = $data['email'];

                    Notification::route('mail', $emailTo)
                        ->notify(new CommonNotification($data));
                }
            }
        } catch (\Throwable $th) {
            dd($th);
        }
    }

    public function getCart()
    {
        $shoppingCart = new ShoppingCart();
        return $shoppingCart->getProductsCart();
    }

    public function getContent()
    {
        $shoppingCart = new ShoppingCart();
        return $shoppingCart->getContent();
    }

    public function track()
    {
        return Inertia::render('Checkout/Tracking');
    }

    public function tracking($orderNumber)
    {
        $query = $this->model::query();
        $order = $query
            ->with(['orderLines', 'orderLines.product'])
            ->where('order_number', $orderNumber)->first();

        if (!$order) {
            return redirect('/');
        }

        if (request()->wantsJson()) {
            return $order->transformDetails();
        }

        return Inertia::render('Checkout/Success', [
            'order' => $order->transformDetails(),
        ]);
    }

    public function paymentFailed($orderNumber)
    {
        $query = $this->model::query();
        $order = $query
            ->with(['orderLines', 'orderLines.product'])
            ->where('order_number', $orderNumber)
            ->first();

        if (!$order) {
            return redirect('/');
        }

        if (request()->wantsJson()) {
            return $order->transformDetails();
        }

        return Inertia::render('Checkout/PaymentFailed', [
            'order' => $order->transformDetails(),
        ]);
    }

    public function checkPayment()
    {
        $isSuccess = false;
        $response = VNPayService::completePurchase(request()->all());

        if ($response['status'] == VNPayService::STATUS_PAID_SUCCESS) {
            $isSuccess = true;
        }

        $orderId = $response['order_id'];

        $order = Order::query()->find($orderId);

        if (!empty($order->id)) {
            if ($isSuccess) {
                $order->financial_status = Order::FINANCIAL_STATUS_PAID;

                if (Config::getShipping()['free_shipping_vnp']) {
                    $order->total_discounts = $order->shipping_cost;
                    $order->total_price = $order->subtotal_price;
                }

                $order->save();
                $this->sendEmail($order);

                ModelsCart::empty();

                return redirect()->action(
                    [self::class, 'tracking'],
                    ['orderNumber' => $order->order_number]
                );
            } else {
                return redirect()->action(
                    [self::class, 'paymentFailed'],
                    ['orderNumber' => $order->order_number]
                );
            }
        }

        return redirect('/');
    }

    public function empty()
    {
        $products = Product::query()
            ->active()
            ->whereHas('categories')
            ->orderByPosition()
            ->take(8)
            ->get()
            ->map(fn($item) => $item->transform());

        $data = [
            'products' => $products
        ];

        return Inertia::render('Checkout/Empty', $data);
    }

    public function checkPaymentStatus($orderNumber)
    {
        $query = $this->model::query();
        $order = $query
            ->with(['orderLines', 'orderLines.product'])
            ->where('order_number', $orderNumber)->first();

        if (!$order) {
            return redirect('/');
        }

        if (request()->wantsJson()) {
            return $order->transformDetails();
        }

        return Inertia::render('Checkout/Success', [
            'order' => $order->transformDetails(),
        ]);
    }

    public function checkPaymentOrderStatus(Request $request): JsonResponse
    {
        // Kiểm tra phương thức request và validate dữ liệu đầu vào
        $request->validate([
            'orderNumber' => 'required'
        ]);

        $orderNumber = $request->input('orderNumber');

        // Truy vấn đơn hàng từ database
        $order = DB::table('orders')->where('order_number', $orderNumber)->first();

        if ($order) {
            return response()->json(['payment_status' => $order->payment_status]);
        } else {
            return response()->json(['payment_status' => 'order_not_found'], 404);
        }
    }
}

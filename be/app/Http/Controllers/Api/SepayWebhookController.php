<?php

namespace App\Http\Controllers\Api;

use App\Models\Order;
use App\Models\Transaction;
use BeyondCode\QueryDetector\Outputs\Log;
use Illuminate\Routing\Controller;
use JamstackVietnam\Core\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SepayWebhookController extends Controller
{
    use ApiResponse;

    public function storeTransaction(Request $request)
    {
        $data = $request->all();

        $amount_in = $data['transferType'] === 'in' ? $data['transferAmount'] : 0;
        $amount_out = $data['transferType'] === 'out' ? $data['transferAmount'] : 0;

        try {
            DB::beginTransaction();

            // Lưu giao dịch vào CSDL
            $transaction = Transaction::create([
                'gateway' => $data['gateway'],
                'transaction_date' => $data['transactionDate'],
                'account_number' => $data['accountNumber'],
                'sub_account' => $data['subAccount'],
                'amount_in' => $amount_in,
                'amount_out' => $amount_out,
                'accumulated' => $data['accumulated'],
                'code' => $data['code'],
                'transaction_content' => $data['content'],
                'reference_number' => $data['referenceCode'],
                'body' => $data['description'],
            ]);

            // Tách mã đơn hàng từ nội dung giao dịch
            // Biểu thức regex để khớp với mã đơn hàng
            $regex = '/^(DH)(WC\d+)/';

            // Sử dụng preg_match để khớp regex với chuỗi nội dung chuyển tiền
            preg_match($regex, $data['content'], $matches);

            $pay_order_number = (string) $matches[2];

            // Tìm đơn hàng với điều kiện phù hợp
            $order = Order::where('order_number', $pay_order_number)
                ->where('payment_status', Order::STATUS_UNPAID)
                ->first();

            if (!$order) {
                DB::rollBack();
                return response()->json(['success' => false, 'message' => 'Order not found.'], 400);
            }

            // Cập nhật trạng thái đơn hàng
            $order->update(['payment_status' => Order::STATUS_PAID]);

            DB::commit();
            return response()->json(['success' => true, 'message' => 'Cập nhật trạng thái đơn hàng thành công'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}

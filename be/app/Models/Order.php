<?php

namespace App\Models;

use App\Models\BaseModel;
use App\Models\Product\FlashSale;
use App\Models\Product\Product;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Nicolaslopezj\Searchable\SearchableTrait;
use App\Traits\HashId;
use Carbon\Carbon;

/**
 * @package App\Models
 */
class Order extends BaseModel
{
    use SoftDeletes;
    use SearchableTrait;
    use HashId;

    public const STATUS_NEW = 'NEW'; // Trạng thái mới
    public const STATUS_VERIFIED = "VERIFIED"; // Xác nhận
    public const STATUS_PROCESSING = "PROCESSING"; // Đang xử lý
    public const STATUS_DELIVERING = "DELIVERING"; // Đang giao hàng
    public const STATUS_DELIVERED = "DELIVERED"; // Đã giao hàng
    public const STATUS_COMPLETED = "COMPLETED"; // Hoàn thành
    public const STATUS_CANCELLED = "CANCELLED"; // Huỷ"
    public const STATUS_UNREAD = "UNREAD"; // Chưa xem

    public const STATUS_UNPAID = 'UNPAID';
    public const STATUS_PAID = 'PAID';

    // trang thai thanh toan
    public const FINANCIAL_STATUS_AUTHORIZED = 'AUTHORIZED'; // Các Order có khoản tiền thanh toán đã được xác thực
    public const FINANCIAL_STATUS_PENDING = 'PENDING'; // Các Order đang tạm dừng thanh toán
    public const FINANCIAL_STATUS_PAID = 'PAID'; // Các Order đã được thanh toán
    public const FINANCIAL_STATUS_REFUNDED = 'REFUNDED'; // Các Order đã được hoàn trả
    public const FINANCIAL_STATUS_VOIDED = 'VOIDED'; // Các Order đã vô hiệu việc thanh toán
    public const FINANCIAL_STATUS_ANY = 'ANY'; // Các Order có trạng thái thanh toán là authorized, pending, và paid (mặc định)
    public const FINANCIAL_DEPOSIT = 'DEPOSIT'; // Đã cọc tiền

    public const PAYMENT_METHOD_COD = 1;
    public const PAYMENT_METHOD_VNPAY = 2;
    public const PAYMENT_METHOD_INTERNET_BANKING = 3;

    public const PERSONAL = 'individual';
    public const TEAM = 'team';

    public const STATUS_LIST = [
        self::STATUS_UNREAD => 'Chưa xem',
        self::STATUS_NEW => 'Đơn hàng mới',
        self::STATUS_VERIFIED => 'Xác nhận',
        self::STATUS_PROCESSING => 'Đang xử lý',
        self::STATUS_DELIVERING => 'Đang giao hàng',
        self::STATUS_DELIVERED => 'Đã giao hàng',
        self::STATUS_COMPLETED => 'Hoàn thành',
        self::STATUS_CANCELLED => 'Huỷ',
        self::STATUS_UNPAID => 'Chưa thanh toán',
        self::STATUS_PAID => 'Đã thanh toán',
    ];

    public const FINANCIAL_STATUS_LIST = [
        self::FINANCIAL_STATUS_AUTHORIZED => 'Đã được xác thực',
        self::FINANCIAL_STATUS_PENDING => 'Tạm dừng thanh toán',
        self::FINANCIAL_STATUS_PAID => 'Đã được thanh toán',
        self::FINANCIAL_STATUS_REFUNDED => 'Đã được hoàn trả',
        self::FINANCIAL_STATUS_VOIDED => 'Vô hiệu việc thanh toán',
        self::FINANCIAL_STATUS_ANY => 'Mặc định',
        self::FINANCIAL_DEPOSIT => 'Đã cọc tiền',
    ];

    public const PAYMENT_LIST = [
        self::PAYMENT_METHOD_COD => 'Thanh toán tiền mặt khi nhận hàng (COD)',
        self::PAYMENT_METHOD_VNPAY => 'Thanh toán bằng VNPAY',
        self::PAYMENT_METHOD_INTERNET_BANKING => 'Chuyển khoản',
    ];

    public const PAYMENT_STATUS_LIST = [
        self::STATUS_UNPAID => 'Chưa thanh toán',
        self::STATUS_PAID => 'Đã thanh toán',
    ];

    public const RENTAL_LIST = [
        self::PERSONAL => 'Cá nhân',
        self::TEAM => 'Đoàn làm phim',
    ];

    protected $table = 'orders';

    public $fillable = [
        'id',
        'order_number',
        'payment_method',
        'status',
        'payment_status',
        'cancel_status',
        'admin_note',
        'status_note',
        'taxes_included',
        'confirmed',
        'buyer_accepts_marketing',
        'discount_codes',

        'total_price',
        'shipping_cost',
        'subtotal_price',
        'total_discounts',
        'deposit_fee',
        'total_line_items_price',
        'total_weight',

        'customer_id',
        'name',
        'phone',
        'email',
        'note',

        'currency',
        'financial_status',
        'cancel_reason',
        'cancelled_at',
        'checkout_token',
        'reference',
        'device_id',
        'browser_ip',
        'note_attributes',
        'payment_gateway_names',

        'processing_method',
        'closed_at',

        'billing_address',
        'shipping_address',
        'shipping_lines',
        'tax_lines',
        'city',
        'district',
        'ward',

        'creator_id',
        'editor_id'
    ];

    protected $casts = [
        'closed_at' => 'datetime',
        'tax_lines' => 'array',
        'shipping_address' => 'array',
        'subtotal_price' => 'int',
    ];

    protected $dates = [
        'deleted_at',
    ];

    public $searchable = [
        'columns' => [
            'orders.order_number' => 10,
            'orders.id' => 9,
            'orders.name' => 7,
            'orders.email' => 5,
            'orders.status' => 2,
        ],
    ];

    public $with = ['orderLines'];

    protected $appends = [
        'formatted_payment_method',
        'formatted_status',
        'formatted_start_rental_date',
        'formatted_end_rental_date',
        'formatted_payment_status'
    ];

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'email|nullable|string|max:255',
            'phone' => 'required|string|max:255',
            'payment_method' => 'required',
        ];
    }

    protected static function booted() {}

    /**
     * Điều chỉnh số lượng sản phẩm và Flash Sale
     * 
     * @param int $productId
     * @param int $quantity
     * @param int $adjustment -1 để trừ, 1 để cộng
     */
    protected static function adjustProductAndFlashSale(int $productId, int $quantity, int $adjustment)
    {
        $product = Product::find($productId);
        if (!$product) return;

        $currentDateTime = Carbon::now();

        // Tìm Flash Sale đang hoạt động
        $flashSale = FlashSale::where('product_id', $productId)
            ->where('start_time', '<=', $currentDateTime)
            ->where('end_time', '>=', $currentDateTime)
            ->first();

        // Cập nhật số lượng trong kho
        $product->stock_quantity += ($adjustment * $quantity);

        // Cập nhật trạng thái is_stock
        $product->is_stock = $product->stock_quantity > 0;

        // Cập nhật số lượng Flash Sale (nếu có)
        if ($flashSale) {
            $flashSale->flash_sale_quantity += ($adjustment * $quantity);
            $flashSale->save();
        }

        // Lưu thay đổi sản phẩm
        $product->save();
    }


    public function orderLines(): HasMany
    {
        return $this->hasMany(OrderLine::class);
    }

    public function getFormattedStatusAttribute()
    {
        return self::STATUS_LIST[$this->status];
    }

    public function getFormattedPaymentStatusAttribute()
    {
        return self::PAYMENT_STATUS_LIST[$this->payment_status];
    }

    public function getFormattedFinancialStatusAttribute()
    {
        return self::FINANCIAL_STATUS_LIST[$this->financial_status];
    }

    public function getFormattedStartRentalDateAttribute(): string
    {
        return to_date($this->attributes['start_rental_date'], 'd/m/Y');
    }

    public function getFormattedEndRentalDateAttribute(): string
    {
        return to_date($this->attributes['end_rental_date'], 'd/m/Y');
    }

    public function getFormattedPaymentMethodAttribute()
    {
        return self::PAYMENT_LIST[$this->payment_method] ?? '--';
    }

    public function getNumberOfItemsAttribute()
    {
        return $this->orderLines->count();
    }

    public function transform(): array
    {
        return [
            'id' => $this->id,
            'customer_name' => $this->customer_name,
            'name' => $this->name,
            'order_number' => $this->order_number,
            'email' => $this->email,
            'phone' => $this->phone,
            'number' => $this->number,
            'total_price' => $this->total_price,
            'subtotal_price' => $this->subtotal_price,
            'total_tax' => $this->total_tax,
            'total_discounts' => $this->total_discounts,
            'currency' => $this->currency,
            'financial_status' => $this->financial_status,
            'note' => $this->note,
            "created_at" => $this->created_at,
            "updated_at" =>  $this->updated_at,
        ];
    }

    public function transformDetails(): array
    {
        $lineItems = $this->orderLines->map(
            function ($item) {
                return [
                    'order_id' => $item->order_id,
                    'product_id' => $item->product_id,
                    'price' => $item->price,
                    'sale_price' => $item->sale_price,
                    'is_sale' => $item->is_sale,
                    'qty' => $item->quantity,
                    'product' => $item->product->transform()
                ];
            }
        );

        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'number' => $this->number,
            'total_price' => $this->total_price,
            'formatted_rental' => $this->formatted_rental,
            'deposit_fee' => $this->deposit_fee,
            'formatted_financial_status' => $this->formatted_financial_status,
            'formatted_payment_status' => $this->formatted_payment_status,
            'subtotal_price' => $this->subtotal_price,
            'shipping_cost' => $this->shipping_cost,
            'total_tax' => $this->total_tax,
            'total_discounts' => $this->total_discounts,
            "formatted_status" => $this->formatted_status,
            'note' => $this->note,
            'discount_codes' => $this->discount_codes,
            'tax_lines' => $this->tax_lines,
            'shipping_address' => $this->shipping_address,
            'full_address' => $this->full_address,
            "formatted_payment_method" => $this->formatted_payment_method,
            "created_at" => $this->created_at,
            "updated_at" =>  $this->updated_at,
            'line_items' => $lineItems,

            "start_rental_date" => $this->formatted_start_rental_date,
            "end_rental_date" =>  $this->formatted_end_rental_date,
            "rental_date" => $this->rental_date,
            'rental' => $this->rental,
        ];
    }

    public function transformEmail()
    {
        return [
            'Họ và tên' => $this->customer_name,
            'Địa chỉ' => $this->shipping_address,
            'Số điện thoại' => $this->phone,
            'Ghi chú' => $this->note,
            'Tổng tiền' => $this->total_price,
            'Phí đặt cọc' => $this->deposit_fee,
            'url' => route('sidebar.orders.form', ['id' => $this->id])
        ];
    }
}

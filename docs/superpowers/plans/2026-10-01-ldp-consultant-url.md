# Triển Khai URL Landing Page Cố Vấn Bán Hàng (`/ldp/[salesSlug]`)

> **Dành cho kỹ sư triển khai:** BẮT BUỘC SỬ DỤNG: superpowers:subagent-driven-development (khuyến nghị) hoặc superpowers:executing-plans để thực thi từng task. Mỗi bước sử dụng checkbox (`- [ ]`) để theo dõi tiến độ.

**Mục tiêu:** Cho phép truy cập trực tiếp URL của Cố vấn bán hàng theo định dạng `https://dongnaiford.com.vn/ldp/[salesSlug]` (ví dụ: `/ldp/nguyen-thi-thu-trang`), hiển thị đầy đủ thông tin Cố vấn, Showroom lưới xe Cố vấn phụ trách, chương trình khuyến mãi và form liên hệ.

**Kiến trúc:**
1. **Backend:** Bổ sung endpoint `GET /api/ldp/{sales_slug}` trong `LandingPageApiController.php` và `routes/api.php`, trả về dữ liệu Cố vấn bán hàng, toàn bộ danh sách xe phụ trách, khuyến mãi, khối giao diện và thông tin SEO.
2. **Frontend Lib:** Cập nhật `fe/src/lib/api.ts` bổ sung phương thức `ldpAPI.getBySalesSlug(salesSlug)`.
3. **Frontend Routing:** Tạo route Server Component mới `fe/src/app/ldp/[salesSlug]/page.tsx` phục vụ SSR và SEO metadata cho trang Cố vấn.
4. **Middleware:** Cập nhật `fe/src/middleware.ts` để khi nhân viên dùng custom domain riêng truy cập vào trang chủ (`/`), hệ thống sẽ rewrite sạch sẽ về `/ldp/${salesSlug}` thay vì bắt buộc kèm xe mặc định.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Laravel 10 (PHP 8.2).

## Ràng Buộc Chung (Global Constraints)
- Tuân thủ nghiêm ngặt **strict-working-rules**: Không sửa file dùng chung không liên quan, giữ nguyên mã nguồn hiện có.
- Không gây lỗi typecheck TypeScript (`npx tsc --noEmit`) và không gây lỗi cú pháp PHP.
- Đảm bảo cơ chế fallback an toàn: Nếu cố vấn chưa được cấu hình LDP cụ thể, vẫn nạp thông tin Cố vấn và danh sách xe đang bán để không bị crash trang.

## Trọng Tâm Rà Soát (Review Focus)
1. Trường hợp slug Cố vấn không tồn tại trong hệ thống: API trả về 404, Next.js gọi `notFound()`.
2. Trường hợp Cố vấn có nhiều xe hoặc chưa gán xe nào: Tự động nạp toàn bộ xe active của hệ thống để Showroom không bị trống.
3. Trường hợp Cố vấn dùng tên miền riêng (custom domain): Truy cập `domain.vn/` phải hiển thị trang Showroom Cố vấn, truy cập `domain.vn/ford-ranger` hiển thị chi tiết xe.
4. Tương thích ngược: Route cũ `/ldp/[salesSlug]/[vehicleSlug]` vẫn hoạt động hoàn hảo khi khách bấm vào từng xe từ lưới Showroom.

---

### Task 1: Bổ sung Endpoint API Backend `GET /api/ldp/{sales_slug}`

**Files:**
- Sửa: `be/routes/api.php`
- Sửa: `be/app/Http/Controllers/Api/LandingPageApiController.php`

**Giao diện & Phương thức:**
- Nhận: `string $sales_slug` từ route parameter.
- Trả về: `JsonResponse` chuẩn `ApiResponse::success(...)` chứa:
  - `sales_consultant`: Thông tin chi tiết cố vấn bán hàng (họ tên, ảnh, hotline, zalo, giới thiệu).
  - `vehicle`: Dòng xe đại diện đầu tiên để làm ngữ cảnh layout.
  - `vehicles`: Mảng danh sách tất cả các xe cố vấn phụ trách (kèm các phiên bản, màu sắc, giá).
  - `layout_blocks`: Danh sách các blocks giao diện chuẩn (hoặc tự động chèn `LdpSalesConsultant`, `LdpVehiclesGrid`, `LdpPromotions`).
  - `promotions`: Khuyến mãi hệ thống và tự nhập.
  - `seo`: Thông tin SEO cá nhân hóa cho Cố vấn.

- [ ] **Bước 1: Khai báo route trong `be/routes/api.php`**
  Thêm route trước route chi tiết xe:
  ```php
  Route::get('ldp/{sales_slug}', [\App\Http\Controllers\Api\LandingPageApiController::class, 'showConsultant'])->name('api.ldp.show-consultant');
  ```

- [ ] **Bước 2: Viết method `showConsultant(string $sales_slug)` trong `LandingPageApiController.php`**
  - Tìm `SalesConsultant` active theo `$sales_slug` (có hỗ trợ fallback 'ton' -> 'toan'). Nếu không thấy trả về `failure('Không tìm thấy cố vấn bán hàng', 404)`.
  - Tìm `LandingPage` active theo `sales_consultant_id`.
  - Lấy danh sách xe (`$vehicleIds`) từ LDP hoặc từ tất cả LDP của cố vấn hoặc toàn bộ xe active.
  - Chuẩn hóa `$allVehiclesData`.
  - Lấy xe đại diện (`$vehicle`) là xe đầu tiên trong danh sách.
  - Chuẩn hóa `$promotionsData` qua hàm `resolvePromotions()`.
  - Chuẩn hóa `$layoutBlocks` qua hàm `resolveLayoutBlocksUrls()`.
  - Trả về `success(...)`.

- [ ] **Bước 3: Xác minh route bằng artisan**
  Chạy kiểm tra cú pháp và danh sách route:
  ```bash
  cd be; php artisan route:list --name=api.ldp
  ```
  Kỳ vọng: Có route `GET api/ldp/{sales_slug}` với tên `api.ldp.show-consultant`.

---

### Task 2: Cập nhật API Client Frontend trong `fe/src/lib/api.ts`

**Files:**
- Sửa: `fe/src/lib/api.ts`

- [ ] **Bước 1: Bổ sung phương thức `getBySalesSlug` vào `ldpAPI`**
  ```typescript
  export const ldpAPI = {
    // Tra cứu domain riêng
    lookupDomain: (domain: string) => fetchAPI<any>(`/ldp/lookup-domain?domain=${encodeURIComponent(domain)}`),

    // Lấy thông tin LDP theo Cố vấn bán hàng (Trang chủ LDP)
    getBySalesSlug: (salesSlug: string) => fetchAPI<any>(`/ldp/${salesSlug}`, { cache: 'no-store' }),

    // Lấy chi tiết xe cụ thể trong LDP
    getBySlug: (salesSlug: string, vehicleSlug: string) => fetchAPI<any>(`/ldp/${salesSlug}/${vehicleSlug}`, { cache: 'no-store' }),
  };
  ```

- [ ] **Bước 2: Kiểm tra biên dịch TypeScript**
  Đảm bảo hàm `getBySalesSlug` không có lỗi cú pháp.

---

### Task 3: Tạo Route Mới `fe/src/app/ldp/[salesSlug]/page.tsx`

**Files:**
- Tạo mới: `fe/src/app/ldp/[salesSlug]/page.tsx`

**Giao diện:**
- Nhận: `params: Promise<{ salesSlug: string }>`
- Xuất: Server Component nạp dữ liệu và xuất `LdpDetailClient` kèm SEO Metadata.

- [ ] **Bước 1: Viết hàm `generateMetadata` cho Cố vấn bán hàng**
  - Gọi `ldpAPI.getBySalesSlug(salesSlug)`.
  - Thiết lập `title`: `${name} - Cố Vấn Bán Hàng | Đồng Nai Ford`.
  - Thiết lập `description`: Mô tả tư vấn xe, báo giá lăn bánh và hỗ trợ mua xe chính hãng của Cố vấn.
  - Thiết lập `canonical`: `https://dongnaiford.com.vn/ldp/${salesSlug}`.
  - Thiết lập OpenGraph ảnh đại diện Cố vấn hoặc banner LDP.

- [ ] **Bước 2: Viết Component chính `Page`**
  - Lấy `salesSlug` từ `await params`.
  - Gọi `ldpAPI.getBySalesSlug(salesSlug)`.
  - Nếu không có dữ liệu -> gọi `notFound()`.
  - Chuẩn hóa `ldpData.vehicle` bằng helper `normalizeVehicle` tương tự như ở `[vehicleSlug]/page.tsx`.
  - Render `<LdpDetailClient initialData={ldpData} />`.

---

### Task 4: Tinh Chỉnh Rewrite Trong `fe/src/middleware.ts`

**Files:**
- Sửa: `fe/src/middleware.ts`

- [ ] **Bước 1: Cập nhật logic rewrite cho Custom Domain của Cố vấn**
  Khi một Cố vấn sử dụng tên miền vệ tinh riêng (ví dụ `nguyenthithutrangford.vn`):
  Nếu người dùng truy cập trang chủ (`/`):
  ```typescript
  if (!vehicleSlug) {
    // Chuyển trực tiếp về Showroom Cố vấn thay vì ép sang một xe cụ thể
    url.pathname = `/ldp/${salesSlug}`;
  } else {
    url.pathname = `/ldp/${salesSlug}/${vehicleSlug}`;
  }
  ```

---

### Task 5: Kiểm Thử & Xác Minh Hoàn Chỉnh

- [ ] **Bước 1: Kiểm tra biên dịch TypeScript Frontend**
  ```bash
  cd fe; npx tsc --noEmit
  ```
  Kỳ vọng: Không có lỗi type nào trong toàn bộ dự án.

- [ ] **Bước 2: Kiểm tra điều hướng thực tế**
  - Truy cập thử nghiệm route: `/ldp/nguyen-thi-thu-trang` (hoặc slug của cố vấn có thật trong DB).
  - Kiểm tra các liên kết xe trong lưới Showroom: Bấm vào xe chuyển mượt mà tới `/ldp/[salesSlug]/[vehicleSlug]`.

# Kế Hoạch Triển Khai: Đưa Các Khối Trang Chủ Sang Landing Page Cố Vấn (Vấn Đề 2)

> **Mục tiêu:** Mang 4 khối quan trọng từ Trang chủ (`dongnaiford.com.vn`) sang trang Landing Page của Cố vấn bán hàng:
> 1. **Hero Banner** (Slideshow banner đại lý/cố vấn với nút CTA kết nối trực tiếp với Cố vấn)
> 2. **Phần Công nghệ (Technology)** (Giới thiệu Ứng dụng Ford, Co-Pilot360™, Âm thanh B&O)
> 3. **Các Dịch vụ (Services)** (Bảo dưỡng, Sửa chữa, Đồng sơn, Phụ tùng chính hãng)
> 4. **Các Câu hỏi thường gặp (FAQs)** (Accordion giải đáp thắc mắc mua xe, chính sách, dịch vụ)
>
> **Tuân thủ:** `strict-working-rules` (Giao tiếp tiếng Việt, diff nhỏ ≤ 50 dòng, typecheck `tsc`, kiểm thử thực tế).

---

## 1. Phân Tích Hiện Trạng & Kiến Trúc

### A. Nguồn dữ liệu & logic từ Trang Chủ (`fe/src/app/HomeClient.tsx`)
- **Hero Banner:** Quản lý bằng slideshow đa banner (`bannersAPI.getAll()`), có ảnh desktop/mobile, tiêu đề, mô tả, nút CTA, thanh tab chuyển slide.
- **Technology (Công nghệ):** Mảng 3 slide công nghệ (`techSlides`) với tab chọn, slider vuốt kéo, hiển thị phân loại và mô tả chi tiết.
- **Services (Dịch vụ):** Nạp qua `servicesAPI.getAll()`, hiển thị dạng marquee liên tục `animate-marquee-continuous` với thẻ card hình ảnh dịch vụ.
- **FAQs (Hỏi đáp):** Mảng 6 câu hỏi chính sách chuẩn (`faqs`) hiển thị dạng Accordion 2 cột sang trọng.

### B. Kiến trúc Landing Page Cố Vấn (`fe/src/app/ldp/[salesSlug]` & `LdpDetailClient.tsx`)
- LDP hoạt động theo hệ thống khối động (`Blocks.tsx`).
- Trên trang LDP Tổng (`/ldp/[salesSlug]`), Backend `LandingPageApiController::resolveConsultantLayoutBlocks` đang cung cấp các block mặc định (`LdpSalesConsultant`, `LdpVehiclesGrid`, `LdpPromotions`).
- Tại `fe/src/components/vehicle/LdpDetailClient.tsx`, các block được chia thành `topBlocks`, `heroBlock` và `bottomBlocks`.

### C. Giải Pháp Kiến Trúc Tối Ưu
Chúng ta sẽ tách và đóng gói 4 khối thành các component module hóa chuẩn mực, đặt tại thư mục `fe/src/components/blocks/`:
1. `fe/src/components/blocks/LdpHeroBannerBlock.tsx`: Slideshow banner chuyên nghiệp, hỗ trợ banner đại lý từ `bannersAPI.getAll()` hoặc banner tùy chỉnh, tích hợp mở Drawer Báo giá / Lái thử của Cố vấn và nút cuộn đến Showroom xe.
2. `fe/src/components/blocks/LdpTechnologyBlock.tsx`: Khối công nghệ tương tác (Ứng dụng Ford, Co-Pilot360, Âm thanh B&O) kế thừa nguyên bản thiết kế cao cấp từ trang chủ.
3. `fe/src/components/blocks/LdpServicesBlock.tsx`: Khối dịch vụ chính hãng tự động nạp từ API dịch vụ, hiệu ứng trượt mượt mà.
4. `fe/src/components/blocks/LdpFaqBlock.tsx`: Khối Accordion hỏi đáp 2 cột phong cách Đồng Nai Ford.

Đồng thời:
- Đăng ký 4 block mới vào `fe/src/components/blocks/Blocks.tsx`.
- Cập nhật Backend `LandingPageApiController.php` hàm `resolveConsultantLayoutBlocks` để mặc định LDP của Cố vấn có đầy đủ các khối này theo thứ tự hài hòa:
  `HeroBanner` / `LdpHeroBanner` ➔ `LdpSalesConsultant` ➔ `LdpVehiclesGrid` ➔ `LdpPromotions` ➔ `LdpTechnology` ➔ `LdpServices` ➔ `LdpFaq`.
- Cập nhật `LdpDetailClient.tsx` để đảm bảo fallback tự động chèn các khối này nếu trang LDP chưa có cấu hình tùy biến.

---

## 2. Kế Hoạch Các Bước Thực Hiện (Tasks)

### Task 1: Xây dựng Component `LdpHeroBannerBlock.tsx`
- **File:** `fe/src/components/blocks/LdpHeroBannerBlock.tsx`
- **Nhiệm vụ:**
  - Nạp banner từ `bannersAPI.getAll()` hoặc từ dữ liệu block.
  - Render slideshow fade transition, hỗ trợ cả desktop & mobile.
  - Nút "Book Lái thử" / "Nhận báo giá": Gọi `openQuoteDrawer()` hoặc `openDriveModal()` của Cố vấn.
  - Nút "Khám phá ngay": Cuộn mượt (`smooth scroll`) xuống phần showroom xe Cố vấn (`#consultant-vehicles`).
  - Đảm bảo đầy đủ navigation buttons và tab indicator.

### Task 2: Xây dựng Component `LdpTechnologyBlock.tsx`
- **File:** `fe/src/components/blocks/LdpTechnologyBlock.tsx`
- **Nhiệm vụ:**
  - Tái tạo phần công nghệ đỉnh cao từ trang chủ: Ứng dụng Ford, Co-Pilot360™, Âm thanh B&O.
  - Hỗ trợ chuyển tab, kéo vuốt mượt mà trên cả máy tính lẫn điện thoại.
  - Nút "Trải nghiệm ngay": Kích hoạt modal lái thử cùng Cố vấn.

### Task 3: Xây dựng Component `LdpServicesBlock.tsx`
- **File:** `fe/src/components/blocks/LdpServicesBlock.tsx`
- **Nhiệm vụ:**
  - Nạp danh sách dịch vụ từ `servicesAPI.getAll()` (có sẵn fallback an toàn).
  - Áp dụng marquee slider liên tục `animate-marquee-continuous` đồng bộ trang chủ.
  - Dẫn liên kết đến `/dich-vu/[slug]`.

### Task 4: Xây dựng Component `LdpFaqBlock.tsx`
- **File:** `fe/src/components/blocks/LdpFaqBlock.tsx`
- **Nhiệm vụ:**
  - Render giao diện FAQ 2 cột hiện đại: Cột trái tiêu đề, Cột phải danh sách Accordion.
  - Animation mở/đóng mượt mà, hỗ trợ cả tùy biến câu hỏi hoặc dùng 6 câu hỏi chuẩn của Đồng Nai Ford.

### Task 5: Tích hợp vào `Blocks.tsx` & `LdpDetailClient.tsx`
- **File:** `fe/src/components/blocks/Blocks.tsx`
  - Import và thêm `case "LdpHeroBanner"`, `case "LdpTechnology"`, `case "LdpServices"`, `case "LdpFaq"`.
- **File:** `fe/src/components/vehicle/LdpDetailClient.tsx`
  - Đảm bảo tự động chèn các khối này vào LDP nếu trang chưa có (auto-injection an toàn).

### Task 6: Cập nhật Backend `LandingPageApiController.php`
- **File:** `be/app/Http/Controllers/Api/LandingPageApiController.php`
- **Nhiệm vụ:**
  - Trong `resolveConsultantLayoutBlocks()`, bổ sung các block `LdpHeroBanner`, `LdpTechnology`, `LdpServices`, `LdpFaq` vào danh sách blocks mặc định trả về cho LDP Cố vấn.

### Task 7: Kiểm Thử & Xác Minh Hoàn Chỉnh
- **TypeScript Typecheck:** Chạy `npx tsc --noEmit` trong thư mục `fe/`.
- **PHP Lint:** Chạy `php -l be/app/Http/Controllers/Api/LandingPageApiController.php`.
- **Manual Verification:** Kiểm tra trực tiếp trên trình duyệt `http://localhost:3000/ldp/tran-thi-thao` xem toàn bộ 4 khối hiển thị đẹp mắt, tương tác hoạt động tốt.

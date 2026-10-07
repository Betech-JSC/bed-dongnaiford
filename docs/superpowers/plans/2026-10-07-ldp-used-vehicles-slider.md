# Kế Hoạch Triển Khai: Section Slider Xe Đã Qua Sử Dụng Cho Landing Page (LDP)

> **Mục tiêu:** Tạo một khối (Section/Block) Slider hiển thị các dòng xe Ford đã qua sử dụng (lấy tự động từ module xe cũ trong CMS) xuất hiện trên các trang Landing Page (trang chủ cố vấn & trang chi tiết xe LDP), cho phép khách hàng xem các mẫu xe Ford Assured chính hãng đang có sẵn.

**Kiến trúc:**
- Sử dụng mô hình LDP Block độc lập (`LdpUsedVehiclesBlock.tsx`) tuân thủ chuẩn `Blocks.tsx` hiện có của dự án.
- Tận dụng REST API `/api/used-vehicles` đã có sẵn qua `usedVehiclesAPI.getAll()` trong `@/lib/api`.
- Slider thuần React + Tailwind CSS (không cài thêm thư viện ngoài), hỗ trợ nút Next/Prev, kéo vuốt mượt mà, dots chỉ báo và auto-play thông minh (tự pause khi hover chuột).
- Tích hợp vào CMS BlockEditor để Admin / Cố vấn có thể đổi tiêu đề, mô tả và sắp xếp vị trí block.

**Tech Stack:** Next.js 16 (React 19), Tailwind CSS, Lucide React, Laravel 10 (Inertia.js + Vue 3).

---

## 1. Phân Tích Hiện Trạng & Ranh Giới (Recon & Boundaries)

1. **Dữ liệu Xe Đã Qua Sử Dụng (CMS & API)**:
   - Module quản trị: `be/app/Models/UsedVehicle/UsedVehicle.php`
   - API Controller: `be/app/Http/Controllers/Api/UsedVehicleController.php` cung cấp `GET /api/used-vehicles`
   - Client API: `usedVehiclesAPI.getAll()` trong `fe/src/lib/api.ts`
   - Dữ liệu trả về gồm: `id`, `title`, `slug`, `tagline`, `price`, `year`, `odo`, `image_url`, `images_urls`.
2. **Giao diện chuẩn của Xe Cũ**:
   - Trang tham chiếu: `https://dongnaiford.com.vn/xe-da-qua-su-dung` (`fe/src/app/xe-da-qua-su-dung/XeDaQuaSuDungClient.tsx`).
   - Card hiển thị gồm:
     - Badge xanh: `Ford Assured` kèm icon `ShieldCheck`
     - Ảnh xe với hiệu ứng sang trọng
     - Năm sản xuất (`Calendar`) & ODO (`Gauge`)
     - Tiêu đề xe & Tagline
     - Mức giá đỏ nổi bật (`formatPrice`)
     - **Lưu ý quan trọng theo yêu cầu**: CHỈ SHOW XE, KHÔNG cho khách bấm vào xem chi tiết xe (không gắn link đến `/xe-da-qua-su-dung/[slug]`, chỉ xem thông tin trực quan hoặc bấm nút "Liên hệ tư vấn" với Cố vấn bán hàng).
3. **Cơ chế Landing Page (LDP)**:
   - LDP Detail (`/ldp/[salesSlug]/[vehicleSlug]`): Dựng từ mảng `layout_blocks` qua `Blocks.tsx`. Cần thêm block type `LdpUsedVehicles`.
   - LDP Home (`/ldp/[salesSlug]`): Giao diện tổng quan cố vấn `LdpHomeClient.tsx`. Cần chèn section slider xe cũ.
   - CMS Admin Builder: `be/resources/Backend/js/Components/Form/Custom/BlockEditor.vue` quản lý danh sách block cho phép bật/tắt hoặc cấu hình tiêu đề.

---

## 2. Kế Hoạch Thực Hiện Từng Bước (Tasks)

### Task 1: Xây dựng Component `LdpUsedVehiclesBlock.tsx`
- **Tập tin tạo mới:** `fe/src/components/blocks/LdpUsedVehiclesBlock.tsx`
- **Trách nhiệm:**
  - Nhận props: `data` (tiêu đề, phụ đề, limit), `salesConsultant`, `anchorId`.
  - Tự động gọi `usedVehiclesAPI.getAll()` khi mount. Nếu không có dữ liệu xe cũ, ẩn block an toàn (tránh render khối rỗng).
  - Xây dựng giao diện Slider ngang:
    - Hiển thị xe dạng thẻ trưng bày thuần túy (display-only, không có thẻ link sang trang chi tiết).
    - Có thể kèm nút "Nhận báo giá / Tư vấn" mở drawer tư vấn của Cố vấn bán hàng.
    - Hiển thị 1 xe (mobile), 2 xe (tablet), 3 xe (desktop).
    - Nút điều hướng Previous / Next bo tròn với hiệu ứng hover.
    - Thanh chỉ báo Dots / Progress bar.
    - Auto-slide mượt mà mỗi 4 giây (tự pause khi hover chuột).

### Task 2: Đăng ký Block vào `Blocks.tsx` & cấu hình mặc định trong `LdpDetailClient.tsx`
- **Tập tin chỉnh sửa:**
  - `fe/src/components/blocks/Blocks.tsx`
  - `fe/src/components/vehicle/LdpDetailClient.tsx`
- **Trách nhiệm:**
  - Import `LdpUsedVehiclesBlock` vào `Blocks.tsx`.
  - Bổ sung `case "LdpUsedVehicles":` vào hàm switch-case render component.
  - Thêm nhãn tên `"Xe đã qua sử dụng (Slider)"` trong `getBlockLabel`.
  - Bổ sung `LdpUsedVehicles` vào mảng block mặc định trong `LdpDetailClient.tsx` để các trang LDP mới hoặc fallback có sẵn block này.

### Task 3: Tích hợp Section Slider Xe Cũ vào Trang Chủ LDP `LdpHomeClient.tsx`
- **Tập tin chỉnh sửa:** `fe/src/components/vehicle/LdpHomeClient.tsx`
- **Trách nhiệm:**
  - Đặt section xe cũ vào vị trí hài hòa trên trang chủ Cố vấn (ngay sau Dịch vụ hoặc Bàn giao xe).
  - Sử dụng chung `LdpUsedVehiclesBlock` hoặc render slider đồng bộ với theme Cố vấn (truyền thông tin `salesConsultant` để hỗ trợ tư vấn xe cũ).

### Task 4: Đăng ký Block Type trong CMS Admin `BlockEditor.vue`
- **Tập tin chỉnh sửa:** `be/resources/Backend/js/Components/Form/Custom/BlockEditor.vue`
- **Trách nhiệm:**
  - Thêm item `{ type: 'LdpUsedVehicles', icon: '🚙', name: 'Xe đã qua sử dụng (Slider)', desc: 'Slide hiển thị các dòng xe Ford cũ chính hãng (Ford Assured)' }` vào mảng `availableBlocks`.
  - Thiết lập dữ liệu khởi tạo mặc định trong hàm `addBlock(type)`.
  - Thêm form cấu hình tiêu đề / phụ đề trong sidebar khi chọn block này.

---

## 3. Rủi Ro & Kế Hoạch Hoàn Tác (Rollback Plan)

- **Rủi ro:**
  1. *CMS chưa nhập xe cũ nào:* Component kiểm tra `vehicles.length === 0` và không render giao diện, đảm bảo layout LDP không bị lỗi hay tạo khoảng trống vô nghĩa.
  2. *Responsive trên màn hình nhỏ:* Slider thiết kế theo dạng flex/scroll snap kèm kích thước card linh hoạt (`w-[280px]` trên mobile, `w-[360px]` trên desktop) tránh tràn khung hình.
- **Hoàn tác:**
  - Nếu cần rollback, chỉ cần revert đúng các file đã chỉnh sửa bằng `git checkout -- <file>` mà không ảnh hưởng tới bất kỳ dữ liệu nào của cơ sở dữ liệu.

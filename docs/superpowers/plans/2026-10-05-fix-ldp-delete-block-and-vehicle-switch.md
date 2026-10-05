# Kế hoạch thực hiện: Sửa lỗi Lưu khi xoá khối LDP Admin & Điều hướng dòng xe LDP

> **Ngày tạo:** 2026-10-05  
> **Trạng thái:** Chờ người dùng duyệt (Pending Approval)  
> **Mục tiêu:**
> 1. Khắc phục triệt để lỗi khi bấm "Xóa khối" trong Admin CMS Landing Pages (`/admin/landing-pages/form/13`), bấm "Lưu trang" bị báo lỗi console và kẹt trạng thái "Đang lưu...".
> 2. Khắc phục lỗi trên trang LDP công khai khi người dùng chọn dòng xe khác trong danh sách phụ trách, trang bị tải lại và cuộn lên đỉnh đầu trang (Hero Banner) thay vì nhảy xuống ngay thông tin chi tiết xe.

---

## 1. Phân tích nguyên nhân gốc rễ (Root Cause Analysis)

### Vấn đề 1: Bấm xoá khối mà khi lưu bị lỗi không thành công trong LDP Admin

**Hiện tượng từ hình ảnh thực tế:**
- Trong [be/resources/Backend/js/Pages/LandingPages/Form.vue](file:///d:/git/bed-dongnaiford/be/resources/Backend/js/Pages/LandingPages/Form.vue), người dùng bấm nút thùng rác xoá khối `Khối 2: LdpSalesConsultant`.
- Số khối hiển thị giảm từ (11) xuống (10).
- Khi bấm nút **"Lưu trang"**, nút bị kẹt ở trạng thái `⏳ Đang lưu...` vĩnh viễn và DevTools Console báo lỗi:
  ```
  at I.post (app.ce0dd01d.js:235:27502)
  at Proxy.submit (app.ce0dd01d.js:813:63083)
  at Proxy.saveFromBuilder (Form.59a3d747.js:1:11617)
  at onClick (Form.59a3d747.js:1:38775)
  ```

**Nguyên nhân kỹ thuật:**
1. **Xung đột kiểu dữ liệu & FormData conversion của Inertia:**
   - Trong [be/resources/Backend/js/Components/Form/Form.vue:181](file:///d:/git/bed-dongnaiford/be/resources/Backend/js/Components/Form/Form.vue#L181), hàm `submit()` thực hiện:
     ```js
     this.$inertia.post(this.route(`admin.${this.currentResource}.store`, { id: this.form?.id }), this.form, ...)
     ```
   - `this.form` ở đây là một đối tượng `InertiaForm` do `this.$inertia.form(...)` tạo ra. Nó chứa các phương thức nội tại (`data`, `transform`, `post`, `reset`, `setError`...) cùng reactive proxies của Vue 3.
   - Khi truyền trực tiếp đối tượng `this.form` vào `this.$inertia.post(url, data)` thay vì dùng `form.post(url)` hoặc truyền plain object sạch `data()`: Inertia gọi `hasFiles(data)`. Khi duyệt đệ quy `Object.values(this.form)`, Inertia duyệt trúng các hàm/phương thức nội bộ và proxy lồng nhau gây ra exception nghiêm trọng (`TypeError` / cyclic traversal) ngay bên trong `I.post` / `I.visit`.
   - Vì xảy ra lỗi ném ra đồng bộ trong `submitFn()`, đoạn mã `setTimeout` khôi phục `this.isSaving = false` trong `saveFromBuilder` không bao giờ chạy, dẫn tới nút bị kẹt ở trạng thái "Đang lưu...".
2. **Logic tự động phục hồi khối bị xoá (`_ensureLdpBlocks`):**
   - Trong [be/resources/Backend/js/Pages/LandingPages/Form.vue:1005](file:///d:/git/bed-dongnaiford/be/resources/Backend/js/Pages/LandingPages/Form.vue#L1005), phương thức `_ensureLdpBlocks(blocks)` cưỡng chế kiểm tra: nếu thiếu `LdpSalesConsultant`, `LdpVehiclesGrid`, `LdpPromotions` thì tự động `blocks.splice(...)` chèn lại.
   - Phương thức này bị gọi trong `initFormData` ngay cả với các LDP đã có sẵn trong DB, khiến việc admin chủ động xoá khối bị xung đột với cơ chế ép chèn lại khối.

---

### Vấn đề 2: Bấm vào dòng xe khác không nhảy xuống ngay thông tin xe mà lại load lại trang

**Hiện tượng từ hình ảnh thực tế:**
- Người dùng đang xem danh sách dòng xe phụ trách ở giữa trang (ảnh 3: thanh chọn tab `FORD TERRITORY 2026`, `FORD TERRITORY`... và lưới thẻ xe bên dưới).
- Khi bấm chọn một dòng xe khác, Next.js thực hiện chuyển trang và cuộn người dùng thẳng lên đỉnh đầu trang (ảnh 4: vị trí Hero Banner "SHOWROOM CỐ VẤN: NGUYỄN THỊ THU TRANG").
- Người dùng có cảm giác trang web bị "tải lại từ đầu" và mất dấu vị trí thông tin dòng xe vừa chọn.

**Nguyên nhân kỹ thuật:**
1. Trong [fe/src/components/vehicle/LdpDetailClient.tsx:186](file:///d:/git/bed-dongnaiford/fe/src/components/vehicle/LdpDetailClient.tsx#L186) và [fe/src/components/blocks/LdpVehiclesGridBlock.tsx:216](file:///d:/git/bed-dongnaiford/fe/src/components/blocks/LdpVehiclesGridBlock.tsx#L216):
   - Các thẻ `<Link href={href}>` trỏ tới `/ldp/[consultantSlug]/[vehicleSlug]` không kèm theo anchor hash (neo định danh phần xe) và không thiết lập `scroll={false}`.
   - Cơ chế mặc định của Next.js App Router (`next/link`) là tự động scroll lên đỉnh `(0, 0)` khi chuyển URL.
   - Do đó, dù trang đã đổi sang xe mới, người dùng luôn bị đẩy lên đỉnh trang (Hero Banner) thay vì dừng lại ngay thanh tab hoặc phần nội dung xe.

---

## 2. Giải pháp thực hiện chi tiết

### Gói công việc 1: Khắc phục lỗi xoá khối và lưu trang trong CMS Backend

**File cần chỉnh sửa:**
- [be/resources/Backend/js/Pages/LandingPages/Form.vue](file:///d:/git/bed-dongnaiford/be/resources/Backend/js/Pages/LandingPages/Form.vue)
- [be/resources/Backend/js/Components/Form/Form.vue](file:///d:/git/bed-dongnaiford/be/resources/Backend/js/Components/Form/Form.vue)

**Các bước cụ thể:**
1. **Chuẩn hóa hàm `saveFromBuilder(submitFn, form)` trong [LandingPages/Form.vue](file:///d:/git/bed-dongnaiford/be/resources/Backend/js/Pages/LandingPages/Form.vue):**
   - Loại bỏ việc gán dữ liệu không an toàn gây xung đột proxy.
   - Sao chép sạch (deep clone) cấu trúc `layout_blocks` dạng plain JSON object.
   - Kiểm tra và sử dụng phương thức `form.post(targetUrl, { ... })` chuẩn của Inertia với các callbacks `onSuccess`, `onError`, `onFinish` để đảm bảo:
     - Tự động bóc tách payload sạch qua `form.data()`, loại bỏ hoàn toàn các methods và reactive proxies gây lỗi `I.post`.
     - `this.isSaving` luôn được reset về `false` trong cả trường hợp thành công lẫn khi có lỗi validation.
     - Hiển thị thông báo toast lỗi rõ ràng nếu backend từ chối lưu thay vì im lặng kẹt nút.
2. **Cập nhật phương thức `submit()` trong [Components/Form/Form.vue](file:///d:/git/bed-dongnaiford/be/resources/Backend/js/Components/Form/Form.vue):**
   - Nếu `this.form` có phương thức `form.post`, ưu tiên gọi `this.form.post(...)` để Inertia tự xử lý payload sạch.
   - Nếu fallback về `this.$inertia.post`, chỉ truyền `this.form.data()` (plain object) thay vì truyền nguyên cả đối tượng `InertiaForm`.
3. **Điều chỉnh logic `_ensureLdpBlocks` trong [LandingPages/Form.vue](file:///d:/git/bed-dongnaiford/be/resources/Backend/js/Pages/LandingPages/Form.vue):**
   - Chỉ áp dụng tự động chèn 3 khối mặc định khi tạo mới Landing Page (trang hoàn toàn chưa có cấu hình blocks nào trong CSDL).
   - Khi mở form của Landing Page đã tồn tại (`item.id` đã có), giữ nguyên danh sách khối từ CSDL; nếu admin đã xoá khối `LdpSalesConsultant` hay bất kỳ khối nào, hệ thống không tự ý chèn lại.

---

### Gói công việc 2: Sửa trải nghiệm chuyển dòng xe trên giao diện người dùng Frontend

**File cần chỉnh sửa:**
- [fe/src/components/vehicle/LdpDetailClient.tsx](file:///d:/git/bed-dongnaiford/fe/src/components/vehicle/LdpDetailClient.tsx)
- [fe/src/components/blocks/LdpVehiclesGridBlock.tsx](file:///d:/git/bed-dongnaiford/fe/src/components/blocks/LdpVehiclesGridBlock.tsx)

**Các bước cụ thể:**
1. **Thiết lập Anchor ID cho thanh điều hướng dòng xe:**
   - Trong [fe/src/components/vehicle/LdpDetailClient.tsx](file:///d:/git/bed-dongnaiford/fe/src/components/vehicle/LdpDetailClient.tsx), thêm `id="ldp-vehicles-tabs"` vào thanh sticky switcher (ngay dưới Hero Banner).
   - Thêm lớp CSS `scroll-mt-4` hoặc `scroll-mt-16` để khi cuộn tới vị trí neo, thanh switcher hiển thị thoáng đãng, không bị che khuất bởi header cố định.
2. **Cập nhật đường dẫn chuyển xe trong thanh switcher [LdpDetailClient.tsx](file:///d:/git/bed-dongnaiford/fe/src/components/vehicle/LdpDetailClient.tsx):**
   - Gắn anchor `#ldp-vehicles-tabs` vào thuộc tính `href` của từng tab xe:  
     `href={`${href}#ldp-vehicles-tabs`}`
   - Thêm thuộc tính `scroll={false}` vào thẻ `<Link>` để ngăn Next.js tự ý cuộn lên đầu trang.
3. **Cập nhật đường dẫn chuyển xe trong lưới thẻ xe [LdpVehiclesGridBlock.tsx](file:///d:/git/bed-dongnaiford/fe/src/components/blocks/LdpVehiclesGridBlock.tsx):**
   - Tương tự, cập nhật các thẻ xe trong lưới trỏ tới `${href}#ldp-vehicles-tabs` với thuộc tính `scroll={false}`.
4. **Thêm hiệu ứng cuộn mượt (Smooth Scroll) khi chuyển xe:**
   - Trong [fe/src/components/vehicle/LdpDetailClient.tsx](file:///d:/git/bed-dongnaiford/fe/src/components/vehicle/LdpDetailClient.tsx), bổ sung hook `useEffect` theo dõi sự thay đổi của dòng xe đang active (`vehicle.slug` / `vehicle.id`):
     - Khi phát hiện có hash `#ldp-vehicles-tabs`, thực hiện `scrollIntoView({ behavior: 'smooth', block: 'start' })` đưa màn hình trượt mượt mà đến ngay vị trí thanh chọn xe và thông tin chi tiết xe bên dưới.

---

## 3. Quy trình thực hiện (Execution Steps)

1. **Bước 1 (Backend CMS):**
   - Sửa `saveFromBuilder` và `_ensureLdpBlocks` trong [LandingPages/Form.vue](file:///d:/git/bed-dongnaiford/be/resources/Backend/js/Pages/LandingPages/Form.vue).
   - Sửa an toàn method `submit` trong [Components/Form/Form.vue](file:///d:/git/bed-dongnaiford/be/resources/Backend/js/Components/Form/Form.vue).
   - Kiểm tra build backend bằng `yarn backend:build` để đảm bảo không có lỗi cú pháp.
2. **Bước 2 (Frontend LDP):**
   - Gắn `id="ldp-vehicles-tabs"` và cập nhật thẻ `<Link scroll={false} ...#ldp-vehicles-tabs>` trong [LdpDetailClient.tsx](file:///d:/git/bed-dongnaiford/fe/src/components/vehicle/LdpDetailClient.tsx).
   - Cập nhật thẻ `<Link scroll={false} ...#ldp-vehicles-tabs>` trong [LdpVehiclesGridBlock.tsx](file:///d:/git/bed-dongnaiford/fe/src/components/blocks/LdpVehiclesGridBlock.tsx).
   - Thêm hook cuộn mượt khi chuyển đổi dòng xe.
   - Kiểm tra typecheck và build frontend (`npm run build` hoặc lint).
3. **Bước 3 (Kiểm thử & Bàn giao):**
   - Kiểm tra thao tác xoá khối bất kỳ và bấm "Lưu trang": dữ liệu lưu thành công, thông báo hiển thị, tải lại trang khối đã xoá không tự xuất hiện lại.
   - Kiểm tra thao tác click chuyển đổi giữa các dòng xe: màn hình không bị nhảy lên Hero Banner mà giữ nguyên tại vị trí switcher/thông tin xe.

---

## 4. Cam kết kỷ luật kỹ thuật
- Mọi chỉnh sửa được thực hiện dưới dạng **Micro-diffs (≤ 50 dòng/edit)**.
- Giữ nguyên cấu trúc code hiện có, không refactor ngoài phạm vi 2 vấn đề trên.
- Không sửa code khi chưa có xác nhận duyệt từ người dùng.

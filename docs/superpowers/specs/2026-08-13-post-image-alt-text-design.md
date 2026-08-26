# Design Spec - Alt Text for Post Featured Image

Tài liệu thiết kế chi tiết cho việc bổ sung trường Alt Text của ảnh đại diện bài viết tại trang quản trị CMS (Inertia/Vue) và hiển thị tương ứng tại Frontend (Next.js) nhằm tối ưu hóa SEO.

## User Review Required

> [!NOTE]
> Giải pháp lưu trữ sử dụng trực tiếp cột `image` dạng JSON/array của bảng `posts` có sẵn trong database. Không cần thay đổi schema hay chạy thêm database migration.

> [!IMPORTANT]
> Alt Text sẽ là trường thông tin chung (Global) đi kèm trực tiếp với ảnh đại diện. Do đó, ô nhập liệu sẽ được thiết kế nằm ở cột bên phải (Sidebar) của biểu mẫu chỉnh sửa bài viết dưới ô tải ảnh.

## Open Questions

Không có câu hỏi mở nào tồn tại. Giải pháp thiết kế đã được người dùng thông qua.

---

## Proposed Changes

### Backend (CMS Admin Panel)

#### [MODIFY] [Form.vue](file:///d:/git/bed-dongnaiford/be/resources/Backend/js/Pages/Posts/Form.vue)
- Bổ sung ô nhập `input` cho Alt Text ngay bên dưới component `<Field v-model="form.image" ... />` trong phần `<template #aside>`.
- Ràng buộc hai chiều dữ liệu (`v-model`) với `form.image.alt`.
- Hiển thị ô nhập này có điều kiện: chỉ xuất hiện khi `form.image` tồn tại và đã có đường dẫn ảnh (`form.image.path`).

---

### Frontend (Next.js App)

#### [MODIFY] [ArticleDetailClient.tsx](file:///d:/git/bed-dongnaiford/fe/src/components/news/ArticleDetailClient.tsx)
- Cập nhật thẻ `<img>` của ảnh đại diện bài viết chi tiết để sử dụng `article.image?.alt` thay vì tiêu đề bài viết. Fallback về `article.title` nếu trống.

#### [MODIFY] [NewsListClient.tsx](file:///d:/git/bed-dongnaiford/fe/src/app/tin-tuc/NewsListClient.tsx)
- Ánh xạ thuộc tính `imageAlt` trong hàm định dạng bài viết `formatArticlesList` từ dữ liệu API trả về (`item.image?.alt || item.title || ""`).
- Thay thế `alt={art.title}` bằng `alt={art.imageAlt || art.title}` trong thẻ hiển thị ảnh.

#### [MODIFY] [HomeClient.tsx](file:///d:/git/bed-dongnaiford/fe/src/app/HomeClient.tsx)
- Ánh xạ thuộc tính `imageAlt` trong hàm định dạng bài viết `formatArticlesList` ở trang chủ.
- Thay thế `alt={homeArticles[0].title}` bằng `alt={homeArticles[0].imageAlt || homeArticles[0].title}` và `alt={art.title}` bằng `alt={art.imageAlt || art.title}` trong thẻ hiển thị ảnh.

#### [MODIFY] [page.tsx](file:///d:/git/bed-dongnaiford/fe/src/app/tim-kiem/page.tsx)
- Ánh xạ thuộc tính `imageAlt` trong hàm định dạng danh sách bài viết `mappedArticles` ở kết quả tìm kiếm.
- Cập nhật thẻ `<img>` hiển thị kết quả tìm kiếm bài viết để sử dụng `alt={art.imageAlt || art.title}`.

---

## Verification Plan

### Manual Verification
1. Truy cập trang CMS quản trị bài viết tại `/admin/posts`.
2. Tạo mới hoặc chỉnh sửa một bài viết bất kỳ. Tải ảnh đại diện lên và nhập nội dung vào ô "Alt text hình ảnh đại diện (SEO)" mới xuất hiện bên cột phải. Nhấn lưu bài viết.
3. Reload lại trang chỉnh sửa để đảm bảo nội dung Alt Text vừa nhập đã được lưu trữ và tải lên đúng.
4. Truy cập trang danh sách tin tức ở frontend (`/tin-tuc`) và chi tiết bài viết đó, kiểm tra mã nguồn (Inspect Element) của thẻ ảnh đại diện xem thuộc tính `alt` của ảnh đã hiển thị đúng nội dung Alt Text vừa lưu hay chưa.
5. Truy cập trang chủ và thực hiện tìm kiếm bài viết trên trang `/tim-kiem`, kiểm tra thuộc tính `alt` của ảnh đại diện bài viết hiển thị đúng.

# Alt Text for Post Featured Image Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Thêm trường Alt Text cho hình ảnh đại diện bài viết chi tiết tại trang quản trị CMS và hiển thị tương ứng tại Frontend để tối ưu SEO.

**Architecture:** Sử dụng trực tiếp trường `alt` bên trong cột `image` dạng JSON/array của bảng `posts`. Cập nhật giao diện Vue 3 Form.vue ở backend CMS để hiển thị input này và cập nhật các tệp hiển thị ảnh ở frontend Next.js.

**Tech Stack:** Next.js, React, Tailwind CSS, Vue 3, Inertia.js, Laravel.

## Global Constraints

- Không thay đổi schema hoặc chạy migration cơ sở dữ liệu.
- Lưu trữ Alt Text dưới dạng thuộc tính `alt` của đối tượng `image` (ví dụ: `image.alt`).
- Fallback về tiêu đề bài viết (`title`) nếu `alt` bị trống ở phía hiển thị của frontend.

---

### Task 1: Backend - Thêm trường Alt Text trong trang chỉnh sửa bài viết CMS

**Files:**
- Modify: `be/resources/Backend/js/Pages/Posts/Form.vue`

**Interfaces:**
- Consumes: `form.image` object từ Inertia form data.
- Produces: `form.image.alt` giá trị nhập từ người dùng.

- [ ] **Step 1: Mở tệp Form.vue và tìm đoạn code hiển thị trường file_upload của image**
  Tìm đoạn code xung quanh dòng 286:
  ```vue
                      <Field v-model="form.image" :field="{
                          type: 'file_upload',
                          name: 'image',
                          multiple: false,
                      }" />
  ```
- [ ] **Step 2: Thêm ô nhập liệu Alt Text ngay bên dưới trường file_upload**
  Thêm đoạn code sau:
  ```vue
                      <Field v-model="form.image" :field="{
                          type: 'file_upload',
                          name: 'image',
                          multiple: false,
                      }" />
                      <div v-if="form.image && form.image.path" class="mt-4">
                          <label class="block mb-2 font-semibold tracking-wide text-gray-700 font-display text-xs uppercase">
                              Alt text hình ảnh đại diện (SEO)
                          </label>
                          <input
                              type="text"
                              v-model="form.image.alt"
                              placeholder="Nhập mô tả hình ảnh cho Google Images..."
                              class="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-primary-500 focus:outline-none"
                          />
                          <small class="text-gray-400 text-[11px] block mt-1 leading-normal">
                              Giúp Google hiểu nội dung ảnh để xếp hạng tốt hơn trên Google Hình ảnh.
                          </small>
                      </div>
  ```
- [ ] **Step 3: Chạy build assets backend và kiểm tra thủ công**
  Mở trình duyệt, truy cập trang quản trị bài viết chi tiết, tải ảnh lên và nhập Alt Text. Lưu bài viết và tải lại trang để xác nhận Alt Text vẫn còn nguyên vẹn.
- [ ] **Step 4: Commit**
  ```bash
  git add be/resources/Backend/js/Pages/Posts/Form.vue
  git commit -m "feat(cms): add alt text input field for post featured image"
  ```

### Task 2: Frontend - Hiển thị Alt Text trên trang chi tiết bài viết

**Files:**
- Modify: `fe/src/components/news/ArticleDetailClient.tsx`

**Interfaces:**
- Consumes: Dữ liệu bài viết `article` từ API của Laravel Backend.
- Produces: Thẻ `<img>` với thuộc tính `alt` động.

- [ ] **Step 1: Mở tệp ArticleDetailClient.tsx và tìm đoạn thẻ img hiển thị ảnh đại diện**
  Tìm đoạn code xung quanh dòng 248:
  ```tsx
            {article.image?.url && (
              <div className="aspect-[16/9] relative rounded-[12px] overflow-hidden w-full bg-gray-50 border border-gray-100">
                <img 
                  src={article.image.url} 
                  alt={article.title} 
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={handleImageError}
                />
              </div>
            )}
  ```
- [ ] **Step 2: Cập nhật thuộc tính alt để đọc từ article.image.alt**
  Thay thế `alt={article.title}` bằng `alt={article.image.alt || article.title}`:
  ```tsx
            {article.image?.url && (
              <div className="aspect-[16/9] relative rounded-[12px] overflow-hidden w-full bg-gray-50 border border-gray-100">
                <img 
                  src={article.image.url} 
                  alt={article.image.alt || article.title} 
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={handleImageError}
                />
              </div>
            )}
  ```
- [ ] **Step 3: Kiểm tra hiển thị chi tiết**
  Truy cập bài viết có chứa ảnh đại diện đã cấu hình Alt Text, inspect element và xác nhận thuộc tính `alt` hiển thị đúng nội dung Alt Text đó.
- [ ] **Step 4: Commit**
  ```bash
  git add fe/src/components/news/ArticleDetailClient.tsx
  git commit -m "feat(fe): render custom alt text in article detail page"
  ```

### Task 3: Frontend - Hiển thị Alt Text trên trang danh sách bài viết

**Files:**
- Modify: `fe/src/app/tin-tuc/NewsListClient.tsx`

**Interfaces:**
- Consumes: Mảng bài viết từ API `postsAPI.getAll()`.
- Produces: Danh sách bài viết được ánh xạ thêm trường `imageAlt` và hiển thị thẻ `<img>` với `alt` động.

- [ ] **Step 1: Tìm hàm formatArticlesList trong NewsListClient.tsx**
  Tìm đoạn code xung quanh dòng 177:
  ```typescript
  const formatArticlesList = (items: any[]) => {
    if (Array.isArray(items) && items.length > 0) {
      return items.map((item: any) => ({
        id: item.slug || item.id || String(Math.random()),
        title: item.title || "",
        image: item.image?.url || "/placeholder-news.jpg",
        published_at: item.published_at || "",
        category: item.category ? { title: item.category.title } : undefined,
        description: item.description || "",
      }));
    }
    return [];
  };
  ```
- [ ] **Step 2: Ánh xạ thêm trường imageAlt trong formatArticlesList**
  Thay thế bằng:
  ```typescript
  const formatArticlesList = (items: any[]) => {
    if (Array.isArray(items) && items.length > 0) {
      return items.map((item: any) => ({
        id: item.slug || item.id || String(Math.random()),
        title: item.title || "",
        image: item.image?.url || "/placeholder-news.jpg",
        imageAlt: item.image?.alt || item.title || "",
        published_at: item.published_at || "",
        category: item.category ? { title: item.category.title } : undefined,
        description: item.description || "",
      }));
    }
    return [];
  };
  ```
- [ ] **Step 3: Cập nhật alt của thẻ img nổi bật và thẻ img danh sách bài viết thường**
  Thay thế các thẻ `alt={art.title}` bằng `alt={art.imageAlt || art.title}` ở các vị trí render ảnh đại diện trong NewsListClient.tsx (Ví dụ ở dòng 314 và dòng 415).
- [ ] **Step 4: Kiểm tra hiển thị trang tin tức**
  Kiểm tra trang `/tin-tuc`, inspect các thẻ ảnh để xác định thuộc tính `alt` có nội dung Alt Text mới hoặc fallback về tiêu đề bài viết.
- [ ] **Step 5: Commit**
  ```bash
  git add fe/src/app/tin-tuc/NewsListClient.tsx
  git commit -m "feat(fe): support post image alt text on news list page"
  ```

### Task 4: Frontend - Hiển thị Alt Text trên trang chủ (HomeClient.tsx)

**Files:**
- Modify: `fe/src/app/HomeClient.tsx`

**Interfaces:**
- Consumes: Mảng bài viết từ API `postsAPI.getAll()` hoặc `initialArticles`.
- Produces: Danh sách bài viết được ánh xạ thêm trường `imageAlt` và hiển thị thẻ `<img>` với `alt` động trên trang chủ.

- [ ] **Step 1: Tìm hàm formatArticlesList trong HomeClient.tsx**
  Tìm đoạn code xung quanh dòng 177:
  ```typescript
  const formatArticlesList = (items: any[]) => {
    if (Array.isArray(items) && items.length > 0) {
      return items.map((item: any) => ({
        id: item.slug || item.id || String(Math.random()),
        title: item.title || "",
        image: item.image?.url || "/placeholder-news.jpg",
        published_at: item.published_at || "",
        category: item.category ? { title: item.category.title } : undefined,
        description: item.description || "",
      }));
    }
    return [];
  };
  ```
- [ ] **Step 2: Ánh xạ thêm trường imageAlt trong formatArticlesList**
  Thay thế bằng:
  ```typescript
  const formatArticlesList = (items: any[]) => {
    if (Array.isArray(items) && items.length > 0) {
      return items.map((item: any) => ({
        id: item.slug || item.id || String(Math.random()),
        title: item.title || "",
        image: item.image?.url || "/placeholder-news.jpg",
        imageAlt: item.image?.alt || item.title || "",
        published_at: item.published_at || "",
        category: item.category ? { title: item.category.title } : undefined,
        description: item.description || "",
      }));
    }
    return [];
  };
  ```
- [ ] **Step 3: Cập nhật alt của thẻ img nổi bật lớn ở trang chủ và thẻ img của 3 bài viết nhỏ bên phải**
  Tìm và thay thế `alt={homeArticles[0].title}` bằng `alt={homeArticles[0].imageAlt || homeArticles[0].title}` (xung quanh dòng 1604).
  Tìm và thay thế `alt={art.title}` bằng `alt={art.imageAlt || art.title}` trong vòng lặp slice(1, 4) (xung quanh dòng 1655).
- [ ] **Step 4: Kiểm tra trang chủ**
  Inspect element các thẻ ảnh trong mục tin tức ở trang chủ để kiểm tra.
- [ ] **Step 5: Commit**
  ```bash
  git add fe/src/app/HomeClient.tsx
  git commit -m "feat(fe): support post image alt text on home page news section"
  ```

### Task 5: Frontend - Hiển thị Alt Text trên trang tìm kiếm (tim-kiem/page.tsx)

**Files:**
- Modify: `fe/src/app/tim-kiem/page.tsx`

**Interfaces:**
- Consumes: Mảng bài viết từ `apiArticles` trên trang tìm kiếm.
- Produces: Mảng bài viết được ánh xạ thêm trường `imageAlt` và hiển thị thẻ `<img>` với `alt` động trên trang kết quả tìm kiếm.

- [ ] **Step 1: Tìm hàm mappedArticles trong tim-kiem/page.tsx**
  Tìm đoạn code định nghĩa `mappedArticles` xung quanh dòng 182:
  ```typescript
      const mart = apiArticles.map((art: any) => {
        const id = art.slug || String(art.id);
        const title = art.title || "";
        const content = art.description || art.content || "";
        const date = formatDate(art.published_at || art.created_at);
        const category = art.category?.title || art.category || "Tin tức";
        const image = resolveImageUrl(art.image?.url || art.image_url || art.image || "/placeholder-news.jpg");

        return {
          id,
          title,
          content,
          date,
          category,
          image,
          body: []
        };
      });
  ```
- [ ] **Step 2: Ánh xạ thêm trường imageAlt trong mappedArticles**
  Thay thế bằng:
  ```typescript
      const mart = apiArticles.map((art: any) => {
        const id = art.slug || String(art.id);
        const title = art.title || "";
        const content = art.description || art.content || "";
        const date = formatDate(art.published_at || art.created_at);
        const category = art.category?.title || art.category || "Tin tức";
        const image = resolveImageUrl(art.image?.url || art.image_url || art.image || "/placeholder-news.jpg");
        const imageAlt = art.image?.alt || title;

        return {
          id,
          title,
          content,
          date,
          category,
          image,
          imageAlt,
          body: []
        };
      });
  ```
- [ ] **Step 3: Cập nhật alt của thẻ img hiển thị bài viết trong danh sách kết quả tìm kiếm**
  Tìm và thay thế `alt={art.title}` bằng `alt={art.imageAlt || art.title}` trong phần render `articlesList` (xung quanh dòng 545).
- [ ] **Step 4: Kiểm tra trang tìm kiếm**
  Thực hiện tìm kiếm một bài viết trên trang `/tim-kiem`, inspect thẻ ảnh kết quả xem thuộc tính `alt` hiển thị đúng.
- [ ] **Step 5: Commit**
  ```bash
  git add fe/src/app/tim-kiem/page.tsx
  git commit -m "feat(fe): support post image alt text on search results page"
  ```

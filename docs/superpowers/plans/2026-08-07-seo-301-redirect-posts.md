# Kế hoạch Triển khai Tính năng 301 Redirect cho Bài viết (Posts)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây dựng hệ thống chuyển hướng 301 Redirect động tích hợp trong trang sửa bài viết chi tiết ở Admin CMS (Laravel) và tự động thực thi chuyển hướng ở Frontend (Next.js) để tối ưu hóa SEO.

**Architecture:** 
1. Backend (Laravel) cung cấp API `api/redirects/lookup` để tra cứu chuyển hướng.
2. Model event trên `PostTranslation` tự động tạo bản ghi 301 Redirect khi slug của bài viết thay đổi.
3. Form chỉnh sửa bài viết ở Admin panel hiển thị và lưu danh sách URL chuyển hướng tùy chỉnh thông qua trường textarea nhập tay (hỗ trợ nhiều URL chụm về 1 link).
4. Frontend (Next.js) sử dụng middleware chặn request để kiểm tra chuyển hướng qua API trước khi kết xuất trang.

**Tech Stack:** Laravel 10+, Inertia.js, Vue 3, Next.js 16+, TypeScript.

## Global Constraints
- Đường dẫn lưu trữ cấu hình redirect phải được lưu trực tiếp vào bảng `redirects` đã có sẵn.
- Trình biên dịch Frontend Next.js và Backend Laravel phải luôn chạy ổn định trên cổng 3000 và 8000 trong suốt quá trình triển khai.

---

### Task 1: Xây dựng API Tra cứu 301 Redirect ở Laravel

**Files:**
- Create: `be/app/Http/Controllers/Api/RedirectLookupController.php`
- Modify: `be/routes/api.php`

**Interfaces:**
- Produces: API Endpoint `GET /api/redirects/lookup?url={path}` trả về thông tin chuyển hướng dạng JSON.

- [ ] **Step 1: Tạo controller RedirectLookupController**

Tạo file [RedirectLookupController.php](file:///d:/git/bed-dongnaiford/be/app/Http/Controllers/Api/RedirectLookupController.php) với nội dung sau:

```php
<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use JamstackVietnam\Redirect\Models\Redirect;

class RedirectLookupController extends Controller
{
    public function lookup(Request $request): JsonResponse
    {
        $url = $request->query('url');
        if (empty($url)) {
            return response()->json(['success' => false, 'message' => 'URL parameter is required'], 400);
        }

        $path = parse_url($url, PHP_URL_PATH);
        $path = trim($path, '/');

        if (empty($path)) {
            $path = '/';
        }

        $redirect = Redirect::active()
            ->where('old_url', $path)
            ->latest()
            ->first();

        if ($redirect) {
            $newUrl = $redirect->new_url;
            if ($newUrl !== '/' && !str_starts_with($newUrl, 'http://') && !str_starts_with($newUrl, 'https://')) {
                $newUrl = '/' . ltrim($newUrl, '/');
            }
            return response()->json([
                'success' => true,
                'redirect' => [
                    'new_url' => $newUrl,
                    'status_code' => (int) $redirect->status_code,
                ]
            ]);
        }

        return response()->json([
            'success' => true,
            'redirect' => null
        ]);
    }
}
```

- [ ] **Step 2: Đăng ký Router cho API Lookup**

Mở file [api.php](file:///d:/git/bed-dongnaiford/be/routes/api.php), tìm đến nhóm `Route::localized(...)` và thêm dòng định nghĩa route lookup:

```php
    Route::get('redirects/lookup', [\App\Http\Controllers\Api\RedirectLookupController::class, 'lookup'])->name('api.redirects.lookup');
```

- [ ] **Step 3: Kiểm tra Route mới trong danh sách Router**

Chạy command kiểm tra route trong CLI:
`php artisan route:list --name=api.redirects.lookup`
Đảm bảo route xuất hiện và trỏ đúng về `RedirectLookupController@lookup`.

- [ ] **Step 4: Commit**

```bash
git add be/app/Http/Controllers/Api/RedirectLookupController.php be/routes/api.php
git commit -m "feat: add api redirect lookup endpoint"
```

---

### Task 2: Tự động hóa tạo 301 Redirect khi đổi Slug bài viết

**Files:**
- Modify: `be/app/Models/Post/PostTranslation.php`

**Interfaces:**
- Consumes: Cập nhật dữ liệu từ model event `updating` trên `PostTranslation`.

- [ ] **Step 1: Cập nhật logic sự kiện Model Event `booted()`**

Mở file [PostTranslation.php](file:///d:/git/bed-dongnaiford/be/app/Models/Post/PostTranslation.php) và thêm phương thức `getRelativeUrlForSlug()` cùng event `booted()` vào trong class:

```php
    public function getRelativeUrlForSlug($slug)
    {
        $post = \App\Models\Post\Post::find($this->post_id);
        if (!$post) {
            return $slug;
        }

        if ($post->type === 'SERVICE') {
            return $this->locale === 'vi' ? "dich-vu/{$slug}" : "services/{$slug}";
        }
        
        return $this->locale === 'vi' ? "tin-tuc/{$slug}" : "posts/{$slug}";
    }

    protected static function booted()
    {
        static::updating(function ($translation) {
            if ($translation->isDirty('slug') || $translation->isDirty('seo_slug')) {
                $oldSlug = $translation->getOriginal('seo_slug') ?: $translation->getOriginal('slug');
                $newSlug = $translation->seo_slug ?: $translation->slug;
                
                if ($oldSlug && $newSlug && $oldSlug !== $newSlug) {
                    $oldUrl = $translation->getRelativeUrlForSlug($oldSlug);
                    $newUrl = $translation->getRelativeUrlForSlug($newSlug);
                    
                    if (\Illuminate\Support\Facades\Schema::hasTable('redirects')) {
                        $oldUrl = trim($oldUrl, '/');
                        $newUrl = trim($newUrl, '/');
                        
                        if ($oldUrl !== $newUrl) {
                            \JamstackVietnam\Redirect\Models\Redirect::updateOrCreate(
                                ['old_url' => $oldUrl],
                                [
                                    'new_url' => $newUrl,
                                    'status_code' => 301,
                                    'is_active' => true
                                ]
                            );
                        }
                    }
                }
            }
        });
    }
```

- [ ] **Step 2: Commit**

```bash
git add be/app/Models/Post/PostTranslation.php
git commit -m "feat: auto create redirect on post slug update"
```

---

### Task 3: Tích hợp Quản lý 301 Redirect Thủ công trong Form bài viết CMS

**Files:**
- Modify: `be/app/Http/Controllers/Backend/PostController.php`
- Modify: `be/resources/Backend/js/Pages/Posts/Form.vue`

**Interfaces:**
- Consumes: `redirect_urls` từ request body lưu trữ vào DB.
- Produces: `redirect_urls` truyền sang Vue Form khi hiển thị chi tiết bài viết.

- [ ] **Step 1: Override `afterForm` và `afterStore` trong PostController**

Mở file [PostController.php](file:///d:/git/bed-dongnaiford/be/app/Http/Controllers/Backend/PostController.php), thêm logic để trích xuất và lưu trữ danh sách redirect:

```php
    public function afterForm($item)
    {
        if (is_array($item)) {
            $itemId = $item['id'] ?? null;
        } else {
            $itemId = $item->id ?? null;
        }

        $redirectUrls = '';
        if ($itemId) {
            $post = Post::find($itemId);
            if ($post) {
                $urls = [];
                foreach ($post->translations as $trans) {
                    $slug = $trans->seo_slug ?: $trans->slug;
                    if ($slug) {
                        $urls[] = trim($trans->getRelativeUrlForSlug($slug), '/');
                    }
                }
                
                if (!empty($urls)) {
                    $redirectUrls = \DB::table('redirects')
                        ->whereIn('new_url', $urls)
                        ->pluck('old_url')
                        ->implode("\n");
                }
            }
        }

        if (is_array($item)) {
            $item['redirect_urls'] = $redirectUrls;
        } else {
            $item->redirect_urls = $redirectUrls;
        }

        return $item;
    }

    public function afterStore($request, $resource)
    {
        revalidate_frontend();

        if ($request->has('redirect_urls')) {
            $urlsString = $request->input('redirect_urls');
            $lines = array_filter(array_map('trim', explode("\n", $urlsString)));
            $lines = array_map(function($line) {
                return trim(parse_url($line, PHP_URL_PATH), '/');
            }, $lines);
            $lines = array_filter($lines);

            $urls = [];
            foreach ($resource->translations as $trans) {
                $slug = $trans->seo_slug ?: $trans->slug;
                if ($slug) {
                    $urls[strtoupper($trans->locale)] = trim($trans->getRelativeUrlForSlug($slug), '/');
                }
            }

            $defaultTarget = $urls['VI'] ?? ($urls['EN'] ?? null);

            if ($defaultTarget) {
                // Xóa các bản ghi chuyển hướng cũ không còn nằm trong danh sách mới
                \DB::table('redirects')
                    ->whereIn('new_url', array_values($urls))
                    ->whereNotIn('old_url', $lines)
                    ->delete();

                // Lưu danh sách chuyển hướng mới
                foreach ($lines as $line) {
                    $target = $defaultTarget;
                    // Phân biệt link tiếng Anh hay tiếng Việt dựa trên /en/ hoặc en/
                    if (str_starts_with($line, 'en/') || str_contains($line, '/en/')) {
                        $target = $urls['EN'] ?? $defaultTarget;
                    }

                    \JamstackVietnam\Redirect\Models\Redirect::updateOrCreate(
                        ['old_url' => $line],
                        [
                            'new_url' => $target,
                            'status_code' => 301,
                            'is_active' => true
                        ]
                    );
                }
            }
        }

        return $resource;
    }
```

- [ ] **Step 2: Thêm trường Textarea Redirects trong Form.vue**

Mở file [Form.vue](file:///d:/git/bed-dongnaiford/be/resources/Backend/js/Pages/Posts/Form.vue):

1. Tìm phần nhập liệu `related_urls` (khoảng dòng 221-230) và chèn thêm block HTML sau ngay phía dưới:

```html
                    <!-- 301 Redirects URLs Input -->
                    <div class="border-t border-gray-100 pt-6 mt-6">
                        <div class="text-xs text-gray-500 font-semibold mb-1">Cấu hình 301 Redirect (Nhập các đường dẫn cũ cần chuyển hướng về bài viết này, mỗi dòng một đường dẫn)</div>
                        <textarea
                            v-model="form.redirect_urls"
                            rows="4"
                            class="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-primary-500 focus:outline-none font-mono"
                            placeholder="Ví dụ:&#10;tin-tuc/everest-2025-cu&#10;danh-gia/everest-2025"
                        ></textarea>
                    </div>
```

2. Tìm hàm `initFormData(item)` (khoảng dòng 357) và gán giá trị khởi tạo cho biến `redirect_urls`:

```javascript
            data.redirect_urls = item.redirect_urls || '';
```

- [ ] **Step 3: Commit**

```bash
git add be/app/Http/Controllers/Backend/PostController.php be/resources/Backend/js/Pages/Posts/Form.vue
git commit -m "feat: integrate manual 301 redirects field in posts edit form"
```

---

### Task 4: Cấu hình Middleware 301 Redirect động trên Next.js Frontend

**Files:**
- Create: `fe/src/middleware.ts`

**Interfaces:**
- Consumes: Gọi API `api/redirects/lookup` để kiểm tra URL đầu vào.

- [ ] **Step 1: Tạo file middleware.ts của Next.js**

Tạo file [middleware.ts](file:///d:/git/bed-dongnaiford/fe/src/middleware.ts) với nội dung:

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { proxy } from "./proxy";

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Bỏ qua các file tĩnh, file hệ thống, API
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
    const fullPath = pathname + search;
    
    // Gọi API tra cứu chuyển hướng
    const response = await fetch(`${apiBase}/redirects/lookup?url=${encodeURIComponent(fullPath)}`, {
      next: { revalidate: 300 } // Cache 5 phút
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.redirect) {
        const { new_url, status_code } = data.redirect;
        const redirectUrl = new URL(new_url, request.url);
        return NextResponse.redirect(redirectUrl, status_code || 301);
      }
    }
  } catch (error) {
    console.error("Next.js 301 Redirect Middleware Error:", error);
  }

  // Tiếp tục chạy proxy LDP cũ nếu không có redirect
  return proxy(request);
}

export const config = {
  matcher: [
    "/((?!api|static|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
```

- [ ] **Step 2: Commit**

```bash
git add fe/src/middleware.ts
git commit -m "feat: add next.js 301 redirect lookup middleware"
```

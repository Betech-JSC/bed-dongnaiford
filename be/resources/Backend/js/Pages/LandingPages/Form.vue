<template layout>
    <Form v-model="formData">
        <template #default="{ form, submit }">
            <!-- Top Mode Selectors (Thiết kế / Thông tin chung) -->
            <div class="flex justify-between items-center mb-6">
                <div class="flex items-center space-x-3">
                    <h1 class="text-2xl font-bold text-gray-900">
                        {{ item.id ? 'Cập nhật Landing Page' : 'Tạo mới Landing Page' }}
                    </h1>
                    <button
                        type="button"
                        class="bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-solid border-blue-200 cursor-pointer flex items-center gap-1 shadow-xs transition"
                        @click="showHelpModal = true"
                    >
                        📖 Hướng dẫn nhanh cho Sale
                    </button>
                </div>
                <div class="flex space-x-3">
                    <button
                        type="button"
                        class="btn"
                        :class="activeFormTab === 'general' ? 'btn-primary' : 'btn-outline-primary'"
                        @click="activeFormTab = 'general'"
                    >
                        📁 Thông tin chung & SEO
                    </button>
                    <button
                        type="button"
                        class="btn"
                        :class="activeFormTab === 'builder' ? 'btn-primary' : 'btn-outline-primary'"
                        :disabled="!hasVehicleSelected"
                        @click="activeFormTab = 'builder'"
                    >
                        🎨 Thiết kế Giao diện (Block Editor)
                    </button>
                </div>
            </div>

            <!-- ===== TAB 1: THÔNG TIN CHUNG & SEO ===== -->
            <div v-show="activeFormTab === 'general'">
                <!-- Locale Tabs -->
                <div class="card">
                    <div class="card-header border-b-0 pb-0">
                        <ul class="flex border-b">
                            <li class="-mb-px mr-1">
                                <a class="bg-white inline-block py-2 px-4 font-semibold cursor-pointer"
                                   :class="currentTab === 'vi' ? 'border-l border-t border-r rounded-t text-primary-700' : 'text-gray-500 hover:text-primary-800'"
                                   @click="currentTab = 'vi'">🇻🇳 Tiếng Việt</a>
                            </li>
                        </ul>
                    </div>
                    <div class="card-body mt-4">
                        <!-- Tiêu đề LDP -->
                        <Field
                            v-model="form[currentTab].title"
                            :field="{
                                type: 'text',
                                name: `title_${currentTab}`,
                                label: 'Tiêu đề Landing Page',
                                placeholder: 'vd: Ranger Raptor Ưu Đãi Cực Khủng - Đăng Ký Lái Thử',
                            }"
                        />
                    </div>
                </div>

                <!-- Cấu hình Khuyến mãi -->
                <div class="card mt-4">
                    <div class="card-header font-bold text-gray-900 border-b pb-2">🎁 Chương trình khuyến mãi hiển thị trên LDP</div>
                    <div class="card-body">
                        <!-- 1. Chọn Khuyến mãi hệ thống (Global) -->
                        <div class="mb-6">
                            <label class="block text-sm font-semibold text-gray-700 mb-2">1. Chọn chương trình khuyến mãi chung từ hệ thống</label>
                            <div v-if="globalPromotions.length === 0" class="text-gray-500 text-sm italic">
                                Không tìm thấy bài viết khuyến mãi nào trong danh mục 'khuyen-mai'.
                            </div>
                            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                                <div v-for="promo in globalPromotions" :key="promo.id" class="flex items-start space-x-3 p-2.5 border rounded-lg hover:bg-gray-50 transition">
                                    <input
                                        type="checkbox"
                                        :id="'promo-' + promo.id"
                                        :value="promo.id"
                                        v-model="form.promotions.global_promotion_ids"
                                        class="mt-1 h-4 w-4 text-primary-650 border-gray-300 rounded focus:ring-primary-500"
                                    />
                                    <label :for="'promo-' + promo.id" class="text-sm font-medium text-gray-800 cursor-pointer">
                                        {{ promo.title }}
                                    </label>
                                </div>
                            </div>
                        </div>

                        <hr class="my-4 border-gray-200" />

                        <!-- 2. Nhập Khuyến mãi riêng (Custom) -->
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-3">2. Các chương trình ưu đãi riêng của bạn (Tự nhập)</label>
                            
                            <div
                                v-for="(promo, index) in form.promotions.custom_promotions"
                                :key="index"
                                class="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50/50 relative"
                            >
                                <button
                                    type="button"
                                    class="absolute top-4 right-4 text-red-500 text-xs font-semibold hover:underline"
                                    @click="removeCustomPromo(index)"
                                >
                                    ❌ Xoá ưu đãi này
                                </button>
                                
                                <h4 class="text-sm font-bold text-gray-800 mb-3">Ưu đãi #{{ index + 1 }}</h4>
                                
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Field
                                        v-model="form.promotions.custom_promotions[index].title"
                                        :field="{
                                            type: 'text',
                                            name: 'custom_promo_title_' + index,
                                            label: 'Tiêu đề ưu đãi',
                                            placeholder: 'vd: Tặng gói phụ kiện 20 triệu'
                                        }"
                                    />
                                    <Field
                                        v-model="form.promotions.custom_promotions[index].link"
                                        :field="{
                                            type: 'text',
                                            name: 'custom_promo_link_' + index,
                                            label: 'Đường dẫn liên kết (tuỳ chọn)',
                                            placeholder: 'vd: /dang-ky-lai-thu'
                                        }"
                                    />
                                </div>

                                <Field
                                    v-model="form.promotions.custom_promotions[index].description"
                                    :field="{
                                        type: 'textarea',
                                        name: 'custom_promo_desc_' + index,
                                        label: 'Mô tả chi tiết ưu đãi',
                                        placeholder: 'vd: Tặng bảo hiểm vật chất 1 năm, lót sàn da chính hãng, phim cách nhiệt Mỹ...'
                                    }"
                                />

                                <Field
                                    v-model="form.promotions.custom_promotions[index].image"
                                    :field="{
                                        type: 'file_upload',
                                        name: 'custom_promo_image_' + index,
                                        label: 'Ảnh banner ưu đãi (tuỳ chọn)',
                                    }"
                                />
                            </div>

                            <button
                                type="button"
                                class="btn btn-outline-primary btn-sm flex items-center"
                                @click="addCustomPromo"
                            >
                                ➕ Thêm khuyến mãi riêng của bạn
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Card Đường Dẫn LDP Thực Tế trên Website -->
                <div class="card mt-4">
                    <div class="card-header font-bold text-gray-900 border-b pb-2 flex items-center justify-between">
                        <span>🔗 Đường Dẫn LDP Thực Tế Trên Website</span>
                        <span v-if="getLdpUrls().length > 0" class="text-xs bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded border border-blue-200">
                            {{ getLdpUrls().length }} đường dẫn LDP
                        </span>
                    </div>
                    <div class="card-body mt-3">
                        <div v-if="getLdpUrls().length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div
                                v-for="item in getLdpUrls()"
                                :key="item.id"
                                class="p-3 bg-gray-50 border border-gray-200 rounded-lg flex flex-col justify-between space-y-2 hover:border-blue-300 transition"
                            >
                                <div class="flex items-center justify-between">
                                    <span class="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                                        🚗 {{ item.title }}
                                    </span>
                                    <a
                                        :href="item.url"
                                        target="_blank"
                                        class="text-xs font-bold text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
                                    >
                                        Xem thực tế ↗
                                    </a>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        readonly
                                        :value="item.url"
                                        class="w-full text-xs bg-white text-gray-700 px-2.5 py-1.5 border border-gray-300 rounded font-mono select-all focus:outline-none"
                                        @click="$event.target.select()"
                                    />
                                    <button
                                        type="button"
                                        class="text-xs bg-gray-200 hover:bg-gray-300 text-gray-800 px-2.5 py-1.5 rounded font-semibold whitespace-nowrap cursor-pointer"
                                        @click="copyToClipboard(item.url)"
                                    >
                                        📋 Copy
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div v-else class="text-xs text-gray-500 italic p-3 bg-gray-50 rounded-lg border border-dashed text-center">
                            ⚠️ Vui lòng chọn <strong>Cố vấn phụ trách</strong> và chọn ít nhất 1 <strong>Dòng xe áp dụng</strong> để tạo đường dẫn LDP.
                        </div>
                    </div>
                </div>

                <!-- Cấu hình SEO -->
                <div class="card mt-4">
                    <div class="card-header font-bold text-gray-900 border-b pb-2">🔍 Tối ưu hóa tìm kiếm (SEO)</div>
                    <div class="card-body mt-4">
                        <Field
                            v-model="form[currentTab].seo_meta_title"
                            :field="{
                                type: 'text',
                                name: `seo_meta_title_${currentTab}`,
                                label: 'SEO Title (Tiêu đề tìm kiếm)',
                                placeholder: 'Nếu bỏ trống sẽ lấy tiêu đề Landing Page',
                            }"
                        />

                        <Field
                            v-model="form[currentTab].seo_meta_description"
                            :field="{
                                type: 'textarea',
                                name: `seo_meta_description_${currentTab}`,
                                label: 'SEO Description (Mô tả tìm kiếm)',
                            }"
                        />

                        <Field
                            v-model="form[currentTab].seo_meta_keywords"
                            :field="{
                                type: 'text',
                                name: `seo_meta_keywords_${currentTab}`,
                                label: 'SEO Keywords (Từ khoá tìm kiếm)',
                            }"
                        />

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <Field
                                v-model="form[currentTab].seo_canonical"
                                :field="{
                                    type: 'text',
                                    name: `seo_canonical_${currentTab}`,
                                    label: 'Canonical URL (Đường dẫn gốc)',
                                    placeholder: 'Nếu bỏ trống sẽ tự động lấy link LDP hiện tại',
                                }"
                            />

                            <Field
                                v-model="form[currentTab].seo_meta_robots"
                                :field="{
                                    type: 'dropdown',
                                    name: `seo_meta_robots_${currentTab}`,
                                    label: 'Robots (Cấu hình lập chỉ mục Google)',
                                    options: [
                                        { id: 'index, follow', label: 'Index, Follow (Cho phép tìm kiếm & bám theo link)' },
                                        { id: 'noindex, nofollow', label: 'Noindex, Nofollow (Chặn tìm kiếm & chặn bám theo link)' },
                                        { id: 'noindex, follow', label: 'Noindex, Follow (Chặn tìm kiếm nhưng bám theo link)' },
                                    ]
                                }"
                            />
                        </div>

                        <Field
                            v-model="form[currentTab].seo_schemas"
                            :field="{
                                type: 'textarea',
                                name: `seo_schemas_${currentTab}`,
                                label: 'Custom Schema JSON-LD (Mã cấu trúc tùy biến)',
                                placeholder: 'Nhập mã JSON-LD của bạn...',
                                rows: 5
                            }"
                        />

                        <Field
                            v-model="form[currentTab].seo_image"
                            :field="{
                                type: 'file_upload',
                                name: `seo_image_${currentTab}`,
                                label: 'Ảnh đại diện khi chia sẻ (SEO Image)',
                            }"
                        />
                    </div>
                </div>
            </div>

            <!-- ===== TAB 2: BLOCK EDITOR ===== -->
            <teleport to="body">
                <div v-if="activeFormTab === 'builder'" class="fixed inset-0 z-[9999] bg-[#f6f6f7] flex flex-col font-sans select-none overflow-hidden h-screen w-screen">
                    <!-- Shopify-style Topbar -->
                    <div class="flex items-center justify-between px-6 py-3.5 bg-white border-b border-gray-200 text-gray-900 shrink-0">
                        <div class="flex items-center space-x-4">
                            <button
                                type="button"
                                class="flex items-center text-xs font-bold text-gray-755 hover:text-gray-900 transition bg-gray-100 hover:bg-gray-200 px-3.5 py-2 rounded-lg border border-gray-300 cursor-pointer"
                                @click="activeFormTab = 'general'"
                            >
                                ← Quay lại thông tin chung
                            </button>
                            <div class="h-4 w-[1px] bg-gray-300"></div>
                            <div class="flex flex-col">
                                <span class="text-[9px] uppercase font-bold tracking-widest text-gray-500 font-mono">Trình dựng trang Sales LDP</span>
                                <span class="text-xs font-bold text-gray-900 mt-0.5">Tùy biến bố cục LDP — {{ formData[currentTab]?.title || 'Landing Page' }}</span>
                            </div>
                        </div>

                        <div class="flex items-center space-x-3">
                            <button
                                type="button"
                                class="bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold px-3 py-2 rounded-lg cursor-pointer transition-colors border border-solid border-amber-300 h-9 flex items-center justify-center gap-1.5"
                                @click="applyVehicleDefaultLayout()"
                                title="Cập nhật bố cục mẫu theo xe đã chọn"
                            >
                                🔄 Tải lại bố cục theo xe
                            </button>
                            <button
                                type="button"
                                class="bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold px-4 py-2 rounded-lg cursor-pointer transition-colors border border-solid border-blue-200 h-9 flex items-center justify-center gap-1.5"
                                @click="showHelpModal = true"
                            >
                                📖 Hướng dẫn cho Sale
                            </button>
                            <button
                                type="button"
                                class="bg-[#008060] hover:bg-[#006e52] text-white text-xs font-bold px-5 py-2 rounded-lg cursor-pointer transition-colors border border-solid border-[#006e52] h-9 flex items-center justify-center gap-1.5 shadow-sm"
                                @click="saveFromBuilder(submit)"
                                :disabled="isSaving"
                            >
                                <span v-if="isSaving">⏳ Đang lưu...</span>
                                <span v-else>💾 Lưu trang</span>
                            </button>
                            <button
                                type="button"
                                class="bg-white hover:bg-gray-50 text-gray-755 hover:text-gray-900 text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition-colors border border-solid border-gray-300 h-9 flex items-center justify-center"
                                @click="activeFormTab = 'general'"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>

                    <!-- Fullscreen Workspace -->
                    <div class="flex-1 bg-[#f6f6f7] overflow-hidden relative h-full w-full">
                        <BlockEditor
                            v-model="form.layout_blocks"
                            :vehicle-slug="selectedVehicleSlug"
                            :vehicle-data="form"
                            :sales-consultants="salesConsultants"
                            :global-promotions="globalPromotions"
                            :fullscreen="true"
                        />
                    </div>
                </div>
            </teleport>
        </template>

        <template #aside="{ form }">
            <!-- Thông tin phân bổ -->
            <div class="card">
                <div class="card-header font-bold text-gray-900 border-b pb-2">🔗 Liên kết trang</div>
                <div class="card-body">
                    <!-- Chọn Cố vấn bán hàng -->
                    <Field
                        v-model="form.sales_consultant_id"
                        :field="{
                            type: 'dropdown',
                            name: 'sales_consultant_id',
                            label: 'Cố vấn phụ trách (Sales)',
                            options: salesConsultants,
                            emptyLabel: '-- Chọn cố vấn bán hàng --',
                        }"
                    />

                    <!-- Chọn dòng xe (Cho phép chọn nhiều dòng xe) -->
                    <Field
                        v-model="form.vehicle_ids"
                        :field="{
                            type: 'select_multiple',
                            name: 'vehicle_ids',
                            label: 'Dòng xe áp dụng (Có thể chọn nhiều)',
                            options: vehicles,
                            labelBy: 'title',
                            keyBy: 'id',
                            placeholder: '-- Chọn các dòng xe áp dụng --',
                        }"
                    />

                    <!-- Nút cập nhật lại bố cục theo dòng xe đã chọn -->
                    <div v-if="hasVehicleSelected" class="mt-2.5 p-2.5 bg-blue-50/70 border border-blue-200/80 rounded-lg">
                        <button
                            type="button"
                            class="text-blue-700 hover:text-blue-900 font-bold text-xs cursor-pointer flex items-center gap-1.5 border-0 bg-transparent p-0"
                            @click="applyVehicleDefaultLayout()"
                        >
                            <span>🔄</span> Tải lại giao diện mẫu theo dòng xe đã chọn
                        </button>
                        <p class="text-[11px] text-gray-500 mt-1 leading-snug">
                            Khi bạn chọn dòng xe mới, bấm nút này để nạp lại toàn bộ khối thiết kế mẫu tương ứng của xe đó.
                        </p>
                    </div>

                    <!-- Trạng thái hoạt động -->
                    <Field
                        v-model="form.status"
                        :field="{
                            type: 'radio_list',
                            name: 'status',
                            label: 'Trạng thái LDP',
                            options: schema.columns.status.list,
                        }"
                    />

                    <!-- Thứ tự sắp xếp -->
                    <Field
                        v-model="form.sort_order"
                        :field="{
                            type: 'number',
                            name: 'sort_order',
                            label: 'Thứ tự',
                        }"
                    />
                </div>
            </div>

            <!-- Preview Link nếu đã lưu -->
            <div v-if="item.id && form.sales_consultant_id && hasVehicleSelected" class="card mt-4">
                <div class="card-header font-bold text-gray-900 border-b pb-2 flex items-center justify-between">
                    <span>👁️ Xem trước Landing Page các dòng xe</span>
                    <span class="text-xs text-gray-500 font-normal">({{ getLdpUrls().length }} dòng xe)</span>
                </div>
                <div class="card-body p-3">
                    <div v-for="ldpUrl in getLdpUrls()" :key="ldpUrl.id" class="flex items-center justify-between py-2 border-b last:border-0">
                        <div class="flex items-center gap-1.5 overflow-hidden pr-2">
                            <span class="text-xs font-semibold text-gray-800 shrink-0">🚘 {{ ldpUrl.title }}:</span>
                            <span class="text-[11px] text-gray-500 truncate" :title="ldpUrl.url">{{ ldpUrl.url }}</span>
                        </div>
                        <div class="flex items-center gap-2 shrink-0">
                            <a
                                :href="ldpUrl.url"
                                target="_blank"
                                class="btn btn-xs btn-outline-primary"
                            >
                                🔗 Xem
                            </a>
                            <button
                                type="button"
                                class="btn btn-xs btn-outline-secondary"
                                @click="copyToClipboard(ldpUrl.url)"
                            >
                                📋 Copy
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- ===== MODAL THÔNG BÁO LƯU THÀNH CÔNG ===== -->
            <transition name="fade-scale">
                <div v-if="showSuccessNotification" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                    <div class="bg-white rounded-2xl p-6 shadow-2xl border border-gray-150 max-w-sm w-full text-center transform transition-all duration-300 scale-100 flex flex-col items-center">
                        <!-- Checkmark Circle Icon -->
                        <div class="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4 ring-8 ring-emerald-50/50">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 class="text-lg font-bold text-gray-900 mb-1">Đã lưu trang thành công!</h3>
                        <p class="text-xs text-gray-500 leading-relaxed mb-4">
                            Tất cả thay đổi về bố cục, khuyến mãi và cố vấn bán hàng đã được cập nhật lên hệ thống.
                        </p>
                        <button 
                            type="button" 
                            @click="showSuccessNotification = false" 
                            class="w-full bg-[#008060] hover:bg-[#006e52] text-white text-xs font-bold py-2.5 rounded-lg transition duration-200 cursor-pointer border-0"
                        >
                            Tuyệt vời
                        </button>
                    </div>
                </div>
            </transition>

            <!-- ===== MODAL HƯỚNG DẪN DÀNH CHO SALE ===== -->
            <transition name="fade-scale">
                <div v-if="showHelpModal" class="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                    <div class="bg-white rounded-2xl shadow-2xl border border-gray-150 max-w-2xl w-full max-h-[85vh] flex flex-col transform transition-all duration-300 scale-100 overflow-hidden text-left">
                        <!-- Header -->
                        <div class="px-6 py-4 border-b border-gray-150 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
                            <div class="flex items-center space-x-2">
                                <span class="text-xl">📖</span>
                                <h3 class="text-base font-bold text-slate-800">HƯỚNG DẪN THIẾT KẾ LDP CHO SALE (DỄ HIỂU)</h3>
                            </div>
                            <button type="button" @click="showHelpModal = false" class="text-gray-400 hover:text-gray-600 text-xl font-bold bg-transparent border-0 cursor-pointer p-1">&times;</button>
                        </div>
                        
                        <!-- Tabs -->
                        <div class="flex border-b border-gray-150 bg-gray-50 text-xs font-semibold overflow-x-auto shrink-0 select-none">
                            <button
                                type="button"
                                class="px-4 py-3 border-b-2 transition cursor-pointer"
                                :class="activeHelpTab === 1 ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100'"
                                @click="activeHelpTab = 1"
                            >
                                👤 Bước 1: Profile cá nhân
                            </button>
                            <button
                                type="button"
                                class="px-4 py-3 border-b-2 transition cursor-pointer"
                                :class="activeHelpTab === 2 ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100'"
                                @click="activeHelpTab = 2"
                            >
                                ➕ Bước 2: Tạo LDP
                            </button>
                            <button
                                type="button"
                                class="px-4 py-3 border-b-2 transition cursor-pointer"
                                :class="activeHelpTab === 3 ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100'"
                                @click="activeHelpTab = 3"
                            >
                                🎨 Bước 3: Bố cục & Ưu đãi
                            </button>
                            <button
                                type="button"
                                class="px-4 py-3 border-b-2 transition cursor-pointer"
                                :class="activeHelpTab === 4 ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100'"
                                @click="activeHelpTab = 4"
                            >
                                🚀 Bước 4: Chạy Ads
                            </button>
                        </div>

                        <!-- Content -->
                        <div class="p-6 overflow-y-auto text-sm text-gray-700 space-y-4 leading-relaxed">
                            <!-- TAB 1: Profile -->
                            <div v-show="activeHelpTab === 1" class="space-y-3">
                                <div class="bg-blue-50 border-l-4 border-blue-500 p-3 rounded text-xs text-blue-800 font-semibold mb-2">
                                    LDP sẽ tự động lấy thông tin Avatar, Số điện thoại và liên kết Zalo từ hồ sơ của bạn để hiển thị cho khách hàng!
                                </div>
                                <h4 class="font-bold text-gray-900">Cách cập nhật hồ sơ cá nhân:</h4>
                                <ol class="list-decimal pl-5 space-y-2">
                                    <li>Vào mục <span class="font-semibold">Cố vấn bán hàng</span> trong menu chính của Admin.</li>
                                    <li>Tìm đúng tên tài khoản của bạn và bấm <span class="font-semibold">Chỉnh sửa</span>.</li>
                                    <li>Cập nhật các thông tin quan trọng:
                                        <ul class="list-disc pl-5 mt-1 space-y-1 text-xs">
                                            <li><span class="font-semibold">Ảnh đại diện (Avatar)</span>: Nên chọn ảnh mặc áo đồng phục Ford lịch sự, hình ảnh rõ nét.</li>
                                            <li><span class="font-semibold">Số điện thoại</span>: Số điện thoại dùng để nhận cuộc gọi trực tiếp từ khách hàng.</li>
                                            <li><span class="font-semibold">Link Zalo</span>: Điền link Zalo cá nhân của bạn (dạng: <code>https://zalo.me/0xxxxxxxxx</code>) để khách hàng nhấn chat Zalo trực tiếp.</li>
                                            <li><span class="font-semibold">Lời giới thiệu ngắn (Short Bio)</span>: Điền chức vụ/câu chào của bạn (vd: <i>"Đại diện kinh doanh cao cấp tại Đồng Nai Ford"</i>).</li>
                                        </ul>
                                    </li>
                                </ol>
                            </div>

                            <!-- TAB 2: Tạo LDP -->
                            <div v-show="activeHelpTab === 2" class="space-y-3">
                                <h4 class="font-bold text-gray-900">Cách thiết lập ban đầu cho một trang LDP:</h4>
                                <ol class="list-decimal pl-5 space-y-2">
                                    <li>Nhấp vào nút <span class="font-semibold">Tạo mới Landing Page</span>.</li>
                                    <li>Nhập <span class="font-semibold">Tiêu đề Landing Page</span> (Tiêu đề này hiển thị trên đầu tab trình duyệt, nên đặt thu hút như: <i>"Ford Territory Thế Thế Mới - Ưu Đãi Trả Góp 5.9% | Đồng Nai Ford"</i>).</li>
                                    <li>Ở phần <span class="font-semibold">Liên kết trang (bên cột tay phải)</span>:
                                        <ul class="list-disc pl-5 mt-1 space-y-1 text-xs">
                                            <li><span class="font-semibold">Cố vấn phụ trách (Sales)</span>: Chọn đúng tên của bạn.</li>
                                            <li><span class="font-semibold">Dòng xe áp dụng</span>: Chọn đúng chiếc xe bạn muốn chạy chiến dịch quảng cáo (ví dụ: Ford Everest, Ford Ranger...).</li>
                                            <li><span class="font-semibold">Trạng thái LDP</span>: Chọn <span class="font-semibold">Hoạt động</span>.</li>
                                        </ul>
                                    </li>
                                </ol>
                            </div>

                            <!-- TAB 3: Bố cục & Ưu đãi -->
                            <div v-show="activeHelpTab === 3" class="space-y-3">
                                <h4 class="font-bold text-gray-900">Cách thiết kế giao diện bằng kéo thả (Block Editor):</h4>
                                <ol class="list-decimal pl-5 space-y-2">
                                    <li>Bấm nút <span class="font-semibold">🎨 Thiết kế Giao diện (Block Editor)</span> ở góc trên bên phải.</li>
                                    <li>Một màn hình lớn sẽ mở ra. Cột bên trái là danh sách các khối giao diện (Blocks), bên phải là màn hình xem trước (Live Preview).</li>
                                    <li><span class="font-semibold">Quy tắc bố cục chuẩn (khuyên dùng):</span>
                                        <ul class="list-disc pl-5 mt-1 space-y-1 text-xs">
                                            <li><span class="font-semibold">Khối 1: Banner lớn (Hero Banner)</span>: Nên là banner đầu trang hiển thị tên xe, nút bấm nhận ưu đãi.</li>
                                            <li><span class="font-semibold">Khối 2: Cố vấn bán hàng (LdpSalesConsultant)</span>: Khối thông tin liên hệ của bạn (Avatar, Hotline, Zalo).</li>
                                            <li><span class="font-semibold">Khối 3: Khuyến mãi (LdpPromotions)</span>: Khối hiển thị các chương trình khuyến mãi/quà tặng của dòng xe.</li>
                                            <li><span class="font-semibold">Khối 4: Form đăng ký (Báo giá/Lái thử)</span>: Để khách hàng điền số điện thoại nhận thông tin tư vấn.</li>
                                        </ul>
                                    </li>
                                    <li>Bạn có thể bấm biểu tượng bút chì ✏️ trên mỗi khối để thay đổi tiêu đề, màu sắc, nút bấm. Sau đó bấm <span class="font-semibold">💾 Lưu trang</span> ở góc trên bên phải để lưu lại.</li>
                                </ol>
                            </div>

                            <!-- TAB 4: Chạy Ads -->
                            <div v-show="activeHelpTab === 4" class="space-y-3">
                                <div class="bg-emerald-50 border-l-4 border-emerald-500 p-3 rounded text-xs text-emerald-800 font-semibold mb-2">
                                    Trang LDP của Sale đã được tối ưu hóa: Ẩn hoàn toàn Header/Footer chung của hãng, chỉ hiển thị thông tin và hotline của riêng bạn để tối đa tỉ lệ khách điền form!
                                </div>
                                <h4 class="font-bold text-gray-900">Cách lấy link LDP sạch để chạy quảng cáo:</h4>
                                <ol class="list-decimal pl-5 space-y-2">
                                    <li>Sau khi bấm <span class="font-semibold">💾 Lưu trang</span> và <span class="font-semibold">Đóng</span>.</li>
                                    <li>Ở góc dưới bên phải trang thông tin chung, bạn sẽ thấy ô <span class="font-semibold">👁️ Xem trước Landing Page</span>.</li>
                                    <li>Bấm vào nút <span class="font-semibold">🔗 Mở trang LDP thực tế</span>.</li>
                                    <li>Trình duyệt sẽ mở ra một trang LDP thực tế của riêng bạn. Bạn chỉ cần <span class="font-semibold">Copy đường dẫn này trên thanh địa chỉ</span> để mang đi chạy Facebook Ads, Google Ads hoặc gửi trực tiếp cho khách hàng qua Zalo/Messenger!</li>
                                    <li>Link chuẩn sẽ có dạng: <code>https://dongnaiford.com.vn/ldp/ten-cua-ban/ten-dong-xe</code></li>
                                </ol>
                            </div>
                        </div>

                        <!-- Footer -->
                        <div class="px-6 py-3 bg-gray-50 border-t border-gray-150 flex justify-end shrink-0">
                            <button
                                type="button"
                                @click="showHelpModal = false"
                                class="bg-[#008060] hover:bg-[#006e52] text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer transition border-0"
                            >
                                Đã hiểu, đóng hướng dẫn
                            </button>
                        </div>
                    </div>
                </div>
            </transition>
        </template>
    </Form>
</template>
<script>
export default {
    props: ['schema', 'item', 'data'],
    data() {
        return {
            formData: this.initFormData(this.item),
            currentTab: 'vi',
            activeFormTab: 'general', // tab chính ('general' hoặc 'builder')
            isSaving: false,
            showSuccessNotification: false,
            showHelpModal: false,
            activeHelpTab: 1,
            salesConsultants: this.data?.sales_consultants ?? [],
            vehicles: this.data?.vehicles ?? [],
            globalPromotions: this.data?.global_promotions ?? []
        }
    },
    watch: {
        item() {
            this.formData = this.initFormData(this.item);
        }
    },
    computed: {
        hasVehicleSelected() {
            if (Array.isArray(this.formData.vehicle_ids) && this.formData.vehicle_ids.length > 0) {
                return true;
            }
            return !!this.formData.vehicle_id;
        },
        selectedVehicleSlug() {
            const vehicle = this.getSelectedVehicle();
            return vehicle ? vehicle.slug : '';
        }
    },
    methods: {
        getFirstVehicleId() {
            let ids = this.formData.vehicle_ids;
            if (!ids || (Array.isArray(ids) && ids.length === 0)) {
                ids = this.formData.vehicle_id ? [this.formData.vehicle_id] : [];
            }
            if (Array.isArray(ids) && ids.length > 0) {
                const first = ids[0];
                return typeof first === 'object' && first !== null ? (first.id ?? first) : first;
            }
            return ids;
        },
        getSelectedVehicle() {
            const id = this.getFirstVehicleId();
            if (!id) return null;
            return this.vehicles.find(v => String(v.id) === String(id)) || null;
        },
        initFormData(item) {
            let vehicleIds = [];
            let rawIds = item ? item.vehicle_ids : null;
            if (typeof rawIds === 'string') {
                try {
                    rawIds = JSON.parse(rawIds);
                } catch (e) {
                    rawIds = [];
                }
            }
            if (Array.isArray(rawIds) && rawIds.length > 0) {
                vehicleIds = rawIds.map(id => typeof id === 'object' && id !== null ? String(id.id ?? id) : String(id));
            } else if (item && item.vehicle_id) {
                vehicleIds = [String(item.vehicle_id)];
            }

            const data = {
                status: 'ACTIVE',
                sort_order: 0,
                layout_blocks: [],
                ...item,
                vehicle_ids: vehicleIds,
                promotions: (item && item.promotions) || {
                    global_promotion_ids: [],
                    custom_promotions: []
                },
            };

            // Ensure default LDP blocks exist in layout_blocks for backwards compatibility and real-time syncing
            if (data.layout_blocks && Array.isArray(data.layout_blocks)) {
                const hasConsultant = data.layout_blocks.some(b => b.type === 'LdpSalesConsultant');
                const hasPromotions = data.layout_blocks.some(b => b.type === 'LdpPromotions');
                
                if (!hasConsultant) {
                    const heroIdx = data.layout_blocks.findIndex(b => b.type === 'HeroBanner');
                    data.layout_blocks.splice(heroIdx !== -1 ? heroIdx + 1 : 0, 0, {
                        id: 'sales-consultant-' + Math.random().toString(36).substr(2, 9),
                        type: 'LdpSalesConsultant',
                        data: {}
                    });
                }
                
                if (!hasPromotions) {
                    const consultantIdx = data.layout_blocks.findIndex(b => b.type === 'LdpSalesConsultant');
                    data.layout_blocks.splice(consultantIdx !== -1 ? consultantIdx + 1 : 1, 0, {
                        id: 'ldp-promotions-' + Math.random().toString(36).substr(2, 9),
                        type: 'LdpPromotions',
                        data: {
                            title: 'Chương Trình Khuyến Mãi Đặc Biệt',
                            description: 'Nhận ưu đãi độc quyền từ Cố vấn khi đăng ký mua xe trong tháng này.'
                        }
                    });
                }
            }
            
            const locales = ['vi'];
            locales.forEach(loc => {
                let trans = null;
                if (item.translations && Array.isArray(item.translations)) {
                    trans = item.translations.find(t => t.locale === loc);
                }
                data[loc] = {
                    title: trans ? (trans.title ?? '') : '',
                    seo_meta_title: trans ? (trans.seo_meta_title ?? '') : '',
                    seo_meta_description: trans ? (trans.seo_meta_description ?? '') : '',
                    seo_meta_keywords: trans ? (trans.seo_meta_keywords ?? '') : '',
                    seo_meta_robots: trans ? (trans.seo_meta_robots ?? 'index, follow') : 'index, follow',
                    seo_canonical: trans ? (trans.seo_canonical ?? '') : '',
                    seo_schemas: trans ? (trans.seo_schemas ?? '') : '',
                    seo_image: trans ? (trans.seo_image ?? null) : null,
                };
            });

            return data;
        },
        addCustomPromo() {
            if (!this.formData.promotions.custom_promotions) {
                this.formData.promotions.custom_promotions = [];
            }
            this.formData.promotions.custom_promotions.push({
                title: '',
                description: '',
                image: null,
                link: ''
            });
        },
        removeCustomPromo(index) {
            this.formData.promotions.custom_promotions.splice(index, 1);
        },
        getLdpUrls() {
            const consultant = this.salesConsultants.find(c => String(c.id) === String(this.formData.sales_consultant_id));
            if (!consultant) return [];

            let clientUrl = '';
            const origin = window.location.origin;
            const hostname = window.location.hostname;
            const port = window.location.port;

            if (port === '8000') {
                // Local dev: CMS chạy port 8000, frontend chạy port 3000
                clientUrl = origin.replace(':8000', ':3000');
            } else if (hostname.startsWith('cms.')) {
                // Production CMS: cms.dongnaiford.com.vn → dongnaiford.com.vn
                clientUrl = `https://${hostname.replace('cms.', '')}`;
            } else {
                // Fallback: dùng domain chính
                clientUrl = `https://dongnaiford.com.vn`;
            }
            const consultantSlug = consultant.slug || this.slugify(consultant.name);

            let vehicleIds = this.formData.vehicle_ids;
            let rawIds = vehicleIds;
            if (typeof rawIds === 'string') {
                try {
                    rawIds = JSON.parse(rawIds);
                } catch (e) {
                    rawIds = [];
                }
            }
            if (!Array.isArray(rawIds) || rawIds.length === 0) {
                rawIds = this.formData.vehicle_id ? [this.formData.vehicle_id] : [];
            }

            const selectedVehicles = rawIds.map(id => {
                const realId = typeof id === 'object' && id !== null ? (id.id ?? id) : id;
                return this.vehicles.find(v => String(v.id) === String(realId));
            }).filter(Boolean);

            if (selectedVehicles.length === 0 && this.formData.vehicle_id) {
                const fallbackVehicle = this.vehicles.find(v => String(v.id) === String(this.formData.vehicle_id));
                if (fallbackVehicle) selectedVehicles.push(fallbackVehicle);
            }

            return selectedVehicles.map(v => {
                let url = `${clientUrl}/ldp/${consultantSlug}/${v.slug}`;
                if (consultant.custom_domain) {
                    const cleanDomain = consultant.custom_domain.replace(/^https?:\/\//i, '').replace(/\/$/, '');
                    url = `https://${cleanDomain}/${v.slug}`;
                }
                return {
                    id: v.id,
                    title: v.title,
                    url: url
                };
            });
        },
        copyToClipboard(text) {
            if (!text) return;
            navigator.clipboard.writeText(text).then(() => {
                alert('Đã sao chép đường dẫn LDP vào bộ nhớ tạm!');
            }).catch(() => {
                alert('Không thể tự động sao chép. Vui lòng chọn thủ công.');
            });
        },
        getLdpPreviewUrl() {
            const urls = this.getLdpUrls();
            return urls.length > 0 ? urls[0].url : '#';
        },
        slugify(text) {
            return text.toString().toLowerCase()
                .replace(/\s+/g, '-')           // Replace spaces with -
                .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
                .replace(/\-\-+/g, '-')         // Replace multiple - with single -
                .replace(/^-+/, '')             // Trim - from start of text
                .replace(/-+$/, '');            // Trim - from end of text
        },
        applyVehicleDefaultLayout(quiet = false) {
            const vehicle = this.getSelectedVehicle();
            if (!vehicle) {
                if (!quiet) alert('Vui lòng chọn ít nhất 1 dòng xe trước.');
                return;
            }

            let blocks = vehicle.layout_blocks;
            if (typeof blocks === 'string') {
                try {
                    blocks = JSON.parse(blocks);
                } catch (e) {
                    blocks = [];
                }
            }
            if (!Array.isArray(blocks)) {
                blocks = [];
            }

            if (!quiet && !confirm(`Bạn có chắc chắn muốn tải lại giao diện mẫu của dòng xe "${vehicle.title}"? Các thay đổi khối hiện tại sẽ được cập nhật theo mẫu của dòng xe này.`)) {
                return;
            }

            let clonedBlocks = JSON.parse(JSON.stringify(blocks));

            if (clonedBlocks.length === 0) {
                clonedBlocks = [
                    {
                        id: 'hero-banner-' + Math.random().toString(36).substr(2, 9),
                        type: 'HeroBanner',
                        data: {
                            title: vehicle.title ? `ƯU ĐÃI ${vehicle.title.toUpperCase()}` : 'ƯU ĐÃI ĐẶC BIỆT',
                            tagline: 'Giá Tốt Nhất - Giao Xe Ngay - Hỗ Trợ Trả Góp',
                            button_text: 'Nhận Báo Giá Lăn Bánh',
                            button_link: '#register-form'
                        }
                    }
                ];
            }

            const hasConsultant = clonedBlocks.some(b => b.type === 'LdpSalesConsultant');
            const hasPromotions = clonedBlocks.some(b => b.type === 'LdpPromotions');

            if (!hasConsultant) {
                const heroIdx = clonedBlocks.findIndex(b => b.type === 'HeroBanner');
                clonedBlocks.splice(heroIdx !== -1 ? heroIdx + 1 : 0, 0, {
                    id: 'sales-consultant-' + Math.random().toString(36).substr(2, 9),
                    type: 'LdpSalesConsultant',
                    data: {}
                });
            }

            if (!hasPromotions) {
                const consultantIdx = clonedBlocks.findIndex(b => b.type === 'LdpSalesConsultant');
                clonedBlocks.splice(consultantIdx !== -1 ? consultantIdx + 1 : 1, 0, {
                    id: 'ldp-promotions-' + Math.random().toString(36).substr(2, 9),
                    type: 'LdpPromotions',
                    data: {
                        title: 'Chương Trình Khuyến Mãi Đặc Biệt',
                        description: 'Nhận ưu đãi độc quyền từ Cố vấn khi đăng ký mua xe trong tháng này.'
                    }
                });
            }

            this.formData.layout_blocks = clonedBlocks;
            if (!quiet) {
                alert(`Đã cập nhật bộ khối giao diện theo dòng xe "${vehicle.title}" thành công! (${clonedBlocks.length} khối)`);
            }
        },
        saveFromBuilder(submitFn) {
            this.isSaving = true;
            if (typeof submitFn === 'function') {
                submitFn();
            }
            setTimeout(() => {
                this.isSaving = false;
                this.showSuccessNotification = true;
                setTimeout(() => {
                    this.showSuccessNotification = false;
                }, 3000);
            }, 1000);
        }
    }
}
</script>

<style scoped>
.fade-scale-enter-active, .fade-scale-leave-active {
    transition: all 0.25s ease-out;
}
.fade-scale-enter-from, .fade-scale-leave-to {
    opacity: 0;
    transform: scale(0.95);
}
</style>

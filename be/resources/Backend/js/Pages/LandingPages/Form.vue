<template layout>
    <Form v-model="formData">
        <template #default="{ form, submit }">
            <!-- Top Mode Selectors (Thiết kế / Thông tin chung) -->
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-2xl font-bold text-gray-900">
                    {{ item.id ? 'Cập nhật Landing Page' : 'Tạo mới Landing Page' }}
                </h1>
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
                        :disabled="!form.vehicle_id"
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

                    <!-- Chọn dòng xe -->
                    <Field
                        v-model="form.vehicle_id"
                        :field="{
                            type: 'dropdown',
                            name: 'vehicle_id',
                            label: 'Dòng xe áp dụng',
                            options: vehicles,
                            emptyLabel: '-- Chọn dòng xe --',
                        }"
                    />

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
            <div v-if="item.id && form.sales_consultant_id && form.vehicle_id" class="card mt-4">
                <div class="card-header font-bold text-gray-900 border-b pb-2">👁️ Xem trước Landing Page</div>
                <div class="card-body text-center py-4">
                    <a
                        :href="getLdpPreviewUrl()"
                        target="_blank"
                        class="btn btn-outline-secondary btn-block text-xs"
                    >
                        🔗 Mở trang LDP thực tế
                    </a>
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
        selectedVehicleSlug() {
            if (!this.formData.vehicle_id) return '';
            const vehicle = this.vehicles.find(v => v.id == this.formData.vehicle_id);
            return vehicle ? vehicle.slug : '';
        }
    },
    methods: {
        initFormData(item) {
            const data = {
                status: 'ACTIVE',
                sort_order: 0,
                layout_blocks: [],
                ...item,
                promotions: item.promotions || {
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
        getLdpPreviewUrl() {
            const vehicle = this.vehicles.find(v => v.id == this.formData.vehicle_id);
            const consultant = this.salesConsultants.find(c => c.id == this.formData.sales_consultant_id);
            if (vehicle && consultant) {
                // Định nghĩa link tới Next.js frontend
                let clientUrl = window.location.origin.replace('8000', '3000');
                if (clientUrl.includes('cms.')) {
                    clientUrl = clientUrl.replace('cms.', '');
                }
                
                // convert consultant name sang slug nếu không tìm thấy slug
                const consultantSlug = consultant.slug || this.slugify(consultant.name);
                return `${clientUrl}/ldp/${consultantSlug}/${vehicle.slug}`;
            }
            return '#';
        },
        slugify(text) {
            return text.toString().toLowerCase()
                .replace(/\s+/g, '-')           // Replace spaces with -
                .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
                .replace(/\-\-+/g, '-')         // Replace multiple - with single -
                .replace(/^-+/, '')             // Trim - from start of text
                .replace(/-+$/, '');            // Trim - from end of text
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

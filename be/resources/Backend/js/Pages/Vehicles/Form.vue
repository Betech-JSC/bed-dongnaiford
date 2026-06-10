<template layout>
    <Form v-model="formData" :config="{ wide: activeFormTab === 'builder' }">
        <template #default="{ form, submit }">

            <!-- ===== MAIN FORM TABS ===== -->
            <div class="mb-5 bg-white p-3 rounded-lg shadow-xs border border-gray-200 flex flex-wrap gap-2">
                <button v-for="tab in tabs" :key="tab.id" type="button"
                    class="py-2 px-4 text-xs md:text-sm font-semibold rounded transition-all cursor-pointer border-0"
                    :class="activeFormTab === tab.id ? 'bg-indigo-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 bg-transparent'"
                    @click="activeFormTab = tab.id"
                >
                    {{ tab.name }}
                </button>
            </div>

            <!-- Tab 1: Thông tin chung & Ảnh -->
            <div v-show="activeFormTab === 'general'" class="space-y-4">
                <div class="card">
                    <!-- Thông tin cơ bản -->
                    <div class="card-body">
                        <p class="text-sm font-semibold text-gray-500 uppercase mb-3">Thông tin dòng xe</p>
                        <Field v-model="form[currentTab].title" :field="{
                            type: 'text',
                            name: `title_${currentTab}`,
                            label: 'Tên dòng xe',
                            placeholder: 'vd: Ford Everest 2026',
                        }" />
                        <Field v-model="form[currentTab].tagline" :field="{
                            type: 'text',
                            name: `tagline_${currentTab}`,
                            label: 'Tagline / Slogan xe',
                            placeholder: 'vd: Thống lĩnh mọi địa hình',
                        }" />
                        <Field v-model="form[currentTab].description" :field="{
                            type: 'richtext',
                            name: `description_${currentTab}`,
                            label: 'Mô tả chi tiết',
                        }" />
                    </div>
                </div>

                <!-- Hình ảnh dòng xe (KHÔNG dịch) -->
                <div class="card mt-4">
                    <div class="card-header font-bold text-gray-700">Hình ảnh dòng xe</div>
                    <div class="card-body">
                        <Field v-model="form.image_thumbnail" :field="{
                            type: 'file_upload',
                            name: 'image_thumbnail',
                            label: 'Ảnh Thumbnail đại diện ở các card',
                        }" />
                        <Field v-model="form.image_featured" :field="{
                            type: 'file_upload',
                            name: 'image_featured',
                            label: 'Ảnh Thumbnail hiển thị ở slider homepage',
                        }" />
                    </div>
                </div>
            </div>

            <!-- Tab 2: Màu sắc & 360° -->
            <div v-show="activeFormTab === 'colors'">
                <!-- Bảng màu xe (KHÔNG dịch) -->
                <div class="card mt-4">
                    <div class="card-header font-bold text-gray-700">Bảng màu xe (Color Swatches) & Trải nghiệm 360°</div>
                    <div class="card-body">
                        <div v-for="(color, index) in form.colors" :key="index" class="border rounded-xl mb-4 bg-white overflow-hidden shadow-xs border-gray-200 transition-all duration-200">
                            <!-- Header of the Accordion -->
                            <div class="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200 cursor-pointer select-none" @click="color.showDetails = !color.showDetails">
                                <div class="flex items-center space-x-3">
                                    <!-- Visual Color circle -->
                                    <div class="w-8 h-8 rounded-full border border-gray-300 shadow-xs transition-transform duration-200 shrink-0"
                                         :style="{ backgroundColor: color.color_code || '#cbd5e1' }"
                                         :class="{ 'scale-110 ring-2 ring-indigo-500/20': color.showDetails }">
                                    </div>
                                    <!-- Name and code -->
                                    <div>
                                        <span class="font-bold text-gray-800 text-sm md:text-base">
                                            {{ color.name || 'Màu sắc chưa đặt tên' }}
                                        </span>
                                        <span v-if="color.color_code" class="text-xs text-gray-500 font-mono ml-2">
                                            ({{ color.color_code }})
                                        </span>
                                    </div>
                                </div>
                                <div class="flex items-center space-x-2" @click.stop>
                                    <button type="button" class="text-red-500 hover:text-red-700 font-bold text-xs border border-red-200 hover:border-red-400 bg-red-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer" @click="removeColor(index)">
                                        ✕ Xóa màu
                                    </button>
                                    <button type="button" class="text-xs text-gray-500 hover:text-gray-700 font-bold bg-transparent border-0 cursor-pointer" @click="color.showDetails = !color.showDetails">
                                        <span>{{ color.showDetails ? '▲ Thu gọn' : '▼ Chi tiết' }}</span>
                                    </button>
                                </div>
                            </div>

                            <!-- Accordion Content -->
                            <div v-show="color.showDetails" class="p-4 space-y-4 border-t border-gray-100 bg-white">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Field v-model="form.colors[index].name" :field="{
                                        type: 'text',
                                        name: 'color_name_' + index,
                                        label: 'Tên màu sắc',
                                        placeholder: 'vd: Trắng Pearl / Đen Panther',
                                    }" />
                                    
                                    <div class="field">
                                        <label class="flex items-center label mb-1">
                                            <span>Mã màu Hex & Chọn màu trực quan</span>
                                        </label>
                                        <div class="flex items-center gap-2">
                                            <input 
                                                type="color" 
                                                v-model="form.colors[index].color_code"
                                                class="w-11 h-[38px] p-0.5 rounded-lg border border-gray-300 cursor-pointer bg-white shrink-0"
                                            />
                                            <InputText 
                                                type="text" 
                                                v-model="form.colors[index].color_code"
                                                placeholder="vd: #ffffff"
                                                class="w-full"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div class="border-t border-gray-150 pt-4 mt-4">
                                    <p class="text-xs font-bold text-indigo-750 uppercase tracking-wider mb-3 flex items-center gap-1">
                                        <span>📸</span>
                                        <span>Hình ảnh & Trải nghiệm 360°</span>
                                    </p>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                                        <Field v-model="form.colors[index].image" :field="{
                                            type: 'file_upload',
                                            name: 'color_image_' + index,
                                            label: 'Ảnh xe phẳng 2D (Ngoại thất)',
                                        }" />
                                        <Field v-model="form.colors[index].image_360_internal" :field="{
                                            type: 'file_upload',
                                            name: 'color_image_360_internal_' + index,
                                            label: 'Ảnh Panorama 360° (Nội thất)',
                                        }" />
                                    </div>
                                    <div class="mt-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                                        <Field v-model="form.colors[index].images_360" :field="{
                                            type: 'file_upload',
                                            name: 'color_images_360_' + index,
                                            label: 'Bộ ảnh xoay 360° Ngoại thất cho màu này (Chọn nhiều ảnh theo thứ tự xoay)',
                                            multiple: true,
                                        }" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div v-if="!form.colors || form.colors.length === 0" class="text-sm text-gray-400 italic mb-3">
                            Chưa cấu hình bảng màu xe nào
                        </div>
                        <button type="button" class="btn btn-secondary btn-sm" @click="addColor">
                            + Thêm màu xe
                        </button>
                    </div>
                </div>
            </div>

            <!-- Tab 3: Phiên bản & Thông số -->
            <div v-show="activeFormTab === 'versions'">
                <!-- Phiên bản & Thông số kỹ thuật -->
                <div class="card mt-4">
                    <div class="card-header font-bold text-gray-700">Phiên bản & Thông số kỹ thuật (Versions & Specs)</div>
                    <div class="card-body">
                        <div v-for="(version, index) in form.versions" :key="index" class="border rounded p-4 mb-4 relative bg-gray-50">
                            <button type="button" class="absolute top-2 right-2 text-red-500 text-sm font-semibold hover:underline" @click="removeVersion(index)">✕ Xóa phiên bản</button>
                            <p class="font-bold text-gray-700 mb-3 text-lg">Phiên bản #{{ index + 1 }}</p>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <!-- Tên phiên bản bằng Tiếng Việt -->
                                <Field v-model="form.versions[index].vi.name" :field="{
                                    type: 'text',
                                    name: 'version_name_vi_' + index,
                                    label: 'Tên phiên bản',
                                    placeholder: 'vd: Titanium 1.5L AT',
                                }" />
                                
                                <!-- Giá phiên bản -->
                                <Field v-model="form.versions[index].price" :field="{
                                    type: 'money',
                                    name: 'version_price_' + index,
                                    label: 'Giá bán (VNĐ)',
                                }" />
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <!-- Trạng thái hoạt động -->
                                <Field v-model="form.versions[index].status" :field="{
                                    type: 'radio_list',
                                    name: 'version_status_' + index,
                                    label: 'Trạng thái phiên bản',
                                    options: [
                                        { id: 'ACTIVE', label: 'Hoạt động' },
                                        { id: 'INACTIVE', label: 'Tạm ẩn' },
                                    ]
                                }" />

                                <!-- Thứ tự sắp xếp -->
                                <Field v-model="form.versions[index].sort_order" :field="{
                                    type: 'number',
                                    name: 'version_sort_' + index,
                                    label: 'Thứ tự sắp xếp',
                                }" />
                            </div>

                            <!-- Toggle Button for Specs -->
                            <div class="mt-4 flex items-center justify-between border-t border-gray-200 pt-3">
                                <button type="button"
                                    class="text-xs text-indigo-650 hover:text-indigo-805 font-bold flex items-center gap-1 bg-transparent border-0 cursor-pointer"
                                    @click="version.showSpecs = !version.showSpecs"
                                >
                                    <span>{{ version.showSpecs ? '▲ Thu gọn thông số kỹ thuật' : '▼ Hiển thị danh sách thông số kỹ thuật chi tiết' }}</span>
                                </button>
                            </div>

                            <!-- Dynamic Specifications List (Collapsible) -->
                            <div v-show="version.showSpecs" class="border-t border-dashed border-gray-200 pt-3 mt-3">
                                <div class="flex justify-between items-center mb-3">
                                    <p class="text-sm font-bold text-indigo-700 uppercase">Thông số kỹ thuật chi tiết (Specs)</p>
                                    <button type="button" class="text-xs text-indigo-650 hover:text-indigo-800 font-bold bg-transparent border-0 cursor-pointer" @click="addCustomSpec(index)">
                                        + Thêm thông số mới
                                    </button>
                                </div>
                                
                                <div class="space-y-2.5 max-w-4xl">
                                    <div v-for="(spec, sIdx) in version.customSpecs" :key="sIdx" class="flex gap-3 items-center bg-gray-50 border border-gray-200 p-2.5 rounded-xl hover:shadow-xs transition duration-150">
                                        <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <!-- Spec Title / Label -->
                                            <div class="md:col-span-1">
                                                <input 
                                                    v-model="spec.label" 
                                                    type="text" 
                                                    class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
                                                    placeholder="Tên thông số (vd: Động cơ)" 
                                                />
                                            </div>
                                            <!-- Spec Value -->
                                            <div class="md:col-span-2">
                                                <input 
                                                    v-model="spec.value" 
                                                    type="text" 
                                                    class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
                                                    placeholder="Giá trị (vd: Bi-Turbo Diesel 2.0L i4)" 
                                                />
                                            </div>
                                        </div>
                                        <!-- Delete button -->
                                        <button 
                                            type="button" 
                                            class="text-red-500 hover:text-red-700 font-bold text-xs bg-red-50 hover:bg-red-100 border border-red-200 w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer shrink-0 transition" 
                                            @click="removeCustomSpec(index, sIdx)"
                                            title="Xóa thông số này"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    <div v-if="!version.customSpecs || version.customSpecs.length === 0" class="text-xs text-gray-400 italic py-2">
                                        Chưa cấu hình thông số kỹ thuật nào cho phiên bản này. Hãy bấm "Thêm thông số mới".
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div v-if="!form.versions || form.versions.length === 0" class="text-sm text-gray-400 italic mb-3">
                            Chưa có phiên bản nào cho dòng xe này.
                        </div>
                        
                        <button type="button" class="btn btn-secondary btn-sm" @click="addVersion">
                            + Thêm phiên bản xe
                        </button>
                    </div>
                </div>
            </div>

            <!-- Tab 4: Thiết kế trang (Shopify Mode Fullscreen Editor Overlay) -->
            <teleport to="body">
                <div v-if="activeFormTab === 'builder'" class="fixed inset-0 z-[9999] bg-[#f6f6f7] flex flex-col font-sans select-none overflow-hidden h-screen w-screen">
                    <!-- Shopify-style Topbar -->
                    <div class="flex items-center justify-between px-6 py-3.5 bg-white border-b border-gray-200 text-gray-900 shrink-0">
                        <div class="flex items-center space-x-4">
                            <button 
                                type="button" 
                                class="flex items-center text-xs font-bold text-gray-750 hover:text-gray-900 transition bg-gray-100 hover:bg-gray-200 px-3.5 py-2 rounded-lg border border-gray-300 cursor-pointer"
                                @click="activeFormTab = 'general'"
                            >
                                ← Quay lại
                            </button>
                            <div class="h-4 w-[1px] bg-gray-300"></div>
                            <div class="flex flex-col">
                                <span class="text-[9px] uppercase font-bold tracking-widest text-gray-500 font-mono">Trình dựng trang trực quan</span>
                                <span class="text-xs font-bold text-gray-900 mt-0.5">Shopify Editor Mode — {{ form.vi?.title || item.title || 'Dòng xe' }}</span>
                            </div>
                        </div>
                        
                        <div class="flex items-center space-x-3">
                            <button 
                                type="button"
                                class="bg-white hover:bg-gray-50 text-gray-755 hover:text-gray-900 text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition-colors border border-solid border-gray-300 h-9 flex items-center justify-center"
                                @click="activeFormTab = 'general'"
                            >
                                Đóng
                            </button>
                            <button 
                                type="button"
                                class="bg-[#008060] hover:bg-[#006e52] disabled:bg-gray-300 text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer transition-colors shadow-xs border-0 h-9 flex items-center justify-center"
                                @click="submit"
                                :disabled="form.processing"
                            >
                                {{ form.processing ? 'Đang lưu...' : 'Lưu thay đổi' }}
                            </button>
                        </div>
                    </div>
                    
                    <!-- Fullscreen Workspace -->
                    <div class="flex-1 bg-[#f6f6f7] overflow-hidden relative h-full w-full">
                        <BlockEditor 
                            v-model="form.layout_blocks" 
                            :vehicle-slug="form.vi.slug || item.slug" 
                            :vehicle-data="form"
                            :fullscreen="true"
                        />
                    </div>
                </div>
            </teleport>

            <!-- Tab 5: Cấu hình SEO -->
            <div v-show="activeFormTab === 'seo'">
                <!-- SEO Settings -->
                <SeoFields :modelValue="form[currentTab]" @update:modelValue="form[currentTab] = $event" />
            </div>

        </template>

        <template #aside="{ form }">
            <div class="card">
                <div class="card-body">
                    <Field v-model="form.category_id" :field="{
                        type: 'dropdown',
                        name: 'category_id',
                        label: 'Danh mục xe',
                        keyBy: 'id',
                        labelBy: 'title',
                        options: categories,
                        emptyLabel: '-- Chọn danh mục --',
                    }" />

                    <Field v-model="form.type" :field="{
                        type: 'dropdown',
                        name: 'type',
                        label: 'Phân loại xe',
                        options: [
                            { id: 'suv', label: 'SUV' },
                            { id: 'pickup', label: 'Bán tải (Pickup)' },
                            { id: 'commercial', label: 'Xe thương mại (Commercial)' },
                        ],
                        emptyLabel: '-- Chọn phân loại xe --',
                    }" />

                    <Field v-model="form.base_price" :field="{
                        type: 'money',
                        name: 'base_price',
                        label: 'Giá niêm yết (VNĐ)',
                    }" />

                    <Field v-model="form.is_best_seller" :field="{
                        type: 'radio_list',
                        name: 'is_best_seller',
                        label: 'Dòng xe bán chạy (Best Seller)',
                        options: [
                            { id: 1, label: 'Có' },
                            { id: 0, label: 'Không' },
                        ]
                    }" />

                    <Field v-model="form.status" :field="{
                        type: 'radio_list',
                        name: 'status',
                        label: 'Trạng thái',
                        options: schema.columns.status.list,
                    }" />

                    <Field v-model="form.sort_order" :field="{
                        type: 'number',
                        name: 'sort_order',
                        label: 'Thứ tự hiển thị',
                    }" />
                </div>
            </div>
        </template>
    </Form>
</template>

<script>
export default {
    props: ['item', 'schema', 'data'],

    data() {
        return {
            currentTab: 'vi',
            activeFormTab: 'general',
            tabs: [
                { id: 'general', name: 'ℹ️ Thông tin chung & Ảnh' },
                { id: 'colors', name: '🎨 Màu xe & 360°' },
                { id: 'versions', name: '⚙️ Phiên bản & Thông số' },
                { id: 'builder', name: '🧱 Thiết kế trang' },
                { id: 'seo', name: '🔍 Cấu hình SEO' }
            ],
            categories: this.data?.categories ?? [],
            formData: this.initFormData(this.item),
        }
    },

    watch: {
        item() {
            this.formData = this.initFormData(this.item)
        },
        'formData.versions': {
            deep: true,
            handler(newVersions) {
                if (!newVersions) return;
                newVersions.forEach(ver => {
                    const specs = {};
                    const labelKeyMap = {
                        'động cơ': 'engine',
                        'động cơ ': 'engine',
                        'công suất cực đại': 'power',
                        'công suất': 'power',
                        'mô-men xoắn cực đại': 'torque',
                        'mô-men xoắn': 'torque',
                        'hộp số': 'transmission',
                        'hệ dẫn động': 'drivetrain',
                        'kích thước (dxrxc)': 'dimensions',
                        'kích thước': 'dimensions',
                        'khoảng sáng gầm': 'clearance',
                        'gầm xe': 'clearance',
                        'tiêu hao nhiên liệu': 'fuelEconomy',
                        'tiêu thụ nhiên liệu': 'fuelEconomy'
                    };

                    if (ver.customSpecs && Array.isArray(ver.customSpecs)) {
                        ver.customSpecs.forEach(item => {
                            if (item.label && item.label.trim()) {
                                const cleanLabel = item.label.trim().toLowerCase();
                                const dbKey = labelKeyMap[cleanLabel] || item.label.trim();
                                specs[dbKey] = item.value || '';
                            }
                        });
                    }
                    ver.specs = specs;
                });
            }
        }
    },

    methods: {
        initFormData(item) {
            const data = {
                status: 'ACTIVE',
                sort_order: 0,
                is_best_seller: 0,
                base_price: 0,
                type: 'suv',
                category_id: null,
                image: null,
                image_thumbnail: null,
                image_featured: null,
                images: [],
                colors: [],
                images_360_external: [],
                image_360_internal_url: '',
                versions: [],
                layout_blocks: [],
                ...item,
            }
            data.layout_blocks = data.layout_blocks || []
            
            // Convert boolean is_best_seller to integer for radio_list
            if (typeof data.is_best_seller === 'boolean') {
                data.is_best_seller = data.is_best_seller ? 1 : 0
            } else if (data.is_best_seller === true || data.is_best_seller === 'true' || data.is_best_seller === '1') {
                data.is_best_seller = 1
            } else {
                data.is_best_seller = 0
            }
            
            const locales = ['vi', 'en']
            locales.forEach(loc => {
                let trans = null
                if (item.translations && Array.isArray(item.translations)) {
                    trans = item.translations.find(t => t.locale === loc)
                }
                const fallback = loc === 'vi' ? item : {}
                data[loc] = {
                    title:            trans?.title            ?? fallback.title            ?? '',
                    slug:             trans?.slug             ?? fallback.slug             ?? '',
                    tagline:          trans?.tagline          ?? fallback.tagline          ?? '',
                    description:      trans?.description      ?? fallback.description      ?? '',
                    // SEO fields
                    seo_meta_title:       trans?.seo_meta_title       ?? '',
                    seo_slug:             trans?.seo_slug             ?? '',
                    seo_meta_description: trans?.seo_meta_description ?? '',
                    seo_meta_keywords:    trans?.seo_meta_keywords    ?? '',
                    seo_meta_robots:      trans?.seo_meta_robots      ?? '',
                    seo_canonical:        trans?.seo_canonical        ?? '',
                    seo_image:            trans?.seo_image            ?? '',
                    seo_schemas:          trans?.seo_schemas          ?? '',
                }
            })

            // Parse existing colors with defaults to avoid reactivity issues in Vue
            data.colors = (data.colors || []).map(col => {
                let code = col.color_code ?? col.hex ?? '';
                if (code && !code.startsWith('#')) {
                    code = '#' + code;
                }
                return {
                    name: col.name ?? col.color_name ?? '',
                    color_code: code || '#cbd5e1',
                    image: col.image ?? (col.image_path ? { path: col.image_path } : null),
                    images_360: col.images_360 ?? [],
                    image_360_internal: col.image_360_internal ?? null,
                    showDetails: false,
                };
            })

            // Parse existing versions with locales & default empty specs
            data.versions = (data.versions || []).map(ver => {
                const verSpecs = ver.specs || {};
                
                // Predefined mapping of English keys to Vietnamese labels
                const keyLabelMap = {
                    engine: 'Động cơ',
                    power: 'Công suất cực đại',
                    torque: 'Mô-men xoắn cực đại',
                    transmission: 'Hộp số',
                    drivetrain: 'Hệ dẫn động',
                    dimensions: 'Kích thước (DxRxC)',
                    clearance: 'Khoảng sáng gầm',
                    fuelEconomy: 'Tiêu hao nhiên liệu'
                };
                
                // Extract specs in order
                const customSpecs = [];
                const knownKeys = ['engine', 'power', 'torque', 'transmission', 'drivetrain', 'dimensions', 'clearance', 'fuelEconomy'];
                
                // First, load standard keys
                knownKeys.forEach(key => {
                    const label = keyLabelMap[key];
                    const val = verSpecs[key] ?? '';
                    customSpecs.push({
                        label: label,
                        value: val
                    });
                });

                // Then, load any other custom keys that are not standard
                Object.keys(verSpecs).forEach(key => {
                    if (!knownKeys.includes(key)) {
                        const vietnameseLabelMatched = Object.values(keyLabelMap).some(l => l.toLowerCase() === key.toLowerCase());
                        if (!vietnameseLabelMatched) {
                            customSpecs.push({
                                label: key,
                                value: verSpecs[key]
                            });
                        }
                    }
                });

                const labelKeyMap = {
                    'động cơ': 'engine',
                    'động cơ ': 'engine',
                    'công suất cực đại': 'power',
                    'công suất': 'power',
                    'mô-men xoắn cực đại': 'torque',
                    'mô-men xoắn': 'torque',
                    'hộp số': 'transmission',
                    'hệ dẫn động': 'drivetrain',
                    'kích thước (dxrxc)': 'dimensions',
                    'kích thước': 'dimensions',
                    'khoảng sáng gầm': 'clearance',
                    'gầm xe': 'clearance',
                    'tiêu hao nhiên liệu': 'fuelEconomy',
                    'tiêu thụ nhiên liệu': 'fuelEconomy'
                };

                const initialSpecs = {};
                customSpecs.forEach(item => {
                    if (item.label && item.label.trim()) {
                        const cleanLabel = item.label.trim().toLowerCase();
                        const dbKey = labelKeyMap[cleanLabel] || item.label.trim();
                        initialSpecs[dbKey] = item.value || '';
                    }
                });

                const verData = {
                    id: ver.id,
                    price: ver.price ?? 0,
                    status: ver.status ?? 'ACTIVE',
                    sort_order: ver.sort_order ?? 0,
                    showSpecs: false,
                    customSpecs: customSpecs,
                    specs: initialSpecs
                }
                locales.forEach(loc => {
                    let trans = null
                    if (ver.translations && Array.isArray(ver.translations)) {
                        trans = ver.translations.find(t => t.locale === loc)
                    }
                    const fallback = loc === 'vi' ? ver : {}
                    verData[loc] = {
                        name: trans?.name ?? fallback.name ?? ''
                    }
                })
                return verData
            })

            return data
        },

        addColor() {
            if (!this.formData.colors) this.formData.colors = []
            this.formData.colors.push({ 
                name: '', 
                color_code: '#cbd5e1', 
                image: null,
                images_360: [],
                image_360_internal: null,
                showDetails: true
            })
        },

        removeColor(index) {
            if (this.formData.colors) {
                this.formData.colors.splice(index, 1)
            }
        },

        addVersion() {
            if (!this.formData.versions) this.formData.versions = []
            
            const defaultSpecs = [
                { label: 'Động cơ', value: '' },
                { label: 'Công suất cực đại', value: '' },
                { label: 'Mô-men xoắn cực đại', value: '' },
                { label: 'Hộp số', value: '' },
                { label: 'Hệ dẫn động', value: '' },
                { label: 'Kích thước (DxRxC)', value: '' },
                { label: 'Khoảng sáng gầm', value: '' },
                { label: 'Tiêu hao nhiên liệu', value: '' }
            ];

            this.formData.versions.push({
                price: 0,
                status: 'ACTIVE',
                sort_order: this.formData.versions.length + 1,
                showSpecs: true,
                customSpecs: defaultSpecs,
                specs: {
                    engine: '',
                    power: '',
                    torque: '',
                    transmission: '',
                    drivetrain: '',
                    dimensions: '',
                    clearance: '',
                    fuelEconomy: ''
                },
                vi: { name: '' },
                en: { name: '' }
            })
        },

        removeVersion(index) {
            if (this.formData.versions) {
                this.formData.versions.splice(index, 1)
            }
        },

        addCustomSpec(versionIndex) {
            const ver = this.formData.versions[versionIndex];
            if (!ver.customSpecs) {
                ver.customSpecs = [];
            }
            ver.customSpecs.push({ label: '', value: '' });
        },

        removeCustomSpec(versionIndex, specIndex) {
            const ver = this.formData.versions[versionIndex];
            if (ver.customSpecs) {
                ver.customSpecs.splice(specIndex, 1);
            }
        },
    },
}
</script>

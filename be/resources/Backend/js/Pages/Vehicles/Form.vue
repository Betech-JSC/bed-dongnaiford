<template layout>
    <Form v-model="formData">
        <template #default="{ form }">

            <!-- ===== LOCALE TABS ===== -->
            <div class="card">
                <div class="card-header border-b-0 pb-0">
                    <ul class="flex border-b">
                        <li class="-mb-px mr-1">
                            <a class="bg-white inline-block py-2 px-4 font-semibold cursor-pointer"
                               :class="currentTab === 'vi' ? 'border-l border-t border-r rounded-t text-primary-700' : 'text-gray-500 hover:text-primary-800'"
                               @click="currentTab = 'vi'">🇻🇳 Tiếng Việt</a>
                        </li>
                        <li class="-mb-px mr-1">
                            <a class="bg-white inline-block py-2 px-4 font-semibold cursor-pointer"
                               :class="currentTab === 'en' ? 'border-l border-t border-r rounded-t text-primary-700' : 'text-gray-500 hover:text-primary-800'"
                               @click="currentTab = 'en'">🇬🇧 English</a>
                        </li>
                    </ul>
                </div>

                <!-- Thông tin cơ bản (dịch theo locale) -->
                <div class="card-body mt-4">
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

            <!-- Ảnh & Thư viện ảnh (KHÔNG dịch) -->
            <div class="card mt-4">
                <div class="card-header">Hình ảnh & Thư viện ảnh</div>
                <div class="card-body">
                    <Field v-model="form.image" :field="{
                        type: 'file_upload',
                        name: 'image',
                        label: 'Ảnh đại diện (Thumbnail danh sách)',
                    }" />
                    <Field v-model="form.images" :field="{
                        type: 'file_upload',
                        name: 'images',
                        label: 'Thư viện ảnh chi tiết',
                        multiple: true,
                    }" />
                </div>
            </div>

            <!-- Xoay 360 độ (KHÔNG dịch) -->
            <div class="card mt-4">
                <div class="card-header">Tính năng xem xe 360 độ</div>
                <div class="card-body">
                    <Field v-model="form.images_360_external" :field="{
                        type: 'file_upload',
                        name: 'images_360_external',
                        label: 'Bộ ảnh xoay 360 độ (Ngoại thất - Chọn nhiều ảnh xếp thứ tự xoay)',
                        multiple: true,
                    }" />
                    <Field v-model="form.image_360_internal_url" :field="{
                        type: 'text',
                        name: 'image_360_internal_url',
                        label: 'Đường dẫn liên kết ảnh 360 độ (Nội thất)',
                        placeholder: 'vd: https://kuula.co/share/...',
                    }" />
                </div>
            </div>

            <!-- Bảng màu xe (KHÔNG dịch) -->
            <div class="card mt-4">
                <div class="card-header">Bảng màu xe (Color Swatches)</div>
                <div class="card-body">
                    <div v-for="(color, index) in form.colors" :key="index" class="border rounded p-4 mb-4 relative bg-gray-50">
                        <button type="button" class="absolute top-2 right-2 text-red-500 text-sm font-semibold hover:underline" @click="removeColor(index)">✕ Xóa</button>
                        <p class="font-bold text-gray-700 mb-3">Màu sắc #{{ index + 1 }}</p>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field v-model="form.colors[index].name" :field="{
                                type: 'text',
                                name: 'color_name_' + index,
                                label: 'Tên màu sắc',
                                placeholder: 'vd: Trắng Pearl / Đen Panther',
                            }" />
                            <Field v-model="form.colors[index].color_code" :field="{
                                type: 'text',
                                name: 'color_code_' + index,
                                label: 'Mã màu Hex',
                                placeholder: 'vd: #ffffff hoặc #000000',
                            }" />
                        </div>
                        <div class="mt-2">
                            <Field v-model="form.colors[index].image" :field="{
                                type: 'file_upload',
                                name: 'color_image_' + index,
                                label: 'Ảnh xe tương ứng màu này',
                            }" />
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

            <!-- Phiên bản & Thông số kỹ thuật -->
            <div class="card mt-4">
                <div class="card-header font-bold text-gray-700">Phiên bản & Thông số kỹ thuật (Versions & Specs)</div>
                <div class="card-body">
                    <div v-for="(version, index) in form.versions" :key="index" class="border rounded p-4 mb-4 relative bg-gray-50">
                        <button type="button" class="absolute top-2 right-2 text-red-500 text-sm font-semibold hover:underline" @click="removeVersion(index)">✕ Xóa phiên bản</button>
                        <p class="font-bold text-gray-700 mb-3 text-lg">Phiên bản #{{ index + 1 }}</p>
                        
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <!-- Tên phiên bản bằng Tiếng Việt -->
                            <Field v-model="form.versions[index].vi.name" :field="{
                                type: 'text',
                                name: 'version_name_vi_' + index,
                                label: 'Tên phiên bản (🇻🇳 Tiếng Việt)',
                                placeholder: 'vd: Titanium 1.5L AT',
                            }" />
                            
                            <!-- Tên phiên bản bằng Tiếng Anh -->
                            <Field v-model="form.versions[index].en.name" :field="{
                                type: 'text',
                                name: 'version_name_en_' + index,
                                label: 'Tên phiên bản (🇬🇧 English)',
                                placeholder: 'vd: Titanium 1.5L AT',
                            }" />

                            <!-- Giá phiên bản -->
                            <Field v-model="form.versions[index].price" :field="{
                                type: 'number',
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

                            <!-- Thứ tự hiển thị -->
                            <Field v-model="form.versions[index].sort_order" :field="{
                                type: 'number',
                                name: 'version_sort_' + index,
                                label: 'Thứ tự sắp xếp',
                            }" />
                        </div>

                        <!-- 8 Thông số kỹ thuật chi tiết -->
                        <div class="border-t pt-3 mt-3">
                            <p class="text-sm font-bold text-primary-700 mb-3 uppercase">Thông số kỹ thuật chi tiết (Specs)</p>
                            
                            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <Field v-model="form.versions[index].specs.engine" :field="{
                                    type: 'text',
                                    name: 'version_spec_engine_' + index,
                                    label: 'Động cơ',
                                    placeholder: 'vd: 1.5L Ecoboost Xăng tăng áp',
                                }" />
                                
                                <Field v-model="form.versions[index].specs.power" :field="{
                                    type: 'text',
                                    name: 'version_spec_power_' + index,
                                    label: 'Công suất cực đại',
                                    placeholder: 'vd: 160 Hp @ 5400-5700 rpm',
                                }" />

                                <Field v-model="form.versions[index].specs.torque" :field="{
                                    type: 'text',
                                    name: 'version_spec_torque_' + index,
                                    label: 'Mô-men xoắn cực đại',
                                    placeholder: 'vd: 248 Nm @ 1500-3000 rpm',
                                }" />

                                <Field v-model="form.versions[index].specs.transmission" :field="{
                                    type: 'text',
                                    name: 'version_spec_transmission_' + index,
                                    label: 'Hộp số',
                                    placeholder: 'vd: Tự động 7 cấp ly hợp kép',
                                }" />
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-3">
                                <Field v-model="form.versions[index].specs.drivetrain" :field="{
                                    type: 'text',
                                    name: 'version_spec_drivetrain_' + index,
                                    label: 'Hệ dẫn động',
                                    placeholder: 'vd: Cầu trước (FWD)',
                                }" />

                                <Field v-model="form.versions[index].specs.dimensions" :field="{
                                    type: 'text',
                                    name: 'version_spec_dimensions_' + index,
                                    label: 'Kích thước (DxRxC)',
                                    placeholder: 'vd: 4.630 x 1.935 x 1.706 mm',
                                }" />

                                <Field v-model="form.versions[index].specs.clearance" :field="{
                                    type: 'text',
                                    name: 'version_spec_clearance_' + index,
                                    label: 'Khoảng sáng gầm',
                                    placeholder: 'vd: 190 mm',
                                }" />

                                <Field v-model="form.versions[index].specs.fuelEconomy" :field="{
                                    type: 'text',
                                    name: 'version_spec_fuel_economy_' + index,
                                    label: 'Tiêu hao nhiên liệu',
                                    placeholder: 'vd: 7.0 L/100km',
                                }" />
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

            <!-- Page Builder Blocks -->
            <div class="card mt-4">
                <div class="card-header font-bold text-gray-700">Trình dựng trang Page Builder</div>
                <div class="card-body">
                    <BlockEditor v-model="form.layout_blocks" />
                </div>
            </div>

            <!-- SEO Settings -->
            <SeoFields :modelValue="form[currentTab]" @update:modelValue="form[currentTab] = $event" />

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
                        type: 'number',
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
            currentTab: this.getCurrentLocale?.() ?? 'vi',
            categories: this.data?.categories ?? [],
            formData: this.initFormData(this.item),
        }
    },

    watch: {
        item() {
            this.formData = this.initFormData(this.item)
        },
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

            // Parse existing versions with locales & default empty specs
            data.versions = (data.versions || []).map(ver => {
                const verData = {
                    id: ver.id,
                    price: ver.price ?? 0,
                    status: ver.status ?? 'ACTIVE',
                    sort_order: ver.sort_order ?? 0,
                    specs: {
                        engine: ver.specs?.engine ?? '',
                        power: ver.specs?.power ?? '',
                        torque: ver.specs?.torque ?? '',
                        transmission: ver.specs?.transmission ?? '',
                        drivetrain: ver.specs?.drivetrain ?? '',
                        dimensions: ver.specs?.dimensions ?? '',
                        clearance: ver.specs?.clearance ?? '',
                        fuelEconomy: ver.specs?.fuelEconomy ?? '',
                        ...(ver.specs || {})
                    }
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
            this.formData.colors.push({ name: '', color_code: '', image: null })
        },

        removeColor(index) {
            if (this.formData.colors) {
                this.formData.colors.splice(index, 1)
            }
        },

        addVersion() {
            if (!this.formData.versions) this.formData.versions = []
            this.formData.versions.push({
                price: 0,
                status: 'ACTIVE',
                sort_order: this.formData.versions.length + 1,
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
    },
}
</script>

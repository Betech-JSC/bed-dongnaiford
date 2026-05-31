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
                        <li class="-mb-px mr-1">
                            <a class="bg-white inline-block py-2 px-4 font-semibold cursor-pointer"
                               :class="currentTab === 'zh' ? 'border-l border-t border-r rounded-t text-primary-700' : 'text-gray-500 hover:text-primary-800'"
                               @click="currentTab = 'zh'">🇨🇳 中文</a>
                        </li>
                    </ul>
                </div>

                <!-- Thông tin cơ bản (dịch theo locale) -->
                <div class="card-body mt-4">
                    <p class="text-sm font-semibold text-gray-500 uppercase mb-3">Thông tin sản phẩm</p>

                    <Field v-model="form[currentTab].title" :field="{
                        type: 'text',
                        name: `title_${currentTab}`,
                        label: 'Tiêu đề khóa học',
                    }" />
                    <Field v-model="form[currentTab].slug" :field="{
                        type: 'text',
                        name: `slug_${currentTab}`,
                        label: 'Slug (tự động tạo)',
                        disabled: currentTab === 'vi',
                    }" />
                </div>
            </div>

            <!-- Ảnh & Banner (KHÔNG dịch) -->
            <div class="card">
                <div class="card-header">Hình ảnh & Banner</div>
                <div class="card-body">
                    <Field v-model="form.image" :field="{
                        type: 'file_upload',
                        name: 'image',
                        label: 'Thumbnail (danh sách)',
                    }" />
                    <Field v-model="form.banner_detail" :field="{
                        type: 'file_upload',
                        name: 'banner_detail',
                        label: 'Banner nền trang chi tiết',
                    }" />
                </div>
            </div>

            <!-- Nội dung mô tả (dịch theo locale) -->
            <div class="card">
                <div class="card-header">Nội dung mô tả</div>
                <div class="card-body">
                    <Field v-model="form[currentTab].overview" :field="{
                        type: 'richtext',
                        name: `overview_${currentTab}`,
                        label: 'Giới thiệu tổng quan',
                    }" />
                    <Field v-model="form[currentTab].overview_courses" :field="{
                        type: 'richtext',
                        name: `overview_courses_${currentTab}`,
                        label: 'Khóa học bao gồm',
                    }" />
                    <Field v-model="form[currentTab].overview_future" :field="{
                        type: 'richtext',
                        name: `overview_future_${currentTab}`,
                        label: 'Hướng tới',
                    }" />
                </div>
            </div>

            <!-- Thông tin giảng viên (dịch theo locale) -->
            <div class="card">
                <div class="card-header">Thông tin giảng viên</div>
                <div class="card-body">
                    <Field v-model="form[currentTab].author" :field="{
                        type: 'text',
                        name: `author_${currentTab}`,
                        label: 'Tên giảng viên',
                        placeholder: 'vd: Mr. Zhou Yi (Châu Nhất)',
                    }" />
                    <Field v-model="form[currentTab].author_title" :field="{
                        type: 'text',
                        name: `author_title_${currentTab}`,
                        label: 'Chức danh',
                        placeholder: 'vd: CEO - LOTUS INSTITUTE',
                    }" />
                    <!-- Ảnh giảng viên KHÔNG dịch -->
                    <Field v-model="form.author_avatar" :field="{
                        type: 'file_upload',
                        name: 'author_avatar',
                        label: 'Ảnh giảng viên',
                    }" />
                    <Field v-model="form[currentTab].author_description" :field="{
                        type: 'textarea',
                        name: `author_description_${currentTab}`,
                        label: 'Mô tả giảng viên',
                    }" />
                </div>
            </div>

            <!-- Highlights (dịch theo locale) -->
            <div class="card">
                <div class="card-header">Điểm nổi bật</div>
                <div class="card-body">
                    <div class="field">
                        <label class="flex items-center label">Điểm nổi bật</label>
                        <div class="flex flex-col gap-2">
                            <div v-for="(_, index) in form[currentTab].highlights" :key="index"
                                class="flex items-center gap-2">
                                <span class="text-gray-400 text-sm w-5 text-center flex-shrink-0">{{ index + 1 }}.</span>
                                <InputText v-model="form[currentTab].highlights[index]" class="w-full"
                                    placeholder="vd: Tư duy và kỷ luật" />
                                <button type="button"
                                    class="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors"
                                    @click="removeHighlight(index)">
                                    <i class="pi pi-times text-sm"></i>
                                </button>
                            </div>
                            <div v-if="!form[currentTab].highlights || form[currentTab].highlights.length === 0"
                                class="text-sm text-gray-400 italic">
                                Chưa có điểm nổi bật nào
                            </div>
                        </div>
                        <Button type="button" label="+ Thêm điểm nổi bật" class="p-button-text p-button-sm mt-2"
                            @click="addHighlight" />
                    </div>
                </div>
            </div>

            <!-- Sections động (dịch theo locale) -->
            <div class="card">
                <div class="card-header">
                    Sections nội dung
                    <small class="text-gray-400 ml-2">(card image + text thay được)</small>
                </div>
                <div class="card-body">
                    <Field v-model="form[currentTab].sections_title" :field="{
                        type: 'text',
                        name: `sections_title_${currentTab}`,
                        label: 'Tiêu đề nội dung',
                        placeholder: 'vd: Những điều bạn sẽ học được',
                    }" />
                    <div v-for="(section, index) in form[currentTab].sections" :key="index"
                        class="border rounded p-4 mb-4 relative">
                        <button type="button" class="absolute top-2 right-2 text-red-500 text-sm"
                            @click="removeSection(index)">✕ Xóa</button>
                        <p class="font-medium mb-3">Section {{ index + 1 }}</p>
                        <!-- Ảnh section KHÔNG dịch — dùng vi làm gốc -->
                        <Field v-model="form['vi'].sections[index].image" :field="{
                            type: 'file_upload',
                            name: 'section_image_' + index,
                            label: 'Ảnh section (chung)',
                        }" />
                        <Field v-model="form[currentTab].sections[index].text" :field="{
                            type: 'textarea',
                            name: `section_text_${currentTab}_${index}`,
                            label: 'Nội dung text',
                        }" />
                    </div>
                    <button type="button" class="btn btn-secondary btn-sm" @click="addSection">
                        + Thêm section
                    </button>
                </div>
            </div>

            <!-- Chọn đánh giá -->
            <div class="card">
                <div class="card-header">Đánh giá hiển thị trên trang</div>
                <div class="card-body">
                    <div class="field">
                        <label class="flex items-center label">Chọn đánh giá (lọc theo danh mục)</label>
                        <div class="flex flex-col gap-2 mt-1">
                            <div v-if="filteredReviews.length === 0" class="text-sm text-gray-400 italic">
                                Chưa có đánh giá nào trong danh mục này. Hãy chọn danh mục trước.
                            </div>
                            <label v-for="review in filteredReviews" :key="review.id"
                                class="flex items-center gap-2 cursor-pointer py-1">
                                <Checkbox :binary="false" :value="review.id" v-model="form.review_ids"
                                    class="flex-shrink-0" />
                                <span class="text-sm">{{ review.label }}</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

        </template>

        <template #aside="{ form }">
            <div class="card">
                <div class="card-body">
                    <Field v-model="form.category_id" :field="{
                        type: 'dropdown',
                        name: 'category_id',
                        label: 'Danh mục',
                        keyBy: 'id',
                        labelBy: 'title',
                        options: categories,
                        emptyLabel: '-- Chọn danh mục --',
                    }" />
                    <Field v-model="form.price" :field="{
                        type: 'number',
                        name: 'price',
                        label: 'Giá (VNĐ)',
                    }" />
                    <Field v-model="form.price_sale" :field="{
                        type: 'number',
                        name: 'price_sale',
                        label: 'Giảm giá (VNĐ)',
                    }" />
                    <Field v-model="form.status" :field="{
                        type: 'radio_list',
                        name: 'status',
                        label: 'Trạng thái',
                        options: schema.columns.status.list,
                    }" />
                    <Field v-model="form.is_hot" :field="{
                        type: 'radio_list',
                        name: 'is_hot',
                        label: 'Sản phẩm nổi bật',
                        options: [
                            { id: 1, label: 'Có' },
                            { id: 0, label: 'Không' },
                        ]
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
            reviews: this.data?.reviews ?? [],
            formData: this.initFormData(this.item),
        }
    },

    computed: {
        filteredReviews() {
            const catId = this.formData?.category_id
            if (!catId) return this.reviews
            return this.reviews.filter(r => r.category_id == catId)
        },
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
                is_hot: 0,
                price: 0,
                price_sale: 0,
                review_ids: [],
                ...item,
            }
            
            // Convert boolean is_hot to integer for radio_list
            if (typeof data.is_hot === 'boolean') {
                data.is_hot = data.is_hot ? 1 : 0
            } else if (data.is_hot === true || data.is_hot === 'true' || data.is_hot === '1') {
                data.is_hot = 1
            } else {
                data.is_hot = 0
            }
            
            const locales = ['vi', 'en', 'zh']
            locales.forEach(loc => {
                let trans = null
                if (item.translations && Array.isArray(item.translations)) {
                    trans = item.translations.find(t => t.locale === loc)
                }
                const fallback = loc === 'vi' ? item : {}
                data[loc] = {
                    title:            trans?.title            ?? fallback.title            ?? '',
                    slug:             trans?.slug             ?? fallback.slug             ?? '',
                    overview:         trans?.overview         ?? fallback.overview         ?? '',
                    overview_courses: trans?.overview_courses ?? fallback.overview_courses ?? '',
                    overview_future:  trans?.overview_future  ?? fallback.overview_future  ?? '',
                    author:           trans?.author           ?? fallback.author           ?? '',
                    author_title:     trans?.author_title     ?? fallback.author_title     ?? '',
                    author_description: trans?.author_description ?? fallback.author_description ?? '',
                    sections_title:   trans?.sections_title   ?? fallback.sections_title   ?? '',
                    sections: this.parseSections(trans?.sections ?? (loc === 'vi' ? fallback.sections : null)),
                    highlights: this.parseHighlights(trans?.highlights ?? (loc === 'vi' ? fallback.highlights : null)),
                }
            })
            return data
        },

        parseSections(val) {
            if (!val) return []
            if (Array.isArray(val)) return val
            try { return JSON.parse(val) } catch { return [] }
        },

        parseHighlights(val) {
            if (!val) return []
            if (Array.isArray(val)) return val
            try { return JSON.parse(val) } catch { return [] }
        },

        addSection() {
            const locales = ['vi', 'en', 'zh']
            locales.forEach(loc => {
                if (!this.formData[loc].sections) this.formData[loc].sections = []
                this.formData[loc].sections.push({ image: null, text: '' })
            })
        },

        removeSection(index) {
            const locales = ['vi', 'en', 'zh']
            locales.forEach(loc => {
                if (this.formData[loc].sections) {
                    this.formData[loc].sections.splice(index, 1)
                }
            })
        },

        addHighlight() {
            if (!this.formData[this.currentTab].highlights) this.formData[this.currentTab].highlights = []
            this.formData[this.currentTab].highlights.push('')
        },

        removeHighlight(index) {
            if (this.formData[this.currentTab].highlights) {
                this.formData[this.currentTab].highlights.splice(index, 1)
            }
        },
    },
}
</script>

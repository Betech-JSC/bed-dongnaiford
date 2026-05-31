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
                <div class="card-body mt-4">

                    <!-- Tên -->
                    <Field
                        v-model="form[currentTab].name"
                        :field="{
                            type: 'text',
                            name: `name_${currentTab}`,
                            label: 'Họ và tên',
                            placeholder: 'vd: Đinh Thị Bích Ly',
                        }"
                    />

                    <!-- Slug -->
                    <Field
                        v-model="form[currentTab].slug"
                        :field="{
                            type: 'text',
                            name: `slug_${currentTab}`,
                            label: 'Slug (tự động tạo)',
                        }"
                    />

                    <!-- Chức danh -->
                    <Field
                        v-model="form[currentTab].job_title"
                        :field="{
                            type: 'text',
                            name: `job_title_${currentTab}`,
                            label: 'Chức danh',
                            placeholder: 'vd: Giám đốc Chăm sóc & Nhân sự',
                        }"
                    />

                    <!-- Tiểu sử ngắn -->
                    <Field
                        v-model="form[currentTab].short_bio"
                        :field="{
                            type: 'textarea',
                            name: `short_bio_${currentTab}`,
                            label: 'Tiểu sử ngắn',
                        }"
                    />

                    <!-- Tiểu sử đầy đủ -->
                    <Field
                        v-model="form[currentTab].bio"
                        :field="{
                            type: 'richtext',
                            name: `bio_${currentTab}`,
                            label: 'Tiểu sử đầy đủ',
                        }"
                    />
                </div>
            </div>

            <!-- Gallery -->
            <div class="card mt-4">
                <div class="card-header">Gallery (Trang chi tiết)</div>
                <div class="card-body">
                    <div
                        v-for="(item, index) in form.gallery"
                        :key="index"
                        class="border rounded p-3 mb-3"
                    >
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <strong>Ảnh {{ index + 1 }}</strong>
                            <button
                                type="button"
                                class="btn btn-sm btn-danger"
                                @click="removeGalleryItem(index)"
                            >Xoá</button>
                        </div>
                        <Field
                            v-model="form.gallery[index].image"
                            :field="{
                                type: 'file_upload',
                                name: 'gallery_image_' + index,
                                label: 'Ảnh',
                            }"
                        />
                        <Field
                            v-model="form.gallery[index].caption"
                            :field="{
                                type: 'text',
                                name: 'gallery_caption_' + index,
                                label: 'Caption (tuỳ chọn)',
                            }"
                        />
                    </div>
                    <button
                        type="button"
                        class="btn btn-outline-primary btn-sm"
                        @click="addGalleryItem"
                    >+ Thêm ảnh gallery</button>
                </div>
            </div>
        </template>

        <template #aside="{ form }">
            <!-- Ảnh đại diện -->
            <div class="card">
                <div class="card-body">
                    <Field
                        v-model="form.avatar"
                        :field="{
                            type: 'file_upload',
                            name: 'avatar',
                            label: 'Ảnh đại diện',
                        }"
                    />
                </div>
            </div>

            <!-- Trạng thái -->
            <div class="card mt-4">
                <div class="card-body">
                    <Field
                        v-model="form.status"
                        :field="{
                            type: 'radio_list',
                            name: 'status',
                            label: 'Trạng thái',
                            options: schema.columns.status.list,
                        }"
                    />
                    <Field
                        v-model="form.sort_order"
                        :field="{
                            type: 'number',
                            name: 'sort_order',
                            label: 'Thứ tự hiển thị',
                        }"
                    />
                </div>
            </div>

            <!-- Liên hệ -->
            <div class="card mt-4">
                <div class="card-header">Liên hệ</div>
                <div class="card-body">
                    <Field
                        v-model="form.email"
                        :field="{
                            type: 'text',
                            name: 'email',
                            label: 'Email',
                            placeholder: 'example@lotus.edu.vn',
                        }"
                    />
                </div>
            </div>
        </template>
    </Form>
</template>

<script>
export default {
    props: ['item', 'schema'],

    data() {
        return {
            currentTab: this.getCurrentLocale?.() ?? 'vi',
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
                gallery: [],
                ...item,
            }
            const locales = ['vi', 'en', 'zh']
            locales.forEach(loc => {
                let trans = null
                if (item.translations && Array.isArray(item.translations)) {
                    trans = item.translations.find(t => t.locale === loc)
                }
                data[loc] = {
                    name:      trans ? (trans.name      ?? '') : (loc === 'vi' ? (item.name      ?? '') : ''),
                    slug:      trans ? (trans.slug      ?? '') : (loc === 'vi' ? (item.slug      ?? '') : ''),
                    job_title: trans ? (trans.job_title ?? '') : (loc === 'vi' ? (item.job_title ?? '') : ''),
                    short_bio: trans ? (trans.short_bio ?? '') : (loc === 'vi' ? (item.short_bio ?? '') : ''),
                    bio:       trans ? (trans.bio       ?? '') : (loc === 'vi' ? (item.bio       ?? '') : ''),
                }
            })
            return data
        },

        addGalleryItem() {
            if (!this.formData.gallery) this.formData.gallery = []
            this.formData.gallery.push({ image: null, caption: '' })
        },

        removeGalleryItem(index) {
            this.formData.gallery.splice(index, 1)
        },
    },
}
</script>

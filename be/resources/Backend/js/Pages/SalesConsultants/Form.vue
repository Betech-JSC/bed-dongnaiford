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

                    <!-- Chức danh -->
                    <Field
                        v-model="form[currentTab].job_title"
                        :field="{
                            type: 'text',
                            name: `job_title_${currentTab}`,
                            label: 'Chức danh',
                            placeholder: 'vd: Cố vấn bán hàng / Cố vấn dịch vụ',
                        }"
                    />

                    <!-- Tiểu sử ngắn -->
                    <Field
                        v-model="form[currentTab].short_bio"
                        :field="{
                            type: 'textarea',
                            name: `short_bio_${currentTab}`,
                            label: 'Giới thiệu ngắn',
                        }"
                    />

                    <!-- Tiểu sử đầy đủ -->
                    <Field
                        v-model="form[currentTab].bio"
                        :field="{
                            type: 'richtext',
                            name: `bio_${currentTab}`,
                            label: 'Thông tin chi tiết / Giới thiệu bản thân',
                        }"
                    />
                </div>
            </div>

            <!-- Gallery -->
            <div class="card mt-4">
                <div class="card-header">Thư viện ảnh hoạt động</div>
                <div class="card-body">
                    <div
                        v-for="(item, index) in form.gallery"
                        :key="index"
                        class="border rounded p-3 mb-3 bg-gray-50"
                    >
                        <div class="flex justify-between items-center mb-2">
                            <strong>Ảnh {{ index + 1 }}</strong>
                            <button
                                type="button"
                                class="text-red-500 text-sm font-semibold hover:underline"
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
                                label: 'Mô tả ảnh (tuỳ chọn)',
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

            <!-- ===== CẤU HÌNH MÃ THEO DÕI QUẢNG CÁO & CHUYỂN ĐỔI (TKQC CỦA SALE) ===== -->
            <div class="card mt-4">
                <div class="card-header font-bold text-gray-900 border-b pb-2 flex items-center justify-between">
                    <span>🎯 Cấu hình Mã Theo Dõi Quảng Cáo &amp; Chuyển Đổi (TKQC của Sale)</span>
                    <span class="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-0.5 rounded border border-emerald-200">
                        Đồng bộ toàn bộ LDP của Cố vấn
                    </span>
                </div>
                <div class="card-body space-y-5 mt-3">
                    <!-- Hộp hướng dẫn tổng quan -->
                    <div class="bg-blue-50 border-l-4 border-blue-500 p-3.5 rounded-r-lg text-xs text-blue-900 space-y-1.5 leading-relaxed">
                        <div class="font-bold text-blue-950">💡 Cơ chế hoạt động tự động trên toàn bộ Landing Page của Sale:</div>
                        <p>
                            Bộ mã cài đặt tại đây sẽ <strong>tự động gắn trên cả Trang Showroom Tổng (<code>/ldp/[ten-sale]</code>) và tất cả Trang Chi Tiết Dòng Xe (<code>/ldp/[ten-sale]/[dong-xe]</code>)</strong> của cố vấn này mà không ảnh hưởng đến mã quảng cáo chung của Đại lý.
                        </p>
                        <p>
                            Hệ thống tự động đo lường và gửi <strong>3 sự kiện chuyển đổi (Conversion)</strong> về Tài khoản Quảng cáo (Google Ads, GTM, Facebook Pixel, TikTok Pixel) và lưu vào mục <strong>Quản lý Liên hệ + Thông báo Telegram</strong>:
                        </p>
                        <ul class="list-disc pl-5 space-y-0.5 font-medium">
                            <li><strong>1. Khách gửi Form Báo giá / Đăng ký Lái thử</strong> (Sự kiện chuẩn: <code>Lead</code> / <code>SubmitForm</code> / <code>ldp_form_submit</code>).</li>
                            <li><strong>2. Khách bấm nút Gọi điện thoại trực tiếp (<code>tel:</code>)</strong> ở bất kỳ vị trí nào trên trang LDP (Sự kiện: <code>Contact</code> / <code>ClickToCall</code> / <code>ldp_click_call</code>).</li>
                            <li><strong>3. Khách bấm nút Chat Zalo trực tiếp (<code>zalo.me</code>)</strong> ở bất kỳ vị trí nào trên trang LDP (Sự kiện: <code>Contact</code> / <code>ClickZalo</code> / <code>ldp_click_zalo</code>).</li>
                        </ul>
                    </div>

                    <!-- 1. Google Ads & Conversion Labels -->
                    <div class="border border-gray-200 rounded-lg p-4 bg-gray-50/60 space-y-3">
                        <div class="flex items-center justify-between border-b border-gray-200 pb-2">
                            <h4 class="text-sm font-bold text-gray-900">1. Google Ads Tag &amp; Nhãn Chuyển Đổi (Conversion Label)</h4>
                            <span class="text-[11px] text-gray-500 font-mono">gtag.js</span>
                        </div>
                        <p class="text-xs text-gray-600 leading-relaxed">
                            Trong Google Ads → <strong>Mục tiêu (Goals) → Lượt chuyển đổi (Conversions) → Tóm tắt</strong>: Bấm vào từng hành động chuyển đổi → chọn <strong>Thiết lập thẻ (Tag setup) → Tự cài đặt thẻ</strong> để lấy <strong>ID chuyển đổi (AW-XXXXXXXXX)</strong> và <strong>Nhãn chuyển đổi (Conversion Label)</strong>.
                        </p>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field
                                v-model="form.tracking_config.google_ads_id"
                                :field="{
                                    type: 'text',
                                    name: 'tracking_google_ads_id',
                                    label: 'Mã Google Ads Tag ID (AW-XXXXXXXXX)',
                                    placeholder: 'vd: AW-16543210987',
                                    help: 'Bắt buộc bắt đầu bằng AW- (hoặc G-). Nếu điền nhãn bên dưới, hãy điền đầy đủ mã AW- này.',
                                }"
                            />
                            <Field
                                v-model="form.tracking_config.google_ads_form_label"
                                :field="{
                                    type: 'text',
                                    name: 'tracking_google_ads_form_label',
                                    label: 'Conversion Label — Khi Khách Gửi Form Báo Giá / Lái Thử',
                                    placeholder: 'vd: AbCdEfGhIjKlMnOpQrSt',
                                    help: 'Chỉ điền phần chuỗi Label phía sau dấu / (Hệ thống sẽ tự ghép thành AW-XXXX/Label).',
                                }"
                            />
                            <Field
                                v-model="form.tracking_config.google_ads_call_label"
                                :field="{
                                    type: 'text',
                                    name: 'tracking_google_ads_call_label',
                                    label: 'Conversion Label — Khi Khách Bấm Nút Gọi Điện (tel:)',
                                    placeholder: 'vd: XyZaBcDeFgHiJkLmNoPq',
                                    help: 'Tự động kích hoạt khi khách bấm vào bất kỳ nút Hotline / Gọi ngay trên LDP của Sale.',
                                }"
                            />
                            <Field
                                v-model="form.tracking_config.google_ads_zalo_label"
                                :field="{
                                    type: 'text',
                                    name: 'tracking_google_ads_zalo_label',
                                    label: 'Conversion Label — Khi Khách Bấm Nút Chat Zalo',
                                    placeholder: 'vd: QwErTyUiOpAsDfGhJkLz',
                                    help: 'Tự động kích hoạt khi khách bấm vào bất kỳ nút Chat Zalo trên LDP của Sale.',
                                }"
                            />
                        </div>
                    </div>

                    <!-- 2. Google Tag Manager, Facebook Pixel, TikTok Pixel -->
                    <div class="border border-gray-200 rounded-lg p-4 bg-gray-50/60 space-y-3">
                        <div class="flex items-center justify-between border-b border-gray-200 pb-2">
                            <h4 class="text-sm font-bold text-gray-900">2. Google Tag Manager (GTM), Facebook Pixel &amp; TikTok Pixel</h4>
                            <span class="text-[11px] text-gray-500 font-mono">Multi-Platform Pixels</span>
                        </div>
                        <p class="text-xs text-gray-600 leading-relaxed">
                            Chỉ cần điền đúng <strong>Mã ID</strong>, hệ thống sẽ tự động cài đặt mã chuẩn của từng nền tảng và tự động bắn sự kiện khi khách Điền Form, Bấm Gọi điện hoặc Bấm Zalo.
                        </p>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Field
                                v-model="form.tracking_config.gtm_id"
                                :field="{
                                    type: 'text',
                                    name: 'tracking_gtm_id',
                                    label: 'Mã Google Tag Manager (GTM)',
                                    placeholder: 'vd: GTM-XXXXXXX',
                                    help: 'Tự động đẩy dataLayer events: ldp_form_submit, ldp_click_call, ldp_click_zalo.',
                                }"
                            />
                            <Field
                                v-model="form.tracking_config.facebook_pixel_id"
                                :field="{
                                    type: 'text',
                                    name: 'tracking_facebook_pixel_id',
                                    label: 'Mã Facebook Pixel ID (Meta Ads)',
                                    placeholder: 'vd: 123456789012345',
                                    help: 'Chỉ nhập dãy số ID Pixel. Tự động bắn PageView, Lead (Form) và Contact (Gọi/Zalo).',
                                }"
                            />
                            <Field
                                v-model="form.tracking_config.tiktok_pixel_id"
                                :field="{
                                    type: 'text',
                                    name: 'tracking_tiktok_pixel_id',
                                    label: 'Mã TikTok Pixel ID (TikTok Ads)',
                                    placeholder: 'vd: C1234567890ABCDEFG',
                                    help: 'Chỉ nhập mã ID Pixel TikTok. Tự động bắn PageView, SubmitForm và Contact.',
                                }"
                            />
                        </div>
                    </div>

                    <!-- 3. Custom Scripts nâng cao -->
                    <div class="border border-gray-200 rounded-lg p-4 bg-gray-50/60 space-y-3">
                        <div class="flex items-center justify-between border-b border-gray-200 pb-2">
                            <h4 class="text-sm font-bold text-gray-900">3. Mã Script Tuỳ Chỉnh Nâng Cao (Tuỳ chọn)</h4>
                            <span class="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-semibold">Chỉ dùng khi cần thêm mã ngoài các ô trên</span>
                        </div>
                        <p class="text-xs text-gray-600 leading-relaxed">
                            Nếu bạn đã điền ID ở mục 1 &amp; 2 bên trên thì <strong>không cần dán lại</strong> mã script vào đây. Chỉ dùng phần này nếu cần nhúng thêm mã theo dõi bên thứ 3 khác (Zalo Ads Pixel, Microsoft Clarity, Hotjar...).
                        </p>
                        <Field
                            v-model="form.tracking_config.inject_head"
                            :field="{
                                type: 'textarea',
                                name: 'tracking_inject_head',
                                label: 'Mã nhúng trong thẻ <head> (Inject Head)',
                                placeholder: '<!-- Dán đoạn mã <script>...</script> cần chèn vào <head> của trang LDP -->',
                                rows: 3,
                            }"
                        />
                        <Field
                            v-model="form.tracking_config.inject_body_start"
                            :field="{
                                type: 'textarea',
                                name: 'tracking_inject_body_start',
                                label: 'Mã nhúng ngay sau thẻ mở <body> (Inject Body Start)',
                                placeholder: '<!-- Dán đoạn mã <noscript>...</noscript> cần chèn ngay đầu <body> -->',
                                rows: 2,
                            }"
                        />
                        <Field
                            v-model="form.tracking_config.inject_body_end"
                            :field="{
                                type: 'textarea',
                                name: 'tracking_inject_body_end',
                                label: 'Mã nhúng trước khi đóng thẻ </body> (Inject Body End)',
                                placeholder: '<!-- Dán đoạn mã script cần chèn ở cuối trang LDP -->',
                                rows: 2,
                            }"
                        />
                    </div>
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
                            label: 'Ảnh chân dung cố vấn (Avatar)',
                        }"
                    />
                </div>
            </div>

            <!-- Ảnh bìa -->
            <div class="card mt-4">
                <div class="card-body">
                    <Field
                        v-model="form.cover_image"
                        :field="{
                            type: 'file_upload',
                            name: 'cover_image',
                            label: 'Ảnh bìa (Cover Image)',
                        }"
                    />
                </div>
            </div>

            <!-- Phân loại & Thứ tự -->
            <div class="card mt-4">
                <div class="card-body">
                    <Field
                        v-model="form.department"
                        :field="{
                            type: 'dropdown',
                            name: 'department',
                            label: 'Phòng ban',
                            options: [
                                { id: 'sales', label: 'Phòng Bán Hàng (Sales)' },
                                { id: 'service', label: 'Phòng Dịch Vụ (Service)' },
                                { id: 'marketing', label: 'Phòng Marketing' },
                                { id: 'technical', label: 'Phòng Kỹ Thuật' },
                                { id: '1', label: 'Phòng 1' },
                                { id: '2', label: 'Phòng 2' },
                                { id: '3', label: 'Phòng 3' },
                            ],
                            emptyLabel: '-- Chọn phòng ban --',
                        }"
                    />

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

            <!-- Thông tin liên hệ -->
            <div class="card mt-4">
                <div class="card-header">Thông tin liên hệ</div>
                <div class="card-body">
                    <Field
                        v-model="form.email"
                        :field="{
                            type: 'text',
                            name: 'email',
                            label: 'Email công việc',
                            placeholder: 'vd: example@dongnaiford.com.vn',
                        }"
                    />

                    <Field
                        v-model="form.phone"
                        :field="{
                            type: 'text',
                            name: 'phone',
                            label: 'Số điện thoại',
                            placeholder: 'vd: 0901234567',
                        }"
                    />

                    <Field
                        v-model="form.zalo_url"
                        :field="{
                            type: 'text',
                            name: 'zalo_url',
                            label: 'Đường dẫn Zalo',
                            placeholder: 'vd: https://zalo.me/...',
                        }"
                    />

                    <Field
                        v-model="form.facebook_url"
                        :field="{
                            type: 'text',
                            name: 'facebook_url',
                            label: 'Đường dẫn Facebook',
                            placeholder: 'vd: https://facebook.com/...',
                        }"
                    />

                    <Field
                        v-model="form.fanpage_url"
                        :field="{
                            type: 'text',
                            name: 'fanpage_url',
                            label: 'Đường dẫn Fanpage',
                            placeholder: 'vd: https://facebook.com/fanpage...',
                        }"
                    />

                    <Field
                        v-model="form.custom_domain"
                        :field="{
                            type: 'text',
                            name: 'custom_domain',
                            label: 'Tên miền riêng của Sale (nếu có)',
                            placeholder: 'vd: tuanford.com (không chứa http:// hoặc https://)',
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
            let rawTracking = item?.tracking_config || {}
            if (typeof rawTracking === 'string') {
                try { rawTracking = JSON.parse(rawTracking) } catch (e) { rawTracking = {} }
            }
            const trackingConfig = {
                google_ads_id: rawTracking?.google_ads_id ?? '',
                google_ads_form_label: rawTracking?.google_ads_form_label ?? '',
                google_ads_call_label: rawTracking?.google_ads_call_label ?? '',
                google_ads_zalo_label: rawTracking?.google_ads_zalo_label ?? '',
                gtm_id: rawTracking?.gtm_id ?? '',
                facebook_pixel_id: rawTracking?.facebook_pixel_id ?? '',
                tiktok_pixel_id: rawTracking?.tiktok_pixel_id ?? '',
                inject_head: rawTracking?.inject_head ?? '',
                inject_body_start: rawTracking?.inject_body_start ?? '',
                inject_body_end: rawTracking?.inject_body_end ?? '',
            }
            const data = {
                status: 'ACTIVE',
                sort_order: 0,
                gallery: [],
                department: 'sales',
                phone: '',
                zalo_url: '',
                facebook_url: '',
                fanpage_url: '',
                custom_domain: '',
                cover_image: null,
                ...item,
                tracking_config: trackingConfig,
            }
            const locales = ['vi', 'en']
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

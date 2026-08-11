<template layout>
    <Head :title="tt('models.titles.setting')" />
    <WrapSetting>
        <Form v-model="formData" :config="{ canDestroy: false, reverse: true, addGrid: false, resource: 'settings' }">
            <template #default="{ form }">
                <div class="card">
                    <div class="card-body">
                        <Field
                            v-model="form.general_business_name"
                            :field="{
                                name: 'general_business_name',
                            }"
                        />
                        <Field
                            v-model="form.general_site_name"
                            :field="{
                                name: 'general_site_name',
                            }"
                        />
                        <Field
                            v-model="form.general_email"
                            :field="{
                                name: 'general_email',
                            }"
                        />
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">Hình ảnh &amp; Logo thương hiệu</div>
                    <div class="card-body">
                        <Field
                            v-model="form.general_logo"
                            :field="{
                                name: 'general_logo',
                                type: 'file_upload',
                                accept: 'image/*',
                            }"
                        />
                        <Field
                            v-model="form.general_logo_footer"
                            :field="{
                                name: 'general_logo_footer',
                                type: 'file_upload',
                                accept: 'image/*',
                            }"
                        />
                        <Field
                            v-model="form.general_favicon"
                            :field="{
                                name: 'general_favicon',
                                type: 'file_upload',
                                accept: 'image/*',
                            }"
                        />
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">Thông tin doanh nghiệp</div>
                    <div class="card-body">
                        <Field
                            v-model="form.general_company_address"
                            :field="{
                                name: 'general_company_address',
                            }"
                        />
                        <Field
                            v-model="form.general_company_phone"
                            :field="{
                                name: 'general_company_phone',
                            }"
                        />
                        <Field
                            v-model="form.general_company_hotline"
                            :field="{
                                name: 'general_company_hotline',
                            }"
                        />
                        <Field
                            v-model="form.general_company_working_hours"
                            :field="{
                                name: 'general_company_working_hours',
                            }"
                        />
                        <Field
                            v-model="form.general_company_tax_code"
                            :field="{
                                name: 'general_company_tax_code',
                            }"
                        />
                        <Field
                            v-model="form.general_company_copyright"
                            :field="{
                                name: 'general_company_copyright',
                            }"
                        />
                        <Field
                            v-model="form.general_company_map_iframe"
                            :field="{
                                name: 'general_company_map_iframe',
                                type: 'textarea',
                                help: 'Dán mã iframe nhúng bản đồ Google Maps vào đây',
                            }"
                        />
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">Mạng xã hội &amp; Liên kết</div>
                    <div class="card-body">
                        <Field
                            v-model="form.social_facebook"
                            :field="{
                                name: 'social_facebook',
                            }"
                        />
                        <Field
                            v-model="form.social_youtube"
                            :field="{
                                name: 'social_youtube',
                            }"
                        />
                        <Field
                            v-model="form.social_zalo"
                            :field="{
                                name: 'social_zalo',
                            }"
                        />
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">{{ tt('Block giới thiệu trang chủ') }}</div>
                    <div class="card-body">
                        <Field
                            v-model="form.homepage_introduce_title"
                            :field="{
                                name: 'homepage_introduce_title',
                                label: 'Tiêu đề',
                            }"
                        />
                        <Field
                            v-model="form.homepage_introduce_description"
                            :field="{
                                name: 'homepage_introduce_description',
                                label: 'Mô tả',
                                type: 'textarea',
                            }"
                        />
                        <Field
                            v-model="form.homepage_introduce_image"
                            :field="{
                                name: 'homepage_introduce_image',
                                label: 'Hình ảnh',
                                type: 'file_upload',
                                accept: 'image/*',
                            }"
                        />
                        <Field
                            v-model="form.homepage_introduce_video"
                            :field="{
                                name: 'homepage_introduce_video',
                                label: 'Video (File)',
                                type: 'file_upload',
                                accept: 'video/*',
                                help: 'Nếu có video sẽ ưu tiên hiển thị thay vì hình ảnh',
                            }"
                        />
                    </div>
                </div>

                <div class="card">
                    <div class="card-header flex items-center justify-between">
                        <span class="font-bold text-gray-800">📸 Danh sách ảnh "Đội Ngũ Ford Đồng Nai" (Trang Giới thiệu)</span>
                        <button type="button" @click="addTeamImage" class="btn btn-sm btn-primary cursor-pointer">
                            + Thêm ảnh mới
                        </button>
                    </div>
                    <div class="card-body">
                        <p class="text-xs text-gray-500 mb-4">
                            Quản lý danh sách hình ảnh hoạt động, sự kiện và nhân sự hiển thị trên Slider section "Đội ngũ Ford Đồng Nai" tại trang /gioi-thieu.
                        </p>

                        <div v-if="!teamImages || teamImages.length === 0" class="text-center py-6 bg-gray-50 rounded-lg text-sm text-gray-500 italic">
                            Chưa có hình ảnh nào. Bấm "+ Thêm ảnh mới" để tạo.
                        </div>

                        <div v-else class="space-y-4">
                            <div 
                                v-for="(imgItem, idx) in teamImages" 
                                :key="idx" 
                                class="p-4 bg-gray-50 rounded-xl border border-gray-200 flex flex-col md:flex-row items-start md:items-center gap-4 relative"
                            >
                                <div class="w-8 text-center font-bold text-gray-400 shrink-0">#{{ idx + 1 }}</div>
                                
                                <div class="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-700 mb-1">Tên / Tiêu đề ảnh</label>
                                        <input 
                                            type="text" 
                                            v-model="imgItem.name" 
                                            placeholder="vd: Sự Kiện Trưng Bày & Lái Thử" 
                                            class="w-full text-xs p-2 border border-gray-300 rounded focus:border-blue-500"
                                            @change="updateTeamImagesField"
                                        />
                                    </div>
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-700 mb-1">Hình ảnh</label>
                                        <Field
                                            v-model="imgItem.image"
                                            @update:modelValue="updateTeamImagesField"
                                            :field="{
                                                name: `team_img_${idx}`,
                                                type: 'file_upload',
                                                accept: 'image/*',
                                                label: false
                                            }"
                                        />
                                    </div>
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-700 mb-1">Đường dẫn liên kết (Link)</label>
                                        <input 
                                            type="text" 
                                            v-model="imgItem.link" 
                                            placeholder="vd: /lien-he hoặc /dang-ky-lai-thu" 
                                            class="w-full text-xs p-2 border border-gray-300 rounded focus:border-blue-500"
                                            @change="updateTeamImagesField"
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="button" 
                                    @click="removeTeamImage(idx)" 
                                    class="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition cursor-pointer shrink-0"
                                    title="Xóa hình ảnh này"
                                >
                                    🗑️ Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <SeoFields
                    :modelValue="form"
                    @update:modelValue="form = $event"
                    :config="{
                        hiddenFields: ['seo_slug'],
                    }"
                />
                <Field class="hidden" disabled v-model="form.id" :field="{ default: 'general' }" />
            </template>
        </Form>
    </WrapSetting>
</template>
<script>
import WrapSetting from '@Core/Components/WrapSetting.vue'
export default {
    components: { WrapSetting },
    props: ['item', 'schema'],
    data() {
        let rawTeam = this.item?.about_team_images;
        while (typeof rawTeam === 'string') {
            try { rawTeam = JSON.parse(rawTeam); } catch (e) { break; }
        }
        if (!Array.isArray(rawTeam)) {
            rawTeam = [
                { id: "team-1", name: "Lễ Bàn Giao Xe Mới Cho Khách Hàng", image: "/images/team/team_1.jpg", link: "/lien-he" },
                { id: "team-2", name: "Đội Ngũ Tư Vấn Bán Hàng Chuyên Nghiệp", image: "/images/team/team_3.jpg", link: "/lien-he" },
                { id: "team-3", name: "Sự Kiện Trưng Bày & Trải Nghiệm Lái Thử Xe", image: "/images/team/team_2.jpg", link: "/dang-ky-lai-thu" }
            ];
        }

        return {
            teamImages: rawTeam,
            formData: {
                homepage_introduce_video: null,
                general_logo: null,
                general_logo_footer: null,
                general_favicon: null,
                about_team_images: JSON.stringify(rawTeam),
                ...this.item
            },
        }
    },
    methods: {
        addTeamImage() {
            this.teamImages.push({
                id: 'team-' + Date.now(),
                name: '',
                image: '',
                link: '/lien-he'
            });
            this.updateTeamImagesField();
        },
        removeTeamImage(idx) {
            this.teamImages.splice(idx, 1);
            this.updateTeamImagesField();
        },
        updateTeamImagesField() {
            this.formData.about_team_images = JSON.stringify(this.teamImages);
        }
    }
}
</script>

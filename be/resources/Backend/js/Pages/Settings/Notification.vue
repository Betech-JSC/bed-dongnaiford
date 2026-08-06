<template layout>
    <Head :title="tt('models.titles.setting')" />
    <WrapSetting>
        <Form
            v-model="formData"
            v-slot="{ form }"
            :config="{ canDestroy: false, addGrid: false, resource: 'settings' }"
        >
            <!-- 📢 Section 1: Thông báo hệ thống cho khách hàng trên Website -->
            <div class="card mb-4">
                <div class="card-header font-bold text-lg">📢 Thông báo hệ thống trên Website (Website Banner / Popup)</div>
                <div class="card-body">
                    <InlineMessage severity="info" class="mb-4">
                        Cấu hình thông báo hệ thống hiển thị trực tiếp cho khách hàng truy cập website (Thông báo lịch nghỉ lễ, ưu đãi khuyến mãi, sự kiện, bảo trì hệ thống...).
                    </InlineMessage>

                    <Field
                        v-model="form.sys_notif_enabled"
                        :field="{
                            type: 'radio_list',
                            name: 'sys_notif_enabled',
                            label: 'Kích hoạt thông báo hệ thống',
                            options: [
                                { label: 'Tắt (Không hiển thị)', value: '0' },
                                { label: 'Bật (Hiển thị trên Website)', value: '1' }
                            ]
                        }"
                    />

                    <Field
                        v-model="form.sys_notif_title"
                        :field="{
                            type: 'text',
                            name: 'sys_notif_title',
                            label: 'Tiêu đề thông báo',
                            placeholder: 'VD: Thông báo lịch nghỉ Lễ Quốc Khánh 2/9',
                            help: 'Tiêu đề hiển thị nổi bật'
                        }"
                    />

                    <Field
                        v-model="form.sys_notif_content"
                        :field="{
                            type: 'textarea',
                            name: 'sys_notif_content',
                            label: 'Nội dung chi tiết thông báo',
                            placeholder: 'VD: Đồng Nai Ford trân trọng thông báo đến Quý khách hàng lịch phục vụ xuyên Lễ...',
                            help: 'Mô tả chi tiết nội dung muốn truyền tải tới khách hàng'
                        }"
                    />

                    <Field
                        v-model="form.sys_notif_type"
                        :field="{
                            type: 'radio_list',
                            name: 'sys_notif_type',
                            label: 'Loại thông báo & Mẫu màu',
                            options: [
                                { label: 'Chung / Thông tin (Xanh dương)', value: 'info' },
                                { label: 'Khuyến mãi / Ưu đãi (Xanh lá)', value: 'success' },
                                { label: 'Cảnh báo / Lưu ý (Vàng)', value: 'warning' },
                                { label: 'Quan trọng / Khẩn cấp (Đỏ)', value: 'danger' }
                            ]
                        }"
                    />

                    <Field
                        v-model="form.sys_notif_display_style"
                        :field="{
                            type: 'radio_list',
                            name: 'sys_notif_display_style',
                            label: 'Vị trí & Kiểu hiển thị trên Website',
                            options: [
                                { label: 'Thanh Banner đầu trang (Top Announcement Bar)', value: 'banner' },
                                { label: 'Hộp thoại Popup giữa màn hình (Modal)', value: 'modal' },
                                { label: 'Thông báo Toast góc màn hình', value: 'toast' }
                            ]
                        }"
                    />

                    <div class="row">
                        <div class="col-md-6">
                            <Field
                                v-model="form.sys_notif_link"
                                :field="{
                                    type: 'text',
                                    name: 'sys_notif_link',
                                    label: 'Đường dẫn liên kết nút bấm (URL)',
                                    placeholder: 'VD: /tin-tuc/thong-bao-nghi-le',
                                    help: 'Đường dẫn khi khách hàng nhấn vào nút'
                                }"
                            />
                        </div>
                        <div class="col-md-6">
                            <Field
                                v-model="form.sys_notif_link_text"
                                :field="{
                                    type: 'text',
                                    name: 'sys_notif_link_text',
                                    label: 'Tên nút bấm liên kết',
                                    placeholder: 'VD: Xem chi tiết',
                                    default: 'Xem chi tiết'
                                }"
                            />
                        </div>
                    </div>

                    <Field
                        v-model="form.sys_notif_dismissible"
                        :field="{
                            type: 'radio_list',
                            name: 'sys_notif_dismissible',
                            label: 'Cho phép người dùng tắt/đóng thông báo',
                            options: [
                                { label: 'Có (Hiển thị nút X tắt)', value: '1' },
                                { label: 'Không (Cố định)', value: '0' }
                            ]
                        }"
                    />
                </div>
            </div>

            <!-- 📩 Section 2: Cấu hình Email & Webhook Nhận Thông Báo Quản Trị (Admin) -->
            <div class="card">
                <div class="card-header font-bold text-lg">📩 Cấu hình Email & Webhook Nhận Thông Báo Quản Trị (Admin)</div>
                <div class="card-body">
                    <Field
                        v-model="form.notification_production_to"
                        :field="{
                            type: 'tags',
                            name: 'notification_production_to',
                            label: tt('models.form.notification_production_to'),
                            help: tt('models.setting.notification_from.help'),
                        }"
                    />
                    <Field
                        v-model="form.notification_staging_to"
                        :field="{
                            type: 'tags',
                            name: 'notification_staging_to',
                            label: tt('models.form.notification_staging_to'),
                            help: tt('models.setting.notification_from.help'),
                        }"
                    />
                    <Field
                        v-model="form.notification_to"
                        :field="{
                            type: 'text',
                            name: 'notification_to',
                            label: 'Email nhận yêu cầu báo giá & tư vấn',
                            help: 'Có thể nhập nhiều email, phân cách bởi dấu phẩy',
                        }"
                    />
                    <hr />
                    <Field
                        v-model="form.telegram_bot_token"
                        :field="{
                            type: 'text',
                            name: 'telegram_bot_token',
                            label: 'Telegram Bot Token',
                            help: 'Tự động nhận thông báo Telegram khi có khách hàng đăng ký lái thử / báo giá mới',
                        }"
                    />
                    <Field
                        v-model="form.telegram_chat_id"
                        :field="{
                            type: 'text',
                            name: 'telegram_chat_id',
                            label: 'Telegram Chat ID',
                        }"
                    />
                    <hr />
                    <Field
                        v-model="form.discord_webhook"
                        :field="{
                            type: 'text',
                            name: 'discord_webhook',
                            label: 'Discord Webhook URL',
                        }"
                    />
                </div>
            </div>

            <Field
                class="hidden"
                disabled
                v-model="form.id"
                :field="{ default: 'notification' }"
            />
        </Form>
    </WrapSetting>
</template>
<script>
import WrapSetting from "@Core/Components/WrapSetting.vue";
export default {
    components: { WrapSetting },
    props: ["item", "schema"],
    data() {
        return {
            formData: {
                sys_notif_enabled: '0',
                sys_notif_type: 'info',
                sys_notif_display_style: 'banner',
                sys_notif_dismissible: '1',
                sys_notif_link_text: 'Xem chi tiết',
                ...this.item
            },
        };
    },
};
</script>

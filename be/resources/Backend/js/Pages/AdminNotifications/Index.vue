<template layout>
    <Head title="Thông báo hệ thống cho Quản trị viên" />

    <div class="p-4 sm:p-6 space-y-6">
        <!-- Header & Action Bar -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gray-800 p-5 rounded-xl border border-gray-700 shadow-sm">
            <div>
                <h1 class="text-xl font-bold text-white flex items-center gap-2">
                    <i class="pi pi-bell text-primary"></i>
                    <span>Quản lý Thông báo Hệ thống (Internal CMS)</span>
                </h1>
                <p class="text-xs text-gray-400 mt-1">
                    Danh sách các thông báo hệ thống, thông báo yêu cầu liên hệ/báo giá từ website và các thông báo nội bộ cho Quản trị viên.
                </p>
            </div>

            <div class="flex items-center gap-3">
                <Button
                    v-if="unreadCount > 0"
                    label="Đánh dấu tất cả đã đọc"
                    icon="pi pi-check-circle"
                    class="p-button-outlined p-button-secondary p-button-sm text-xs"
                    @click="markAllRead"
                />
                <Button
                    label="Tạo thông báo mới"
                    icon="pi pi-plus"
                    class="p-button-primary p-button-sm text-xs font-bold"
                    @click="showCreateModal = true"
                />
            </div>
        </div>

        <!-- Table / List of Notifications -->
        <div class="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-sm">
            <div v-if="!notifications || !notifications.data || notifications.data.length === 0" class="p-12 text-center text-gray-400">
                <i class="pi pi-inbox text-4xl mb-2 text-gray-500 block"></i>
                <p class="text-sm font-medium">Chưa có thông báo hệ thống nào</p>
            </div>

            <div v-else class="divide-y divide-gray-700/60">
                <div
                    v-for="item in notifications.data"
                    :key="item.id"
                    :class="[
                        'p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors',
                        !item.is_read ? 'bg-gray-700/30' : 'hover:bg-gray-700/20'
                    ]"
                >
                    <div class="flex items-start gap-3 flex-1 min-w-0">
                        <div :class="['mt-0.5 p-2 rounded-lg shrink-0', getTypeBadgeClass(item.type)]">
                            <i :class="['pi text-lg', item.icon || 'pi-bell']"></i>
                        </div>

                        <div class="space-y-1 min-w-0 flex-1">
                            <div class="flex items-center gap-2">
                                <h3 class="text-sm font-bold text-white truncate">{{ item.title }}</h3>
                                <span v-if="!item.is_read" class="px-2 py-0.5 text-[10px] font-bold bg-indigo-600 text-white rounded-full">
                                    Mới
                                </span>
                            </div>
                            <p class="text-xs text-gray-300 leading-relaxed whitespace-pre-line">{{ item.content }}</p>
                            <span class="text-[11px] text-gray-400 block pt-1">
                                <i class="pi pi-clock text-[10px] mr-1"></i>
                                {{ formatDate(item.created_at) }}
                            </span>
                        </div>
                    </div>

                    <div class="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <a
                            v-if="item.link"
                            :href="item.link"
                            @click="markRead(item.id)"
                            class="px-3 py-1.5 text-xs font-semibold bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors flex items-center gap-1"
                        >
                            <span>Xem chi tiết</span>
                            <i class="pi pi-arrow-right text-[10px]"></i>
                        </a>

                        <button
                            v-if="!item.is_read"
                            @click="markRead(item.id)"
                            class="p-1.5 text-xs text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors border-0 bg-transparent cursor-pointer"
                            title="Đánh dấu đã đọc"
                        >
                            <i class="pi pi-check"></i>
                        </button>

                        <button
                            @click="deleteNotif(item.id)"
                            class="p-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-colors border-0 bg-transparent cursor-pointer"
                            title="Xóa thông báo"
                        >
                            <i class="pi pi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Pagination -->
            <div v-if="notifications && notifications.links" class="p-4 bg-gray-900 border-t border-gray-700 flex justify-center">
                <Pagination :links="notifications.links" />
            </div>
        </div>

        <!-- Create Modal Dialog -->
        <Dialog
            header="Tạo & Gửi Thông báo Hệ thống cho Admin"
            v-model:visible="showCreateModal"
            :style="{ width: '500px' }"
            :modal="true"
        >
            <div class="space-y-4 py-2">
                <div>
                    <label class="block text-xs font-bold text-gray-300 mb-1">Tiêu đề thông báo *</label>
                    <InputText v-model="createForm.title" placeholder="VD: Thông báo họp giao ban tuần mới" class="w-full text-xs" />
                </div>

                <div>
                    <label class="block text-xs font-bold text-gray-300 mb-1">Nội dung chi tiết *</label>
                    <Textarea v-model="createForm.content" rows="4" placeholder="Nhập nội dung thông báo gửi tới các Admin..." class="w-full text-xs" />
                </div>

                <div>
                    <label class="block text-xs font-bold text-gray-300 mb-1">Mức độ thông báo</label>
                    <Dropdown
                        v-model="createForm.type"
                        :options="typeOptions"
                        optionLabel="label"
                        optionValue="value"
                        class="w-full text-xs"
                    />
                </div>

                <div>
                    <label class="block text-xs font-bold text-gray-300 mb-1">Đường dẫn liên kết (Nếu có)</label>
                    <InputText v-model="createForm.link" placeholder="VD: /admin/contacts" class="w-full text-xs" />
                </div>
            </div>

            <template #footer>
                <Button label="Hủy" icon="pi pi-times" class="p-button-text text-xs" @click="showCreateModal = false" />
                <Button label="Gửi thông báo" icon="pi pi-send" class="p-button-primary text-xs font-bold" :loading="submitting" @click="submitCreate" />
            </template>
        </Dialog>
    </div>
</template>

<script>
import Pagination from "@Core/Components/Pagination.vue";

export default {
    components: { Pagination },
    props: ["notifications", "unreadCount"],
    data() {
        return {
            showCreateModal: false,
            submitting: false,
            createForm: {
                title: "",
                content: "",
                type: "info",
                link: "",
            },
            typeOptions: [
                { label: "Thông tin chung (Info)", value: "info" },
                { label: "Thành công / Hoàn thành (Success)", value: "success" },
                { label: "Cảnh báo / Lưu ý (Warning)", value: "warning" },
                { label: "Quan trọng / Cần xử lý gấp (Danger)", value: "danger" },
            ],
        };
    },
    methods: {
        getTypeBadgeClass(type) {
            switch (type) {
                case "success":
                    return "bg-emerald-900/50 text-emerald-300 border border-emerald-700";
                case "warning":
                    return "bg-amber-900/50 text-amber-300 border border-amber-700";
                case "danger":
                    return "bg-red-900/50 text-red-300 border border-red-700";
                case "info":
                default:
                    return "bg-indigo-900/50 text-indigo-300 border border-indigo-700";
            }
        },
        formatDate(dateStr) {
            if (!dateStr) return "";
            return new Date(dateStr).toLocaleString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });
        },
        markRead(id) {
            this.$inertia.post(this.route("admin.admin-notifications.mark-read", { id }), {}, { preserveScroll: true });
        },
        markAllRead() {
            this.$inertia.post(this.route("admin.admin-notifications.mark-read", { id: "all" }), {}, { preserveScroll: true });
        },
        deleteNotif(id) {
            if (confirm("Bạn có chắc chắn muốn xóa thông báo này?")) {
                this.$inertia.delete(this.route("admin.admin-notifications.destroy", { id }), { preserveScroll: true });
            }
        },
        submitCreate() {
            if (!this.createForm.title || !this.createForm.content) {
                alert("Vui lòng nhập đầy đủ tiêu đề và nội dung thông báo");
                return;
            }
            this.submitting = true;
            this.$inertia.post(this.route("admin.admin-notifications.store"), this.createForm, {
                onSuccess: () => {
                    this.showCreateModal = false;
                    this.submitting = false;
                    this.createForm = { title: "", content: "", type: "info", link: "" };
                },
                onError: () => {
                    this.submitting = false;
                },
            });
        },
    },
};
</script>

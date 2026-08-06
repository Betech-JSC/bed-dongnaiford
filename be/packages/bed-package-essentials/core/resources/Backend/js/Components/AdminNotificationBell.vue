<template>
    <div class="relative inline-block text-left">
        <!-- Bell Icon Trigger with Unread Counter Badge -->
        <button
            @click="togglePanel"
            type="button"
            class="relative p-2 text-gray-300 rounded-full hover:text-white hover:bg-gray-700 focus:outline-none transition-colors cursor-pointer border-0 bg-transparent"
            title="Thông báo hệ thống"
        >
            <i class="pi pi-bell text-xl"></i>
            <span
                v-if="unreadCount > 0"
                class="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-600 rounded-full ring-2 ring-gray-800 animate-pulse"
            >
                {{ unreadCount > 99 ? '99+' : unreadCount }}
            </span>
        </button>

        <!-- Dropdown Notification Overlay Panel -->
        <div
            v-if="isOpen"
            class="fixed md:absolute right-4 md:right-0 top-14 md:top-full mt-2 w-80 sm:w-96 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden text-gray-200"
        >
            <!-- Header -->
            <div class="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-700">
                <div class="flex items-center gap-2 font-bold text-sm text-white">
                    <i class="pi pi-bell text-primary"></i>
                    <span>Thông báo hệ thống</span>
                </div>
                <button
                    v-if="unreadCount > 0"
                    @click="markAllRead"
                    type="button"
                    class="text-xs text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer border-0 bg-transparent"
                >
                    Đánh dấu đã đọc
                </button>
            </div>

            <!-- Notification Item List -->
            <div class="max-h-80 overflow-y-auto divide-y divide-gray-700">
                <div v-if="loading" class="p-6 text-center text-gray-400 text-xs">
                    <i class="pi pi-spin pi-spinner text-lg mb-1"></i>
                    <p>Đang tải thông báo...</p>
                </div>

                <div v-else-if="notifications.length === 0" class="p-6 text-center text-gray-400 text-xs">
                    <i class="pi pi-inbox text-2xl mb-1 text-gray-500"></i>
                    <p>Không có thông báo mới</p>
                </div>

                <div
                    v-else
                    v-for="item in notifications"
                    :key="item.id"
                    @click="handleClickItem(item)"
                    :class="[
                        'p-3 flex items-start gap-3 hover:bg-gray-700/60 transition-colors cursor-pointer text-xs',
                        !item.is_read ? 'bg-gray-700/30 font-semibold' : 'opacity-80'
                    ]"
                >
                    <div class="mt-0.5 p-1.5 rounded-lg bg-indigo-900/50 text-indigo-300 shrink-0">
                        <i :class="['pi', item.icon || 'pi-info-circle']"></i>
                    </div>

                    <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between gap-1">
                            <h4 class="text-white text-xs font-bold truncate">{{ item.title }}</h4>
                            <span v-if="!item.is_read" class="w-2 h-2 rounded-full bg-indigo-500 shrink-0"></span>
                        </div>
                        <p class="text-gray-300 text-xs mt-0.5 line-clamp-2 leading-snug">{{ item.content }}</p>
                        <span class="text-[10px] text-gray-400 mt-1 block">{{ formatDate(item.created_at) }}</span>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="p-2.5 bg-gray-900 border-t border-gray-700 text-center">
                <a
                    :href="route('admin.admin-notifications.index')"
                    class="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors block"
                >
                    Xem tất cả thông báo hệ thống →
                </a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isOpen: false,
            loading: false,
            unreadCount: 0,
            notifications: [],
            pollTimer: null
        };
    },
    mounted() {
        this.fetchNotifications();
        // Poll for new internal notifications every 30 seconds
        this.pollTimer = setInterval(this.fetchNotifications, 30000);
        document.addEventListener('click', this.handleOutsideClick);
    },
    beforeUnmount() {
        if (this.pollTimer) clearInterval(this.pollTimer);
        document.removeEventListener('click', this.handleOutsideClick);
    },
    methods: {
        togglePanel(e) {
            e.stopPropagation();
            this.isOpen = !this.isOpen;
            if (this.isOpen) {
                this.fetchNotifications();
            }
        },
        fetchNotifications() {
            this.$axios
                .get(this.route('admin.admin-notifications.feed'))
                .then((res) => {
                    if (res.data && res.data.success) {
                        this.unreadCount = res.data.unread_count || 0;
                        this.notifications = res.data.data || [];
                    }
                })
                .catch(() => {});
        },
        markAllRead() {
            this.$axios
                .post(this.route('admin.admin-notifications.mark-read', { id: 'all' }))
                .then((res) => {
                    this.unreadCount = 0;
                    this.notifications.forEach((n) => (n.is_read = true));
                });
        },
        handleClickItem(item) {
            if (!item.is_read) {
                this.$axios.post(this.route('admin.admin-notifications.mark-read', { id: item.id }));
                item.is_read = true;
                if (this.unreadCount > 0) this.unreadCount--;
            }
            this.isOpen = false;
            if (item.link) {
                this.$inertia.visit(item.link);
            }
        },
        formatDate(dateStr) {
            if (!dateStr) return '';
            const d = new Date(dateStr);
            return d.toLocaleString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        },
        handleOutsideClick(e) {
            if (this.$el && !this.$el.contains(e.target)) {
                this.isOpen = false;
            }
        }
    }
};
</script>

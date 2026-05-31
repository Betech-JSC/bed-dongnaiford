<template>
    <Head title="Tổng quan" />

    <div class="dashboard-wrapper">
        <!-- Header -->
        <div class="dashboard-header">
            <div class="header-content">
                <h1 class="header-title">Tổng Quan Hệ Thống</h1>
                <p class="header-date">{{ currentDate }}</p>
            </div>
            <div class="header-badge">
                <span class="badge-dot"></span>
                <span>Live</span>
            </div>
        </div>

        <!-- Stats Grid -->
        <div class="stats-grid">
            <!-- Đơn hàng hôm nay -->
            <div class="stat-card stat-card--indigo">
                <div class="stat-card__icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <path d="M9 12h6M9 16h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
                <div class="stat-card__body">
                    <div class="stat-card__label">Đơn hàng hôm nay</div>
                    <div class="stat-card__value">{{ todayOrderCount }}</div>
                    <div class="stat-card__sub">
                        <span class="dot dot--new"></span>
                        <span>{{ newOrderCount }} đơn mới chờ xử lý</span>
                    </div>
                </div>
            </div>

            <!-- Doanh thu hôm nay -->
            <div class="stat-card stat-card--emerald">
                <div class="stat-card__icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                        <path d="M12 6v2m0 8v2M9 12h6m-6 0a3 3 0 106 0 3 3 0 00-6 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
                <div class="stat-card__body">
                    <div class="stat-card__label">Doanh thu hôm nay</div>
                    <div class="stat-card__value">{{ formattedRevenue }}</div>
                    <div class="stat-card__sub">
                        <span class="dot dot--green"></span>
                        <span>Tổng giá trị đơn hàng ngày</span>
                    </div>
                </div>
            </div>

            <!-- Liên hệ hôm nay -->
            <div class="stat-card stat-card--rose">
                <div class="stat-card__icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
                <div class="stat-card__body">
                    <div class="stat-card__label">Liên hệ hôm nay</div>
                    <div class="stat-card__value">{{ todayContactCount }}</div>
                    <div class="stat-card__sub">
                        <span class="dot dot--red"></span>
                        <span>{{ newContactCount }} liên hệ chưa xử lý</span>
                    </div>
                </div>
            </div>

            <!-- Tuyển dụng hôm nay -->
            <div class="stat-card stat-card--amber">
                <div class="stat-card__icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
                <div class="stat-card__body">
                    <div class="stat-card__label">Ứng tuyển hôm nay</div>
                    <div class="stat-card__value">{{ todayApplyCount }}</div>
                    <div class="stat-card__sub">
                        <span class="dot dot--yellow"></span>
                        <span>{{ newApplyCount }} hồ sơ chưa xem</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Summary Row -->
        <div class="summary-grid">
            <!-- Tổng kết liên hệ -->
            <div class="summary-card">
                <div class="summary-card__header">
                    <h2 class="summary-card__title">
                        <svg viewBox="0 0 20 20" fill="currentColor" class="summary-icon summary-icon--rose">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                        </svg>
                        Liên hệ &amp; Tuyển dụng
                    </h2>
                </div>
                <div class="summary-card__body">
                    <div class="summary-row">
                        <span class="summary-label">Liên hệ hôm nay</span>
                        <span class="summary-value summary-value--rose">{{ todayContactCount }}</span>
                    </div>
                    <div class="summary-row">
                        <span class="summary-label">Liên hệ chưa xử lý</span>
                        <span class="summary-value summary-value--rose">{{ newContactCount }}</span>
                    </div>
                    <div class="summary-divider"></div>
                    <div class="summary-row">
                        <span class="summary-label">Ứng tuyển hôm nay</span>
                        <span class="summary-value summary-value--amber">{{ todayApplyCount }}</span>
                    </div>
                    <div class="summary-row">
                        <span class="summary-label">Hồ sơ chưa xem</span>
                        <span class="summary-value summary-value--amber">{{ newApplyCount }}</span>
                    </div>
                </div>
                <div class="summary-card__footer">
                    <a :href="route('admin.contacts.index')" class="summary-link summary-link--rose">
                        Xem tất cả liên hệ →
                    </a>
                </div>
            </div>

            <!-- Tổng kết đơn hàng -->
            <div class="summary-card">
                <div class="summary-card__header">
                    <h2 class="summary-card__title">
                        <svg viewBox="0 0 20 20" fill="currentColor" class="summary-icon summary-icon--indigo">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                            <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"/>
                        </svg>
                        Đơn hàng
                    </h2>
                </div>
                <div class="summary-card__body">
                    <div class="summary-row">
                        <span class="summary-label">Đơn hàng hôm nay</span>
                        <span class="summary-value summary-value--indigo">{{ todayOrderCount }}</span>
                    </div>
                    <div class="summary-row">
                        <span class="summary-label">Đơn hàng mới (chờ xử lý)</span>
                        <span class="summary-value summary-value--indigo">{{ newOrderCount }}</span>
                    </div>
                    <div class="summary-divider"></div>
                    <div class="summary-row">
                        <span class="summary-label">Doanh thu hôm nay</span>
                        <span class="summary-value summary-value--emerald">{{ formattedRevenue }}</span>
                    </div>
                </div>
                <div class="summary-card__footer">
                    <a :href="route('admin.orders.index')" class="summary-link summary-link--indigo">
                        Xem tất cả đơn hàng →
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Head } from '@inertiajs/inertia-vue3'

export default {
    components: {
        Head,
    },
    computed: {
        currentDate() {
            return new Date().toLocaleDateString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            })
        },
        todayContactCount() {
            return this.$page.props.data.today_contact_count ?? 0
        },
        todayApplyCount() {
            return this.$page.props.data.today_apply_count ?? 0
        },
        newContactCount() {
            return this.$page.props.data.new_contact_count ?? 0
        },
        newApplyCount() {
            return this.$page.props.data.new_apply_count ?? 0
        },
        todayOrderCount() {
            return this.$page.props.data.today_order_count ?? 0
        },
        newOrderCount() {
            return this.$page.props.data.new_order_count ?? 0
        },
        todayOrderTotalPrice() {
            return this.$page.props.data.today_order_total_price ?? 0
        },
        formattedRevenue() {
            if (!this.todayOrderTotalPrice) return '0 ₫'
            return new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
                maximumFractionDigits: 0,
            }).format(this.todayOrderTotalPrice)
        },
    },
}
</script>

<style scoped>
.dashboard-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 32px 24px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* Header */
.dashboard-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32px;
}

.header-title {
    font-size: 24px;
    font-weight: 700;
    color: #111827;
    margin: 0 0 4px;
}

.header-date {
    font-size: 14px;
    color: #6b7280;
    margin: 0;
    text-transform: capitalize;
}

.header-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    background: #ecfdf5;
    color: #059669;
    font-size: 13px;
    font-weight: 600;
    padding: 6px 14px;
    border-radius: 999px;
    border: 1px solid #a7f3d0;
}

.badge-dot {
    width: 8px;
    height: 8px;
    background: #10b981;
    border-radius: 50%;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
}

/* Stats Grid */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 24px;
}

@media (max-width: 1024px) {
    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 640px) {
    .stats-grid {
        grid-template-columns: 1fr;
    }
}

.stat-card {
    background: #fff;
    border-radius: 16px;
    padding: 24px;
    display: flex;
    align-items: flex-start;
    gap: 16px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.05);
    border: 1px solid #f3f4f6;
    transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1), 0 8px 24px rgba(0,0,0,0.07);
}

.stat-card__icon {
    width: 48px;
    height: 48px;
    min-width: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.stat-card__icon svg {
    width: 24px;
    height: 24px;
}

.stat-card--indigo .stat-card__icon {
    background: #eef2ff;
    color: #4f46e5;
}

.stat-card--emerald .stat-card__icon {
    background: #ecfdf5;
    color: #059669;
}

.stat-card--rose .stat-card__icon {
    background: #fff1f2;
    color: #e11d48;
}

.stat-card--amber .stat-card__icon {
    background: #fffbeb;
    color: #d97706;
}

.stat-card__label {
    font-size: 13px;
    color: #6b7280;
    font-weight: 500;
    margin-bottom: 6px;
}

.stat-card__value {
    font-size: 30px;
    font-weight: 700;
    color: #111827;
    line-height: 1;
    margin-bottom: 10px;
}

.stat-card--indigo .stat-card__value { color: #4f46e5; }
.stat-card--emerald .stat-card__value { color: #059669; }
.stat-card--rose .stat-card__value { color: #e11d48; }
.stat-card--amber .stat-card__value { color: #d97706; }

.stat-card__sub {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #9ca3af;
}

.dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
}

.dot--new { background: #4f46e5; }
.dot--green { background: #10b981; }
.dot--red { background: #e11d48; }
.dot--yellow { background: #f59e0b; }

/* Summary Grid */
.summary-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
}

@media (max-width: 768px) {
    .summary-grid {
        grid-template-columns: 1fr;
    }
}

.summary-card {
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.05);
    border: 1px solid #f3f4f6;
    overflow: hidden;
}

.summary-card__header {
    padding: 16px 20px;
    border-bottom: 1px solid #f3f4f6;
    background: #fafafa;
}

.summary-card__title {
    font-size: 15px;
    font-weight: 600;
    color: #374151;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
}

.summary-icon {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
}

.summary-icon--rose { color: #e11d48; }
.summary-icon--indigo { color: #4f46e5; }

.summary-card__body {
    padding: 20px;
}

.summary-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
}

.summary-label {
    font-size: 14px;
    color: #6b7280;
}

.summary-value {
    font-size: 18px;
    font-weight: 700;
    min-width: 50px;
    text-align: right;
}

.summary-value--rose { color: #e11d48; }
.summary-value--amber { color: #d97706; }
.summary-value--indigo { color: #4f46e5; }
.summary-value--emerald { color: #059669; }

.summary-divider {
    height: 1px;
    background: #f3f4f6;
    margin: 8px 0;
}

.summary-card__footer {
    padding: 14px 20px;
    border-top: 1px solid #f3f4f6;
    background: #fafafa;
}

.summary-link {
    font-size: 13px;
    font-weight: 600;
    text-decoration: none;
    transition: opacity 0.15s;
}

.summary-link:hover {
    opacity: 0.7;
}

.summary-link--rose { color: #e11d48; }
.summary-link--indigo { color: #4f46e5; }
</style>

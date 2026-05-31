<template layout>
    <div class="guide-portal">

        <!-- HEADER -->
        <div class="guide-header">
            <div>
                <h1 class="guide-title">Hướng dẫn sử dụng</h1>
                <p class="guide-subtitle">Tài liệu hướng dẫn chi tiết các tính năng của CMS Lotus</p>
            </div>
            <div class="header-right">
                <div class="search-box">
                    <svg class="search-ico" xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.099zm-5.242 1.656a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z"/>
                    </svg>
                    <input v-model="search" type="text" placeholder="Tìm kiếm hướng dẫn..." class="search-input" />
                </div>
                <a v-if="can('admin.lotus-guides.form')" :href="route('admin.lotus-guides.form')" class="btn-add">
                    + Thêm hướng dẫn
                </a>
            </div>
        </div>

        <!-- HERO BANNER -->
        <div class="hero" v-if="!search">
            <div class="hero-top">
                <div class="hero-icon-wrap">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 16 16">
                        <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10h14V4h-3.5z"/>
                    </svg>
                </div>
                <div>
                    <h2 class="hero-title">Chào mừng đến với CMS Lotus!</h2>
                    <p class="hero-sub">Hệ thống quản lý nội dung toàn diện. Hãy bắt đầu với các bước nhanh bên dưới.</p>
                </div>
            </div>
            <div class="hero-steps">
                <div class="hero-step" v-for="(s, i) in steps" :key="i">
                    <span class="step-num">{{ i + 1 }}</span>
                    <div>
                        <div class="step-title">{{ s.title }}</div>
                        <div class="step-desc">{{ s.desc }}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- SEARCH RESULTS -->
        <template v-if="search">
            <div class="search-meta">
                <span class="search-pill">🔍 "{{ search }}"</span>
                <span class="search-count">{{ filteredItems.length }} kết quả</span>
                <button class="btn-clear" @click="search = ''">✕ Xoá</button>
            </div>
            <div v-if="filteredItems.length === 0" class="empty-search">
                <div>🔍</div>
                <p>Không tìm thấy hướng dẫn nào phù hợp</p>
            </div>
            <div class="result-list" v-else>
                <div class="result-item" v-for="item in filteredItems" :key="item.id">
                    <span class="result-icon">{{ item.icon || '📄' }}</span>
                    <div class="result-body">
                        <div class="result-title" v-html="highlight(item.title)"></div>
                        <div class="result-summary" v-if="item.summary">{{ item.summary }}</div>
                        <span class="result-badge">{{ categoryLabel(item.category) }}</span>
                    </div>
                    <div class="result-actions">
                        <a v-if="item.video_url" :href="item.video_url" target="_blank" class="tag-video">▶ Video</a>
                        <a v-if="can('admin.lotus-guides.form')" :href="route('admin.lotus-guides.form', { id: item.id })" class="tag-edit">Sửa</a>
                    </div>
                </div>
            </div>
        </template>

        <!-- CATEGORY GRID -->
        <template v-if="!search">
            <!-- Loading -->
            <div v-if="loading" class="loading-grid">
                <div class="skeleton-card" v-for="n in 4" :key="n"></div>
            </div>

            <!-- Empty -->
            <div v-else-if="groupedGuides.length === 0" class="empty-state">
                <div class="empty-icon">📚</div>
                <div class="empty-title">Chưa có hướng dẫn nào</div>
                <p class="empty-desc">Tạo hướng dẫn đầu tiên để giúp người dùng hiểu cách dùng hệ thống.</p>
                <a v-if="can('admin.lotus-guides.form')" :href="route('admin.lotus-guides.form')" class="btn-add">
                    + Tạo hướng dẫn đầu tiên
                </a>
            </div>

            <!-- Grid -->
            <div v-else class="cat-grid">
                <div class="cat-card" v-for="group in groupedGuides" :key="group.key">
                    <div class="cat-header">
                        <div class="cat-icon" :style="{ background: catColor(group.key) }">{{ catIcon(group.key) }}</div>
                        <div>
                            <div class="cat-name">{{ group.label }}</div>
                            <div class="cat-count">{{ group.count }} hướng dẫn</div>
                        </div>
                    </div>
                    <div class="cat-divider"></div>
                    <div class="item-list">
                        <div
                            v-for="item in group.items"
                            :key="item.id"
                            class="guide-item"
                            :class="{ open: expandedId === item.id }"
                        >
                            <div class="item-row" @click="toggle(item.id)">
                                <div class="item-label">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="#9ca3af" viewBox="0 0 16 16">
                                        <path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm5.5 1.5v2a1 1 0 0 0 1 1h2L9.5 1.5z"/>
                                    </svg>
                                    <span class="item-title">{{ item.title }}</span>
                                    <span v-if="item.video_url" class="vid-badge">▶</span>
                                </div>
                                <svg class="chevron" :class="{ rotated: expandedId === item.id }" xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                                </svg>
                            </div>
                            <div class="item-body" v-show="expandedId === item.id">
                                <p class="item-summary">{{ item.summary || 'Chưa có mô tả.' }}</p>
                                <div class="item-footer">
                                    <a v-if="item.video_url" :href="item.video_url" target="_blank" class="btn-vid">▶ Xem video hướng dẫn</a>
                                    <a v-if="can('admin.lotus-guides.form')" :href="route('admin.lotus-guides.form', { id: item.id })" class="btn-detail">Xem chi tiết →</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>

    </div>
</template>

<script>
export default {
    props: ['schema', 'grouped_guides', 'category_list'],

    data() {
        return {
            search: '',
            expandedId: null,
            loading: false,
            steps: [
                { title: 'Đăng nhập', desc: 'Sử dụng tài khoản được cấp để đăng nhập vào hệ thống CMS' },
                { title: 'Tạo nội dung', desc: 'Vào module tương ứng → Tạo mới → Nhập thông tin' },
                { title: 'Quản lý', desc: 'Theo dõi, chỉnh sửa và xuất bản nội dung trực tiếp trên CMS' },
                { title: 'Cấu hình', desc: 'Thiết lập SEO, email, và các tùy chọn hệ thống trong Settings' },
            ],
        }
    },

    computed: {
        groupedGuides() { return this.grouped_guides ?? [] },
        allItems() { return this.groupedGuides.flatMap(g => g.items) },
        filteredItems() {
            const q = this.search.trim().toLowerCase()
            if (!q) return []
            return this.allItems.filter(
                i => i.title.toLowerCase().includes(q) ||
                     (i.summary && i.summary.toLowerCase().includes(q))
            )
        },
    },

    methods: {
        toggle(id) { this.expandedId = this.expandedId === id ? null : id },

        catIcon(key) {
            return { general:'🏠', posts:'📝', products:'🎓', media:'🗂️', settings:'⚙️', users:'👥', other:'📌' }[key] ?? '📄'
        },
        catColor(key) {
            return {
                general:  'linear-gradient(135deg,#6366f1,#8b5cf6)',
                posts:    'linear-gradient(135deg,#0ea5e9,#38bdf8)',
                products: 'linear-gradient(135deg,#10b981,#34d399)',
                media:    'linear-gradient(135deg,#f59e0b,#fbbf24)',
                settings: 'linear-gradient(135deg,#64748b,#94a3b8)',
                users:    'linear-gradient(135deg,#ec4899,#f472b6)',
                other:    'linear-gradient(135deg,#f97316,#fb923c)',
            }[key] ?? 'linear-gradient(135deg,#6b7280,#9ca3af)'
        },
        categoryLabel(key)  { return (this.category_list ?? {})[key] ?? key },
        highlight(text) {
            if (!this.search.trim()) return text
            const esc = this.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            return text.replace(new RegExp(`(${esc})`, 'gi'), '<mark>$1</mark>')
        },
    },
}
</script>

<style scoped>
.guide-portal { padding: 20px 24px; font-family: 'Inter', sans-serif; }

/* Header */
.guide-header { display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:16px; margin-bottom:24px; }
.guide-title  { font-size:24px; font-weight:700; color:#111827; margin:0 0 4px; }
.guide-subtitle { font-size:13px; color:#6b7280; margin:0; }
.header-right { display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
.search-box   { position:relative; display:flex; align-items:center; }
.search-ico   { position:absolute; left:10px; color:#9ca3af; pointer-events:none; }
.search-input { border:1px solid #d1d5db; border-radius:8px; padding:8px 12px 8px 32px; font-size:13px; width:220px; outline:none; background:#fff; transition:border-color .2s; }
.search-input:focus { border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,.12); }
.btn-add      { display:inline-flex; align-items:center; gap:6px; background:linear-gradient(135deg,#6366f1,#8b5cf6); color:#fff; padding:8px 16px; border-radius:8px; font-size:13px; font-weight:600; text-decoration:none; white-space:nowrap; transition:opacity .15s, transform .15s; }
.btn-add:hover { opacity:.9; transform:translateY(-1px); }

/* Hero */
.hero         { background:linear-gradient(135deg,#1e3a5f 0%,#2563eb 60%,#3b82f6 100%); border-radius:16px; padding:28px 32px 24px; margin-bottom:28px; color:#fff; }
.hero-top     { display:flex; align-items:center; gap:16px; margin-bottom:24px; }
.hero-icon-wrap { width:52px; height:52px; background:rgba(255,255,255,.18); border-radius:14px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.hero-title   { font-size:20px; font-weight:700; margin:0 0 6px; }
.hero-sub     { font-size:14px; opacity:.85; margin:0; }
.hero-steps   { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
@media (max-width:768px){ .hero-steps{ grid-template-columns:repeat(2,1fr); } }
.hero-step    { background:rgba(255,255,255,.1); border-radius:10px; padding:14px; display:flex; align-items:flex-start; gap:10px; backdrop-filter:blur(4px); }
.step-num     { width:22px; height:22px; background:rgba(255,255,255,.25); border-radius:50%; font-size:11px; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.step-title   { font-size:12px; font-weight:700; margin-bottom:3px; }
.step-desc    { font-size:11px; opacity:.75; line-height:1.4; }

/* Search results */
.search-meta  { display:flex; align-items:center; gap:12px; margin-bottom:14px; flex-wrap:wrap; }
.search-pill  { background:#eef2ff; color:#6366f1; font-size:13px; font-weight:600; padding:5px 10px; border-radius:6px; }
.search-count { font-size:13px; color:#6b7280; }
.btn-clear    { font-size:12px; color:#6b7280; background:none; border:1px solid #d1d5db; border-radius:6px; padding:4px 10px; cursor:pointer; }
.btn-clear:hover { border-color:#6366f1; color:#6366f1; }
.empty-search { text-align:center; padding:48px; background:#fff; border-radius:12px; border:1px solid #e5e7eb; color:#6b7280; font-size:14px; }
.empty-search div { font-size:36px; margin-bottom:10px; }
.result-list  { display:flex; flex-direction:column; gap:8px; }
.result-item  { display:flex; align-items:center; gap:14px; background:#fff; border:1px solid #e5e7eb; border-radius:10px; padding:14px 16px; }
.result-item:hover { box-shadow:0 2px 10px rgba(0,0,0,.07); }
.result-icon  { font-size:22px; width:36px; text-align:center; flex-shrink:0; }
.result-body  { flex:1; min-width:0; }
.result-title { font-size:14px; font-weight:600; color:#111827; margin-bottom:4px; }
.result-title :deep(mark) { background:#fef08a; border-radius:2px; padding:0 2px; color:inherit; }
.result-summary { font-size:12px; color:#6b7280; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.result-badge { display:inline-block; margin-top:6px; font-size:11px; color:#6366f1; background:#eef2ff; padding:2px 8px; border-radius:4px; font-weight:500; }
.result-actions { display:flex; gap:8px; flex-shrink:0; }
.tag-video  { font-size:11px; color:#ef4444; background:#fee2e2; padding:4px 8px; border-radius:5px; font-weight:700; text-decoration:none; }
.tag-edit   { font-size:12px; color:#6366f1; background:#eef2ff; padding:5px 10px; border-radius:6px; font-weight:600; text-decoration:none; }

/* Category grid */
.loading-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
.skeleton-card { height:200px; border-radius:12px; background:#f3f4f6; animation:pulse 1.5s infinite; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
.cat-grid  { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
@media (max-width:768px){ .cat-grid{ grid-template-columns:1fr; } }
.cat-card  { background:#fff; border-radius:12px; border:1px solid #e5e7eb; padding:20px; box-shadow:0 1px 4px rgba(0,0,0,.05); transition:box-shadow .2s; }
.cat-card:hover { box-shadow:0 4px 16px rgba(0,0,0,.08); }
.cat-header { display:flex; align-items:center; gap:14px; margin-bottom:16px; }
.cat-icon   { width:44px; height:44px; border-radius:11px; display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0; }
.cat-name   { font-size:15px; font-weight:700; color:#111827; }
.cat-count  { font-size:12px; color:#6b7280; margin-top:2px; }
.cat-divider { height:1px; background:#f3f4f6; margin-bottom:12px; }

/* Guide accordion */
.item-list  { display:flex; flex-direction:column; gap:2px; }
.guide-item { border-radius:8px; overflow:hidden; }
.item-row   { display:flex; align-items:center; justify-content:space-between; padding:10px; cursor:pointer; border-radius:8px; user-select:none; transition:background .15s; }
.item-row:hover { background:#f9fafb; }
.open .item-row { background:#f0f4ff; }
.item-label { display:flex; align-items:center; gap:8px; flex:1; min-width:0; }
.item-title { font-size:13px; color:#374151; font-weight:500; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.vid-badge  { font-size:10px; background:#fee2e2; color:#ef4444; padding:2px 5px; border-radius:4px; font-weight:700; flex-shrink:0; }
.chevron    { color:#9ca3af; transition:transform .25s; flex-shrink:0; }
.chevron.rotated { transform:rotate(180deg); }
.item-body  { padding:0 10px 14px 28px; }
.item-summary { font-size:13px; color:#6b7280; line-height:1.6; margin:0 0 12px; }
.item-footer { display:flex; align-items:center; gap:10px; }
.btn-vid    { font-size:12px; color:#ef4444; text-decoration:none; background:#fee2e2; padding:5px 10px; border-radius:6px; font-weight:600; }
.btn-vid:hover  { background:#fecaca; }
.btn-detail { font-size:12px; color:#6366f1; text-decoration:none; background:#eef2ff; padding:5px 10px; border-radius:6px; font-weight:600; }
.btn-detail:hover { background:#e0e7ff; }

/* Empty */
.empty-state { text-align:center; padding:64px 20px; background:#fff; border-radius:12px; border:1px solid #e5e7eb; }
.empty-icon  { font-size:48px; margin-bottom:14px; }
.empty-title { font-size:18px; font-weight:700; color:#111827; margin-bottom:8px; }
.empty-desc  { font-size:14px; color:#6b7280; margin-bottom:20px; }
</style>

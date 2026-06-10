<template layout>
    <div class="manual-container">
        <!-- Header area -->
        <div class="manual-header">
            <h1 class="manual-title">
                <span v-if="!isEditMode">📚 Hướng dẫn sử dụng hệ thống</span>
                <span v-else>⚙️ Quản lý tài liệu hướng dẫn</span>
            </h1>
            
            <button 
                v-if="can('admin.cms-manuals.store')" 
                @click="isEditMode = !isEditMode" 
                class="btn-toggle-mode"
                :class="isEditMode ? 'btn-read' : 'btn-edit'"
            >
                <span v-if="isEditMode">📖 Đọc hướng dẫn</span>
                <span v-else>🛠️ Quản lý tài liệu</span>
            </button>
        </div>

        <!-- Mode 1: Edit/CRUD mode (standard table) -->
        <div v-if="isEditMode" class="crud-view">
            <Table
                :schema="schema"
                :columns="[
                    'id',
                    'title',
                    'sort_order',
                    'status',
                    'created_at',
                ]"
            />
        </div>

        <!-- Mode 2: Reading Mode (GitBook style docs) -->
        <div v-else class="reader-view">
            <!-- Sidebar for topics -->
            <div class="reader-sidebar">
                <div class="search-box">
                    <input 
                        type="text" 
                        v-model="searchQuery" 
                        placeholder="Tìm kiếm tài liệu..." 
                        class="search-input"
                    />
                </div>
                <div class="topics-list">
                    <div 
                        v-for="manual in filteredManuals" 
                        :key="manual.id"
                        @click="selectManual(manual)"
                        class="topic-item"
                        :class="{ 'topic-item--active': activeManual && activeManual.id === manual.id }"
                    >
                        <span class="topic-dot"></span>
                        <span class="topic-title">{{ manual.title }}</span>
                    </div>
                    
                    <div v-if="filteredManuals.length === 0" class="no-topics">
                        Không tìm thấy hướng dẫn nào.
                    </div>
                </div>
            </div>

            <!-- Content Reading Area -->
            <div class="reader-content">
                <transition name="fade-slide" mode="out-in">
                    <div :key="activeManual ? activeManual.id : 'empty'" class="content-wrapper">
                        <div v-if="activeManual" class="doc-pane">
                            <h2 class="doc-title">{{ activeManual.title }}</h2>
                            <div class="doc-meta">
                                <span>📅 Đăng ngày: {{ activeManual.created_at }}</span>
                                <span class="meta-separator">|</span>
                                <span>🔄 Cập nhật: {{ activeManual.updated_at }}</span>
                            </div>
                            
                            <div class="doc-divider"></div>
                            
                            <div 
                                class="doc-body html-content" 
                                v-html="activeManual.content || '<p class=text-gray-400>Tài liệu này chưa có nội dung.</p>'"
                            ></div>
                        </div>
                        <div v-else class="empty-state">
                            <div class="empty-icon">📖</div>
                            <h3>Chào mừng bạn đến với Hướng dẫn sử dụng</h3>
                            <p>Chọn một chủ đề ở danh mục bên trái để bắt đầu đọc hướng dẫn quản trị các tính năng trên website.</p>
                            <button 
                                v-if="can('admin.cms-manuals.store')" 
                                @click="isEditMode = true" 
                                class="btn-create-first"
                            >
                                Tạo tài liệu hướng dẫn đầu tiên
                            </button>
                        </div>
                    </div>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['schema', 'manuals'],
    data() {
        return {
            isEditMode: false,
            searchQuery: '',
            activeManual: null
        }
    },
    computed: {
        filteredManuals() {
            if (!this.manuals) return [];
            if (!this.searchQuery) return this.manuals;
            const query = this.searchQuery.toLowerCase();
            return this.manuals.filter(m => 
                m.title.toLowerCase().includes(query) || 
                (m.content && m.content.toLowerCase().includes(query))
            );
        }
    },
    created() {
        if (this.manuals && this.manuals.length > 0) {
            this.activeManual = this.manuals[0];
        }
    },
    methods: {
        selectManual(manual) {
            this.activeManual = manual;
        }
    }
}
</script>

<style scoped>
.manual-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 1.5rem;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #1f2937;
}

.manual-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e5e7eb;
}

.manual-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #111827;
}

.btn-toggle-mode {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid transparent;
}

.btn-edit {
    background-color: #f3f4f6;
    color: #374151;
    border-color: #d1d5db;
}

.btn-edit:hover {
    background-color: #e5e7eb;
}

.btn-read {
    background-color: #4f46e5;
    color: white;
}

.btn-read:hover {
    background-color: #4338ca;
}

.reader-view {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 1.5rem;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 4px 20px rgba(0,0,0,0.03);
    border: 1px solid #f3f4f6;
    overflow: hidden;
}

@media (max-width: 768px) {
    .reader-view {
        grid-template-columns: 1fr;
    }
}

.reader-sidebar {
    background-color: #fafafa;
    border-right: 1px solid #f3f4f6;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    height: 70vh;
    min-height: 500px;
}

.search-box {
    margin-bottom: 1.25rem;
}

.search-input {
    width: 100%;
    padding: 0.625rem 0.875rem;
    border-radius: 6px;
    border: 1px solid #d1d5db;
    font-size: 0.875rem;
    background-color: white;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.search-input:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.topics-list {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
}

.topic-item {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.75rem 0.875rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    user-select: none;
}

.topic-item:hover {
    background-color: #f3f4f6;
}

.topic-item--active {
    background-color: #eef2ff !important;
    color: #4f46e5;
    font-weight: 600;
}

.topic-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #9ca3af;
    transition: background-color 0.2s ease;
}

.topic-item--active .topic-dot {
    background-color: #4f46e5;
}

.topic-title {
    font-size: 0.875rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.no-topics {
    padding: 1rem;
    text-align: center;
    color: #9ca3af;
    font-size: 0.875rem;
}

.reader-content {
    padding: 2rem;
    height: 70vh;
    min-height: 500px;
    overflow-y: auto;
    background-color: white;
}

.content-wrapper {
    max-width: 800px;
    margin: 0 auto;
}

.doc-pane {
    animation: fadeIn 0.3s ease;
}

.doc-title {
    font-size: 1.75rem;
    font-weight: 800;
    color: #111827;
    margin-bottom: 0.5rem;
}

.doc-meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.75rem;
    color: #6b7280;
    margin-bottom: 1.25rem;
}

.meta-separator {
    color: #e5e7eb;
}

.doc-divider {
    height: 1px;
    background-color: #e5e7eb;
    margin-bottom: 1.5rem;
}

.html-content {
    line-height: 1.625;
    font-size: 0.9375rem;
    color: #374151;
}

.html-content :deep(p) {
    margin-bottom: 1rem;
}

.html-content :deep(h2) {
    font-size: 1.375rem;
    font-weight: 700;
    color: #111827;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    border-bottom: 1px solid #f3f4f6;
    padding-bottom: 0.25rem;
}

.html-content :deep(h3) {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
    margin-top: 1.25rem;
    margin-bottom: 0.5rem;
}

.html-content :deep(ul), .html-content :deep(ol) {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
}

.html-content :deep(ul) {
    list-style-type: disc;
}

.html-content :deep(ol) {
    list-style-type: decimal;
}

.html-content :deep(li) {
    margin-bottom: 0.25rem;
}

.html-content :deep(strong) {
    font-weight: 600;
    color: #111827;
}

.html-content :deep(blockquote) {
    border-left: 4px solid #e5e7eb;
    padding-left: 1rem;
    font-style: italic;
    color: #6b7280;
    margin: 1rem 0;
    background-color: #f9fafb;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    border-radius: 0 4px 4px 0;
}

.html-content :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 1.5rem 0;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    border: 1px solid #e5e7eb;
}

.html-content :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
    font-size: 0.875rem;
}

.html-content :deep(th), .html-content :deep(td) {
    border: 1px solid #e5e7eb;
    padding: 0.75rem;
    text-align: left;
}

.html-content :deep(th) {
    background-color: #f9fafb;
    font-weight: 600;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 4rem 2rem;
    height: 100%;
    color: #4b5563;
}

.empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    animation: float 3s ease-in-out infinite;
}

@keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

.empty-state h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 0.5rem;
}

.empty-state p {
    font-size: 0.875rem;
    color: #6b7280;
    max-width: 400px;
    margin-bottom: 1.5rem;
}

.btn-create-first {
    background-color: #4f46e5;
    color: white;
    padding: 0.625rem 1.25rem;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.btn-create-first:hover {
    background-color: #4338ca;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.2s ease;
}

.fade-slide-enter-from {
    opacity: 0;
    transform: translateY(10px);
}

.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
</style>

<template layout>
    <div>
        <div class="mb-2 flex items-center justify-end">
            <a
                :href="route('admin.vehicles.export-template')"
                class="btn btn-outline-secondary inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 transition shadow-sm"
                target="_blank"
                title="Tải file mẫu Excel (.xlsx) để điền dữ liệu"
            >
                <span>📥 Tải File Mẫu (.xlsx)</span>
            </a>
        </div>
        <Table
            :schema="schema"
            :config="{
                canExport: true,
                canImport: true
            }"
            :columns="displayColumns"
        />
    </div>
</template>
<script>
export default {
    props: ['schema', 'data'],
    data() {
        return {
            categories: this.data?.categories ?? [],
        }
    },
    computed: {
        displayColumns() {
            return [
                'id',
                'image',
                'title',
                {
                    field: 'category_id',
                    label: 'Danh mục',
                    transform: (data) => {
                        const categories = this.categories || []
                        const cat = categories.find(c => c.id === data.category_id)
                        return cat ? cat.title : '—'
                    },
                },
                'price',
                'price_sale',
                {
                    field: 'discount_percent',
                    label: '% Giảm',
                    transform: (data) => {
                        if (data.price > 0 && data.price_sale > 0) {
                            const percent = Math.round((data.price - data.price_sale) / data.price * 100)
                            return `-${percent}%`
                        }
                        return '—'
                    }
                },
                'status',
                'sort_order',
                'created_at',
            ]
        }
    }
}
</script>

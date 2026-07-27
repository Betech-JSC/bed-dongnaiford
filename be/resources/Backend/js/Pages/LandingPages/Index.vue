<template layout>
    <Table
        :schema="schema"
        :columns="displayColumns"
    />
</template>
<script>
export default {
    props: ['schema', 'data'],
    computed: {
        displayColumns() {
            return [
                'id',
                {
                    field: 'sales_consultant_id',
                    label: 'Cố vấn bán hàng',
                    transform: (row) => row.sales_consultant ? row.sales_consultant.name : '—'
                },
                {
                    field: 'vehicle_id',
                    label: 'Dòng xe áp dụng',
                    transform: (row) => {
                        if (row.vehicles_list && row.vehicles_list.length > 0) {
                            return row.vehicles_list.map(v => v.title).join(', ');
                        }
                        return row.vehicle ? row.vehicle.title : '—';
                    }
                },
                {
                    field: 'urls',
                    label: 'Đường dẫn LDP',
                    transform: (row) => {
                        if (!row.sales_consultant) return '—';
                        const consultantSlug = row.sales_consultant.slug || this.slugify(row.sales_consultant.name);
                        let clientUrl = window.location.origin.replace('8000', '3000');
                        if (clientUrl.includes('cms.')) {
                            clientUrl = clientUrl.replace('cms.', '');
                        }

                        let vehicles = row.vehicles_list || [];
                        if (vehicles.length === 0 && row.vehicle) {
                            vehicles = [row.vehicle];
                        }
                        if (vehicles.length === 0) return '—';

                        return vehicles.map(v => `${clientUrl}/ldp/${consultantSlug}/${v.slug}`).join('\n');
                    }
                },
                'status',
                'created_at',
            ]
        }
    },
    methods: {
        slugify(text) {
            return text.toString().toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^\w\-]+/g, '')
                .replace(/\-\-+/g, '-')
                .replace(/^-+/, '')
                .replace(/-+$/, '');
        }
    }
}
</script>

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
                'status',
                'created_at',
            ]
        }
    }
}
</script>

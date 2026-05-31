<template layout>
    <Table
        :schema="schema"
        :columns="[
            'id',
            'name',
            'phone',
            'email',
            'formatted_status',
            'formatted_payment_status',
            'created_at',
            'updated_at',
        ]"
        :config="{
            canCreate: false,
        }"
    >
    </Table>
</template>
<script>
export default {
    props: ['schema'],
    data() {
        return {
            status: null,
            sort: 'all',
        }
    },
}
</script>

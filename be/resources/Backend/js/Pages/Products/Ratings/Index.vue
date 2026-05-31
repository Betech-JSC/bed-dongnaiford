<template layout>
    <Table
        :schema="schema"
        :columns="[
            'id',
            'name',
            'rate_score',
            'status',
            'created_at',
            'updated_at',
        ]"
        :config="{
            canCreate: false,
        }"
    />
</template>
<script>
export default {
    props: ["schema"],
};
</script>

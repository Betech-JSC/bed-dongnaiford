<template layout>
    <Table
        :schema="schema"
        :columns="[
            'id',
            'name',
            'email',
            'phone',
            'created_at',
            'updated_at',
        ]"
        :config="{
            canCreate: false,
            canExport: true,
        }"
    />
</template>
<script>
export default {
    props: ["schema"],
};
</script>

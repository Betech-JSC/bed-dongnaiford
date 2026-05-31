<template>
    <div v-if="isVisible" class="skeleton-loader">
        <div class="skeleton-header"></div>
        <div class="skeleton-body">
            <div class="skeleton-item" v-for="i in 5" :key="i"></div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        isVisible: {
            type: Boolean,
            default: false,
        },
    },
}
</script>

<style scoped>
.skeleton-loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #f4f4f4;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    padding: 20px;
}
.skeleton-header {
    width: 100%;
    height: 20px;
    background: #e0e0e0;
    margin-bottom: 20px;
    border-radius: 5px;
}
.skeleton-body .skeleton-item {
    width: 100%;
    height: 15px;
    background: #e0e0e0;
    margin-bottom: 10px;
    border-radius: 5px;
}
</style>

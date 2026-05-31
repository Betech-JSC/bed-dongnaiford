<template>
    <div class="space-y-3 box-option">
        <h4 class="font-bold text-gray-700">{{ option.title }}</h4>
        <div class="space-y-[6px]">
            <div v-for="(node, indexNote) in option.nodes.slice(0, quantity)" :key="indexNote" class="check-control">
                <input
                    type="checkbox"
                    name="box-brands"
                    v-model="node.active"
                    :id="`box-brands-${node.slug}`"
                    @change="$emit('pushToUrl')"
                />
                <label :for="`box-brands-${node.slug}`" class="label-check caption">{{ node.title }}</label>
                <span class="checkmark"></span>
            </div>
        </div>
        <button
            v-if="isShow"
            @click="isShowMore ? showMore() : showLess()"
            class="flex items-center space-x-2 font-medium text-green-600 caption"
        >
            <span>{{ isShowMore ? 'Xem thêm' : 'Thu gọn' }}</span>
            <IconBoxOptionArrow :class="isShowMore ? 'rotate-0' : 'rotate-180'" />
        </button>
    </div>
</template>
<script>
export default {
    props: {
        option: {
            type: Object,
            default: {},
        },
        quantityInit: {
            type: Number,
            default: 6,
        },
    },
    data() {
        return {
            quantity: this.quantityInit,
        }
    },
    computed: {
        isShow() {
            return this.option.nodes.length > this.quantityInit
        },
        isShowMore() {
            return this.option.nodes.length > this.quantity
        },
    },
    methods: {
        showMore() {
            const total = this.option.nodes.length
            this.quantity = total
        },
        showLess() {
            this.quantity = this.quantityInit
        },
    },
}
</script>

<template>
    <div class="space-y-3 box-option px-3 pt-3">
        <div class="flex items-center space-x-2 font-medium justify-between">
            <p class="label-1 font-semibold text-gray-900">{{ option.title }}</p>
            <button v-if="isShow" @click="isShowMore ? showMore() : showLess()" class="caption">
                <IconBoxOptionArrow :class="isShowMore ? 'rotate-180' : 'rotate-0'" />
            </button>
        </div>
        <div class="flex flex-col gap-3" :class="isShowMore ? 'pb-0' : 'pb-3'">
            <div v-for="(node, indexNote) in option.nodes.slice(0, quantity)" :key="indexNote" class="check-control">
                <input
                    type="checkbox"
                    name="box-option"
                    v-model="node.active"
                    :id="`box-option-${node.slug}`"
                    @change="$emit('pushToUrl')"
                />
                <label :for="`box-option-${node.slug}`" class="label-check caption">{{ node.title }}</label>
                <span class="checkmark"></span>
            </div>
        </div>
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
            default: 0,
        },
    },
    data() {
        return {
            quantity: this.quantityInit,
            quantityDefault: 10,
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
            this.quantity = this.quantity + this.quantityDefault
        },
        showLess() {
            this.quantity = this.quantityInit
        },
    },
}
</script>

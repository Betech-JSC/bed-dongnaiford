<template>
    <template
        v-if="field.type === undefined || field.type === 'text' || field.type === 'email' || field.type === 'password'"
    >
        <div class="relative flex items-center gap-1 md:gap-2 bg-white rounded-full p-1.5">
            <label
            v-if="field.label"
            :for="field.name"
            class="max-w-[100px] md:max-w-[150px] w-full body-2 font-medium bg-primary-400 text-gray-900 flex items-center justify-center text-center py-3 md:py-4 rounded-full flex-shrink-0"
        >
            {{ field.label }}
            <!-- <span v-if="isRequired" class="text-red-600">*</span> -->
        </label>
        <input
            :class="isCart ? 'input-cart' : 'input-form'"
            :name="field.name"
            :id="field.name"
            :type="field.type ?? 'text'"
            :readonly="field.readonly ?? false"
            :placeholder="field.placeholder"
            :value="modelValue"
            v-on:input="$emit('update:modelValue', $event.target.value)"
            :max="field.max ?? ''"
            :min="field.min ?? ''"
            autocomplete="off"
        />
        </div>
    </template>
    <template v-else-if="field.type === 'number'">
        <div class="relative flex items-center gap-1 md:gap-2 bg-white rounded-full p-1.5">
            <label
                v-if="field.label"
                :for="field.name"
                class="max-w-[100px] md:max-w-[150px] w-full body-2 font-medium bg-primary-400 text-gray-900 flex items-center justify-center text-center py-3 md:py-4 rounded-full flex-shrink-0"
            >
                {{ field.label }}
                <!-- <span v-if="isRequired" class="text-red-600">*</span> -->
            </label>
            <input
                :class="isCart ? 'input-cart' : 'input-form'"
                :type="field.type ?? 'text'"
                :name="field.name"
                :id="field.name"
                :readonly="field.readonly ?? false"
                :placeholder="field.placeholder ?? (!field.readonly && field.label ? `${field.label.toLowerCase()}` : '')"
                :value="modelValue"
                @input="$emit('update:modelValue', $event.target.value)"
                :max="field.max ?? ''"
                :min="field.min ?? ''"
                autocomplete="off"
                inputmode="numeric"
                onkeypress="return event.charCode >= 48 && event.charCode =< 57"
                onkeydown="return event.keyCode !== 69 && event.keyCode !== 190"
            />
        </div>
    </template>

    <template v-else-if="field.type === 'textarea'">
        <label
            :for="field.name"
            class="text-gray-700 label-2 lg:mb-1.5 mb-1 block"
            :class="isContact ? 'lg:mb-1.5 mb-1 text-gray-700' : 'mb-[2px] text-white'"
        >
            {{ field.label }} <span v-if="isPopup">*</span>
        </label>

        <textarea
            :id="field.name"
            :rows="field.rows ?? 3"
            :placeholder="field.placeholder ?? (!field.readonly && field.label ? `${field.label.toLowerCase()}` : '')"
            class=""
            :class="isCart ? 'input-area-cart' : 'input-area'"
            :readonly="field.readonly ?? false"
            :value="modelValue"
            autocomplete="off"
            @input="$emit('update:modelValue', $event.target.value)"
        >
        </textarea>
    </template>
    <template v-else-if="field.type === 'select_single'">
        <label v-if="field.label" :for="field.name" class="text-gray-700 font-[450] mb-[2px] block">
            {{ field.label }}
            <span v-if="isRequired" class="text-gray-700">*</span>
        </label>
        <div class="relative">
            <select
                class="select-form relative pr-[12px] caption"
                :class="!modelValue || (!modelValue && field.placeholder) ? 'text-slate-500' : ' text-gray-700'"
                @input="$emit('update:modelValue', $event.target.value)"
                :value="modelValue"
            >
                <option v-if="field.placeholder" value="" class="text-slate-500" selected disabled>
                    {{ field.placeholder }}
                </option>
                <option v-for="(item, index) in field.options" :key="index" :value="item">
                    {{ item }}
                </option>
            </select>
            <div class="absolute right-[12px] top-1/2 -translate-y-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                    <path
                        d="M13 6.5L8 11.5L3 6.5"
                        stroke="#CBD5E1"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            </div>
        </div>
    </template>
    <template v-else-if="field.type === 'radio'">
        <template v-for="(item, key) of field.options" :key="key">
            <div class="radio">
                <input
                    type="radio"
                    :value="item.id !== undefined ? item.id : key"
                    :id="`${fieldId}_${key}`"
                    :name="fieldId"
                    :checked="item.id && modelValue && item.id.toString() === modelValue.toString()"
                    @input="$emit('update:modelValue', $event.target.value)"
                />
                <label :for="`${fieldId}_${key}`">
                    {{ item.name ? item.name : item }}
                </label>
                <span></span>
            </div>
        </template>
    </template>
    <template v-else-if="field.type === 'checkbox'">
        <div class="checkbox">
            <input
                type="checkbox"
                :id="fieldId"
                :name="fieldId"
                :checked="modelValue && modelValue.toString()"
                @change="$emit('update:modelValue', !!$event.target.checked)"
            />
            <label :for="fieldId">
                {{ field.label }}
            </label>
            <span></span>
        </div>
    </template>
    <template v-else-if="field.type === 'checkbox_list'">
        <div class="checkbox">
            <input
                type="checkbox"
                :id="fieldId"
                :name="fieldId"
                :checked="modelValue"
                @change="$emit('update:modelValue', !!$event.target.checked)"
            />
            <label :for="fieldId">
                {{ field.options.label }}
            </label>
            <span></span>
        </div>
    </template>
    <template v-else-if="field.type === 'date'">
        <label
            :for="field.name"
            class="text-gray-700 label-2 lg:mb-1.5 mb-1 block"
            :class="isContact ? 'lg:mb-1.5 mb-1 text-gray-700' : 'mb-[2px] text-white'"
        >
            {{ field.label }} <span v-if="isPopup">*</span>
        </label>
        <input
            :id="field.name"
            type="date"
            class="input-form"
            :readonly="field.readonly ?? false"
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
        />
    </template>
    <template v-else-if="field.type === 'datetime-local'">
        <label
            :for="field.name"
            class="text-gray-700 label-2 lg:mb-1.5 mb-1 block"
            :class="isContact ? 'lg:mb-1.5 mb-1 text-gray-700' : 'mb-[2px] text-white'"
        >
            {{ field.label }} <span v-if="isPopup">*</span>
        </label>
        <input
            :id="field.name"
            type="datetime-local"
            class="input-form"
            :readonly="field.readonly ?? false"
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
        />
    </template>
</template>
<script>
export default {
    inheritAttrs: false,
    props: ['field', 'modelValue', 'isCart', 'isPopup', 'isContact'],
    emits: ['update:modelValue', 'validate'],
    data() {
        return {
            model: this.modelValue,
            select: this.modelValue,
            fieldId: '',
            option: this.modelValue,
            isChecked: 1,
            isRequired: false,
        }
    },
    created() {
        this.fieldId = Math.random().toString(36).substr(2, 9)
        if (
            this.field.rules[`${this.field.fieldName}`] &&
            this.field.rules[`${this.field.fieldName}`].includes('required')
        ) {
            this.isRequired = true
        }
    },
    watch: {
        select: {
            handler() {
                this.$emit('input', this.select)
            },
        },
        option: {
            handler() {
                this.$emit('input', this.option)
            },
        },
        modelValue(value) {
            this.select = value
            this.model = value
        },
    },
    methods: {
        handleInput(e) {
            this.$emit('input', e.target.value)
        },
        handleInputCheckbox(e) {
            this.$emit('input', e.target.checked)
        },
        handleInputRadio(option) {
            this.$emit('input', option)
        },
        inputChange(value) {
            this.$emit('input', value)
        },
        handleSelect(e) {
            this.$emit('select', e.target.value)
        },
    },
}
</script>
<style lang="scss" scoped>
.input-form {
    @apply block w-full text-gray-700 rounded-full focus:bg-white focus:ring-0 outline-none focus:outline-none focus:duration-200 focus:border-primary h-[44px] placeholder:text-gray-400;
    @apply text-[16px] leading-[150%] font-sans font-normal;
    &:focus {
        @apply duration-200;
    }
}

.input-cart {
    @apply block w-full px-3 py-2.5 text-gray-500 border border-gray-300 rounded-lg bg-transparent focus:bg-transparent focus:ring-0 outline-none focus:outline-none focus:duration-200 focus:border-primary-800 h-[44px];
    &:focus {
        @apply duration-200;
    }
}

.input-area {
    @apply min-h-[100px] block w-full p-3 text-gray-500 border border-neutral-100 rounded-md bg-white  focus:bg-white focus:ring-0 outline-none focus:outline-none focus:duration-200 focus:border-primary;
    @apply text-[14px] leading-[140%] font-sans;
    &:focus {
        @apply duration-200;
    }
}

.input-area-cart {
    @apply min-h-[134px] block w-full py-2.5 xl:px-3.5 px-2.5 text-gray-500 border border-gray-300 rounded-lg  bg-white  focus:bg-white focus:ring-0 outline-none focus:outline-none focus:duration-200 focus:border-primary-800;
    box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
    &:focus {
        @apply duration-200;
    }
}

.select-form {
    @apply block w-full md:p-3 p-2 border border-transparent rounded-sm  bg-white  focus:bg-white focus:ring-0 outline-none focus:outline-none focus:duration-200 focus:border-blue-500;
    &:focus {
        @apply duration-200;
    }
}
::placeholder {
    @apply text-gray-700;
}
.input-form:focus::placeholder {
    @apply duration-300;
}
textarea:focus::placeholder {
    @apply duration-300;
}
input[type='text']:disabled {
    background: #ececed;
}
input[type='number']:disabled {
    background: #ececed;
}
input[type='password']:disabled {
    background: #ececed;
}
input[type='email']:disabled {
    background: #ececed;
}
.input-form[type='date'] {
    -webkit-appearance: none;
    appearance: none;
    @apply block w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:outline-none;
}
select {
    -webkit-appearance: none;
    -webkit-border-radius: 0px;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>

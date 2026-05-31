<template>
    <fieldset>
        <!-- Text, Email, Password, Textarea, Number, Select -->
        <div v-if="
            field.type === 'text' ||
            field.type === 'email' ||
            field.type === 'password' ||
            field.type === 'textarea' ||
            field.type === 'number' ||
            field.type === 'select_single' ||
            field.type === 'select_administrative'
        ">
            <div class="relative">
                <JamField :field="field" :isCart="isCart" :validate="validate" :modelValue="modelValue"
                    :rows="field.rows" :isContact="isContact" :isPopup="isPopup" @action="$emit('action')"
                    @update:modelValue="$emit('update:modelValue', $event)" />
                <small v-if="validate !== true && validate !== undefined"
                    class="absolute bottom-[-3px] md:bottom-[-5px] left-5 text-brand-100 translate-y-full leading-[100%]">
                    {{ `${capitalizedLabel} is invalid` }}
                </small>
            </div>
        </div>

        <!-- Radio -->
        <div v-if="field.type === 'radio' || field.type === 'radio_custom'">
            <JamField :field="field" :modelValue="modelValue" @update:modelValue="$emit('update:modelValue', $event)" />
        </div>

        <!-- Radio Control -->
        <div v-if="field.type === 'radio_control'">
            <JamField v-model="model" :field="field" />
        </div>

        <!-- Media Upload -->
        <div v-if="field.type === 'media_upload'">
            <JamField :value="value" @changeImages="changeImage" @input="(val) => (model = val)" :field="field" />
            <small v-if="validate !== true && validate !== undefined"
                :class="field.type === 'media_upload' || field.type === 'textarea' ? '' : 'mt-[6px]'"
                class="absolute text-red-600 description">
                {{ validate === false ? `${label} ${tt('is invalid')}` : validate }}
            </small>
        </div>

        <!-- Date Input -->
        <div v-if="field.type === 'date'">
            <JamField :field="field" :modelValue="modelValue" @update:modelValue="onDateChange" />
            <small v-if="validate !== true && validate !== undefined"
                class="absolute -bottom-1 text-red-600 translate-y-full leading-[100%]">
                {{ validate === false ? `${label} ${tt('is invalid')}` : validate }}
            </small>
        </div>

        <div v-if="field.type === 'datetime-local'">
            <JamField :field="field" :modelValue="modelValue" @update:modelValue="onDateChange" />
            <small v-if="validate !== true && validate !== undefined"
                class="absolute -bottom-1 text-red-600 translate-y-full leading-[100%]">
                {{ validate === false ? `${label} ${tt('is invalid')}` : validate }}
            </small>
        </div>
    </fieldset>
</template>

<script>
import { validateField } from '../../validator'
import JamField from '../Jam/Field.vue'

export default {
    props: [
        'field',
        'classGrid',
        'classCol',
        'modelValue',
        'isSubmit',
        'isCart',
        'isPopup',
        'isProduct',
        'isContact',
    ],
    components: { JamField },
    emits: ['update:modelValue', 'setIsSubmit', 'input', 'changeImages'],
    data() {
        return {
            model: this.modelValue,
            validate: this.field.validate === false ? this.field.validate : true,
            label: this.field.name ? this.field.name.replace('<br />', '') : '',
        }
    },
    computed: {
        error() {
            return this.field.fieldName ? this.field.errors[this.field.fieldName] : ''
        },
        capitalizedLabel() {
            const word = this.label
            return word.charAt(0).toUpperCase() + word.slice(1)
        },
    },
    created() {
        this.checkValidate()
    },
    watch: {
        'field.validate'(newVal) {
            this.validate = newVal
        },
        model(value) {
            if (this.isSubmit) {
                this.$emit('setIsSubmit', false)
                return
            } else {
                this.validate = validateField(this.modelValue, this.field.rules[this.field.fieldName])
                this.$emit('input', this.modelValue)
            }
        },
        error() {
            this.checkValidate()
        },
        modelValue(value) {
            this.model = value
        },
    },
    methods: {
        changeImage(value) {
            this.$emit('changeImages', value)
        },
        onDateChange(value) {
            // Handle validation only after date change
            this.validate = validateField(value, this.field.rules[this.field.fieldName])
            this.$emit('update:modelValue', value)
            this.$emit('input', value)
        },
        checkValidate() {
            this.validate = !this.field.errors.hasOwnProperty(this.field.fieldName)
        },
    },
}
</script>

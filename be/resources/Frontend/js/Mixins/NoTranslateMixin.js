/**
 * Vue Mixin để bảo vệ nội dung khỏi Google Translate
 * Sử dụng: mixins: [NoTranslateMixin]
 */

import NoTranslateProtection from '../Utils/NoTranslateProtection.js';

export default {
    data() {
        return {
            noTranslateProtection: null
        }
    },

    mounted() {
        this.initNoTranslateProtection();
    },

    beforeUnmount() {
        this.destroyNoTranslateProtection();
    },

    methods: {
        /**
         * Khởi tạo bảo vệ notranslate cho component
         */
        initNoTranslateProtection() {
            this.$nextTick(() => {
                // Bảo vệ toàn bộ component
                if (this.$el) {
                    NoTranslateProtection.protect(this.$el);
                }

                // Bảo vệ các phần tử cụ thể
                this.protectSpecificElements();
            });
        },

        /**
         * Bảo vệ các phần tử cụ thể trong component
         */
        protectSpecificElements() {
            const selectors = [
                '[v-html]',
                '.prose',
                '.content-dynamic',
                '.title-dynamic',
                '.description-dynamic'
            ];

            selectors.forEach(selector => {
                const elements = this.$el?.querySelectorAll(selector) || [];
                elements.forEach(element => {
                    NoTranslateProtection.protect(element);
                });
            });
        },

        /**
         * Bảo vệ một phần tử cụ thể
         * @param {Element|string} elementOrSelector - Element hoặc CSS selector
         */
        protectElement(elementOrSelector) {
            if (typeof elementOrSelector === 'string') {
                NoTranslateProtection.protectBySelector(elementOrSelector);
            } else {
                NoTranslateProtection.protect(elementOrSelector);
            }
        },

        /**
         * Bảo vệ nội dung v-html
         * @param {string} content - Nội dung HTML
         * @returns {string} - Nội dung đã được bảo vệ
         */
        protectHtmlContent(content) {
            if (!content) return content;
            
            // Wrap nội dung trong div có class notranslate
            return `<div class="notranslate" translate="no" data-notranslate="true">${content}</div>`;
        },

        /**
         * Tạo props cho phần tử cần bảo vệ
         * @param {Object} additionalProps - Props bổ sung
         * @returns {Object} - Props đã bao gồm bảo vệ notranslate
         */
        getNoTranslateProps(additionalProps = {}) {
            return {
                class: `notranslate ${additionalProps.class || ''}`.trim(),
                translate: 'no',
                'data-notranslate': 'true',
                ...additionalProps
            };
        },

        /**
         * Hủy bảo vệ khi component bị destroy
         */
        destroyNoTranslateProtection() {
            if (this.noTranslateProtection && this.noTranslateProtection.destroy) {
                this.noTranslateProtection.destroy();
            }
        }
    },

    /**
     * Computed properties hữu ích
     */
    computed: {
        /**
         * Class CSS cho phần tử cần bảo vệ
         */
        noTranslateClass() {
            return 'notranslate';
        },

        /**
         * Attributes cho phần tử cần bảo vệ
         */
        noTranslateAttrs() {
            return {
                translate: 'no',
                'data-notranslate': 'true'
            };
        }
    },

    /**
     * Directives tùy chỉnh
     */
    directives: {
        /**
         * Directive v-no-translate
         * Sử dụng: <div v-no-translate>Content</div>
         */
        noTranslate: {
            mounted(el) {
                NoTranslateProtection.protect(el);
            },
            updated(el) {
                NoTranslateProtection.protect(el);
            }
        }
    }
};
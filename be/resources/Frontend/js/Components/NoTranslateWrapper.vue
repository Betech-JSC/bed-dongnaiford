<template>
    <div 
        :class="wrapperClass"
        :translate="translate"
        ref="wrapper"
    >
        <slot />
    </div>
</template>

<script>
export default {
    name: 'NoTranslateWrapper',
    props: {
        // Có chặn dịch hay không
        noTranslate: {
            type: Boolean,
            default: true
        },
        // Class CSS bổ sung
        wrapperClass: {
            type: String,
            default: ''
        },
        // Loại nội dung để áp dụng class phù hợp
        contentType: {
            type: String,
            default: 'default',
            validator: (value) => ['default', 'prose', 'title', 'description', 'code'].includes(value)
        }
    },
    computed: {
        translate() {
            return this.noTranslate ? 'no' : 'yes';
        }
    },
    mounted() {
        if (this.noTranslate) {
            this.applyNoTranslateProtection();
        }
    },
    methods: {
        applyNoTranslateProtection() {
            const wrapper = this.$refs.wrapper;
            if (!wrapper) return;

            // Thêm các class cần thiết
            wrapper.classList.add('notranslate');
            
            // Thêm class theo loại nội dung
            const contentTypeClasses = {
                prose: 'prose-notranslate',
                title: 'title-notranslate', 
                description: 'desc-notranslate',
                code: 'code-notranslate'
            };
            
            if (contentTypeClasses[this.contentType]) {
                wrapper.classList.add(contentTypeClasses[this.contentType]);
            }

            // Thêm attribute để Google Translate bỏ qua
            wrapper.setAttribute('translate', 'no');
            wrapper.setAttribute('data-notranslate', 'true');
            
            // Áp dụng cho tất cả phần tử con
            const childElements = wrapper.querySelectorAll('*');
            childElements.forEach(child => {
                child.classList.add('notranslate');
                child.setAttribute('translate', 'no');
            });
        }
    }
}
</script>

<style scoped>
/* Đảm bảo các phần tử được bảo vệ */
.notranslate {
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
}

/* Styles cho các loại nội dung khác nhau */
.prose-notranslate {
    /* Bảo vệ nội dung prose/blog */
}

.title-notranslate {
    /* Bảo vệ tiêu đề */
}

.desc-notranslate {
    /* Bảo vệ mô tả */
}

.code-notranslate {
    /* Bảo vệ code */
    font-family: 'Courier New', monospace;
}
</style>
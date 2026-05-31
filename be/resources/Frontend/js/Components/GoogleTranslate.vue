<template>
    <div class="flex items-center gap-1 text-primary-900">
        <Global />

        <div class="flex items-center gap-0.5">
            <a href="javascript:void(0)" @click="translate('vi')" :class="currentLang === 'vi' ? '' : 'opacity-20'">
                VI
            </a>
            <span class="opacity-20">/</span>
            <a href="javascript:void(0)" @click="translate('en')" :class="currentLang === 'en' ? '' : 'opacity-20'">
                EN
            </a>
        </div>

        <!-- Widget gg translate (ẩn) -->
        <div id="google_translate_element" style="display: none"></div>

        <!-- Các phần tử mà bạn muốn Google Translate bỏ qua -->
        <div class="notranslate">
            <h1>Tiêu đề không dịch</h1>
            <p>Đoạn văn bản này sẽ không bị dịch</p>
        </div>

        <div>
            <h1 class="notranslate">Không dịch phần này</h1>
            <p>Đây là một đoạn văn bản sẽ không được Google Translate dịch.</p>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            currentLang: 'vi',
        }
    },
    mounted() {
        // Inject CSS ngay khi mount
        const style = document.createElement('style')
        style.innerHTML = `
          .goog-te-banner-frame.skiptranslate { display: none !important; }
          body { top: 0px !important; }
        `
        document.head.appendChild(style)

        // Tải script Google Translate
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
        document.body.appendChild(script)

        // Khởi tạo Google Translate
        window.googleTranslateElementInit = () => {
            new window.google.translate.TranslateElement(
                {
                    pageLanguage: 'vi',
                    includedLanguages: 'vi,en',
                    autoDisplay: false,
                },
                'google_translate_element'
            )
        }

        // Ẩn banner nếu Google đã inject
        this.$nextTick(() => {
            setTimeout(this.hideGoogleBanner, 2000)
        })
    },
    methods: {
        translate(lang) {
            const select = document.querySelector('select.goog-te-combo')
            if (select) {
                select.value = lang
                select.dispatchEvent(new Event('change'))
                this.currentLang = lang
                // Ẩn banner ngay sau khi dịch
                setTimeout(this.hideGoogleBanner, 500)
            }
        },
        hideGoogleBanner() {
            // Xóa iframe banner
            const iframe = document.querySelector('iframe.goog-te-banner-frame')
            if (iframe) iframe.style.display = 'none'

            // Reset lại body
            document.body.style.top = '0px'
        },
    },
}
</script>

<template>
    <header class="sticky inset-x-0 top-0 z-[1000] transition-all duration-300 bg-white border-b border-gray-300"
        :class="{
            '': isScrolled || isToggleMenu || $page.props.route.name === 'vi.posts.show' || $page.props.route.name === 'vi.jobs.show'
        }" @mouseleave="menuSelected = null">
        <div class="relative md:h-[98px]">
            <div class="container flex items-center justify-between py-2 h-full max-md:px-4">
                <Logo />
                <ul class="hidden xl:flex items-center md:space-x-4">
                    <template v-for="(menu, index) in menus" :key="index">
                        <li v-if="menu && menu.title !== ''" @mouseover="setMenuSelected(menu)"
                            @mouseenter="setFirstSubMenu" class="relative group">
                            <Link :href="menu.slug"
                                class="flex items-center gap-1 relative duration-150 ease-in-out title-3 font-bold"
                                :class="fullPath.includes(menu.slug) ? 'text-primary' : 'text-gray-700 lg:hover:text-primary'"
                                @click="menuSelected = null">
                            <div>{{ menu.title }}</div>
                            <div v-if="menu.subMenu && menu.subMenu.length > 0">
                                <ChervonDown />
                            </div>
                            </Link>

                            <!-- Desktop Dropdown -->
                            <div v-if="menu.subMenu && menu.subMenu.length > 0"
                                class="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 w-max">
                                <ul class="bg-white rounded-[12px] overflow-hidden py-3">
                                    <li v-for="(subItem, subIndex) in (menu.subMenu || []).filter((s) => s.slug)"
                                        :key="subIndex">
                                        <Link :href="route('products.categories', { slug: subItem.slug })"
                                            class="block px-4 py-2 body-2 text-gray-900 hover:bg-brand-200 hover:text-brand-500 transition-colors duration-300 ease-in-out notranslate"
                                            :class="{ 'bg-brand-50 text-brand-500': fullPath.includes(subItem.slug) }"
                                            @click="menuSelected = null">
                                        {{ subItem.title }}
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </template>
                </ul>

                <div class="flex items-center justify-center gap-2.5">
                    <div class="flex items-center justify-center notranslate">
                        <LanguageSwitcher @switch="switchLang" />
                    </div>
                    <Link :href="route('contact')"
                        class="max-lg:hidden btn btn-primary min-w-[120px] flex items-center justify-center">
                    {{ tt('Đăng ký') }}</Link>
                    <button @click="onToggleMenu()" class="xl:hidden">
                        <Hamburger :isToggleMenu="isToggleMenu" />
                    </button>
                </div>
            </div>

            <!-- Mobile Menu -->
            <div class="fixed md:top-[var(--header-height-md)] top-[var(--header-height-sm)] w-full h-full z-[1000] xl:hidden"
                :class="isToggleMenu ? 'right-0' : '-right-full'" style="transition: right 0.5s">
                <div class="w-full md:w-[50vw] h-full bg-primary-50 absolute z-30 duration-300 px-6 py-8 space-y-4"
                    :class="isToggleMenu ? 'right-0' : '-right-full'" style="transition: right 0.5s">
                    <ul class="space-y-4 body-1 font-semibold">
                        <template v-for="(menuMb, menuMbIndex) in menus" :key="menuMbIndex">
                            <li class="flex flex-col py-2 border-b border-gray-200 last:border-0"
                                :class="fullPath.includes(menuMb.slug) ? 'text-primary' : 'text-gray-900'">
                                <div class="flex items-center justify-between w-full">
                                    <Link :href="menuMb.slug" @click="closeMenu()" class="flex-1">
                                    {{ menuMb.title }}
                                    </Link>
                                    <button v-if="menuMb.subMenu && menuMb.subMenu.length > 0"
                                        @click="toggleMobileSubMenu(menuMbIndex)"
                                        class="p-2 -mr-2 text-primary-600 hover:text-primary-800 focus:outline-none">
                                        <DropdownArrow class="w-5 h-5 transition-transform duration-300"
                                            :class="{ 'rotate-180': activeMobileSubMenus.includes(menuMbIndex) }" />
                                    </button>
                                </div>

                                <!-- Mobile Submenu Accordion -->
                                <div v-if="menuMb.subMenu && menuMb.subMenu.length > 0"
                                    class="overflow-hidden transition-[max-height] duration-300 ease-in-out"
                                    :style="{ maxHeight: activeMobileSubMenus.includes(menuMbIndex) ? '500px' : '0px' }">
                                    <ul class="pl-4 mt-2 space-y-2 border-l-2 border-primary-200 ml-1">
                                        <li v-for="(subItem, subIndex) in (menuMb.subMenu || []).filter((s) => s.slug)"
                                            :key="subIndex">
                                            <Link :href="route('products.categories', { slug: subItem.slug })"
                                                @click="closeMenu()"
                                                class="block py-1 text-sm text-primary-700 hover:text-primary-900"
                                                :class="{ 'font-medium text-primary-900': fullPath.includes(subItem.slug) }">
                                            {{ subItem.title }}
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        </template>
                    </ul>

                    <!-- Google Translate Element (hidden) -->
                    <div id="google_translate_element" class="hidden"></div>
                </div>
            </div>
        </div>

        <!-- Background Overlay -->
        <div @mouseenter="setBackgroundHover('leave')"
            :class="hoverBackground ? 'visible duration-100' : 'invisible duration-100'"
            class="absolute w-screen h-screen bg-black opacity-50 z-1"></div>
    </header>
</template>

<script>
import ChervonDown from './Icon/ChervonDown.vue'
import DropdownArrow from './Icons/DropdownArrow.vue'
import LanguageSwitcher from './LanguageSwitcher.vue'

export default {
    props: {
        fullPath: {
            type: String,
            default: '',
        },
        fullRoute: {
            type: String,
            default: '',
        },
    },
    components: { DropdownArrow, ChervonDown, LanguageSwitcher },
    data() {
        return {
            inited: false,
            isScrolled: false,
            menus: [
                {
                    title: this.tt('Về Lotus Institute'),
                    slug: this.route('histories.index'),
                    type: 'histories',
                    subMenu: [],
                },
                {
                    title: this.$page.props.locale.current === 'zh' ? '课程' : (this.$page.props.data.lotus_categories?.find(c => c.translations?.some(t => t.slug === 'khoa-hoc'))?.title || this.tt('Khóa học')),
                    slug: this.route('products.categories', { slug: this.$page.props.data.lotus_categories?.find(c => c.translations?.some(t => t.slug === 'khoa-hoc'))?.slug || 'khoa-hoc' }),
                    type: 'products',
                    subMenu: []
                },
                {
                    title: this.tt('Sản phẩm'),
                    slug: this.route('products.index'),
                    type: 'products',
                    subMenu: this.$page.props.data.lotus_categories
                },
                {
                    title: this.tt('Thị trường đầu tư'),
                    slug: this.route('posts'),
                    type: 'posts',
                    subMenu: [],
                },
                {
                    title: this.tt('Chính sách'),
                    slug: this.route('policies.index'),
                    type: 'policies',
                    subMenu: [],
                },
                {
                    title: this.$page.props.locale.current === 'zh' ? '联系我们' : this.tt('Liên hệ'),
                    slug: this.route('contact'),
                    type: 'contact',
                    subMenu: [],
                },
            ],
            hoverBackground: false,
            menuSelected: null,
            subMenuSelected: null,
            isToggleMenu: false,
            activeMobileSubMenus: [],
            vietnamesePageObserver: null,
        }
    },
    methods: {
        handleScroll() {
            this.isScrolled = window.scrollY > 100
        },
        setMenuSelected(item) {
            this.menuSelected = item
        },
        setFirstSubMenu() {
            if (this.menuSelected?.subMenu?.length > 0) {
                this.subMenuSelected = this.menuSelected.subMenu[0]
            }
        },
        setBackgroundHover(type) {
            this.hoverBackground = type === 'enter'
        },
        onToggleMenu() {
            this.isToggleMenu = !this.isToggleMenu
            document.body.classList.toggle('overflow-hidden', this.isToggleMenu)
        },
        toggleMobileSubMenu(index) {
            if (this.activeMobileSubMenus.includes(index)) {
                this.activeMobileSubMenus = this.activeMobileSubMenus.filter(i => i !== index)
            } else {
                this.activeMobileSubMenus.push(index)
            }
        },
        closeMenu() {
            document.body.classList.remove('overflow-hidden', 'menu-is-opened')
            this.isToggleMenu = false
            this.activeMobileSubMenus = []
        },
        switchLang(lang) {
            console.log('switchLang called with:', lang)
            
            let targetUrl
            let googleTarget
            
            if (lang === 'en') {
                targetUrl = '/en'
                googleTarget = 'en'
            } else if (lang === 'zh') {
                targetUrl = '/zh'
                googleTarget = 'zh-CN'
            } else {
                targetUrl = '/'
                googleTarget = 'vi'
                
                // Clear all Google Translate cookies when switching to Vietnamese
                document.cookie.split(";").forEach((c) => {
                    if (c.trim().startsWith('googtrans')) {
                        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                    }
                });
            }

            console.log('Switching to:', targetUrl, 'Google Translate:', googleTarget)
            
            // Set Google Translate cookie before redirect
            const domain = window.location.hostname
            document.cookie = `googtrans=/vi/${googleTarget}; path=/; domain=${domain}`
            document.cookie = `googtrans=/vi/${googleTarget}; path=/`
            
            // Try to trigger Google Translate if selector exists
            const trySetGoogleTranslate = () => {
                const sel = document.querySelector('select.goog-te-combo')
                if (sel) {
                    console.log('Found Google Translate selector, setting value to:', googleTarget)
                    sel.value = googleTarget
                    sel.dispatchEvent(new Event('change'))
                    return true
                }
                return false
            }
            
            // Try immediately
            if (trySetGoogleTranslate()) {
                // If selector found, wait a bit then redirect
                console.log('Selector found, waiting 300ms before redirect')
                setTimeout(() => {
                    window.location.href = targetUrl
                }, 300)
            } else {
                // If selector not found, try a few times then redirect anyway
                console.log('Selector not found, trying with retries...')
                let attempts = 0
                const retryInterval = setInterval(() => {
                    attempts++
                    if (trySetGoogleTranslate()) {
                        console.log('Selector found on attempt', attempts)
                        clearInterval(retryInterval)
                        setTimeout(() => {
                            window.location.href = targetUrl
                        }, 300)
                    } else if (attempts >= 5) {
                        console.log('Selector not found after 5 attempts, redirecting anyway')
                        clearInterval(retryInterval)
                        window.location.href = targetUrl
                    }
                }, 100)
            }
            
            this.isToggleMenu = false
        },
        nukeBanner() {
            const killOnce = () => {
                document.querySelectorAll('iframe.goog-te-banner-frame').forEach((el) => {
                    el.style.setProperty('display', 'none', 'important')
                    try {
                        el.parentNode?.removeChild(el)
                    } catch { }
                })

                const tt = document.getElementById('goog-gt-tt')
                if (tt) tt.style.setProperty('display', 'none', 'important')

                document
                    .querySelectorAll('.goog-te-balloon-frame, .goog-te-menu-frame')
                    .forEach((el) => el.style.setProperty('display', 'none', 'important'))

                this.ensureBodyTop()
            }

            killOnce()
            let count = 0
            const itv = setInterval(() => {
                killOnce()
                count++
                if (count > 40) clearInterval(itv)
            }, 100)
        },
        ensureBodyTop() {
            try {
                document.body.style.setProperty('top', '0px', 'important')
                document.documentElement.style.setProperty('top', '0px', 'important')
            } catch { }
        },
        protectVietnamesePage() {
            console.log('Setting up Vietnamese page protection')
            
            // Monitor for unwanted translations
            const observer = new MutationObserver(() => {
                const html = document.documentElement
                const htmlLang = html.getAttribute('lang')
                
                // If page is being translated to something other than Vietnamese
                if (htmlLang && htmlLang !== 'vi' && htmlLang !== 'vi-VN') {
                    console.warn('Detected unwanted translation to:', htmlLang, '- Resetting to Vietnamese')
                    
                    // Reset selector
                    const sel = document.querySelector('select.goog-te-combo')
                    if (sel && sel.value !== 'vi') {
                        sel.value = ''
                        sel.dispatchEvent(new Event('change'))
                        
                        setTimeout(() => {
                            sel.value = 'vi'
                            sel.dispatchEvent(new Event('change'))
                        }, 100)
                    }
                    
                    // Remove translated classes
                    html.classList.remove('translated-ltr', 'translated-rtl')
                    html.removeAttribute('lang')
                    document.body.classList.remove('translated-ltr', 'translated-rtl')
                }
            })
            
            // Observe changes to html element
            observer.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ['lang', 'class']
            })
            
            // Store observer for cleanup
            this.vietnamesePageObserver = observer
        },
        injectCssHacks() {
            const css = `
                .goog-te-banner-frame { display: none !important; }
                body { top: 0 !important; }
                #goog-gt-tt, .goog-te-balloon-frame, .goog-te-menu-frame { display: none !important; }
                .goog-text-highlight { background: none !important; box-shadow: none !important; }
                .goog-te-gadget { display: none !important; }
                html { position: static !important; }
            `
            const style = document.createElement('style')
            style.type = 'text/css'
            style.appendChild(document.createTextNode(css))
            document.head.appendChild(style)

            const mo = new MutationObserver(() => {
                const banner = document.querySelector('.goog-te-banner-frame')
                if (banner) {
                    banner.style.setProperty('display', 'none', 'important')
                    try {
                        banner.remove()
                    } catch { }
                }
                this.ensureBodyTop()
            })
            mo.observe(document.documentElement, { childList: true, subtree: true })
        },
    },
    mounted() {
        // Add scroll event listener
        window.addEventListener('scroll', this.handleScroll)

        // Force clear Google Translate for Vietnamese page
        if (this.$page.props.locale.current === 'vi') {
            console.log('Vietnamese page detected, clearing all Google Translate data')
            
            // Clear all Google Translate cookies (multiple formats)
            const cookiesToClear = ['googtrans', 'googtrans=/auto/vi', 'googtrans=/auto/en', 'googtrans=/auto/zh-CN', 'googtrans=/vi/en', 'googtrans=/vi/zh-CN']
            cookiesToClear.forEach(cookieName => {
                // Clear for current domain
                document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
                document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`
                document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname}`
            })
            
            // Also clear by pattern
            document.cookie.split(";").forEach((c) => {
                const cookieName = c.trim().split('=')[0]
                if (cookieName.includes('googtrans') || cookieName.includes('google')) {
                    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
                    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`
                    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname}`
                }
            })
            
            // Clear localStorage
            try {
                Object.keys(localStorage).forEach(key => {
                    if (key.includes('google') || key.includes('translate')) {
                        localStorage.removeItem(key)
                    }
                })
            } catch (e) {
                // no-op
            }
            
            // Clear sessionStorage
            try {
                Object.keys(sessionStorage).forEach(key => {
                    if (key.includes('google') || key.includes('translate')) {
                        sessionStorage.removeItem(key)
                    }
                })
            } catch (e) {
                // no-op
            }
            
            // Remove translated class from html immediately
            const html = document.documentElement
            html.classList.remove('translated-ltr', 'translated-rtl')
            html.removeAttribute('lang')
            
            // Also remove from body
            document.body.classList.remove('translated-ltr', 'translated-rtl')
            
            console.log('All Google Translate data cleared')
        }

        this.injectCssHacks()

        window.googleTranslateElementInit = () => {
            console.log('Google Translate initializing...')
            try {
                // Clear any existing Google Translate widget
                const existingWidget = document.getElementById('google_translate_element')
                if (existingWidget) {
                    existingWidget.innerHTML = ''
                    console.log('Cleared existing Google Translate widget')
                }
                
                new window.google.translate.TranslateElement(
                    {
                        pageLanguage: 'vi',
                        includedLanguages: 'vi,en,zh-CN',
                        autoDisplay: false,
                        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                    },
                    'google_translate_element'
                )
                this.inited = true
                console.log('Google Translate initialized successfully')
                
                // Wait for selector to appear, then apply language
                const applyLanguage = () => {
                    const currentLang = this.$page.props.locale.current
                    const sel = document.querySelector('select.goog-te-combo')
                    console.log('Attempting to set language:', currentLang, 'Selector found:', !!sel)
                    
                    if (sel) {
                        let targetLang = 'vi'
                        if (currentLang === 'en') {
                            targetLang = 'en'
                        } else if (currentLang === 'zh') {
                            targetLang = 'zh-CN'
                        }
                        
                        console.log('Current selector value:', sel.value, 'Target:', targetLang)
                        
                        // Force set to target language regardless of current value
                        if (currentLang === 'vi') {
                            // For Vietnamese, always force reset
                            console.log('Forcing reset to Vietnamese')
                            sel.value = ''
                            sel.dispatchEvent(new Event('change'))
                            
                            setTimeout(() => {
                                sel.value = 'vi'
                                sel.dispatchEvent(new Event('change'))
                            }, 100)
                            
                            return true
                        } else if (sel.value !== targetLang) {
                            console.log('Changing from', sel.value, 'to', targetLang)
                            sel.value = targetLang
                            sel.dispatchEvent(new Event('change'))
                            return true
                        } else {
                            console.log('Already at correct language:', targetLang)
                            return true
                        }
                    }
                    return false
                }
                
                // Wait for selector to appear, then apply language
                let attempts = 0
                const waitForSelector = setInterval(() => {
                    attempts++
                    console.log('Waiting for Google Translate selector, attempt:', attempts)
                    
                    if (applyLanguage()) {
                        console.log('Language applied successfully')
                        clearInterval(waitForSelector)
                        
                        // For Vietnamese page, add extra protection
                        if (this.$page.props.locale.current === 'vi') {
                            this.protectVietnamesePage()
                        }
                    } else if (attempts > 30) {
                        console.error('Google Translate selector not found after 30 attempts (3 seconds)')
                        clearInterval(waitForSelector)
                    }
                }, 100)
            } catch (e) {
                console.error('Google Translate initialization error:', e)
            }
        }

        if (!document.getElementById('google-translate-script')) {
            console.log('Loading Google Translate script...')
            const s = document.createElement('script')
            s.id = 'google-translate-script'
            s.type = 'text/javascript'
            s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
            s.onerror = () => {
                console.error('Failed to load Google Translate script')
            }
            s.onload = () => {
                console.log('Google Translate script loaded successfully')
            }
            document.head.appendChild(s)
        } else {
            console.log('Google Translate script already exists, reinitializing...')
            // Force reinitialize
            if (typeof window.google !== 'undefined' && window.google.translate) {
                console.log('Google Translate API available, calling init')
                if (typeof window.googleTranslateElementInit === 'function') {
                    window.googleTranslateElementInit()
                }
            } else {
                console.log('Google Translate API not available yet, waiting...')
                // Wait for it to be available
                let attempts = 0
                const checkInterval = setInterval(() => {
                    attempts++
                    if (typeof window.google !== 'undefined' && window.google.translate) {
                        console.log('Google Translate API now available')
                        clearInterval(checkInterval)
                        if (typeof window.googleTranslateElementInit === 'function') {
                            window.googleTranslateElementInit()
                        }
                    } else if (attempts > 50) {
                        console.error('Google Translate API not available after 5 seconds')
                        clearInterval(checkInterval)
                    }
                }, 100)
            }
        }
    },
    beforeUnmount() {
        // Remove scroll event listener
        window.removeEventListener('scroll', this.handleScroll)
        
        // Disconnect Vietnamese page observer
        if (this.vietnamesePageObserver) {
            this.vietnamesePageObserver.disconnect()
        }
    },
}
</script>

<style lang="scss">
body {
    --header-height-sm: 65px;
    --header-height-md: 98px;
    --header-height-lg: 98px;
    --header-height-xl: 98px;
}
</style>

<style lang="scss" scoped>
.menu {
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    transition: max-height 0.4s ease-in-out, opacity 0.4s ease-in-out;
}

.group:hover .menu {
    max-height: 90vh;
    opacity: 1;
}
</style>
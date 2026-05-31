import LayoutGuest from '@/Layouts/Guest.vue'
import { createInertiaApp, Head, Link } from '@inertiajs/inertia-vue3'
import createServer from '@inertiajs/server'
import messages from '@intlify/unplugin-vue-i18n/messages'
import { renderToString } from '@vue/server-renderer'
import { createPinia } from 'pinia'
import { createSSRApp, h } from 'vue'
import { createI18n } from 'vue-i18n'
import route from 'ziggy-js'
import { Ziggy } from '../../../public/build/ziggy.frontend.js'

const appName = import.meta.env.VITE_APP_NAME
const appPort = import.meta.env.VITE_APP_PORT || 13714

createServer(
    (page) =>
        createInertiaApp({
            page,
            render: renderToString,
            title: (title) => `${title} - ${appName}`,
            resolve: (name) => {
                const pages = import.meta.glob('./Pages/**/*.vue')

                let page = pages[`./Pages/${name}.vue`]
                if (typeof page === 'undefined') {
                    return false
                }
                page = typeof page === 'function' ? page() : page

                page.then((module) => {
                    module.default.layout = module.default.layout || LayoutGuest
                })

                return page
            },
            setup({ app, props, plugin }) {
                const i18n = createI18n({
                    locale: props.initialPage.props.locale.current,
                    fallbackLocale: props.initialPage.props.locale.default,
                    legacy: false,
                    globalInjection: true,
                    messages: messages,
                })
                return createSSRApp({
                    render: () => h(app, props),
                })
                    .use(plugin)
                    .use(i18n)
                    .use(createPinia())
                    .component('Link', Link)
                    .component('Head', Head)
                    .mixin({
                        methods: {
                            routeLocaleName(name) {
                                const localeName = props.initialPage.props.locale.current + '.' + name

                                return Ziggy.routes[localeName] ? localeName : name
                            },
                            route(
                                name,
                                params,
                                absolute,
                                config = {
                                    ...Ziggy,
                                    location: new URL(Ziggy.url),
                                }
                            ) {
                                return route(this.routeLocaleName(name), params, absolute, config)
                            },
                            routes() {
                                return Ziggy.routes
                            },
                            tt(text) {
                                return this.$t(text)
                            },
                        },
                    })
            },
        }),
    appPort
)

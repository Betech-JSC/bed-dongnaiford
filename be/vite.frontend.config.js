import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import vue from '@vitejs/plugin-vue'
import laravel from 'laravel-vite-plugin'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
const libraryDir = './node_modules/@toannguyen112/bed-library-essentials'
const rootDir = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/Frontend/js/app.js',
            ssr: 'resources/Frontend/js/ssr.js',
            buildDirectory: 'build/frontend',
            hotFile: 'public/vite.frontend.hot',
            refresh: ['resources/Frontend/**', 'routes/frontend.php'],
        }),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
        Components({
            dirs: ['resources/Frontend/js/Components', resolve(rootDir, `${libraryDir}/src/js/components`)],
            directoryAsNamespace: true,
        }),
        VueI18nPlugin({
            include: resolve(rootDir, './public/build/locales/**'),
            runtimeOnly: false,
        }),
        VitePWA({
            registerType: 'autoUpdate',
            injectRegister: 'auto',
            devOptions: {
                enabled: true,
                type: 'module',
            },
            workbox: {
                globPatterns: ['**/*.{js,css}'],
                navigateFallback: null,
                cleanupOutdatedCaches: false,
            },
        }),
    ],
    ssr: {
        noExternal: ['@inertiajs/server'],
    },
    css: {
        postcss: {
            plugins: [
                require('tailwindcss')({
                    config: './resources/Frontend/tailwind.config.js',
                }),
                require('autoprefixer'),
            ],
        },
    },
    resolve: {
        alias: {
            '@': resolve(rootDir, './resources/Frontend/js'),
            '@core/scss': resolve(rootDir, `${libraryDir}/src/scss`),
            '@core/components': resolve(rootDir, `${libraryDir}/src/js/components`),
            '@core/utils': resolve(rootDir, `${libraryDir}/src/js/utils`),
            '@core': resolve(rootDir, libraryDir),
            '@framework/components': resolve(rootDir, './resources/Frontend/js/Components'),
        },
    },

    server: {
        port: 5174,
    },
})


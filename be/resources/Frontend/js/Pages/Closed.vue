<template>
    <main class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <section class="w-full max-w-3xl rounded-2xl bg-white shadow-lg ring-1 ring-black/5 overflow-hidden"
            role="status" aria-live="polite">
            <div class="px-6 py-8 md:px-10 md:py-12">
                <div class="flex items-center gap-3 mb-6">
                    <!-- Logo placeholder -->
                    <div class="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                            class="h-6 w-6 text-gray-500">
                            <path
                                d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 5a1 1 0 10-2 0v5a1 1 0 00.293.707l3 3a1 1 0 101.414-1.414L13 11.586V7z" />
                        </svg>
                    </div>
                    <h1 class="text-xl md:text-2xl font-semibold text-gray-900">Vietnam Farmer Company Limited</h1>
                </div>

                <h2 class="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Website under maintenance</h2>
            </div>
        </section>
    </main>
</template>

<script>
export default {
    name: 'MaintenancePage',
}
</script>

<!-- Tailwind handled globally. No component-scoped styles needed. -->
<style>
/* Optional: smooth fade for toast */
</style>

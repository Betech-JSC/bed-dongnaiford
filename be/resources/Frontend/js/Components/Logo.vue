<template>
    <div :class="className ?? 'max-w-[250px] lg:max-w-[220px] max-h-[58px]'">
        <Link :href="route('home')">
            <JPicture src="/assets/images/logo.png" alt="logo" class="w-full h-full" />
        </Link>
    </div>
</template>

<script>
export default {
    props: ["className"]
}
</script>

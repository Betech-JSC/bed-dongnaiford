<template>
    <span class="hidden">
        {{ $page.props.route.name }}
    </span>


    <!-- ===== NỘI DUNG ===== -->
    <Link v-if="can('admin.post-categories.index')" :href="route('admin.post-categories.index')"
        :class="{ active: isUrl('admin.post-categories.*') }" class="item">
    <bx:category />
    <span>{{ tt('models.table_list.post-categories') }}</span>
    </Link>
    <Link v-if="can('admin.posts.index')" :href="route('admin.posts.index')" :class="{ active: isUrl('admin.posts.*') }"
        class="item">
    <ph-newspaper-clipping-light />
    <span>{{ tt('models.table_list.posts') }}</span>
    </Link>
    <Link v-if="can('admin.policies.index')" :href="route('admin.policies.index')"
        :class="{ active: isUrl('admin.policies.*') }" class="item">
    <ph:shield-check-light />
    <span>{{ tt('models.table_list.policies') }}</span>
    </Link>
    <Link v-if="can('admin.contacts.index')" :href="route('admin.contacts.index')"
        :class="{ active: isUrl('admin.contacts.*') }" class="item">
    <material-symbols:connect-without-contact />
    <span>{{ tt('models.table_list.contacts') }}</span>
    </Link>

    <Link v-if="can('admin.lotus-banners.index')" :href="route('admin.lotus-banners.index')"
        :class="{ active: isUrl('admin.lotus-banners.*') }" class="item">
    <bi:collection-play />
    <span>Banners</span>
    </Link>

    <Link v-if="can('admin.lotus-categories.index')" :href="route('admin.lotus-categories.index')"
        :class="{ active: isUrl('admin.lotus-categories.*') }" class="item">
    <bx:category />
    <span>Danh mục</span>
    </Link>

    <Link v-if="can('admin.lotus-products.index')" :href="route('admin.lotus-products.index')"
        :class="{ active: isUrl('admin.lotus-products.*') }" class="item">
    <fluent-mdl2:product-list />
    <span>Khóa học</span>
    </Link>

    <Link v-if="can('admin.lotus-reviews.index')" :href="route('admin.lotus-reviews.index')"
        :class="{ active: isUrl('admin.lotus-reviews.*') }" class="item">
    <ph:star-light />
    <span>Đánh giá</span>
    </Link>

    <Link v-if="can('admin.lotus-sponsors.index')" :href="route('admin.lotus-sponsors.index')"
        :class="{ active: isUrl('admin.lotus-sponsors.*') }" class="item">
    <bi:building />
    <span>Nhà tài trợ</span>
    </Link>

    <Link v-if="can('admin.lotus-teams.index')" :href="route('admin.lotus-teams.index')"
        :class="{ active: isUrl('admin.lotus-teams.*') }" class="item">
    <ph:users-three-light />
    <span>Đội ngũ</span>
    </Link>

    <Link v-if="can('admin.lotus-guides.index')" :href="route('admin.lotus-guides.index')"
        :class="{ active: isUrl('admin.lotus-guides.*') }" class="item">
    <ph:book-open-light />
    <span>Hướng dẫn CMS</span>
    </Link>

    <Link v-if="can('admin.lotus-activities.index')" :href="route('admin.lotus-activities.index')"
        :class="{ active: isUrl('admin.lotus-activities.*') }" class="item">
    <ph:image-light />
    <span>Hoạt động</span>
    </Link>

    <Link v-if="can('admin.lotus-awards.index')" :href="route('admin.lotus-awards.index')"
        :class="{ active: isUrl('admin.lotus-awards.*') }" class="item">
    <ph:medal-light />
    <span>Giải thưởng</span>
    </Link>
</template>

<script>
export default {
    data() {
        return {
        }
    },
    computed: {
        newContact() {
            return this.$page.props.data.new_contact_count
        },
        newApply() {
            return this.$page.props.data.new_apply_count
        },
        newOrder() {
            return this.$page.props.data.new_order_count
        },
    },
    methods: {
    },
}
</script>

<style scoped>
.badge {
    @apply px-2 py-1 text-xs font-medium rounded;
}
.badge-success {
    @apply text-green-700 bg-green-200;
}
.badge-danger {
    @apply text-red-600 bg-red-200;
}

</style>

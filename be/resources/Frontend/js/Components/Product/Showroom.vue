<template>
    <div class="">
        <div class="grid grid-cols-2 p-2 gap-x-2">
            <JamFieldSet
                v-model="provinceId"
                :field="{
                    type: 'select_single',
                    placeholder: tt('Chọn tỉnh thành'),
                    rules: [],
                    errors: [],
                    options: cities,
                }"
                size="sm"
                class="fieldset-showroom"
            />
            <JamFieldSet
                v-model="districtId"
                :field="{
                    type: 'select_single',
                    placeholder: tt('Quận huyện'),
                    rules: [],
                    errors: [],
                    options: districts,
                }"
                size="sm"
                class="fieldset-showroom"
                :showFull="true"
            />
        </div>
        <div
            class="md:space-y-[8px] xl:space-y-[16px] py-2 px-3 max-h-[330px] lg:max-h-[316px] xl:max-h-[414px] md:h-full scrollbar-gray style-scroll-bar"
        >
            <ShowroomItem
                v-for="(showroom, index) in showrooms_v2"
                :key="index"
                :showroom="showroom"
                class="border-b md:pt-0 first:pt-0 last:pb-0"
            />
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    props: ["isHomepage"],
    data() {
        return {
            cities: [],
            districts: [],
            provinceId: null,
            districtId: null,
            showrooms: [],
        };
    },
    watch: {
        provinceId() {
            this.districtId = null;
            this.getDistrict();
        },
        districtId(value) {},
    },
    created() {
        this.getCity();
        this.getListShowroom();
    },
    computed: {
        showrooms_v2() {
            if (!this.provinceId) return this.showrooms;
            return this.showrooms
                .filter((o) => o.province_id === this.provinceId)
                .filter((o) => {
                    if (!this.districtId) return true;
                    return o.district_id === this.districtId;
                });
        },
    },

    methods: {
        async getListShowroom() {
            const { data } = await axios.get(this.route("api.agencies.index"));
            this.showrooms = data?.data || [];
        },
        async getCity() {
            const { data } = await axios.get(
                this.route("api.agencies.province")
            );

            this.cities = data.data;
            this.getDistrict();
        },

        async getDistrict() {
            if (!this.provinceId) return;
            const { data } = await axios.get(
                this.route("api.agencies.district", this.provinceId)
            );
            this.districts = data.data;
        },
    },
};
</script>

<style lang="scss" scoped>
::placeholder {
    @apply text-gray-500;
}
::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 4px;
    display: block;
}

::-webkit-scrollbar-track {
    background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
    @apply bg-gray-300;
}
::-webkit-scrollbar-track {
    background: #f1f1f1;
}
.scrollbar-gray {
    overflow-y: scroll;

    -webkit-overflow-scrolling: touch;
}
</style>

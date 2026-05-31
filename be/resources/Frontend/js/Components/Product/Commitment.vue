<template lang="">
    <div class="border border-gray-300 rounded-lg">
        <div class="px-3 pt-2 pb-1 font-medium text-gray-700 body-custom">
            Nhà thuốc Phương Chính cam kết
        </div>

        <div class="space-y-[16px] py-2 px-3">
            <div
                v-for="(commit, index) in commits"
                :key="index"
                class="flex items-center space-x-3"
            >
                <div class="w-[36px] h-[36px] flex-shrink-0">
                    <JamPicture
                        :alt="commit.title"
                        :src="commit.image_url"
                        class="picture-cover"
                    />
                </div>
                <div class="text-gray-700 caption-custom hover:text-green-400">
                    {{ commit.title }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            commits: [
                {
                    title: "Thuốc chính hãng - Tặng 10 triệu nếu phát hiện hàng giả",
                    image_url: "/assets/images/product/medicine.png",
                },
                {
                    title: "Giao hàng toàn quốc, kiểm tra hàng - trả tiền",
                    image_url: "/assets/images/product/truck.png",
                },
                {
                    title: "Đổi trả hàng giữ nguyên giá trong 30 ngày",
                    image_url: "/assets/images/product/forward.png",
                },
                {
                    title: "Tích điểm đơn hàng, trừ tiền vào đơn hàng sau",
                    image_url: "/assets/images/product/star.png",
                },
            ],
        };
    },
};
</script>

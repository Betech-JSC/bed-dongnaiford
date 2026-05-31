<template>
    <div class="flex flex-col min-h-screen pt-16 pb-12 bg-white">
        <main class="flex flex-col justify-center flex-grow w-full px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <JPageError
                :title="tt('KHÔNG TÌM THẤY TRANG')"
                :description="
                    tt(
                        'Địa chỉ truy cập không tồn tại hoặc đã bị xóa. Trong trường hợp khẩn cấp, Quý khách vui lòng liên hệ hotline '
                    )
                "
                phone="+84 283 8722 846"
                :link="route('home')"
            >
            </JPageError>
        </main>
    </div>
</template>

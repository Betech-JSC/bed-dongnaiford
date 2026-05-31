<template>
    <div v-if="!isClosedManually" class="fixed bottom-4 left-2 md:bottom-6 md:left-6 z-[9999] max-w-[96vw] md:max-w-[416px] w-full">
        <div ref="wrap" class="relative overflow-hidden rounded-[12px] w-full h-[114px]"></div>
    </div>
</template>

<script>
export default {
    name: 'CourseRegistrationNotification',
    data() {
        return {
            currentIndex: 0,
            isClosedManually: false,
            notifications: [
                { user: 'Minh Anh', course: 'FT-17: Hệ thống giao dịch lọc cộng hướng đa chỉ báo', image: '/assets/images/demo/image-course-1.jpg' },
                { user: 'Hoàng Nam', course: 'GTV Nghệ thuật giao dịch ngắn hạn', image: '/assets/images/demo/image-course-3.jpg' },
                { user: 'Thu Thủy', course: 'Phân tích cơ bản chuyên sâu', image: '/assets/images/demo/image-course-2.jpg' },
                { user: 'Quốc Bảo', course: 'FT-17: Hệ thống giao dịch lọc cộng hướng đa chỉ báo', image: '/assets/images/demo/image-course-1.jpg' },
                { user: 'Hồng Hạnh', course: 'FT-17: Hệ thống giao dịch lọc cộng hướng đa chỉ báo', image: '/assets/images/demo/image-course-1.jpg' },
                { user: 'Minh Đức', course: 'GTV Nghệ thuật giao dịch ngắn hạn', image: '/assets/images/demo/image-course-3.jpg' },
                { user: 'Thanh Vân', course: 'FT-17: Hệ thống giao dịch lọc cộng hướng đa chỉ báo', image: '/assets/images/demo/image-course-1.jpg' },
                { user: 'Anh Tuấn', course: 'Phân tích cơ bản chuyên sâu', image: '/assets/images/demo/image-course-2.jpg' },
                { user: 'Thảo Vy', course: 'FT-17: Hệ thống giao dịch lọc cộng hướng đa chỉ báo', image: '/assets/images/demo/image-course-1.jpg' },
                { user: 'Gia Thành', course: 'GTV Nghệ thuật giao dịch ngắn hạn', image: '/assets/images/demo/image-course-3.jpg' }
            ],
            timer: null
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.showNext()
        })
    },
    beforeUnmount() {
        if (this.timer) clearInterval(this.timer)
    },
    methods: {
        makeCard(data) {
            const el = document.createElement('div')
            el.style.cssText = `
                position: absolute; inset: 0;
                display: flex; align-items: start; gap: 6px;
                padding: 12px;
                background: rgba(255,255,255,0.95);
                backdrop-filter: blur(12px);
                border: 1px solid rgba(255,255,255,0.4);
                border-radius: 16px;
                box-shadow: 0 20px 50px rgba(0,0,0,0.15);
                box-sizing: border-box;
            `
            el.innerHTML = `
                <div style="position:relative;flex-shrink:0;width:90px;height:90px;border-radius:8px;overflow:hidden;background:#f9fafb;">
                    <img src="${data.image}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='/cover.jpg'"/>
                    <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.2),transparent);"></div>
                </div>
                <div style="flex:1;min-width:0;">
                    <div style="font-style: normal;font-weight: 500;font-size: 14px;line-height: 140%;letter-spacing: 0.02em;">
                        <span style="color: #1C1917;">${data.user}</span>
                        <span style="color: #79716B;"> đã đăng ký khóa học</span>
                    </div>
                    <div style="font-style: normal;font-weight: 500;font-size: 14px;line-height: 140%;letter-spacing: 0.02em;color: #1C1917;margin-top: 4px; margin-bottom: 8px;">${data.course}</div>
                    <div style="font-style: normal;font-weight: 400;font-size: 12px;line-height: 150%;color: #79716B;">1 phút</div>
                </div>
                <button class="close-btn" style="width:24px;height:24px;border-radius:4px;background:#F5F5F4;display:flex;align-items:center;justify-content:center;">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.785669 14L0 13.2143L6.21433 7L0 0.785669L0.785669 0L7 6.21433L13.2143 0L14 0.785669L7.78567 7L14 13.2143L13.2143 14L7 7.78567L0.785669 14Z" fill="#1C1917"/>
                    </svg>
                </button>
            `
            el.querySelector('.close-btn').addEventListener('click', () => this.closeNotification())
            return el
        },

        showNext() {
            const wrap = this.$refs.wrap
            if (!wrap) return

            const data = this.notifications[this.currentIndex]
            const incoming = this.makeCard(data)

            incoming.style.transform = 'translateY(100%)'
            incoming.style.opacity = '0'
            incoming.style.transition = 'none'
            wrap.appendChild(incoming)

            const outgoing = wrap.children.length > 1 ? wrap.children[0] : null

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    incoming.style.transition = 'transform 0.5s cubic-bezier(0.34,1.2,0.64,1), opacity 0.4s ease'
                    incoming.style.transform = 'translateY(0)'
                    incoming.style.opacity = '1'

                    if (outgoing) {
                        outgoing.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease'
                        outgoing.style.transform = 'translateY(-100%)'
                        outgoing.style.opacity = '0'
                        setTimeout(() => outgoing.remove(), 520)
                    }
                })
            })

            this.currentIndex = (this.currentIndex + 1) % this.notifications.length
            this.timer = setTimeout(() => this.showNext(), 5000)
        },

        closeNotification() {
            this.isClosedManually = true
            if (this.timer) clearTimeout(this.timer)
        }
    }
}
</script>

<style scoped>
@keyframes ping {
    75%, 100% { transform: scale(2); opacity: 0; }
}
</style>

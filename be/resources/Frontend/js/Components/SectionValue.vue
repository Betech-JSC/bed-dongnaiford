<template>
  <section v-observe-visibility="{ callback: visibilityChanged, threshold: 0.3, throttle: 0, once: true }">
    <div class="container">
      <div class="grid grid-cols-2 lg:grid-cols-4">
        <AnimatedAppear v-for="(item, index) in values" :key="index" class="relative px-1 md:px-6 py-4 md:py-7 group" :delay="index * 100">
          <div class="absolute inset-0 w-full h-full bg-linear opacity-0 lg:group-hover:opacity-100 transition-opacity ease-in-out duration-300"></div>
          <div class="relative flex flex-col space-y-1.5 text-center">
            <div class="flex items-center justify-center gap-1 display-3 max-md:text-[26px] font-bold text-gray-900">
              <div v-if="item.symbolHead" :class="{ 'notranslate': $page.props.locale.current === 'zh' }">{{ item.symbolHead }}</div>
              <div :class="{ 'notranslate': $page.props.locale.current === 'zh' }">{{ displayNumbers[index] }}</div>
              <div v-if="item.symbolTail" :class="{ 'notranslate': $page.props.locale.current === 'zh' }">{{ item.symbolTail }}</div>
            </div>
            <div class="text-center title-2 max-md:text-[14px] md:px-4" :class="{ 'notranslate': $page.props.locale.current === 'zh' }">{{ item.title }}</div>
          </div>
        </AnimatedAppear>
      </div>
    </div>
  </section>
</template>

<script>
import AnimatedAppear from './AnimatedAppear.vue';

export default {
  components: { AnimatedAppear },
  props: ['values'],

  data() {
    return {
      displayNumbers: [],
      hasAnimated: false,
    }
  },

  created() {
    this.displayNumbers = this.values.map(() => 0)
  },

  methods: {
    visibilityChanged(isVisible) {
      if (isVisible && !this.hasAnimated) {
        this.hasAnimated = true;
        this.runCounters();
      }
    },

    runCounters() {
      const duration = 2500; // Increased duration for a smoother visual rollout

      this.values.forEach((item, index) => {
        const target = parseFloat(item.number)
        if (isNaN(target)) {
          this.displayNumbers[index] = item.number
          return
        }

        // Delay the counting so it runs perfectly while the item is fading in
        const delay = index * 100 + 400;

        setTimeout(() => {
          const start = performance.now()

          const tick = (now) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3)

            this.displayNumbers[index] = Math.round(target * ease)

            if (progress < 1) {
              requestAnimationFrame(tick)
            }
          }

          requestAnimationFrame(tick)
        }, delay)
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.bg-linear {
  background: linear-gradient(114.93deg, #FFF1C7 0%, rgba(255, 195, 16, 0.8) 100%);
}
</style>

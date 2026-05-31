<template>
  <main>
    <section class="pt-[112px]">
      <div class="container">
        <div class="grid grid-cols-12 md:gap-6 gap-4 xl:gap-8">
          <div class="col-span-full">
            <div class="xl:space-y-4 md:space-y-3 space-y-2">
              <JamBreadcrumb :items="breadcrumbs" />
              <h1 class="headline-3 font-bold text-brand-100 uppercase">
                {{ job.title }}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="md:py-16 py-12 xl:py-20">
      <div class="container">
        <div class="grid grid-cols-12 md:gap-6 gap-4 xl:gap-8">
          <div class="lg:col-span-8 col-span-full">
            <div class="prose prose-blog notranslate" v-html="job.content" translate="no">
            </div>
          </div>
          <div class="lg:col-span-4 col-span-full">
            <div class="bg-brand-300 rounded-[16px] p-6 sticky top-24">
              <div class="space-y-4">
                <div class="flex items-center gap-1">
                  <span class="body-1 font-semibold text-primary">Working Type:</span>
                  <span>
                    <div class="body-2">{{ job.working_position }}</div>
                  </span>
                </div>
                <div class="flex items-center gap-1">
                  <span class="body-1 font-semibold text-primary">Working Location:</span>
                  <span>
                    <div class="body-2">{{ job.work_address }}</div>
                  </span>
                </div>
                <div class="flex items-center gap-1">
                  <span class="body-1 font-semibold text-primary">Quantity:</span>
                  <span>
                    <div class="body-2">{{ job.quantity }}</div>
                  </span>
                </div>
                <div class="flex items-center gap-1">
                  <span class="body-1 font-semibold text-primary">Posted Date:</span>
                  <span>
                    <div class="body-2">{{ formatDate(job.published_at) }}</div>
                  </span>
                </div>
                <div class="flex items-center gap-1">
                  <span class="body-1 font-semibold text-primary">Application Deadline:</span>
                  <span>
                    <div class="body-2">{{ formatDate(job.expected_time) }}</div>
                  </span>
                </div>
                <SocialShare title="Share this job" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import JamBreadcrumb from '@/Components/Jam/Breadcrumb.vue'
export default {
  components: { JamBreadcrumb },
  props: ['job', 'breadcrumbs'],
  data() {
    return {
      breadcrumbs: [
        {
          title: 'Careers',
          link: this.route('jobs'),
        },
        {
          title: this.job?.title,
        },
      ],
      posts: {
        data: [
          {
            image: {
              url: '/assets/images/posts/banner.jpg',
              alt: 'image demo',
            },
            title: 'VietNam Farmer Expands Export to Japan',
            slug: 'demo',
            description:
              'We are proud to announce our first shipment of Cavendish bananas to Japan, a market known for its strict quality standards. This milestone reflects our commitment to global growth and premium quality.',
          },
          {
            image: {
              url: '/assets/images/posts/banner.jpg',
              alt: 'image demo',
            },
            title: 'VietNam Farmer Expands Export to Japan',
            slug: 'demo',
            description:
              'We are proud to announce our first shipment of Cavendish bananas to Japan, a market known for its strict quality standards. This milestone reflects our commitment to global growth and premium quality.',
          },
          {
            image: {
              url: '/assets/images/posts/banner.jpg',
              alt: 'image demo',
            },
            title: 'VietNam Farmer Expands Export to Japan',
            slug: 'demo',
            description:
              'We are proud to announce our first shipment of Cavendish bananas to Japan, a market known for its strict quality standards. This milestone reflects our commitment to global growth and premium quality.',
          },
          {
            image: {
              url: '/assets/images/posts/banner.jpg',
              alt: 'image demo',
            },
            title: 'VietNam Farmer Expands Export to Japan',
            slug: 'demo',
            description:
              'We are proud to announce our first shipment of Cavendish bananas to Japan, a market known for its strict quality standards. This milestone reflects our commitment to global growth and premium quality.',
          },
          {
            image: {
              url: '/assets/images/posts/banner.jpg',
              alt: 'image demo',
            },
            title: 'VietNam Farmer Expands Export to Japan',
            slug: 'demo',
            description:
              'We are proud to announce our first shipment of Cavendish bananas to Japan, a market known for its strict quality standards. This milestone reflects our commitment to global growth and premium quality.',
          },
          {
            image: {
              url: '/assets/images/posts/banner.jpg',
              alt: 'image demo',
            },
            title: 'VietNam Farmer Expands Export to Japan',
            slug: 'demo',
            description:
              'We are proud to announce our first shipment of Cavendish bananas to Japan, a market known for its strict quality standards. This milestone reflects our commitment to global growth and premium quality.',
          },
          {
            image: {
              url: '/assets/images/posts/banner.jpg',
              alt: 'image demo',
            },
            title: 'VietNam Farmer Expands Export to Japan',
            slug: 'demo',
            description:
              'We are proud to announce our first shipment of Cavendish bananas to Japan, a market known for its strict quality standards. This milestone reflects our commitment to global growth and premium quality.',
          },
          {
            image: {
              url: '/assets/images/posts/banner.jpg',
              alt: 'image demo',
            },
            title: 'VietNam Farmer Expands Export to Japan',
            slug: 'demo',
            description:
              'We are proud to announce our first shipment of Cavendish bananas to Japan, a market known for its strict quality standards. This milestone reflects our commitment to global growth and premium quality.',
          },
        ],
      },
    }
  },
}
</script>

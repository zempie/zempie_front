<template>
  <div class="content">
    <ClientOnly>
      <CommunityHeaderSk v-if="isPending" />
      <CommunityHeader v-else :communityInfo="communityInfo" />
    </ClientOnly>
    <div class="tab-menu-swiper">
      <div class="swiper-area">
        <NuxtLink
          :class="['swiper-slide', !routeQuery ? 'active' : '']"
          :to="localePath(`/community/${communityInfo?.id}`)"
        >
          <p><i class="uil uil-clock-three"></i></p>
          <h2>{{ $t('timeline') }}(ALL)</h2>
        </NuxtLink>

        <NuxtLink
          :class="['swiper-slide', routeQuery === 'image' ? 'active' : '']"
          :to="localePath(`/community/${communityInfo?.id}`) + '?media=image'"
        >
          <p><i class="uil uil-image-edit"></i></p>
          <h2>{{ $t('image') }}</h2>
        </NuxtLink>

        <NuxtLink
          :class="['swiper-slide', routeQuery === 'video' ? 'active' : '']"
          :to="localePath(`/community/${communityInfo?.id}`) + '?media=video'"
        >
          <p><i class="uil uil-play-circle"></i></p>
          <h2>{{ $t('video') }}</h2>
        </NuxtLink>

        <NuxtLink
          :class="['swiper-slide', routeQuery === 'sound' ? 'active' : '']"
          :to="localePath(`/community/${communityInfo?.id}`) + '?media=sound'"
        >
          <p><i class="uil uil-music"></i></p>
          <h2>{{ $t('audio') }}</h2>
        </NuxtLink>
      </div>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useLocalePath } from 'vue-i18n-routing'

const localePath = useLocalePath()
const route = useRoute()

const communityInfo = computed(() => useCommunity().community.value.info)
const communityId = computed(() => route.params.id as string)
const routeQuery = computed(() => route.query.media)
const isPending = ref(true)

onMounted(async () => {
  await useCommunity().setCommunity(communityId.value)
  isPending.value = false
})
</script>

<style lang="scss" scoped>
.tab-menu-swiper {
  .swiper-slide {
    width: 25%;
    display: inline-block;
  }
}

@media all and (max-width: 479px) {
  .swiper-slide {
    h2 {
      display: none;
    }

    &:hover {
      background: #fff;
      p {
        color: #888;
      }
    }
  }
}
@media all and (min-width: 480px) and (max-width: 767px) {
  .tab-menu-swiper {
    width: 100%;
    .swiper-slide {
      &:hover {
        background: #fff;
        p {
          color: #888;
        }
        h2 {
          color: #888;
        }
      }
    }
  }
}

@media all and (min-width: 768px) and (max-width: 991px) {
}

@media all and (min-width: 992px) and (max-width: 1199px) {
}
</style>

<template>
  <div class="content">
    <ClientOnly>
      <CommunityHeaderSk v-if="isPending" />
      <CommunityHeader v-else :communityInfo="communityInfo" />
    </ClientOnly>
    <div class="tab-menu-swiper">
      <div class="swiper-area">
        <NuxtLink :class="['swiper-slide', !routeQuery ? 'active' : '']"
          :to="localePath(`/community/${communityInfo?.id}`)">
          <p><i class="uil uil-clock-three"></i></p>
          <h2>TIMELINE(ALL)</h2>
        </NuxtLink>

        <NuxtLink :class="['swiper-slide', routeQuery === 'sns' ? 'active' : '',]"
          :to="localePath(`/community/${communityInfo?.id}`) + '?media=sns'">
          <p><i class="uil uil-comment-dots"></i></p>
          <h2>SNS</h2>
        </NuxtLink>

        <NuxtLink :class="['swiper-slide', routeQuery === 'blog' ? 'active' : '',]"
          :to="localePath(`/community/${communityInfo?.id}`) + '?media=blog'">
          <p><i class="uil uil-edit"></i></p>
          <h2>BLOG</h2>
        </NuxtLink>

        <NuxtLink :class="['swiper-slide', routeQuery === 'img' ? 'active' : '',]"
          :to="localePath(`/community/${communityInfo?.id}`) + '?media=img'">
          <p><i class="uil uil-image-edit"></i></p>
          <h2>IMAGE</h2>
        </NuxtLink>

        <NuxtLink :class="['swiper-slide', routeQuery === 'video' ? 'active' : '',]"
          :to="localePath(`/community/${communityInfo?.id}`) + '?media=video'">
          <p><i class="uil uil-play-circle"></i></p>
          <h2>VIDEO</h2>
        </NuxtLink>

        <NuxtLink :class="['swiper-slide', routeQuery === 'audio' ? 'active' : '',]"
          :to="localePath(`/community/${communityInfo?.id}`) + '?media=audio'">
          <p><i class="uil uil-music"></i></p>
          <h2>AUDIO</h2>
        </NuxtLink>
      </div>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useLocalePath } from 'vue-i18n-routing';

const localePath = useLocalePath();
const route = useRoute();

const communityInfo = computed(() => useCommunity().community.value.info)
const communityId = computed(() => route.params.id as string)
const routeQuery = computed(() => route.query.media)
const isPending = ref(true)


onMounted(async () => {
  await useCommunity().setCommunity(communityId.value)
  isPending.value = false;
})



</script>

<style lang="scss" scoped>
.swiper-slide {
  display: inline-block
}
</style>

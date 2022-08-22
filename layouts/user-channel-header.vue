<template>
  <div class="content">
    <ClientOnly>
      <ChannelHeaderSk v-if="isPending" />
      <ChannelHeader v-else :userInfo='userInfo' />
      <div class="tab-menu-swiper">
        <div class="swiper-area">
          <NuxtLink :to="localePath(`/channel/${channelId}`)" :class="[!routeQuery ? 'active' : '', 'swiper-slide']">
            <p><i class="uil uil-clock-three"></i></p>
            <h2>TIMELINE(ALL)</h2>
          </NuxtLink>
          <NuxtLink :to="localePath(`/channel/${channelId}`) + '?media=sns'"
            :class="[routeQuery === 'sns' ? 'active' : '', 'swiper-slide']">
            <p><i class="uil uil-comment-dots"></i></p>
            <h2>SNS</h2>
          </NuxtLink>
          <NuxtLink :to="localePath(`/channel/${channelId}`) + '?media=blog'"
            :class="[routeQuery === 'blog' ? 'active' : '', 'swiper-slide']">
            <p><i class="uil uil-edit"></i></p>
            <h2>BLOG</h2>
          </NuxtLink>
          <NuxtLink :to="localePath(`/channel/${channelId}`) + '?media=img'"
            :class="[routeQuery === 'img' ? 'active' : '', 'swiper-slide']">
            <p><i class="uil uil-image-edit"></i></p>
            <h2>IMAGE</h2>
          </NuxtLink>
          <NuxtLink :to="localePath(`/channel/${channelId}`) + '?media=video'"
            :class="[routeQuery === 'video' ? 'active' : '', 'swiper-slide']">
            <p><i class="uil uil-play-circle"></i></p>
            <h2>VIDEO</h2>
          </NuxtLink>
          <NuxtLink :to="localePath(`/channel/${channelId}`) + '?media=audio'"
            :class="[routeQuery === 'audio' ? 'active' : '', 'swiper-slide']">
            <p><i class="uil uil-music"></i></p>
            <h2>AUDIO</h2>
          </NuxtLink>
          <NuxtLink :to="localePath(`/channel/${channelId}/games`)"
            :class="[$route.name.toString().includes('channel-id-game') ? 'active' : '', 'swiper-slide']">
            <p><i class="uil uil-map-pin-alt"></i></p>
            <h2>GAME</h2>

          </NuxtLink>
        </div>
      </div>
    </ClientOnly>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { IUserChannel } from "~~/types"
import { useLocalePath } from 'vue-i18n-routing';

const localePath = useLocalePath();
const route = useRoute();

const userInfo = ref<IUserChannel>()

const isPending = ref(true)
const channelId = computed(() => route.params.id as string)
const routeQuery = computed(() => route.query.media)

onMounted(async () => {
  await getChannelHeaderInfo()
})


async function getChannelHeaderInfo() {
  const { data, pending } = await user.getUserInfo(channelId.value)

  if (data.value) {
    const { result } = data.value;
    userInfo.value = result.target
    useChannel().setUserChannel(userInfo.value)
  }
  isPending.value = pending.value

}

</script>

<style lang="scss" scoped>
.swiper-slide {
  display: inline-block
}
</style>

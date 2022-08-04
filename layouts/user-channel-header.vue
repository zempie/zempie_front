<template>
  <div class="content">
    <ClientOnly>
      <ChannelHeaderSk v-if="isPending" />
      <ChannelHeader v-else :userInfo='userInfo' />
      <div class="tab-menu-swiper">
        <div class="swiper-area">
          <div class="swiper-slide ">
            <p><i class="uil uil-clock-three"></i></p>
            <h2>TIMELINE(ALL)</h2>
          </div>
          <div class="swiper-slide active">
            <p><i class="uil uil-comment-dots"></i></p>
            <h2>SNS</h2>
          </div>
          <div class="swiper-slide ">
            <p><i class="uil uil-edit"></i></p>
            <h2>BLOG</h2>
          </div>
          <div class="swiper-slide ">
            <p><i class="uil uil-image-edit"></i></p>
            <h2>IMAGE</h2>
          </div>
          <div class="swiper-slide ">
            <p><i class="uil uil-play-circle"></i></p>
            <h2>VIDEO</h2>
          </div>
          <div class="swiper-slide ">
            <p><i class="uil uil-music"></i></p>
            <h2>AUDIO</h2>
          </div>
          <div class="swiper-slide ">
            <p><i class="uil uil-map-pin-alt"></i></p>
            <h2>GAME</h2>
          </div>
          <!-- <div class="swiper-button-prev" slot="button-prev"></div>
        <div class="swiper-button-next" slot="button-next"></div> -->
        </div>
      </div>
    </ClientOnly>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { IUser } from "~~/types"
const route = useRoute();

const userInfo = ref({} as IUser)

const isPending = ref(true)
const channelId = computed(() => route.params.id as string)

onMounted(async () => {
  await getChannelHeaderInfo()
})


async function getChannelHeaderInfo() {
  const { data, pending } = await user.getUserInfo(channelId.value)
  isPending.value = pending.value
  const { result } = data.value;
  userInfo.value = result.target

}

</script>

<style lang="scss" scoped>
.swiper-slide {
  display: inline-block
}
</style>

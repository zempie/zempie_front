<template>
  <div class="content" style="padding-top:65px">
    <ClientOnly>
      <ChannelHeaderSk v-if="isPending" />
      <ChannelHeader v-else :userInfo='userInfo' v-if="!isMine" />
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


const isMine = computed(() => {
  return channelId.value === useUser().user.value.info?.channel_id
})

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

.tab-menu-swiper .swiper-area .swiper-slide {

  width: 14%;
}
</style>

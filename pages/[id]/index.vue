<template>
  <div>
    <NuxtLayout name="channel-header">
      <dl class="three-area">
        <dt :key="channelInfo.nickname">
          <ChannelInfoBox :key="channelInfo.channel_id" />
          <ChannelGameBox :key="channelInfo.channel_id" :isLoading="isLoading" />
        </dt>
        <dd>
          <PostTimeline type="user" :isMine="isMine" :key="userId" />
        </dd>
        <dt>
          <div class="ta-groups" style="margin-top: 0px">
            <h2>{{ $t('community') }}</h2>
            <CommunityList :communities="communityList" :isLoading="isLoading" />
          </div>
        </dt>
      </dl>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { onBeforeRouteLeave } from 'vue-router';

const route = useRoute()

const userChannel = computed(() => useChannel().userChannel.value)
const isLoading = computed(() => userChannel.value.isLoading)
const channelInfo = computed(() => userChannel.value.info)
const userId = computed(() => route.params.id as string)
const communityList = computed(() => channelInfo.value.communities)

const isMine = computed(() => {
  return userId.value === useUser().user.value.info?.nickname
})


definePageMeta({
  title: 'user-channel',
  name: 'userChannel',
})



onBeforeRouteLeave((to, from, next) => {
  useChannel().resetUserChannel()
  next()
})
</script>

<style lang="scss" scoped>
.swiper-slide {
  display: inline-block;
}


@media all and (max-width: 479px) {}

@media all and (min-width: 480px) and (max-width: 767px) {



  .area-title,
  .card-game {
    width: 100%;
  }
}

@media all and (min-width: 768px) and (max-width: 991px) {}

@media all and (min-width: 992px) and (max-width: 1199px) {}

@media all and (min-width: 1200px) {}
</style>

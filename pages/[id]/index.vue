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


/*
 page 단위에서 isPopState 검사 후 true라면 false로 변경
 이후 component에서 watch로 받아 팝업닫기
*/
onBeforeRouteLeave((to, from, next) => {
  if (useCommon().common.value.isPopState) {
    next(false)
    useCommon().setPopState(false)
  } else {
    next()
  }
  useChannel().resetUserChannel()
})
</script>

<style lang="scss" scoped>
.swiper-slide {
  display: inline-block;
}

@media all and (min-width: 480px) and (max-width: 767px) {



  .area-title,
  .card-game {
    width: 100%;
  }
}
</style>

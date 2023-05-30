<template>
  <div>
    <NuxtLayout name="channel-header">
      <dl class="three-area">
        <dt :key="channelInfo.id">
          <ChannelInfoBox :isLoading="isLoading" />
          <ChannelGameBox />
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

onBeforeUnmount(() => {
  useChannel().resetUserChannel()
  console.log('unmount', useChannel().userChannel.value.info)
})



</script>

<style lang="scss" scoped>
.swiper-slide {
  display: inline-block;
}

.ta-game-list {
  display: block;
  width: 100%;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0px 10px 50px rgba(0, 0, 0, 0.1);
}

@media all and (max-width: 479px) {

  .ta-game-list {
    display: none;
  }
}

@media all and (min-width: 480px) and (max-width: 767px) {

  .ta-game-list {
    display: none;
  }

  .area-title,
  .card-game {
    width: 100%;
  }
}

@media all and (min-width: 768px) and (max-width: 991px) {
  .ta-game-list {
    display: none;
  }
}

@media all and (min-width: 992px) and (max-width: 1199px) {}

@media all and (min-width: 1200px) {}
</style>

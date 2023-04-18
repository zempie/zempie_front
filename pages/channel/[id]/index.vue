<template>
  <div>
    <NuxtLayout name="channel-header">
      <dl class="three-area">
        <dt :key="channelInfo.id">
          <ChannelInfoBox :isLoading="isLoading" />
          <ChannelGameBox />
        </dt>
        <dd>
          <PostTimeline type="user" :isMine="isMine" :key="channelId" />
        </dd>
        <dt>
          <div class="ta-groups" style="margin-top: 0px">
            <h2>Community</h2>
            <CommunityList :communities="communityList" :isLoading="isLoading" />
          </div>
        </dt>
      </dl>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const isLoading = computed(() => useChannel().userChannel.value.isLoading)
const channelInfo = computed(() => useChannel().userChannel.value.info)
const channelId = computed(() => route.params.id as string)
const communityList = computed(() => channelInfo.value.communities)

const isMine = computed(() => {
  return channelId.value === useUser().user.value.info?.channel_id
})


definePageMeta({
  title: 'user-channel',
  name: 'userChannel',
})

</script>

<style lang="scss" scoped>
.ta-myinfo {
  margin-bottom: 20px;
}

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
  .ta-myinfo {
    margin-bottom: 0px;
  }

  .ta-game-list {
    display: none;
  }
}

@media all and (min-width: 480px) and (max-width: 767px) {
  .ta-myinfo {
    margin-bottom: 0px;
  }

  .ta-game-list {
    display: none;
  }

  .area-title,
  .card-game {
    width: 100%;
  }
}

@media all and (min-width: 768px) and (max-width: 991px) {
  .ta-myinfo {
    margin-bottom: 0px;
  }

  .ta-game-list {
    display: none;
  }
}

@media all and (min-width: 992px) and (max-width: 1199px) {}

@media all and (min-width: 1200px) {}
</style>

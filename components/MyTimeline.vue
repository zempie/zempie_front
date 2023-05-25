<template>
  <NuxtLayout name="my-timeline">
    <dl class="three-area">
      <dt>
        <ChannelInfoBox :key="channelInfo.channel_id" />
        <ChannelGameBox :key="channelInfo.channel_id" />
      </dt>
      <dd>
        <PostTimeline type="userAll" :isMine="true" />
      </dd>
      <dt>
        <div class="ta-groups" style="margin-top: 0px">
          <h2>Community</h2>
          <CommunityList :communities="channelInfo?.communities" :isLoading="isChannelLoading" />
        </div>
      </dt>
    </dl>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { isObjEmpty } from '~~/scripts/utils';

const { $localePath } = useNuxtApp()
const config = useRuntimeConfig()
const { t, locale } = useI18n()
const route = useRoute()

const isPending = ref(true)
const games = ref()

const userInfo = computed(() => useUser().user.value.info)
const channelInfo = computed(() => useChannel().userChannel.value.info)
const isChannelLoading = computed(
  () => useChannel().userChannel.value.isLoading
)

watch(
  () => userInfo.value,
  async (info) => {
    if (info?.id) {
      await useChannel().getChannelInfo(info.channel_id)
      games.value = info.games
    }
  }
)

onMounted(async () => {
  // if (!useCookie(config.COOKIE_NAME).value) navigateTo('/')
  await useChannel().getChannelInfo(userInfo.value.nickname)
  games.value = channelInfo.value?.games
  isPending.value = false
})
</script>

<style lang="scss" scoped>
.ta-myinfo {
  margin-bottom: 20px;
}

.swiper-slide {
  display: inline-block;
}

.no-game {
  height: 60px;
  padding: 20px 20px 0 20px;

  li {
    margin-top: 0px;
  }
}

.ta-game-list {
  display: block;
  width: 100%;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0px 10px 50px rgba(0, 0, 0, 0.1);
}

@media all and (max-width: 479px) {
  // .ta-myinfo {
  //   margin-bottom: 0px;
  // }

  .ta-game-list {
    display: none;
  }
}

@media all and (min-width: 480px) and (max-width: 767px) {
  // .ta-myinfo {
  //   margin-bottom: 0px;
  // }

  .ta-game-list {
    display: none;
  }

  .area-title,
  .card-game {
    width: 100%;
  }
}

@media all and (min-width: 768px) and (max-width: 991px) {
  // .ta-myinfo {
  //   margin-bottom: 0px;
  // }

  .ta-game-list {
    display: none;
  }
}

@media all and (min-width: 992px) and (max-width: 1199px) {}

@media all and (min-width: 1200px) {}
</style>

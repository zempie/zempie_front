<template>
  <NuxtLayout name="my-timeline">
    <dl class="three-area">
      <dt>
        <div class="my-info">
          <ChannelInfoBox :key="channelInfo.channel_id" />
          <ChannelGameBox :key="channelInfo.channel_id" :isLoading="isChannelLoading" />
        </div>
      </dt>
      <dd>
        <PostTimeline type="userAll" :isMine="true" />
      </dd>
      <dt>

        <div class="ta-groups" style="margin-top: 0px">
          <h2>{{ $t('community') }}</h2>
          <CommunityList :communities="channelInfo?.communities" :isLoading="isChannelLoading" />
        </div>
      </dt>
    </dl>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

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

definePageMeta({
  layout: 'header-only',
})

watch(
  () => userInfo.value,
  async (info) => {
    if (info && info.id) {
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


@media all and (max-width: 479px) {
  .my-info {
    display: none;
  }

  :deep(.ta-message-send) {
    margin-top: 70px !important;
  }
}

@media all and (min-width: 480px) and (max-width: 767px) {
  .my-info {
    display: none;
  }

  .area-title,
  .card-game {
    width: 100%;
  }
}

@media all and (min-width: 768px) and (max-width: 991px) {
  .my-info {
    display: none;
  }
}
</style>

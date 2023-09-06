<template>
  <NuxtLayout name="my-timeline">
    <dl class="my-tl-container three-area">
      isPopState{{ isPopState }}

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
const isChannelLoading = computed(() => useChannel().userChannel.value.isLoading)
const isPopState = computed(() => useCommon().common.value.isPopState)


watch(
  () => userInfo.value,
  async (info) => {
    if (info && info.id) {
      await useChannel().getChannelInfo(info.channel_id)
      games.value = info.games
    }
  }
)


watch(
  () => isPopState.value,
  async (state) => {
    console.log('pop', state)
  }
)
onMounted(async () => {
  await useChannel().getChannelInfo(userInfo.value.nickname)
  games.value = channelInfo.value?.games
  isPending.value = false
})

</script>

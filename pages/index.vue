<template>
  <div>
    <ClientOnly>
      <div v-if="useUser().user.value.isLoading" class="content"></div>
      <div v-if="hasUserCookie" :key="useUser().user.value.info">
        <MyTimeline />
      </div>
      <div v-else>
        <MainGuest />
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts" >
import shared from '~~/scripts/shared';

const config = useRuntimeConfig()
const { t } = useI18n()

const userInfo = computed(() => useUser().user.value.info)
const hasUserCookie = computed(() => {
  return (useCookie(config.COOKIE_NAME).value || useCookie(config.REFRESH_TOKEN).value) ? true : false
})

definePageMeta({
  title: 'main',
  name: 'main',
})

watch(() =>
  userInfo.value,
  (info) => {
    shared.createHeadMeta(`${userInfo.value.name}${t('seo.channel.title')}`, `${userInfo.value.name}${t('seo.channel.desc')}`, userInfo.value.profile_img)
  }
)

onBeforeMount(() => {
  if (!hasUserCookie.value) {
    shared.createHeadMeta(t('seo.landing.title'), t('seo.landing.description'), config.OG_IMG)
  } else {
    if (userInfo.value?.id) {
      shared.createHeadMeta(`${userInfo.value.name}${t('seo.channel.title')}`, `${userInfo.value.name}${t('seo.channel.desc')}`, userInfo.value.profile)
    }
  }
})



</script>

<style scoped lang="scss">

</style>

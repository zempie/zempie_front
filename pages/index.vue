<template>
  <div>
    <ClientOnly>
      <MyTimeline v-if="userInfo" />
      <MainGuest v-else />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts" >
import shared from '~~/scripts/shared'

const config = useRuntimeConfig()
const { t } = useI18n()

const userInfo = computed(() => useUser().user.value.info)


definePageMeta({
  title: 'main',
  name: 'main',
})

shared.createHeadMeta(t('seo.landing.title'), t('seo.landing.description'), config.OG_IMG)


</script>

<style scoped lang="scss"></style>

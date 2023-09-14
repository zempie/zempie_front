<template>
  <NuxtLayout :name="userInfo && 'my-timeline'">
    <ClientOnly>
      <MyTimeline v-if="userInfo" />
      <MainGuest v-else />
    </ClientOnly>
  </NuxtLayout>
</template>

<script setup lang="ts" >
import shared from '~~/scripts/shared'
import { onBeforeRouteLeave } from 'vue-router';

const config = useRuntimeConfig()
const { t } = useI18n()

const userInfo = computed(() => useUser().user.value.info)

useRouter().onError((error) => {
  const messages = [
    "Importing a module script failed",
    "Failed to fetch dynamically imported module",
  ];
  if (messages.some((message) => error?.message.includes(message))) {
    (async () => {
      window.location.reload()
    })();
  }

})


definePageMeta({
  title: 'main',
  name: 'main',
})

shared.createHeadMeta(t('seo.landing.title'), t('seo.landing.description'), config.OG_IMG)


onMounted(() => {
  useRouterLeave()
})

</script>

<style scoped lang="scss"></style>

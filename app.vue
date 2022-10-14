<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup lang="ts">
import { ID_INJECTION_KEY } from 'element-plus'
// import { useLocalePath, useSwitchLocalePath } from 'vue-i18n-routing'

import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()
const config = useRuntimeConfig()
const switchLocalePath = useSwitchLocalePath()
const route = useRoute()
const router = useRouter()

useHead({
  title: `${t('seo.landing.title')} | Zempie`,
  link: [
    {
      rel: 'alternate',
      href: `${config.ZEMPIE_URL}${route.fullPath}`,
      hreflang: locale,
    },
    {
      rel: 'canonical',
      href: `${config.ZEMPIE_URL}${route.fullPath}`,
    },
  ],
  meta: [
    {
      property: 'og:url',
      content: `${config.ZEMPIE_URL}${route.fullPath}`,
    },
    {
      property: 'og:site_name',
      content: 'Zempie',
    },
    {
      name: 'og:type',
      content: 'website',
    },
    {
      name: 'description',
      content: `${t('seo.landing.desc')}`,
    },
    {
      property: 'og:title',
      content: `${t('seo.landing.title')}`,
    },
    {
      property: 'og:description',
      content: `${t('seo.landing.description')}`,
    },
    {
      property: 'og:url',
      content: `${config.ZEMPIE_URL}${route.path}`,
    },
    {
      name: 'og:image',
      content: '/images/sns-thumbnail.png',
    },
    {
      name: 'og:type',
      content: 'website',
    },
  ],
})

provide(ID_INJECTION_KEY, {
  prefix: 100,
  current: 0,
})

onBeforeMount(() => {
  const lang = navigator.language.split('-')[0]

  if (lang === 'ko') {
    locale.value = 'ko'
    switchLocalePath('ko')
  } else {
    locale.value = 'en'
    switchLocalePath('en')
  }
  useCommon().setLang(locale.value)

  router.replace(route.fullPath)
})
</script>

<style lang="scss">
@import 'https://unicons.iconscout.com/release/v3.0.3/css/line.css';

body {
  margin: 0px !important;

  .content {
    min-height: calc(100vh - 200px) !important;
  }
}
</style>

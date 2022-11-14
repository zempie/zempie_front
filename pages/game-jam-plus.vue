<template>
    <EventGJPlus/>
</template>
<script setup lang="ts">
const { t, locale } = useI18n()
const route = useRoute()
const config = useRuntimeConfig()

useHead({
  title: `Game Jam Plus | Zempie`,
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
      name: 'robots',
      content: 'index, follow',
    },
    {
      name: 'description',
      content: `${t('global.game.zem.info')}`,
    },

    {
      property: 'og:title',
      content: `Game Jam Plus`,
    },
    {
      property: 'og:description',
      content: `${t('global.game.zem.info')}`,
    },
    {
      property: 'og:url',
      content: `${config.ZEMPIE_URL}${route.path}`,
    },
  ],
})
</script>
<style scoped lang="scss"></style>
<template>
  <NuxtLayout name="studio">
    <div class="content-studio">
      <div class="studio-banner bg02">
        <h2>{{ $t('uploadGame.selectStage.text') }}</h2>
        <p>{{ $t('uploadGame.selectStage.info') }}</p>
      </div>
      <ProjectUpload />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const route = useRoute()
const config = useRuntimeConfig()

definePageMeta({
  middleware: 'auth',
})

useHead({
  title: `${t('seo.project.upload.title')} | Zempie Studio`,
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
      content: 'noindex, nofollow',
    },
    {
      name: 'description',
      content: `${t('seo.project.upload.desc')}`,
    },
    {
      property: 'og:title',
      content: `${t('seo.project.upload.title')}`,
    },
    {
      property: 'og:description',
      content: `${t('seo.project.upload.description')}`,
    },
    {
      property: 'og:url',
      content: `${config.ZEMPIE_URL}${route.path}`,
    },
  ],
})
</script>

<style scoped lang="scss">
//FIXME: image border 수정해야함
@media all and (min-width: 992px) and (max-width: 1199px) {
  .studio-banner {
    background-size: contain;
  }
}
</style>

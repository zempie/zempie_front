<template>
  <NuxtLayout name="project-manage">
    <div class="studio-version">
      <dl>
        <dt></dt>
        <dd>
          <NuxtLink
            :to="$localePath(`/project/${$route.params.id}/add-version`)"
            class="btn-default"
            ><i class="uil uil-plus"></i> {{ $t('versionManage.addVersion') }}
          </NuxtLink>
        </dd>
      </dl>

      <ul class="gv-title">
        <li></li>
        <li>{{ $t('versionManage.index') }}</li>
        <li>{{ $t('versionManage.detailedVersion') }}</li>
        <li>{{ $t('versionManage.state') }}</li>
        <li>{{ $t('versionManage.creationDate') }}</li>
        <li></li>
      </ul>

      <ProjectVersionRow
        v-for="(version, idx) in project?.projectVersions"
        :version="version"
        :idx="idx"
      />
    </div>
  </NuxtLayout>
</template>
<script setup lang="ts">
import { IVersion } from '~~/types'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const route = useRoute()
const config = useRuntimeConfig()
const { $localePath } = useNuxtApp()
const project = ref()

definePageMeta({
  title: 'Version Mgmt.',
  name: 'versionManage',
  //middleware: 'auth',
})
useHead({
  title: `${t('seo.project.version.manage.title')} | Zempie Studio`,
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
      content: `${t('seo.project.version.manage.desc')}`,
    },
    {
      property: 'og:title',
      content: `${t('seo.project.version.manage.title')}`,
    },
    {
      property: 'og:description',
      content: `${t('seo.project.version.manage.description')}`,
    },
    {
      property: 'og:url',
      content: `${config.ZEMPIE_URL}${route.path}`,
    },
  ],
})

watch(
  () => useProject().editProject.value.info,
  (newVal) => {
    project.value = useProject().editProject.value.info
  }
)
onMounted(() => {
  if (useProject().editProject.value.info?.id) {
    project.value = useProject().editProject.value.info
  }
})
</script>

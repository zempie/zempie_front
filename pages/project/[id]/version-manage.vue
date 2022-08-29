<template>
  <NuxtLayout name="project-manage">
    <div class="studio-version">
      <dl>
        <dt>
        </dt>
        <dd>
          <NuxtLink :to="localePath(`/project/${$route.params.id}/add-version`)" class="btn-default"><i
              class="uil uil-plus"></i> {{ $t('versionManage.addVersion') }}
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

      <ProjectVersionRow v-for="(version, idx) in data.result.projectVersions" :version="version" :idx="idx"
        @refresh="refresh" />
    </div>
  </NuxtLayout>

</template>
<script setup lang="ts">
import { IVersion } from '~~/types'
import { useLocalePath } from 'vue-i18n-routing';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n()
const route = useRoute();
const config = useRuntimeConfig()
const localePath = useLocalePath();


// useHead({
//   title: `${t('seo.project.version.manage.title')} | Zempie`,
//   meta: [
//     {
//       name: 'description',
//       content: `${t('seo.project.version.manage.desc')}`
//     },
//     {
//       name: 'og:title',
//       content: `${t('seo.project.version.manage.title')}`
//     },
//     {
//       name: 'og:description',
//       content: `${t('seo.project.version.manage.description')}`
//     },
//     {
//       name: 'og:url',
//       content: `${config.ZEMPIE_URL}${route.path}`
//     },
//   ]
// })

definePageMeta({
  title: '버전 관리',
  name: 'versionManage'
})


const { data, error, pending, refresh } = await useFetch<{ result: { projectVersions: IVersion[] } }>(`/community/project/${route.params.id}`, getZempieFetchOptions('get', true))


</script>

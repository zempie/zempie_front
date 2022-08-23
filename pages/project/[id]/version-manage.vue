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

useHead({
  title: 'Zempie | Project version ',
  meta: [{
    name: 'description',
    content: 'project list'
  }]
})

definePageMeta({
  title: '버전 관리',
  name: 'versionManage'
})

const localePath = useLocalePath();
const route = useRoute()


const { data, error, pending, refresh } = await useFetch<{ result: { projectVersions: IVersion[] } }>(`/community/project/${route.params.id}`, getZempieFetchOptions('get', true))


</script>

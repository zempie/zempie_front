<template>
  <NuxtLayout name="project-manage">
    <div class="studio-version">
      <dl>
        <dt></dt>
        <dd>
          <NuxtLink :to="$localePath(`/project/${$route.params.id}/add-version`)" class="btn-default flex items-center">
            <i>
              <LazyIconPlus color="#fff" />
            </i> {{ $t('versionManage.addVersion') }}
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

      <ProjectVersionRow v-for="(version, idx) in project?.projectVersions" :version="version" :idx="idx" />
    </div>
  </NuxtLayout>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import shared from '~~/scripts/shared';
import { onBeforeRouteLeave } from 'vue-router';

const { t } = useI18n()
const { $localePath } = useNuxtApp()
const project = ref()

definePageMeta({
  title: 'Version Mgmt.',
  name: 'versionManage',
  middleware: 'auth',
})

shared.createHeadMeta(t('seo.project.version.manage.title'), t('seo.project.version.manage.desc'))


watch(
  () => useProject().editProject.value.info,
  (newVal) => {
    project.value = useProject().editProject.value.info
  }
)
onMounted(() => {
  useRouterLeave()
  if (useProject().editProject.value.info?.id) {
    project.value = useProject().editProject.value.info
  }
})
</script>

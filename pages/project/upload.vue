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
import shared from '~/scripts/shared'
import { onBeforeRouteLeave } from 'vue-router';

const { t, locale } = useI18n()
const route = useRoute()
const config = useRuntimeConfig()

definePageMeta({
  middleware: 'auth',
  layout: 'header-only',
})

shared.createHeadMeta(t('seo.project.upload.title'), t('seo.project.upload.desc'))

onMounted(() => {
  useRouterLeave()
})

onBeforeMount(() => {
  useProject().setStepOne()
  useProject().resetPurpose()
  useProject().resetForm()
  useProject().resetProjectInfo()
  useProject().resetEditStep()
})
</script>

<style scoped lang="scss">
@media all and (min-width: 992px) and (max-width: 1199px) {
  .studio-banner {
    background-size: contain;
  }
}
</style>

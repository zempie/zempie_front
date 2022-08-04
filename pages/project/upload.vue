<template>
  <NuxtLayout name="studio">
    <div class="content-studio">
      <div class="studio-banner bg02">
        <h2>{{ $t('uploadGame.selectStage.text') }}</h2>
        <p>{{ $t('uploadGame.selectStage.info') }}
        </p>
      </div>
      <ProjectUpload />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
//FIXME: image border 수정해야함 
@media all and (min-width: 992px) and (max-width: 1199px) {
  .studio-banner {
    background-size: contain;
  }
}
</style>
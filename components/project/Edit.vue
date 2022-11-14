<template>
  <dl class="studio-upload-area">
    <ProjectSelectPurpose v-if="editProject.step === 1" />
    <ProjectEditSelectStage v-else-if="editProject.step === 2" />
    <ProjectAddGameInfo v-else-if="editProject.step === 3" />
  </dl>
</template>

<script setup lang="ts">
const { editProject, resetProjectInfo } = useProject()
</script>

<style scoped lang="scss">
.studio-upload-area {
  min-height: 700px;
}
</style>

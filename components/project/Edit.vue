<template>
  <dl class="studio-upload-area">
    <ProjectEditSelectStage v-if="editProject.step === 1" />
    <AddGameInfo v-else-if="editProject.step === 2" />
  </dl>
</template>

<script setup lang="ts">
import AddGameInfo from './AddGameInfo.vue'
const { editProject, resetProjectInfo } = useProject()
</script>

<style scoped lang="scss">
.studio-upload-area {
  min-height: 700px;
}
</style>

<template>
  <ClientOnly>
    <el-dialog v-model="isTextEditorOpen" class="post-modal" :show-close="false" :close-on-click-modal="false"
      :close-on-press-escape="false" :destroy-on-close="true" @close="closeEditor" :fullscreen="isMobile">
      <slot name="textEditor"></slot>
    </el-dialog>
  </ClientOnly>
</template>
<script setup lang="ts">
import { ElDialog, } from 'element-plus'
const isEditorDestroy = ref(false)
const isFullScreen = ref(false)


const props = defineProps({
  isTextEditorOpen: Boolean,
})

const isTextEditorOpen = computed(() => {
  return props.isTextEditorOpen ? props.isTextEditorOpen : false
})
const isMobile = computed(() => useCommon().common.value.isMobile)


function closeEditor() {
  isEditorDestroy.value = true
}

</script>
<style scoped land="scss"></style>

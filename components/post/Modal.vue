<template>
  <ClientOnly>
    <el-dialog
      v-model="isTextEditorOpen"
      custom-class="post-modal"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :destroy-on-close="true"
      @close="closeEditor"
      :fullscreen="isFullScreen"
    >
      <slot name="textEditor"></slot>
    </el-dialog>
  </ClientOnly>
</template>
<script setup lang="ts">
import {
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElSelect,
  ElOption,
  ElMessage,
  ElDialog,
} from 'element-plus'
const isEditorDestroy = ref(false)
const isFullScreen = ref(false)

const props = defineProps({
  isTextEditorOpen: {
    type: Boolean,
    default: false,
  },
})

const isTextEditorOpen = computed(() => {
  return props.isTextEditorOpen ? props.isTextEditorOpen : false
})

const isMobile = computed(() =>
  window.matchMedia('screen and (max-width: 767px)')
)

onMounted(async () => {
  nextTick(() => {
    onResize()
  })
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
})

function closeEditor() {
  isEditorDestroy.value = true
}

function onResize() {
  isFullScreen.value = isMobile.value.matches ? true : false
  usePost().setFullScreen(isFullScreen.value)
}
</script>
<style scoped></style>

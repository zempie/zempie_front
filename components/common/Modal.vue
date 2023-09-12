<template>
  <el-dialog v-model="showModal" class="modal-area-type" width="380px" :append-to-body="isAppendBody">
    <div class="modal-alert">
      <dl class="ma-header">
        <dt>{{ title }}</dt>
        <dd>
          <button @click="closeModal" class="pointer">
            <i class="uil uil-times"></i>
          </button>
        </dd>
      </dl>
      <div class="ma-content">
        <h2>{{ desc }}</h2>
      </div>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import { ElDialog } from 'element-plus'

const emit = defineEmits(['closeModal'])

const props = defineProps({
  openModal: {
    type: Boolean,
    default: false
  },
  title: String,
  desc: String,
  isAppendBody: {
    type: Boolean,
    default: false
  }
})

watch(
  () => useCommon().common.value.isPopState,
  (val) => {
    if (!val) {
      closeModal()
    }
  })

const showModal = computed(() => props.openModal)

function closeModal() {
  emit('closeModal')
}
</script>
<style scoped lang="scss"></style>
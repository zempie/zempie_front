<template>
  <ClientOnly>
    <el-dropdown trigger="click" ref="msgMenu" placement="bottom-end">
      <div class="flex items-center" style="max-height: 50px;">
        <button class="msg-menu-btn"> <i class="uil uil-ellipsis-h font25"></i></button>
      </div>
      <template #dropdown>
        <div class="more-list fixed" style="min-width: 150px">
          <a @click="onDeleteMsg" id="editFeed" class="pointer">{{ $t('delete.msg') }}</a>
        </div>
      </template>
    </el-dropdown>
  </ClientOnly>
</template>
<script setup lang="ts">
import { ElDropdown, ElDialog } from 'element-plus';
const props = defineProps({
  msg: Object
})

const msgMenu = ref()
const opDeleteMsgModal = ref(false)
const userInfo = computed(() => useUser().user.value.info)

const emit = defineEmits(['deleteMsg'])

const isShow = ref(true)

onMounted(() => {
  isShow.value = true
})
function openDeleteModal() {
  msgMenu.value.handleClose()
  opDeleteMsgModal.value = true
}

async function onDeleteMsg() {

  emit('deleteMsg', props.msg)
  isShow.value = false

}


</script>
<style scoped lang="scss">
.more-list {
  a {
    &:hover {
      border-radius: 5px;
    }
  }
}

::deep(.el-popper) {
  z-index: 0;
}
</style>
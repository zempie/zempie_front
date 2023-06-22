<template>
  <ClientOnly>
    <el-dropdown trigger="click" ref="msgMenu">
      <button class="msg-menu-btn"> <i class="uil uil-ellipsis-h font25"></i></button>
      <template #dropdown>
        <div class="more-list fixed" style="min-width: 150px">
          <a @click="onDeleteMsg" id="editFeed" class="pointer">메시지 삭제</a>
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


function openDeleteModal() {
  msgMenu.value.handleClose()
  opDeleteMsgModal.value = true
}

async function onDeleteMsg() {

  emit('deleteMsg', props.msg)

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
</style>
<template>
  <CommonDropdown>
    <template #options>
      <li @click="showReportModal = true">{{ $t('report.user') }}</li>
      <li v-if="!user.is_blocked" @click="onBlockUser">{{ $t('block.user') }}</li>
      <li v-else @click="onUnBlockUser">{{ $t('cancel.block') }}</li>
    </template>
  </CommonDropdown>
  <UserReportModal :openModal="showReportModal" @closeModal="closeReportModal" :user="user" />
  <CommonModal :openModal="showReportComModal" :title="$t('finish.report.title')" :desc="$t('finish.report.desc')"
    @closeModal="closeModal" />
</template>
<script setup lang="ts">
import { ElDialog, ElMessage } from 'element-plus'
import { PropType } from 'vue';
import { IUser } from '~~/types';

const { t, locale } = useI18n()

const showReportModal = ref(false)
const showReportComModal = ref(false)

watch(
  () => useCommon().common.value.isPopState,
  (val) => {
    if (!val) {
      closeReportModal()
      closeModal()
    }
  })


const props = defineProps({
  user: Object as PropType<IUser>
})


function closeModal() {
  showReportComModal.value = false
}


function closeReportModal() {
  showReportModal.value = false

}
async function onBlockUser() {

  await useUser().blockUser(props.user.id)
    .then(() => {
      useChannel().updateChannelBlockInfo(true)

    })
}

async function onUnBlockUser() {
  await useUser().unblockUser(props.user.id)
    .then(() => {
      useChannel().updateChannelBlockInfo(false)
    })
}

</script>
<style scoped lang="scss">
li {
  font-size: 12px;
  color: #888;
  transition: 0.3s;
}

:deep(.menu-btn) {
  cursor: pointer;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 35px;
  text-align: center;
  font-size: 18px;
  line-height: 18px;
  color: #fff;
  border: #fff 2px solid;
  border-radius: 50%;
  background: #999;
  bottom: 0px;
}


:deep(.more-list) {
  top: 5px;
  left: -35px;
}


:deep(.modal-area-type) {

  .ma-header {
    // height: 50px;
  }
}
</style>
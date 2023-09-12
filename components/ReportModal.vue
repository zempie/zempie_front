<template>
  <el-dialog v-model="showModal" class="modal-area-type" width="380px" :append-to-body="isAppendBody" @close="initData">
    <div class="modal-report">
      <dl class="mr-header">
        <dt>{{ reportInfo.title }}</dt>
        <dd>
          <button class="pointer" @click="emit('closeModal')">
            <IconClose />
          </button>
        </dd>
      </dl>
      <div class="mr-content">
        <p class="desc w100p"> {{ reportInfo.desc }}</p>
        <ul>
          <li class="flex items-center" v-for="item in reportInfo.list">
            <input type="radio" v-model="reportReason" :value="item.value" :id="`report${item.value}`" />
            <span><label :for="`report${item.value}`">{{ item.title }} </label></span>
          </li>
          <li>
            <textarea class="w100p" maxlength="50" v-model="additionalReportReason"
              :placeholder="`${$t('add.additional.info')}`"></textarea>
          </li>
        </ul>

        <div class="flex row justify-between" style="border:none">
          <button class="btn-gray" style="width: 48% !important;" @click="emit('closeModal')">{{ $t('cancel')
          }}</button>
          <button class="btn-default" style="width: 48% !important;" @click="onSubmitReport">{{ $t('post.report.btn')
          }}</button>
        </div>
      </div>
    </div>
  </el-dialog>
  <CommonModal :openModal="showReportComModal" :title="`${$t('finish.report.title')}`"
    :desc="`${$t('finish.report.desc')}`" @closeModal="showReportComModal = false" :isAppendBody="true" />
</template>
<script setup lang="ts">
import { ElDialog } from 'element-plus'
import { eReportType } from '~~/types';


const reportReason = ref()
const showReportComModal = ref(false)
const additionalReportReason = ref()

const props = defineProps({
  isAppendBody: {
    type: Boolean,
    default: true
  },
  reportInfo: Object,
  openModal: {
    type: Boolean,
    default: false
  },
})

const emit = defineEmits(['closeModal'])
const showModal = computed(() => props.openModal)


async function onSubmitReport() {
  if (!reportReason.value) return
  let payload

  switch (props.reportInfo.type) {
    case eReportType.post:
      payload = {
        targetType: props.reportInfo.type,
        post_id: props.reportInfo.target_id,
        report_reason: reportReason.value
      }
      const { data, error, pending } = await useCustomAsyncFetch(`/post/report`, getComFetchOptions('post', true, payload))
      if (data.value) {
        showReportComModal.value = true
      }
      break;
    case eReportType.comment:
      payload = {
        comment_id: props.reportInfo.target_id,
        targetType: props.reportInfo.type,
        // post_id: props.reportInfo.target_id,
        report_reason: reportReason.value
      }
      const { data: cmtData } = await useCustomAsyncFetch(`/comment/report`, getComFetchOptions('post', true, payload))
      if (cmtData.value) {
        showReportComModal.value = true
      }
      break;
    default:
      //TODO: 임시
      showReportComModal.value = true
      break;
  }

  emit('closeModal')

}

function initData() {
  reportReason.value = null
  additionalReportReason.value = null
  emit('closeModal')
}

</script>
<style scoped lang="scss">
textarea {
  resize: none;
}
</style>
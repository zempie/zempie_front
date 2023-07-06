<template>
  <el-dialog v-model="showModal" class="modal-area-type" width="380px" :append-to-body="isAppendBody" @close="initData">
    <div class="modal-report">
      <dl class="mr-header">
        <dt>{{ reportInfo.title }}</dt>
        <dd>
          <button class="pointer" @click="emit('closeModal')"><i class="uil uil-times"></i></button>
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
              placeholder="추가적인 정보를 작성해주세요."></textarea>
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


function onSubmitReport() {
  if (!reportReason.value) return
  emit('closeModal')
  showReportComModal.value = true

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
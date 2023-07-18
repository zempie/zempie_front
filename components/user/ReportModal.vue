<template>
  <el-dialog v-model="showModal" class="modal-area-type" width="380px">
    <div class="modal-report">
      <dl class="mr-header">
        <dt>{{ $t('user.report') }}</dt>
        <dd>
          <button class="pointer" @click="emit('closeModal')"><i class="uil uil-times"></i></button>
        </dd>
      </dl>
      <div class="mr-content">
        <p class="desc w100p">{{ $t('report.user.title') }} </p>
        <ul>
          <li>
            <input type="radio" v-model="reportReason" value="1" id="report1" />

            <span><label for="report1">{{ $t('report.user.info1') }} </label></span>
          </li>
          <li>
            <input type="radio" v-model="reportReason" value="2" id="report2" /> <span><label for="report2"> {{
              $t('report.user.info2') }}</label></span>
          </li>
          <li>
            <input type="radio" v-model="reportReason" value="3" id="report3" /> <span><label for="report3">{{
              $t('report.user.info3') }} </label></span>
          </li>
          <li>
            <input type="radio" v-model="reportReason" value="4" id="report4" /> <span><label for="report4">{{
              $t('report.user.info4') }} </label></span>
          </li>
          <li>
            <input type="radio" v-model="reportReason" value="5" id="report5" /> <span><label for="report5">{{
              $t('ect') }}</label></span>
          </li>
          <li>
            <textarea class="w100p" name="" v-model="additionalReportReason"
              :placeholder="`${$t('add.additional.info')}`"></textarea>
          </li>
        </ul>
        <div class="flex row justify-between bottom">
          <button class="btn-gray" @click="emit('closeModal')">{{ $t('cancel')
          }}</button>
          <button class="btn-default" @click="onSubmitReport">{{ $t('post.report.btn')
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
import { PropType } from 'vue';
import { IUser } from '~~/types';

const reportReason = ref()
const additionalReportReason = ref()
const showReportComModal = ref(false)

const props = defineProps({
  openModal: {
    type: Boolean,
    default: false
  },
  user: Object as PropType<IUser>
})
const showModal = computed(() => props.openModal)
const userInfo = computed(() => useUser().user.value.info)

const emit = defineEmits(['closeModal'])

async function onSubmitReport() {
  if (!reportReason.value) return

  const formData = new FormData();
  formData.append('target_id', String(props.user.id));
  formData.append('reporter_id', String(userInfo.value.id));
  formData.append('reason_num', reportReason.value);
  if (additionalReportReason.value) {
    formData.append('reason', additionalReportReason.value);
  }

  const { data } = await useCustomAsyncFetch('/report/user', getZempieFetchOptions('post', true, formData))
  if (data.value) {
    showReportComModal.value = true
    emit('closeModal')
  }


}

</script>
<style scoped lang="scss">
.mr-header {
  // height: 50px;
}

.mr-content {
  text-align: left;

  .desc {
    height: auto !important;
  }

  ul {
    li {
      display: flex;
      align-items: center;

      span {
        font-size: 14px !important;
      }

      textarea {
        resize: none;
      }
    }

  }
}

.bottom {
  border: none !important;

  button {
    width: 48% !important;
  }
}
</style>
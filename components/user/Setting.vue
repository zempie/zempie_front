<template>
  <CommonDropdown>
    <template #options>
      <li @click="showReportModal = true">유저 신고</li>
      <li @click="onBlockUser">유저 차단</li>
    </template>
  </CommonDropdown>


  <el-dialog v-model="showReportModal" class="modal-area-type" width="380px">
    <div class="modal-report">
      <dl class="mr-header">
        <dt>{{ $t('user.report') }}</dt>
        <dd>
          <button class="pointer" @click="showReportModal = false"><i class="uil uil-times"></i></button>
        </dd>
      </dl>
      <div class="mr-content">
        <p class="desc w100p"> 신고사유를 선택해주세요 신고 사유에 맞지 않는 신고일 경우, 해당 신고는 처리되지 않습니다. 검토까지는 최대 24시간이 소요됩니다.</p>
        <ul>
          <li>
            <input type="radio" v-model="reportReason" value="1" id="report1" />

            <span><label for="report1">적합하지 않은 콘텐츠 게시 </label></span>
          </li>
          <li>
            <input type="radio" v-model="reportReason" value="2" id="report2" /> <span><label for="report2"> 타인
                사칭</label></span>
          </li>
          <li>
            <input type="radio" v-model="reportReason" value="3" id="report3" /> <span><label for="report3"> 만 12세 미만
                계정</label></span>
          </li>
          <li>
            <input type="radio" v-model="reportReason" value="4" id="report4" /> <span><label for="report4"> 비정상적인
                플레이</label></span>
          </li>
          <li>
            <input type="radio" v-model="reportReason" value="5" id="report5" /> <span><label
                for="report5">기타</label></span>
          </li>
          <li>
            <textarea class="w100p" name="" v-model="additionalReportReason" placeholder="추가적인 정보를 작성해주세요."></textarea>
          </li>
        </ul>
        <div class="flex row justify-between">
          <button class="btn-gray" style="width: 48% !important;" @click="showReportModal = false">{{ $t('cancel')
          }}</button>
          <button class="btn-default" style="width: 48% !important;" @click="onSubmitReport">{{ $t('post.report.btn')
          }}</button>
        </div>
      </div>
    </div>
  </el-dialog>

  <el-dialog v-model="showReportModal" class="modal-area-type" width="380px">
    <div class="modal-report">
      <dl class="mr-header">
        <dt>{{ $t('user.report') }}</dt>
        <dd>
          <button class="pointer" @click="showReportModal = false"><i class="uil uil-times"></i></button>
        </dd>
      </dl>
      <div class="mr-content">
        <p class="desc w100p"> 신고사유를 선택해주세요 신고 사유에 맞지 않는 신고일 경우, 해당 신고는 처리되지 않습니다. 검토까지는 최대 24시간이 소요됩니다.</p>
        <ul>
          <li>
            <input type="radio" v-model="reportReason" value="10" id="report1" />

            <span><label for="report1">적합하지 않은 콘텐츠 게시 </label></span>
          </li>
          <li>
            <input type="radio" v-model="reportReason" value="11" id="report2" /> <span><label for="report2"> 타인
                사칭</label></span>
          </li>
          <li>
            <input type="radio" v-model="reportReason" value="12" id="report3" /> <span><label for="report3"> 만 12세 미만
                계정</label></span>
          </li>
          <li>
            <input type="radio" v-model="reportReason" value="13" id="report4" /> <span><label for="report4"> 비정상적인
                플레이</label></span>
          </li>
          <li>
            <input type="radio" v-model="reportReason" value="14" id="report5" /> <span><label
                for="report5">기타</label></span>
          </li>
          <li>
            <textarea class="w100p" maxlength="50" v-model="additionalReportReason"
              placeholder="추가적인 정보를 작성해주세요."></textarea>
          </li>
        </ul>
        <div class="flex row justify-between" style="border:none">
          <button class="btn-gray" style="width: 48% !important;" @click="showReportModal = false">{{ $t('cancel')
          }}</button>
          <button class="btn-default" style="width: 48% !important;" @click="onSubmitReport">{{ $t('post.report.btn')
          }}</button>
        </div>
      </div>
    </div>
  </el-dialog>
  <CommonModal :openModal="showReportComModal" :title="'신고 접수 완료'" :desc="'신고하신 내용이 정상적으로 접수완료되었습니다.'"
    @closeModal="closeModal" />
</template>
<script setup lang="ts">
import { ElDialog } from 'element-plus'
import { PropType } from 'vue';
import { IUser } from '~~/types';

const showReportModal = ref(false)
const reportReason = ref()
const additionalReportReason = ref()
const showReportComModal = ref(false)


const props = defineProps({
  user: Object as PropType<IUser>
})

const userInfo = computed(() => useUser().user.value.info)

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
    showReportModal.value = false
    showReportComModal.value = true
  }

}

function closeModal() {
  showReportComModal.value = false

}
function onBlockUser() {

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

:deep(.modal-area-type) {

  .ma-header {
    // height: 50px;
  }
}
</style>
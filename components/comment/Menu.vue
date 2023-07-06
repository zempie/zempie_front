<template>
  <el-dropdown trigger="click" popper-class="tapl-more-dropdown" style="margin-top:0px" ref="menuRef">
    <a slot="trigger"><i class="uil uil-ellipsis-h font25 pointer"></i></a>
    <template #dropdown>
      <div slot="body" class="more-list">
        <template v-if="comment.user?.uid === user?.uid">
          <a @click="editComment" class="pointer">{{
            $t('comment.edit')
          }}</a>
          <a @click="showDeleteModal = true" class="pointer">
            {{ $t('comment.delete') }}
          </a>
        </template>
        <a v-else @click="onClickReport" class="pointer">
          {{ $t('comment.report') }}
        </a>
      </div>
    </template>
  </el-dropdown>

  <ClientOnly>
    <el-dialog v-model="showDeleteModal" append-to-body class="modal-area-type" width="380px">
      <div class="modal-alert">
        <dl class="ma-header">
          <dt>{{ $t('information') }}</dt>
          <dd>
            <button class="pointer" @click="showDeleteModal = false">
              <i class="uil uil-times"></i>
            </button>
          </dd>
        </dl>
        <div class="ma-content">
          <h2>{{ $t('comment.delete.text') }}</h2>
          <div>
            <button class="btn-default w48p" @click="$emit('deleteComment')">
              {{ $t('delete') }}
            </button>
            <button class="btn-gray w48p" @click="showDeleteModal = false">
              {{ $t('no') }}
            </button>
          </div>
        </div>
      </div>
    </el-dialog>
  </ClientOnly>
  <ReportModal :openModal="showReportModal" :reportInfo="reportInfo" @closeModal="showReportModal = false" />
</template>
<script setup lang="ts">
import { ElDropdown, ElDialog } from 'element-plus';
import { eReportType } from '~~/types';

const { t, locale } = useI18n()

const props = defineProps({
  comment: Object,
})
const emit = defineEmits(['deleteComment', 'editComment'])

defineExpose({ closeDeleteModal })

const showDeleteModal = ref(false)
const menuRef = ref()

const showReportModal = ref(false)
const reportInfo = ref()
const user = computed(() => useUser().user.value.info)

function closeDeleteModal() {
  showDeleteModal.value = false
}

function editComment() {
  emit('editComment')
  menuRef.value.handleClose()
}


function onClickReport() {
  reportInfo.value = {
    type: eReportType.comment,
    title: t('report.comment.title'),//'댓글 신고',
    desc: t('report.post.desc'),//'신고 사유를 선택해주세요. 신고 사유에 맞지 않는 신고일 경우, 해당 신소는 처리되지 않습니다. 검토까지는 최대 24시간이 소요됩니다.',
    list: [
      {
        value: 10,
        title: t('report.post.options1'),//'개인정보보호 위반'
      },
      {
        value: 11,
        title: t('report.post.options2'),//'불쾌하거나 민감한 콘텐츠'
      },
      {
        value: 12,
        title: t('report.post.options3'),//'불법 콘텐츠'
      },
      {
        value: 13,
        title: t('report.post.options4'),//'허가되지 않은 광고'
      },
      {
        value: 14,
        title: t('report.post.options5'),//'지식재산권 침해'
      },
      {
        value: 15,
        title: t('etc'),//'기타'
      }

    ]
  }
  showReportModal.value = true
}

</script>
<style scoped lang="scss"></style>
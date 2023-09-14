<template>
  <el-dropdown trigger="click" popper-class="tapl-more-dropdown" style="margin-top:0px" ref="menuRef"
    @visible-change="handleVisible">
    <a slot="trigger">
      <IconEllipsisH />
    </a>
    <template #dropdown>
      <div slot="body" class="more-list">
        <template v-if="comment.user?.uid === user?.uid">
          <a @click="editComment" class="pointer">{{
            $t('comment.edit')
          }}</a>
          <a @click="openDeleteModal" class="pointer">
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
            <button class="pointer" @click="closeDeleteModal">
              <IconClose />
            </button>
          </dd>
        </dl>
        <div class="ma-content">
          <h2>{{ $t('comment.delete.text') }}</h2>
          <div>
            <button class="btn-default w48p" @click="$emit('deleteComment')">
              {{ $t('delete') }}
            </button>
            <button class="btn-gray w48p" @click="closeDeleteModal">
              {{ $t('no') }}
            </button>
          </div>
        </div>
      </div>
    </el-dialog>
  </ClientOnly>
  <ReportModal :openModal="showReportModal" :reportInfo="reportInfo" @closeModal="closeReportModal" />
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
const isMobile = computed(() => useCommon().common.value.isMobile)

watch(
  () => useCommon().common.value.isPopState,
  (val) => {
    if (!val) {
      closeDeleteModal()
      closeReportModal()
      menuRef.value.handleClose()
    }
  })

function openDeleteModal() {
  showDeleteModal.value = true
  if (isMobile.value) {
    useCommon().setPopState(true)
  }
}

function closeDeleteModal() {
  showDeleteModal.value = false
  if (isMobile.value) {
    useCommon().setPopState(false)
  }
}

function editComment() {
  emit('editComment')
  menuRef.value.handleClose()
}


function onClickReport() {
  reportInfo.value = {
    type: eReportType.comment,
    target_id: props.comment.id,
    title: t('report.comment.title'),
    desc: t('report.post.desc'),
    list: [
      {
        value: 10,
        title: t('report.post.options1'),
      },
      {
        value: 11,
        title: t('report.post.options2'),
      },
      {
        value: 12,
        title: t('report.post.options3'),
      },
      {
        value: 13,
        title: t('report.post.options4'),
      },
      {
        value: 14,
        title: t('report.post.options5'),
      },
      {
        value: 15,
        title: t('etc'),
      }

    ]
  }
  openReportModal()
}

function openReportModal() {
  showReportModal.value = true
  if (isMobile.value) {
    useCommon().setPopState(true)
  }
}
function closeReportModal() {
  showReportModal.value = false
  if (isMobile.value) {
    useCommon().setPopState(false)
  }
}

function handleVisible(visible: boolean) {
  if (!isMobile.value) return
  if (visible) {
    useCommon().setPopState(true)
  } else {
    useCommon().setPopState(false)
  }
}
</script>
<style scoped lang="scss"></style>

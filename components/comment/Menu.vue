<template>
  <el-dropdown v-if="comment.user?.uid === user?.uid" trigger="click" popper-class="tapl-more-dropdown"
    style="margin-top:0px">
    <a slot="trigger"><i class="uil uil-ellipsis-h font25 pointer"></i></a>
    <template #dropdown>
      <div slot="body" class="more-list">
        <a @click="isCommentEdit = !isCommentEdit" class="pointer">{{
          $t('comment.edit')
        }}</a>
        <a @click="showDeleteModal = true" class="pointer">
          {{ $t('comment.delete') }}
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
</template>
<script setup lang="ts">
import { ElDropdown, ElDialog } from 'element-plus';


const props = defineProps({
  comment: Object,
})
const emit = defineEmits(['deleteComment'])
defineExpose({ closeDeleteModal })

const showDeleteModal = ref(false)

const user = computed(() => useUser().user.value.info)

function closeDeleteModal() {
  showDeleteModal.value = false
}

</script>
<style scoped lang="scss"></style>
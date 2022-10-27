<template>
  <ClientOnly>
    <el-dropdown trigger="click" ref="feedMenu" popper-class="feed-menu">
      <a class="btn-circle-none pt6" slot="trigger"
        ><i class="uil uil-ellipsis-h font25"></i
      ></a>
      <template #dropdown>
        <div slot="body" class="more-list fixed" style="min-width: 150px">
          <template v-if="user && user.id === (feed?.user && feed?.user.id)">
            <a @click="isTextEditorOpen = true">{{ t('feed.edit') }}</a>
            <a @click="showDeletePostModal = true">{{ t('feed.delete') }}</a>
          </template>
          <template v-else>
            <NuxtLink
              :to="$localePath(`/channel/${feed.user && feed.user.channel_id}`)"
            >
              {{ t('visit.userChannel') }}
            </NuxtLink>
            <!-- <a v-if="user" @click="report">{{ t('post.report') }}</a>
            <a v-if="user" @click="userReportModalOpen">{{ t('post.report') }}유저 신고하기</a> -->
          </template>
        </div>
      </template>
    </el-dropdown>

    <el-dialog
      v-model="showDeletePostModal"
      append-to-body
      custom-class="modal-area-type"
      width="380px"
    >
      <div class="modal-alert">
        <dl class="ma-header">
          <dt>{{ t('information') }}</dt>
          <dd>
            <button @click="showDeletePostModal = false">
              <i class="uil uil-times"></i>
            </button>
          </dd>
        </dl>
        <div class="ma-content">
          <h2>
            {{ t('post.delete.modal.text1') }} <br />{{
              t('post.delete.modal.text2')
            }}
          </h2>
          <div>
            <button class="btn-default w48p" @click="deletePost">
              {{ t('delete') }}
            </button>
            <button class="btn-gray w48p" @click="showDeletePostModal = false">
              {{ t('no') }}
            </button>
          </div>
        </div>
      </div>
    </el-dialog>
  </ClientOnly>

  <PostModal :isTextEditorOpen="isTextEditorOpen">
    <template #textEditor>
      <TextEditor
        @closeModal="closeEditor"
        :isEdit="true"
        :feed="feed"
        @refresh="emit('refresh')"
        :isFullScreen="usePost().post.value.isFullScreen"
        :key="editorKey"
      />
    </template>
  </PostModal>
</template>
<script lang="ts" setup>
import { PropType } from 'vue'
import { IFeed } from '~~/types'
import {
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElSelect,
  ElOption,
  ElMessage,
  ElDialog,
} from 'element-plus'
import { useI18n } from 'vue-i18n'

const { $localePath } = useNuxtApp()

const { t, locale } = useI18n()

const isTextEditorOpen = ref(false)
const showDeletePostModal = ref(false)
const editorKey = ref(0)

const props = defineProps({
  feed: Object as PropType<IFeed>,
})
const emit = defineEmits(['refresh', 'deletePost'])

const user = computed(() => useUser().user.value.info)

async function deletePost() {
  const { data, error, pending } = await post.delete(props.feed.id)

  if (!error.value) {
    ElMessage({
      message: t('posting.deleted'),
      type: 'success',
    })
    emit('deletePost')
  }
  showDeletePostModal.value = false
}

async function closeEditor() {
  isTextEditorOpen.value = false
  editorKey.value = Date.now()
}
</script>

<style scoped lang="scss"></style>

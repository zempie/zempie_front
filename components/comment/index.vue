<template>
  <dl v-if="comment && !isCommentEdit">
    <dt>
      <dl>
        <dt>
          <UserAvatar :user="comment.user" :tag="'span'" :has-router="true"></UserAvatar>
        </dt>
        <dd>
          <h2 style="color:#000">
            <NuxtLink :to="$localePath(`/${comment.user?.nickname}`)">
              {{ comment.user?.nickname }}</NuxtLink>
          </h2>
          <div style="color: #000">
            {{ commentContent }}
          </div>
          <p style="display: inline-block">
            <a v-if="isLiked" @click="unsetLike()">
              <i class="xi-heart like-icon" style="color: red"></i>
            </a>
            <a v-else @click="setLike()">
              <i class="uil uil-heart-sign"></i>
            </a>
            {{ $t('like') }} {{ likeCnt }}{{ $t('like.unit') }}
          </p>
          <TranslateBtn :text="commentContent" @translatedText="translate" @untranslatedText="untranslatedText" />
        </dd>
      </dl>
    </dt>

    <dd v-if="comment.user?.uid === user?.uid">
      <el-dropdown trigger="click" ref="feedMenu" popper-class="tapl-more-dropdown">
        <a slot="trigger"><i class="uil uil-ellipsis-h font25 pointer"></i></a>
        <template #dropdown>
          <div slot="body" class="more-list">
            <a @click="isCommentEdit = !isCommentEdit" class="pointer">{{
              $t('comment.edit')
            }}</a>
            <!-- <slot name="commentEdit"></slot> -->

            <!-- <a @click="$modal.show('deleteComment', { commentId: comment.id, postId: postId })">{{ $t('comment.delete')
          }}</a> -->
            <a @click="showDeleteModal = true" class="pointer">
              {{ $t('comment.delete') }}
            </a>
          </div>
        </template>
      </el-dropdown>
    </dd>
    <ClientOnly>
      <el-dialog v-model="showDeleteModal" append-to-body class="modal-area-type" width="380px">
        <div class="modal-alert">
          <dl class="ma-header">
            <dt>{{ $t('information') }}</dt>
            <dd>
              <button @click="showDeleteModal = false">
                <i class="uil uil-times"></i>
              </button>
            </dd>
          </dl>
          <div class="ma-content">
            <h2>{{ $t('comment.delete.text') }}</h2>
            <div>
              <button class="btn-default w48p" @click="deleteComment">
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
  </dl>
  <CommentInput v-if="isCommentEdit" @refresh="refresh" @editComment="editComment" :postId="comment.post_id"
    :comment="comment" :isEdit="true" />
</template>

<script setup lang="ts">
import _ from 'lodash'
import { ElDropdown, ElDialog } from 'element-plus'
import { IComment } from '~~/types';

const { $localePath } = useNuxtApp()

const showDeleteModal = ref(false)
const isCommentEdit = ref(false)
const props = defineProps({
  comment: Object,
  isEdit: {
    type: Boolean,
    default: false,
  },
})


const commentContent = ref(props.comment?.content || '')

const emit = defineEmits(['refresh', 'editComment', 'deleteComment'])
const isLiked = ref(props.comment.is_liked)
const likeCnt = ref(props.comment.like_cnt)

const { info: user, isLogin } = useUser().user.value

function refresh(content: string) {
  isCommentEdit.value = !isCommentEdit.value
  commentContent.value = content

  emit('refresh', content)
}

function editComment(comment: IComment) {
  isCommentEdit.value = !isCommentEdit.value
  emit('editComment', comment)
}
const setLike = _.debounce(async () => {
  const { data, pending, error } = await useCustomAsyncFetch(
    `/post/${props.comment.post_id}/comment/${props.comment.id}/like`,
    getComFetchOptions('post', true)
  )

  if (!error.value) {
    likeCnt.value++
    isLiked.value = true
  }
}, 300)

const unsetLike = _.debounce(async () => {
  const { data, pending, error } = await useCustomAsyncFetch(
    `/post/${props.comment.post_id}/comment/${props.comment.id}/unlike`,
    getComFetchOptions('post', true)
  )

  if (!error.value) {
    likeCnt.value--
    isLiked.value = false
  }
}, 300)

async function deleteComment() {
  const { data, pending, error } = await useCustomAsyncFetch(
    `/post/${props.comment.post_id}/comment/${props.comment.id}`,
    getComFetchOptions('delete', true)
  )

  if (!error.value) {
    emit('deleteComment', props.comment.id)
  }
  showDeleteModal.value = false
}

async function translate(text: string) {
  commentContent.value = text
}

function untranslatedText(originText: string) {
  commentContent.value = originText
}


</script>

<style lang="scss" scoped>
.post-comment-text {
  position: absolute;
  width: 520px;
  height: 98px;
  left: 0px;
  top: 55.5px;
}

.xi-heart {
  transform-origin: center;
  animation: animateHeartOut 0.3s linear forwards;
}

.post-comment-text {
  text-align: left;
}

.comment.active {
  color: #4ff461;
}

.comment-btn {
  color: #9aa4bf;
  background: none;
}

.more-list {
  background-color: #fff !important;
  border-radius: 10px !important;
  box-shadow: 0 0 15px 0 rgb(82 70 70 / 20%);
}

.fixed {
  width: 100px;
  position: fixed;
  right: 10px;
}

@keyframes animateHeartOut {
  0% {
    transform: scale(1.4);
  }

  100% {
    transform: scale(1);
  }
}
</style>

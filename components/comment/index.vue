<template>
  <dl v-if="comment && !isCommentEdit">
    <dt class="full-width">
      <dl>
        <dt>
          <UserAvatar :user="comment.user" :tag="'span'" :has-router="true"></UserAvatar>
        </dt>
        <dd class="full-width">
          <div class="row items-center justify-between">
            <h2>
              <NuxtLink style="color:#000" :to="$localePath(`/${comment.user?.nickname}`)">
                {{ comment.user?.nickname }}</NuxtLink>
              <span class="font13">{{ dateFormat(comment.created_at) }}</span>
            </h2>
            <el-dropdown v-if="comment.user?.uid === user?.uid" trigger="click" ref="feedMenu"
              popper-class="tapl-more-dropdown">
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
          </div>
          <div style="color: #000">
            {{ commentContent }}
          </div>
          <p style="display: inline-block">
            <i v-if="isLiked" @click="unsetLike()" class="xi-heart like-icon pointer" style="color: red"></i>
            <i v-else class="uil uil-heart-sign pointer" @click="setLike()"></i>
            <span class="ml5">{{ $t('like') }} {{ likeCnt }}{{ $t('like.unit') }}</span>
          </p>
          <Recomment class="ml10" @recomment="emit('recomment', comment)" />
          <TranslateBtn :text="commentContent" @translatedText="translate" @untranslatedText="untranslatedText" />
          <p class="zem-color pointer" v-if="comment.children_comments?.length" @click="onClickRecomment">
            <i :class="isRecommentOpen ? 'uil uil-angle-up' : 'uil uil-angle-down'"></i>
            답글 {{ comment.children_comments?.length }}개
          </p>


        </dd>

      </dl>
      <div class="tapl-comment" v-if="comment.children_comments?.length">
        <ul>
          <li v-for="cmt in comment.children_comments">
            <Comment :comment="cmt" />
          </li>
        </ul>
      </div>
    </dt>


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
import Recomment from '~~/components/comment/Recomment.vue'
import { ElDropdown, ElDialog } from 'element-plus'
import { IComment } from '~~/types';
import { dateFormat } from '~~/scripts/utils'
import { PropType } from 'vue';

const { $localePath } = useNuxtApp()

const showDeleteModal = ref(false)
const isCommentEdit = ref(false)
const props = defineProps({
  comment: Object as PropType<IComment>,
  isEdit: {
    type: Boolean,
    default: false,
  },
})


const commentContent = ref(props.comment?.content || '')

const emit = defineEmits(['refresh', 'editComment', 'deleteComment', 'recomment'])
const isLiked = ref(props.comment.is_liked)
const likeCnt = ref(props.comment.like_cnt)

const isRecommentOpen = ref(false)

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

function onClickRecomment() {
  isRecommentOpen.value = !isRecommentOpen.value
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

.tapl-comment {
  padding: 10px 0px 10px 50px !important;
  width: 100%;

  ul {
    li {

      margin-top: 10px !important;
      padding-top: 0px !important;
    }
  }
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

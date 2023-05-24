<template>
  <li v-if="showComment" class="mt0 pb10">
    <dl style="border-top:0px;">
      <dt class="full-width">
        <dl>
          <dt v-if="!comment.deleted_at">
            <UserAvatar :user="comment.user" :tag="'span'" :has-router="true"></UserAvatar>
          </dt>
          <dd class="full-width">
            <div v-if="!comment.deleted_at" class="row items-center justify-between">
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
              <div class="cmt-chip-container">
                <div v-if="parentUser?.id && parentUser?.nickname" class="chip pointer"
                  @click="$router.push($localePath(`/${parentUser?.nickname}`))">
                  {{ '@' + parentUser?.nickname }}
                </div>
                {{ commentContent }}
              </div>
            </div>
            <template v-if="!comment.deleted_at">
              <p style="display: inline-block">
                <i v-if="isLiked" @click="unsetLike()" class="xi-heart like-icon pointer" style="color: red"></i>
                <i v-else class="uil uil-heart-sign pointer" @click="setLike()"></i>
                <span class="ml5">{{ $t('like') }} {{ likeCnt }}{{ $t('like.unit') }}</span>
              </p>
              <span class="pointer ml10" @click="emit('recomment', comment)">
                <i class="uil uil-edit-alt"></i>{{ $t('write.recomment') }}</span>
              <TranslateBtn :text="commentContent" @translatedText="translate" @untranslatedText="untranslatedText" />
            </template>

            <p class="zem-color pointer" v-if="recomments?.length" @click="onClickRecomment"
              :style="comment.deleted_at ? 'margin-left:35px' : ''">
              <i :class="isRecommentOpen ? 'uil uil-angle-up' : 'uil uil-angle-down'"></i>
              {{ $t('recomment') }} {{ recomments?.length }}{{ $t('unit') }}
            </p>
          </dd>
        </dl>
        <div class="tapl-comment recomment" v-if="filteredRecomments?.length" style="padding-bottom:0px !important">
          <ul>
            <!-- <TransitionGroup name="fade"> -->
            <Comment v-for="cmt in filteredRecomments" :key="cmt.content" :comment="cmt"
              @recomment="emit('recomment', cmt)" @refresh="emit('refresh')" @delete-recomment="deleteRecomment" />
            <!-- </TransitionGroup> -->
          </ul>
        </div>

        <div class="tapl-comment recomment" v-if="isRecommentOpen && recomments?.length">
          <ul>
            <!-- <TransitionGroup name="fade"> -->
            <Comment v-for="cmt in recomments" :key="cmt.content" :comment="cmt" @recomment="emit('recomment', cmt)"
              @refresh="emit('refresh')" @delete-recomment="deleteRecomment" />
            <!-- </TransitionGroup> -->
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
  </li>

  <CommentInput v-if="isCommentEdit" @refresh="refresh" @editComment="editComment" :postId="comment.post_id"
    :comment="comment" :isEdit="true" />
</template>

<script setup lang="ts">
import _ from 'lodash'
import { ElDropdown, ElDialog } from 'element-plus'
import { IComment } from '~~/types';
import { dateFormat } from '~~/scripts/utils'
import { PropType } from 'vue';

const { $localePath } = useNuxtApp()
const parentUser = reactive({
  id: null,
  nickname: null
})

const showDeleteModal = ref(false)
const isCommentEdit = ref(false)
const props = defineProps({
  comment: Object as PropType<IComment>,
  isEdit: {
    type: Boolean,
    default: false,
  },
  newRecomments: Array as PropType<IComment[]>,
})


const recomments = ref(props.comment?.children_comments)
const commentContent = ref(commentCheck(props.comment) || '')


const emit = defineEmits(['refresh', 'editComment', 'deleteComment', 'recomment', 'deleteRecomment'])

const isLiked = ref(props.comment.is_liked)
const likeCnt = ref(props.comment.like_cnt)

const isRecommentOpen = ref(false)


const filteredRecomments = computed(() => {
  const result = props.newRecomments?.filter((cmt) => {
    console.log(cmt)
    return cmt.parent_id === props.comment.id
  })

  console.log(result)
  return result
})


const showComment = computed(() => {
  if (props.comment.deleted_at && recomments.value?.length === 0) {
    return false
  } else if (props.comment && !isCommentEdit.value) {
    return true
  } else {
    return false
  }
  // (comment.deleted_at && recomments?.length > 0) && comment && !isCommentEdit
})

const { info: user, isLogin } = useUser().user.value

function commentCheck(cmt: IComment) {

  if (cmt?.parent_id) {
    parentUser.id = cmt.parent_id

    const nickname = cmt.content.indexOf('@') !== -1 ? cmt.content.slice(cmt.content.indexOf('@') + 1, cmt.content.indexOf(' ')) : null
    if (nickname) {
      parentUser.nickname = cmt.content.slice(cmt.content.indexOf('@') + 1, cmt.content.indexOf(' '))
      return cmt.content.slice(cmt.content.indexOf(' '));
    } else {
      return cmt.content

    }
  } else {
    return cmt.content
  }
}

function refresh(content: string) {
  isCommentEdit.value = !isCommentEdit.value
  commentContent.value = content

  emit('refresh', content)
}

function editComment(cmt: IComment) {

  isCommentEdit.value = !isCommentEdit.value
  const nickname = cmt.content.indexOf('@') !== -1 ? cmt.content.slice(cmt.content.indexOf('@') + 1, cmt.content.indexOf(' ')) : null

  if (nickname) {
    commentContent.value = cmt.content.slice(cmt.content.indexOf(' '))
    props.comment.content = '@' + nickname + ' ' + cmt.content.slice(cmt.content.indexOf(' '))
  } else {
    parentUser.nickname = null
    commentContent.value = cmt.content
    props.comment.content = cmt.content
  }
  emit('editComment', cmt)
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

    if (props.comment.parent_id) {
      emit('deleteRecomment', props.comment)
    } else {
      emit('deleteComment', props.comment)
    }
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

function deleteRecomment(comment: IComment) {

  recomments.value = recomments.value?.filter((elem) => {
    return elem.id !== comment.id
  })
  emit('deleteComment', comment)

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

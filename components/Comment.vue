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
                <NuxtLink style="color:#000" :to="$localePath(`/${commentUser.nickname}`)">
                  {{ commentUser.nickname }}</NuxtLink>
                <span class="font13">{{ dateFormat(comment.created_at) }}</span>
              </h2>
              <el-dropdown trigger="click" ref="feedMenu" popper-class="tapl-more-dropdown">
                <a slot="trigger">
                  <IconEllipsisH />
                </a>
                <template #dropdown>
                  <div slot="body" class="more-list">
                    <template v-if="comment.user?.uid === user?.uid">
                      <a @click="isCommentEdit = !isCommentEdit" class="pointer">{{
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
                <i v-else class="xi-heart-o" @click="setLike()"></i>
                <span class="ml5">{{ $t('like') }} {{ likeCnt }}{{ $t('like.unit') }}</span>
              </p>
              <span class="pointer ml10" @click="emit('recomment', comment)">
                {{ $t('write.recomment') }}</span>
              <TranslateBtn :text="commentContent" @translatedText="translate" @untranslatedText="untranslatedText" />
            </template>

            <p class="zem-color pointer flex items-center" v-if="recomments?.length" @click="onClickRecomment"
              :style="comment.deleted_at ? 'margin-left:35px' : ''">
              <IconAngleUp v-if="isRecommentOpen" color="#f97316" width="15px" />
              <IconAngleDown v-else color="#f97316" width="15px" />
              {{ $t('recomment') }} {{ recomments?.length }}{{ $t('unit') }}
            </p>
          </dd>
        </dl>
        <div class="tapl-comment recomment" v-if="filteredRecomments?.length" style="padding-bottom:0px !important">
          <ul>
            <Comment v-for="cmt in filteredRecomments" :key="cmt.content" :comment="cmt"
              @recomment="emit('recomment', cmt)" @refresh="emit('refresh')" @delete-recomment="deleteRecomment" />
          </ul>
        </div>

        <div class="tapl-comment recomment" v-if="isRecommentOpen && recomments?.length">
          <ul>
            <Comment v-for="cmt in recomments" :key="cmt.content" :comment="cmt" @recomment="emit('recomment', cmt)"
              @refresh="emit('refresh')" @delete-recomment="deleteRecomment" />
          </ul>
        </div>
      </dt>

      <ClientOnly>
        <el-dialog v-model="showDeleteModal" append-to-body class="modal-area-type" width="380px">
          <div class="modal-alert">
            <dl class="ma-header">
              <dt>{{ $t('information') }}</dt>
              <dd>
                <button @click="closeDeleteModal">
                  <IconClose />
                </button>
              </dd>
            </dl>
            <div class="ma-content">
              <h2>{{ $t('comment.delete.text') }}</h2>
              <div>
                <button class="btn-default w48p" @click="deleteComment">
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
    </dl>
  </li>

  <CommentInput v-if="isCommentEdit" @refresh="refresh" @editComment="editComment" :postId="comment.post_id"
    :comment="comment" :isEdit="true" />

  <ReportModal :openModal="showReportModal" :reportInfo="reportInfo" @closeModal="closeReportModal" />
</template>

<script setup lang="ts">
import _ from 'lodash'
import { ElDropdown, ElDialog } from 'element-plus'
import { IComment, eReportType } from '~~/types';
import { dateFormat } from '~~/scripts/utils'
import { PropType } from 'vue';

const { t, locale } = useI18n()

const { $localePath } = useNuxtApp()
const parentUser = reactive({
  id: null,
  nickname: null
})

const showDeleteModal = ref(false)
const isCommentEdit = ref(false)

watch(
  () => useCommon().common.value.isPopState,
  (val) => {
    if (!val) {
      closeDeleteModal()
      closeReportModal()
    }
  })

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
const isMobile = computed(() => useCommon().common.value.isMobile)


const emit = defineEmits(['refresh', 'editComment', 'deleteComment', 'recomment', 'deleteRecomment'])

const isLiked = ref(props.comment.is_liked)
const likeCnt = ref(props.comment.like_cnt)

const isRecommentOpen = ref(false)

const showReportModal = ref(false)
const reportInfo = ref()



const commentUser = computed(() => props.comment?.user)


let likeAcceessableCount = 2
let unlikeAcceessableCount = 2


const filteredRecomments = computed(() => {
  const result = props.newRecomments?.filter((cmt) => {
    return cmt.parent_id === props.comment.id
  })

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


async function setLike() {
  if (!isLogin) {
    useModal().openLoginModal()
    return
  }
  likeAcceessableCount = likeAcceessableCount - 1
  if (likeAcceessableCount > 0) {
    isLiked.value = true
    likeCnt.value++
    const { data, pending, error } = await useCustomAsyncFetch(
      `/post/${props.comment.post_id}/comment/${props.comment.id}/like`,
      getComFetchOptions('post', true)
    )
  }
  likeAcceessableCount = likeAcceessableCount + 1

}


async function unsetLike() {
  if (!isLogin) {
    useModal().openLoginModal()
    return
  }
  unlikeAcceessableCount = unlikeAcceessableCount - 1
  if (unlikeAcceessableCount > 0) {
    isLiked.value = false
    likeCnt.value--
    const { data, pending, error } = await useCustomAsyncFetch(
      `/post/${props.comment.post_id}/comment/${props.comment.id}/unlike`,
      getComFetchOptions('post', true)
    )
  }
  unlikeAcceessableCount = unlikeAcceessableCount + 1

}

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
  showReportModal.value = true
  if (isMobile.value) {
    useCommon().setPopState(true)
  }
}

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

function closeReportModal() {
  showReportModal.value = false
  if (isMobile.value) {
    useCommon().setPopState(false)
  }
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

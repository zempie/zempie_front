<template>
  <li>
    <div class="user-info row items-center w100p">
      <UserAvatar :user="comment.user" :has-router="true" tag="p" />
      <div class="column right w100p">
        <div class="flex row justify-between w100p align-center" style="margin-top:0px">
          <span class="name">{{ comment.user?.nickname }} {{ comment.user?.name }}</span>
          <CommentMenu v-if="hasOptions" :comment="comment" @delete-comment="deleteComment" ref="commentMenuRef" />
        </div>
        <span>{{ dateFormat(comment.created_at) }}</span>
      </div>
    </div>
    <p class="comment">
      {{ comment.content }}
    </p>
    <div class="options" v-if="hasOptions" style="justify-content: flex-start;">
      <!-- <p style="display: inline-block">
                      <i v-if="isLiked" @click="unsetLike()" class="xi-heart like-icon pointer" style="color: red"></i>
                      <i v-else class="uil uil-heart-sign pointer" @click="setLike()"></i>
                      <span class="ml5">{{ $t('like') }} {{ likeCnt }}{{ $t('like.unit') }}</span>
                    </p> -->
      <p class="zem-color pointer mr10" v-if="comment?.count_reply" @click="onClickRecomment"
        :style="comment.deleted_at ? 'margin-left:35px' : ''">
        <i :class="isRecommentOpen ? 'uil uil-angle-up' : 'uil uil-angle-down'"></i>
        {{ $t('recomment') }} {{ replyCount }}{{ $t('unit') }}
      </p>
      <span class="pointer" @click="opRecomment">
        <i class="uil uil-edit-alt"></i>{{ $t('write.recomment') }}
      </span>

    </div>
    <ul class="recomment" v-if="isRecommentOpen">
      <GameCommentItem v-for="cmt in recommentList" :comment="cmt" @delete-comment="deleteRecomment"
        :game-id="cmt.game_id" />
    </ul>
    <ul class="recomment" v-if="newReCmtList.length">
      <GameCommentItem v-for="cmt in newReCmtList" :comment="cmt" @delete-comment="deleteRecomment"
        :game-id="cmt.game_id" />
    </ul>
    <CommonInput v-if="showRecomment" ref="inputRef" placeholder="Message" @send-input="sendRecomment"
      class="mt10 justify-between pr10" />
  </li>
</template>
<script setup lang="ts">
import { ElDropdown } from 'element-plus';
import { PropType } from 'vue';
import { dateFormat } from '~~/scripts/utils'
import { IReply } from '~~/types';

const props = defineProps({
  comment: Object as PropType<IReply>,
  hasOptions: {
    type: Boolean,
    default: true
  },
  gameId: Number
})

const emit = defineEmits(['deleteComment'])

const replyCount = ref(props.comment.count_reply)

const showRecomment = ref(false)
const isRecommentOpen = ref(false)
const limit = ref(10)
const offset = ref(0)

const inputRef = ref()

const recommentList = ref<IReply[]>([])
const newReCmtList = ref<IReply[]>([])
const commentMenuRef = ref()

function opRecomment() {
  showRecomment.value = true
}

async function sendRecomment(text: string) {
  if (!text) return

  const payload = {
    game_id: props.gameId,
    reply_id: props.comment.id,
    target_uid: props.comment.user.uid,
    content: text
  }

  console.log(payload)

  const { data } = await useCustomAsyncFetch<{ result: IReply }>('/game/reply', getZempieFetchOptions('post', true, payload))
  if (data.value) {
    const { result } = data.value
    if (isRecommentOpen.value) {
      recommentList.value = [result, ...recommentList.value]
    } else {
      newReCmtList.value = [result, ...newReCmtList.value]
    }
    inputRef.value.initInput()
    replyCount.value += 1
    showRecomment.value = false
  }
}

async function onClickRecomment() {
  if (isRecommentOpen.value) {
    isRecommentOpen.value = false;
    return
  }
  isRecommentOpen.value = true

  //FIXME: limit 서버 수정해야됨 
  const payload = {
    reply_id: props.comment.id,
    limit: 500,
    offset: offset.value
  }
  const { data } = await useCustomAsyncFetch<{ result: { replies: IReply[] } }>(createQueryUrl('/game/rereply', payload), getZempieFetchOptions('get', true))

  if (data.value) {
    const { result } = data.value
    recommentList.value = result.replies
  }
}

async function deleteComment() {
  const { data, error } = await useCustomAsyncFetch<{ result: IReply }>(`/game/reply/${props.comment.id}`, getZempieFetchOptions('delete', true))

  if (data.value) {
    const { result } = data.value

    emit('deleteComment', result)
    commentMenuRef.value.closeDeleteModal()
  }
}

function deleteRecomment(cmt) {
  recommentList.value = recommentList.value.filter((comment) => {
    if (comment.id !== cmt.id) {
      return comment
    }
  })

  newReCmtList.value = newReCmtList.value.filter((comment) => {
    if (comment.id !== cmt.id) {
      return comment
    }
  })
  replyCount.value -= 1

  commentMenuRef.value.closeDeleteModal()

}
</script>
<style scoped lang="scss">
li {
  border-bottom: 1px solid #e9e9e9;
  padding: 10px 0px 10px 0px;

  .name {
    color: #333;
    font-weight: 500;
  }

  .menu {
    background: none;
    border: none;
  }

  ::v-deep(.picture) {
    height: 35px;
    width: 35px;
    margin-right: 10px;
  }

  .options {
    margin-top: 0px !important;
    margin-left: 45px;
    justify-content: flex-start;

    span {
      &:hover {
        color: #f97316;
      }
    }
  }
}

.recomment {
  margin-left: 45px;
}
</style>
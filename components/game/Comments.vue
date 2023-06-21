<template>
  <div class="ta-coment-list">
    <dl class="title">
      <dt>{{ $t('comments') }} <span class="count">({{ count }})</span></dt>
      <span class="pointer all-btn" @click="opCommentsModal">{{ $t('view.all') }}</span>
    </dl>
    <ul>
      <li class="mb10 comment-input">
        <CommonInput @send-input="sendComment" ref="inputRef" placeholder="Message" />
      </li>
      <GameCommentItem v-if="patialComments.length" v-for="comment in patialComments" :comment="comment" :key="comment.id"
        :has-options="false" @delete-comment="deleteComment" />

      <li v-else-if="!isPending && comments.length === 0" class="no-list">
        작성된 코멘트가 없습니다.
      </li>
      <li v-else="isPending" v-for="i in 5">
        <div class="user-info row items-center w100p" style="min-height: 50px;">
          <UserAvatarSk class="mr10" style="width:35px; height:35px" />
          <div class="column w100p">
            <span class="name w100p skeleton-animation" style="height: 10px;"></span>
            <span class="w50p skeleton-animation mt10" style="height: 10px;"></span>
          </div>
        </div>
        <p class="comment skeleton-animation"> </p>
      </li>
    </ul>

    <ClientOnly>
      <el-dialog v-model="showCommentModal" class="modal-area-type" width="500px">
        <div class="modal-alert">
          <dl class="ma-header">
            <dt>{{ $t('review') }}</dt>
            <dd>
              <button @click="showCommentModal = false">
                <i class="uil uil-times pointer"></i>
              </button>
            </dd>
          </dl>
          <div class="ma-content ta-coment-list">
            <ul ref="commentEl">
              <GameCommentItem v-if="comments.length" v-for="comment in comments" :comment="comment" :key="comment.id"
                :game-id="game.id" @delete-comment="deleteComment" @update-comment="updateComment" />
            </ul>
            <div>
              <CommonInput @send-input="sendComment" ref="inputRef" placeholder="Message" />
            </div>
          </div>
        </div>
      </el-dialog>
    </ClientOnly>
  </div>
</template>
<script setup lang="ts">
import { ElDropdown, ElDialog } from 'element-plus'
import { PropType } from 'vue'
import { IGame, IReply } from '~~/types'
import { useInfiniteScroll } from '@vueuse/core'

const COMMENT_LIMIT = 10
const inputRef = ref()
const patialComments = ref<IReply[]>([])
const comments = ref<IReply[]>([])
const count = ref(0)
const isPending = ref(true)

const limit = ref(COMMENT_LIMIT)
const offset = ref(0)

const showCommentModal = ref(false)
const commentEl = ref<HTMLElement | null>(null)
const isAddData = ref(false)

const props = defineProps({
  game: Object as PropType<IGame>
})


useInfiniteScroll(
  commentEl,
  async () => {
    if (isAddData.value) {
      offset.value += limit.value
      await getComments()
    }
  },
  { distance: 10 }
)

onMounted(async () => {
  try {
    const replies = await getComments()
    patialComments.value = replies.slice(0, 5)

  } finally {
    isPending.value = false
  }
})

async function getComments() {
  const payload = {
    game_id: props.game.id,
    limit: limit.value,
    offset: offset.value
  }
  const { data } = await useCustomAsyncFetch<{ result: { totalCount: number, replies: IReply[] } }>(createQueryUrl('/game/reply', payload), getZempieFetchOptions('get', true))
  if (data.value) {
    const { replies, totalCount } = data.value.result
    count.value = totalCount

    if (isAddData.value) {
      if (replies.length > 0) {
        comments.value = [...comments.value, ...replies]
      } else {
        isAddData.value = false
      }
    }
    else {
      comments.value = replies
      isAddData.value = true
    }
    return replies
  }

}


async function sendComment(text: string) {
  if (!text) return

  const payload = {
    game_id: props.game.id,
    content: text
  }


  const { data } = await useCustomAsyncFetch<{ result: IReply }>('/game/reply', getZempieFetchOptions('post', true, payload))
  if (data.value) {
    const { result } = data.value
    if (patialComments.value) {
      patialComments.value = [result, ...patialComments.value]
    } else {
      patialComments.value = [result]
    }
    inputRef.value.initInput()
  }
}

async function opCommentsModal() {
  showCommentModal.value = true
  initCommentList()
  await getComments()
}

function deleteComment(cmt) {
  comments.value = comments.value.filter((comment) => {
    if (comment.id !== cmt.id) {
      return comment
    }
  })
}

function initCommentList() {
  limit.value = COMMENT_LIMIT
  offset.value = 0
  comments.value = []
  isAddData.value = false
}

function updateComment(comment: IReply) {
  console.log('updateComment', comment)

  comments.value = comments.value.map((cmt: IReply) => {
    if (cmt.id === comment.id) {
      return {
        ...cmt,
        content: comment.content
      }
    } else {
      return cmt
    }

  })

}

</script>

<template>
  <ul class="ta-post post-ul">
    <li class="tap-list" ref="commentEl">
      <div class="content-area">
        <dl class="tapl-title">
          <dt class="w100p">
            <PostHeaderInfo :feed="feed">
              <template #followBtn>
                <UserFollowBtn :user="feed.user" class="follow-btn-feed" />
              </template>
            </PostHeaderInfo>
          </dt>
        </dl>

        <div class="tapl-content" v-html="feed?.content" style="max-height:none"></div>
        <template v-if="feed?.post_type === 'SNS' &&
          feed?.attatchment_files?.length === 1 &&
          feed?.attatchment_files[0].type === 'image'
          ">
          <img style="height: 88%; margin: 0 auto; display: flex" :src="feed?.attatchment_files[0].url"
            class="feed-img mt-3" />
        </template>
        <template v-else-if="feed?.post_type === 'SNS' &&
          feed?.attatchment_files &&
          feed?.attatchment_files.length > 0
          ">
          <div class="tapl-movie-img" v-if="attatchment_files[0].type === 'image'">
            <PostImgSwiper :images="attatchment_files" @update-blind="updateBlind" />
          </div>
          <div class="tapl-movie-img" v-else>
            <div v-for="file in feed?.attatchment_files" :key="file.id">
              <video class="sns-img" v-if="file.type === 'video'" width="320" height="240" controls
                :src="file.url"></video>
              <audio v-else-if="file.type === 'sound'" controls :src="file.url"></audio>
              <div class="audio" v-else-if="file.type === 'sound'">
                <audio controls :src="file.url"></audio>
                <p>{{ file?.name }}</p>
              </div>
            </div>
          </div>
        </template>
        <PostLinkPreview v-if="!isObjEmpty(feed.metadata)" :tag-info="feed.metadata" :is-edit="false" />

        <CommunityTarget :communities="feed?.posted_at?.community" :games="feed?.posted_at?.game" />
        <ul class="tapl-option">
          <PostActions :feed="feed" :comment-cnt="commentCount" />
          <li>
            <PostDropdown :feed="feed" @deletePost="$router.back()" @refresh="refresh" />
          </li>
        </ul>
      </div>

      <div class="tapl-comment" v-if="comments">
        <p>
          {{ $t('comment') }} {{ commentCount }}{{ $t('comment.count.unit') }}
        </p>
        <ul>
          <Comment v-for="comment in comments" :key="comment.content" :comment="comment" :isEdit="isCommentEdit"
            @refresh="commentRefresh" @editComment="editComment" @deleteComment="deleteComment" @recomment="getRecomment"
            :newRecomments="newRecomments" />
        </ul>
      </div>
      <div class="comment-input-container">
        <CommentInput :postId="feed?.id" @addComment="addComment" :recomment="recomment" />
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import _ from 'lodash'
import { PropType } from 'vue'
import { IComment, IFeed } from '~~/types'

import 'swiper/css/pagination';
import 'swiper/css';

import {
  dateFormat,
  execCommandCopy,
  htmlToDomElem,
  enDateFormat,
  isObjEmpty,
} from '~/scripts/utils'

import { useI18n } from 'vue-i18n'

import { useWindowScroll, useInfiniteScroll } from '@vueuse/core'

const { $localePath } = useNuxtApp()
const { x, y } = useWindowScroll()
const config = useRuntimeConfig()
const { t, locale } = useI18n()
const router = useRouter()

const COMMENT_LIMIT = 10

const limit = ref(COMMENT_LIMIT)
const offset = ref(0)
const sort = ref(null)
const comments = ref([])
const commentEl = ref<HTMLElement | null>(null)
const isAddData = ref(false)

const isCommentEdit = ref(false)
const totalComment = ref(0)

const attatchment_files = computed(() => {
  return props.feed.attatchment_files
    && (Array.isArray(props.feed.attatchment_files)
      ? props.feed.attatchment_files
      : JSON.parse(props.feed.attatchment_files))
})

useInfiniteScroll(
  commentEl,
  async () => {
    if (isAddData.value) {
      offset.value += limit.value
      await commentFetch()
    }
  },
  { distance: 10 }
)

const props = defineProps({
  feed: Object as PropType<IFeed>,
})

const commentCount = ref(props.feed?.comment_cnt || 0)

const swiperOption = ref({
  pagination: {
    el: '.swiper-pagination',
  },
})

const emit = defineEmits(['refresh', 'updateBlind'])

//대댓글
const recomment = ref()
const newRecomments = ref([])


onMounted(async () => {
  await commentFetch()
})

async function commentRefresh(comment?: any) {
  isCommentEdit.value = !isCommentEdit.value
  commentInit()
  await commentFetch()
}

function updateBlind(img) {
  emit('updateBlind', img)

}

function addComment(comment: IComment) {

  if (comment) {
    if (comment.parent_id) {
      if (recomment.value?.parent_id) {
        comment.parent_id = recomment.value.parent_id
      }

      newRecomments.value = [comment, ...newRecomments.value]

    } else {
      comments.value = [comment, ...comments.value]
    }
    commentCount.value += 1

  }

  recomment.value = null
}

function editComment(comment: IComment) {
  comments.value.map((elem: IComment) => {
    if (elem.id === comment.id) {
      elem.content = comment.content
    }
    return elem;
  })
}
async function deleteComment(comment: IComment) {

  const hasNewRecomments = newRecomments.value.find((elem) => {
    return elem.parent_id === comment.id
  })

  comments.value = comments.value.filter((elem: IComment) => {
    if (elem.id === comment.id) {
      if (elem.children_comments?.length || hasNewRecomments) {
        delete elem.user
        elem.deleted_at = String(Date.now())
        return elem.content = '삭제된 댓글입니다.'
      }
    } else {
      return elem.id !== comment.id
    }
  })

  commentCount.value -= 1

  if (comments.value.length < COMMENT_LIMIT && totalComment.value >= COMMENT_LIMIT) {
    offset.value = comments.value.length
    await commentFetch()
  }

  if (newRecomments.value.length) {
    newRecomments.value = newRecomments.value.filter((elem: IComment) => {
      return elem.id !== comment.id
    })
  }

}


function commentInit() {
  comments.value = []
  limit.value = COMMENT_LIMIT
  offset.value = 0
  sort.value = null
}

async function commentFetch() {
  const query = {
    offset: offset.value,
    limit: limit.value,
    sort: sort.value,
  }

  const { data, pending, error } = await useCustomAsyncFetch<{ result: [], totalCount: number }>(
    createQueryUrl(`/post/${props.feed.id}/comment/list`, query),
    getComFetchOptions('get', true)
  )

  if (data.value) {
    totalComment.value = data.value.totalCount
    if (comments.value.length < limit.value && data.value.result.length < limit.value && data.value.result.length > 0) {
      offset.value += limit.value
      commentFetch()
    }

    if (isAddData.value) {
      if (data.value.result.length > 0) {
        comments.value = [...comments.value, ...data.value.result]
      } else {
        isAddData.value = false
      }
    } else {
      comments.value = data.value.result
      isAddData.value = true
    }
  }


}


function getRecomment(comment: IComment) {
  recomment.value = comment
}

</script>

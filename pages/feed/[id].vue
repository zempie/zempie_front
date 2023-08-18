<template>
  <div v-if="isExist" class="content">
    <div class="area-view">
      <ul class="ta-post" v-if="feed">
        <li class="tap-list">
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
            <div class="tapl-movie-img" v-if="feed?.attatchment_files[0].type === 'image'">
              <PostImgSwiper :images="attatchment_files" />
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
          <a v-if="!isObjEmpty(feed.metadata)" :href="feed.metadata?.url" target="_blank">

            <PostLinkPreview v-if="!isObjEmpty(feed.metadata)" :tag-info="feed.metadata" :is-edit="false" />
          </a>

          <CommunityTarget :communities="postedCommunity(feed?.posted_at)" :games="postedGame(feed?.posted_at)" />

          <ul class="tapl-option">
            <PostActions :feed="feed" :comment-cnt="commentCount" />
            <li>
              <PostDropdown :feed="feed" @deletePost="$router.back()" @refresh="refresh" />
            </li>
          </ul>
          <div class="tapl-comment" v-if="comments">
            <p>
              {{ $t('comment') }} {{
                commentCount
              }}{{ $t('comment.count.unit') }}
            </p>

            <ul ref="commentEl" style="max-height:700px; overflow-y: scroll;">
              <Comment v-for="comment in comments" :key="comment.content" :comment="comment" :isEdit="isCommentEdit"
                @refresh="commentRefresh" @editComment="editComment" @deleteComment="deleteComment"
                @recomment="getRecomment" :newRecomments="newRecomments" />
            </ul>
            <CommentInput :postId="feed?.id" @addComment="addComment" :recomment="recomment" />

          </div>
        </li>
      </ul>
      <ul class="ta-post" v-else>
        <ClientOnly>
          <li class="tap-list">
            <dl class="tapl-title">
              <dt>
                <dl>
                  <dt>
                    <UserAvatarSk style="width: 40px; height: 40px" />
                  </dt>
                  <dd>
                    <h2 class="grey-text skeleton-animation mb10" style="width: 300px; ">
                    </h2>
                    <p class="grey-text skeleton-animation mb10" style="width: 150px; "></p>
                  </dd>
                </dl>
              </dt>
            </dl>

            <div class="tapl-content grey-text skeleton-animation" style="margin: 20px; padding: 20px"></div>
            <ul class="tapl-option">
              <li>
                <ul>
                  <li>
                    <i class="uil uil-comment-alt-dots" style="font-size: 22px"></i>&nbsp;
                  </li>
                  <li>
                    <a><i class="uil uil-share-alt" style="font-size: 20px"></i>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ClientOnly>
      </ul>
    </div>
  </div>
  <div v-else class="content">
    <div class="area-view">
      <ul class="ta-post">
        <li class="tap-list flex column items-center
        content-center" style="min-height: 500px;">
          <div class="flex content-center items-center "
            style="background-color:#ededed; height: 70px; width:70px; border-radius: 50%;">
            <i class="uil uil-exclamation-triangle font30 zem-color"></i>
          </div>
          <p class="mt30 mb30 text-bold font16"> {{ $t('not.exist.post') }}</p>
          <button class="btn-default" @click="$router.push($localePath('/'))">{{ $t('to.home') }}</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { dateFormat, execCommandCopy, getFirstDomElementByServer, stringToDomElemByServer, isObjEmpty, } from '~~/scripts/utils'
import shared from '~~/scripts/shared'
import { IComment } from '~~/types'

const { $localePath } = useNuxtApp()


const COMMENT_LIMIT = 10
const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()
const config = useRuntimeConfig()
const comments = ref<IComment[]>()
const limit = ref(COMMENT_LIMIT)
const offset = ref(0)
const sort = ref(null)
const commentEl = ref<HTMLElement | null>(null)

const swiperOption = ref({
  pagination: {
    el: '.swiper-pagination',
  },
})
const feedId = computed(() => route.params.id as string)
const commentCnt = ref(0)

const observer = ref<IntersectionObserver>(null)
const triggerDiv = ref()
const isAddData = ref(false)


const isCommentEdit = ref(false)

//대댓글
const recomment = ref()
const newRecomments = ref([])


//에러
const isExist = ref(true)



const attatchment_files = computed(() => {
  return feed.value.attatchment_files
    && (Array.isArray(feed.value.attatchment_files)
      ? feed.value.attatchment_files
      : JSON.parse(feed.value.attatchment_files))
})

definePageMeta({
  layout: 'header-only',
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


const {
  data: feed,
  error,
  pending,
  refresh,
} = await useAsyncData<any>('feed', () =>
  $fetch(`/post/${feedId.value}`, getComFetchOptions('get', true)),
  {
    initialCache: false
  }
)
setHead()
const commentCount = ref(feed.value?.comment_cnt || 0)

const postedCommunity = (posted_at) => {
  if (posted_at) {
    const [postedTarget] = posted_at

    return postedTarget.community
      .filter(com => 'group' in com)
      ?.map((com) => ({
        community_id: com.id,
        channel: com.channel,
        channel_id: com.channel_id,
        community: com.group
      })
      )
  }
}

const postedGame = (posted_at) => {
  if (posted_at) {
    const [postedTarget] = posted_at

    return postedTarget.game
      ?.map((game) =>
      ({
        id: game.id,
        game: game.game
      })
      )
  }
}

onMounted(async () => {
  await commentFetch()
})

async function handleIntersection(target: any) {
  if (target.isIntersecting) {
    if (isAddData.value) {
      offset.value += limit.value
      await commentFetch()
    }
  }
}

async function commentFetch() {
  const query = {
    limit: limit.value,
    offset: offset.value,
    sort: sort.value,
  }

  const { data, pending, refresh, error } = await useCustomAsyncFetch<{ result: [] }>(
    createQueryUrl(`/post/${feedId.value}/comment/list`, query),
    getComFetchOptions('get', true)
  )
  if (error.value) {
    isExist.value = false
  } else if (data.value) {
    const { result } = data.value
    if (isAddData.value) {
      if (result.length > 0) {
        comments.value = [...comments.value, ...result]
      } else {
        isAddData.value = false
        // observer.value.unobserve(triggerDiv.value)
      }
    } else {
      comments.value = result
      isAddData.value = true
    }
  }
  return
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

async function deleteComment(comment: IComment) {

  const hasNewRecomments = newRecomments.value.find((elem) => {
    return elem.parent_id === comment.id
  })

  if (newRecomments.value.length) {
    newRecomments.value = newRecomments.value.filter((elem: IComment) => {
      return elem.id !== comment.id
    })
  }

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

  if (comments.value.length < COMMENT_LIMIT && commentCount.value >= COMMENT_LIMIT) {
    offset.value = comments.value.length
    await commentFetch()
  }

}

function editComment(comment: IComment) {

  const newComment = comments.value.map((cmt: IComment) => {
    if (comment.id === cmt.id) {
      return { ...cmt, content: comment.content }
    }
    return cmt
  })
  comments.value = newComment

}

async function setHead() {

  if (feed.value) {
    const content = stringToDomElemByServer(feed.value.content);

    const h1Tag = content.querySelector('h1');
    const h2Tag = content.querySelector('h2');
    const h3Tag = content.querySelector('h3');
    const img = content.querySelector('img');
    const video = content.querySelector('video');
    const audio = content.querySelector('audio');


    let attatchment_files = feed.value.attatchment_files
      && (Array.isArray(feed.value.attatchment_files)
        ? feed.value.attatchment_files
        : JSON.parse(feed.value.attatchment_files))

    const [attr] = attatchment_files || []


    let imgMeta = img?.attrs.src || attr?.type === 'image' && attr?.url

    let title = h1Tag?.innerText || h2Tag?.innerText || h3Tag?.innerText;

    const firstDom = getFirstDomElementByServer(feed.value.content)
    let desc = firstDom?.innerText.slice(0, 50)

    if (!desc) {
      if (img) {
        desc = img.attrs?.title || img.attrs?.alt || '이미지'
      }
      else if (video) {
        desc = '동영상'
      }
      else if (audio) {
        desc = audio.attrs?.title || '오디오'
      }
      else if (attr) {
        desc = attr.name
      }
    }
    if (!title) {
      title = desc.length ? desc.slice(0, 20) : feed.value?.user.name
    }

    console.log('img', imgMeta)
    shared.createHeadMeta(title, desc, imgMeta)

  }
}

async function translate(text: string) {
  feed.value.content = text
}

function untranslatedText(originText: string) {
  feed.value.content = originText
}

function copyUrl() {
  execCommandCopy(window.location.href)
  ElMessage({
    message: t('copied.clipboard'),
    type: 'success',
  })
}


async function commentRefresh(comment?: any) {
  isCommentEdit.value = !isCommentEdit.value
  commentInit()
  await commentFetch()
}



function getRecomment(comment: IComment) {
  recomment.value = comment
}

function commentInit() {
  comments.value = []
  limit.value = COMMENT_LIMIT
  offset.value = 0
  sort.value = null
}
</script>

<style lang="scss" scoped>
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.fade-leave-active {
  position: absolute;
}

.tapl-movie-img {
  padding-bottom: 0px !important;
  height: auto !important;

  div {
    audio {
      display: flex;
      align-items: center;
      border-radius: 5px;
      background: #f5f5f5;
      flex-direction: column;
      width: 95%;
      margin: 20px auto;

      p {
        width: 100%;
        height: 30px;
        padding-left: 20px;
      }
    }
  }
}

.feed-img {
  max-width: 100%;
}

.sns-img {
  width: 100%;
}

.audio {
  margin: 20px 20px 0 20px;
  display: flex;
  align-items: center;
  border-radius: 5px;
  background: #f5f5f5;
  flex-direction: column;

  audio {
    width: 100%;
  }

  p {
    width: 100%;
    height: 30px;
    padding-left: 20px;
  }
}

input[type='radio']+label {
  display: inline-block;
  width: 22px;
  height: 22px;
  text-align: center;
  font-size: 15px;
  color: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  cursor: pointer;
}

input[type='radio']:checked+label {
  color: #fff;
  background: #ff6e17;
  border-color: #ff6e17;
}

input[type='radio'] {
  display: none;
}

.tapl-comment {
  .comment:nth-child(1) {
    border-top: 0px;
  }
}
</style>

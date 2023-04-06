<template>
  <div class="content">

    <div class="area-view">
      <ul class="ta-post" v-if="feed">
        <li class="tap-list">
          <dl class="tapl-title">
            <dt class="w100p">
              <PostHeaderInfo :feed="feed">
              </PostHeaderInfo>
            </dt>

            <dd>
              <UserFollowBtn :user="feed.user" class="follow-btn-feed" />
            </dd>
          </dl>

          <div class="tapl-content" v-html="feed?.content" style="max-height:none"></div>
          <template v-if="
            feed?.post_type === 'SNS' &&
            feed?.attatchment_files?.length === 1 &&
            feed?.attatchment_files[0].type === 'image'
          ">
            <img style="height: 88%; margin: 0 auto; display: flex" :src="feed?.attatchment_files[0].url"
              class="feed-img mt-3" />
          </template>
          <template v-else-if="
            feed?.post_type === 'SNS' &&
            feed?.attatchment_files &&
            feed?.attatchment_files.length > 0
          ">
            <div class="tapl-movie-img" v-if="feed?.attatchment_files[0].type === 'image'">
              <swiper class="swiper" :options="swiperOption" style="height: 350px">
                <template v-for="file in feed?.attatchment_files">
                  <swiper-slide>
                    <img style="height: 88%; margin: 0 auto; display: flex" v-if="file.type === 'image'" :src="file.url"
                      class="feed-img mt-3" />
                  </swiper-slide>
                </template>
                <div class="swiper-pagination" slot="pagination"></div>
              </swiper>
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
          <PostLinkPreview :tag-info="feed.metadata" :is-edit="false" />

          <CommunityTarget :communities="postedCommunity(feed?.posted_at)" :games="postedGame(feed?.posted_at)" />

          <ul class="tapl-option">
            <li>
              <ul>
                <LikeBtn v-if="feed" :feed="feed" />
                <li>
                  <i class="uil uil-comment-alt-dots" style="font-size: 22px"></i>&nbsp;
                  {{ feed?.comment_cnt }}
                </li>

                <li @click="copyUrl">
                  <a><i class="uil uil-share-alt" style="font-size: 20px"></i>
                  </a>
                </li>
              </ul>
            </li>

            <li>
              <PostDropdown :feed="feed" @deletePost="$router.back()" @refresh="refresh" />
            </li>
          </ul>
          <div class="tapl-comment" v-if="comments">
            <p>
              {{ $t('comment') }} {{
                feed?.comment_cnt
              }}{{ $t('comment.count.unit') }}
            </p>
            <CommentInput :postId="feed?.id" @refresh="commentFetch" @addComment="addComment" />
            <ul>
              <TransitionGroup name="fade">
                <li v-for="comment in comments" :key="comment.id" class="comment">
                  <Comment :comment="comment" @refresh="commentFetch" @deleteComment="deleteComment"
                    @editComment="editComment" :key="comment.content" />
                </li>
              </TransitionGroup>
            </ul>
          </div>
          <div ref="triggerDiv"></div>
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
                    <h2 class="grey-text skeleton-animation" style="width: 300px; margin-bottom: 10px">
                    </h2>

                    <p class="grey-text skeleton-animation" style="width: 150px; margin-bottom: 10px"></p>
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
</template>

<script setup lang="ts">
import hljs from 'highlight.js'
import _ from 'lodash'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

import { Swiper, SwiperSlide } from 'swiper/vue'

import { dateFormat, execCommandCopy, getFirstDomElementByServer, stringToDomElemByServer, enDateFormat, } from '~~/scripts/utils'
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

const swiperOption = ref({
  pagination: {
    el: '.swiper-pagination',
  },
})
const feedId = computed(() => route.params.id as string)

const observer = ref<IntersectionObserver>(null)
const triggerDiv = ref()
const isAddData = ref(false)

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
  hljs.configure({
    ignoreUnescapedHTML: true,
  })
  document.querySelectorAll('pre').forEach((block) => {
    hljs.highlightElement(block)
  })
  if (feed.value) {
    observer.value = new IntersectionObserver(
      (entries) => {
        handleIntersection(entries[0])
      },
      { root: null, threshold: 1 }
    )
    observer.value.observe(triggerDiv.value)
  }
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

  const { data, pending, refresh } = await useFetch<{ result: [] }>(
    createQueryUrl(`/post/${feedId.value}/comment/list`, query),
    getComFetchOptions('get', true)
  )

  if (data.value) {
    const { result } = data.value
    if (isAddData.value) {
      if (result.length > 0) {
        comments.value = [...comments.value, ...result]
      } else {
        isAddData.value = false
        observer.value.unobserve(triggerDiv.value)
      }
    } else {
      comments.value = result
      isAddData.value = true
    }
  }
  return
}

function addComment(comment: IComment) {
  comments.value = [comment, ...comments.value]

}

function deleteComment(commentId: string) {
  comments.value = comments.value.filter((comment: IComment) => {
    return comment.id !== commentId
  })

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

    const [attr] = feed.value.attatchment_files || []


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
</script>

<style lang='scss' scoped>
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

<template>
  <div class="content">
    <div class="area-view">
      <ul class="ta-post" v-if="feed">
        <li class="tap-list">
          <dl class="tapl-title">
            <dt>
              <dl>
                <dt>
                  <UserAvatar :user="feed?.user" :tag="'span'" />
                </dt>
                <dd v-if="feed?.user">
                  <h2>{{ feed?.user?.name }}</h2>
                  <span>
                    <i class="uis uis-clock" style="color: #c1c1c1"></i>
                    {{ dateFormat(feed?.created_at) }}
                  </span>
                  <TranslateBtn
                    :text="feed.content"
                    @translatedText="translate"
                    @untranslatedText="untranslatedText"
                  />
                </dd>
                <dd v-else>
                  <h2>{{ $t('feed.noUser.post') }}</h2>
                  <p>
                    <i class="uis uis-clock" style="color: #c1c1c1"></i>
                    {{ dateFormat(feed?.created_at) }}
                  </p>
                </dd>
              </dl>
            </dt>
            <dd>
              <UserFollowBtn :user="feed.user" class="follow-btn-feed" />
            </dd>
          </dl>

          <div class="tapl-content" v-html="feed?.content"></div>
          <template
            v-if="
              feed?.post_type === 'SNS' &&
              feed?.attatchment_files?.length === 1 &&
              feed?.attatchment_files[0].type === 'image'
            "
          >
            <img
              style="height: 88%; margin: 0 auto; display: flex"
              :src="feed?.attatchment_files[0].url"
              class="feed-img mt-3"
            />
          </template>
          <template
            v-else-if="
              feed?.post_type === 'SNS' &&
              feed?.attatchment_files &&
              feed?.attatchment_files.length > 0
            "
          >
            <div
              class="tapl-movie-img"
              v-if="feed?.attatchment_files[0].type === 'image'"
            >
              <swiper
                class="swiper"
                :options="swiperOption"
                style="height: 350px"
              >
                <template v-for="file in feed?.attatchment_files">
                  <swiper-slide>
                    <img
                      style="height: 88%; margin: 0 auto; display: flex"
                      v-if="file.type === 'image'"
                      :src="file.url"
                      class="feed-img mt-3"
                    />
                  </swiper-slide>
                </template>
                <div class="swiper-pagination" slot="pagination"></div>
              </swiper>
            </div>
            <div class="tapl-movie-img" v-else>
              <div v-for="file in feed?.attatchment_files" :key="file.id">
                <video
                  class="sns-img"
                  v-if="file.type === 'video'"
                  width="320"
                  height="240"
                  controls
                  :src="file.url"
                ></video>
                <audio
                  v-else-if="file.type === 'sound'"
                  controls
                  :src="file.url"
                ></audio>
                <div class="audio" v-else-if="file.type === 'sound'">
                  <audio controls :src="file.url"></audio>
                  <p>{{ file?.name }}</p>
                </div>
              </div>
            </div>
          </template>

          <ul class="tapl-option">
            <li>
              <ul>
                <LikeBtn v-if="feed" :feed="feed" />
                <li>
                  <i
                    class="uil uil-comment-alt-dots"
                    style="font-size: 22px"
                  ></i
                  >&nbsp;
                  {{ feed?.comment_cnt }}
                </li>

                <li @click="copyUrl">
                  <a
                    ><i class="uil uil-share-alt" style="font-size: 20px"></i>
                  </a>
                </li>
              </ul>
            </li>

            <li>
              <PostDropdown
                :feed="feed"
                @deletePost="$router.back()"
                @refresh="refresh"
              />
            </li>
          </ul>
          <div class="tapl-comment" v-if="comments">
            <p>
              {{ $t('comment') }} {{ feed?.comment_cnt
              }}{{ $t('comment.count.unit') }}
            </p>
            <CommentInput :postId="feed?.id" @refresh="commentFetch" />
            <ul>
              <TransitionGroup name="fade">
                <li
                  v-for="comment in comments"
                  :key="comment.id"
                  class="comment"
                >
                  <Comment :comment="comment" @refresh="commentFetch" />
                </li>
              </TransitionGroup>
            </ul>
          </div>
          <div ref="triggerDiv"></div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import hljs from 'highlight.js'
import _ from 'lodash'
import { ElMessage, ElDropdown, ElDialog } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useLocalePath } from 'vue-i18n-routing'

import { Swiper, SwiperSlide } from 'swiper/vue'
import { dateFormat, execCommandCopy } from '~~/scripts/utils'
const localePath = useLocalePath()

const COMMENT_LIMIT = 10
const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()
const config = useRuntimeConfig()
const createdDate = ref('')
const comments = ref([])

const limit = ref(COMMENT_LIMIT)
const offset = ref(0)
const sort = ref(null)

const swiperOption = ref({
  pagination: {
    el: '.swiper-pagination',
  },
})
const userInfo = ref(computed(() => useUser().user.value.info))
const feedId = computed(() => route.params.id as string)

const observer = ref<IntersectionObserver>(null)
const triggerDiv = ref()
const isAddData = ref(false)

const {
  data: feed,
  error,
  pending,
  refresh,
} = await useAsyncData('feed', () =>
  $fetch(`/post/${feedId.value}`, getComFetchOptions('get', true))
)

setHead()

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

async function setHead() {
  if (feed.value) {
    useHead({
      title: `${feed.value?.user.name}${t('seo.feed.title')} | Zempie`,
      meta: [
        {
          name: 'description',
          content: `${feed.value?.content.slice(0, 20)}${t('seo.feed.desc')}`,
        },
        {
          name: 'og:title',
          content: `${feed.value?.user.name}${t('seo.feed.title')}`,
        },
        {
          name: 'og:description',
          content: `${feed.value?.content.slice(0, 20)}${t('seo.feed.desc')}`,
        },
        {
          name: 'og:url',
          content: `${config.ZEMPIE_URL}${route.path}`,
        },
      ],
    })
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

input[type='radio'] + label {
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

input[type='radio']:checked + label {
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

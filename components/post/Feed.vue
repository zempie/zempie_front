<template>
  <li class="tap-list" v-if="feed">
    <dl class="tapl-title">
      <dt class="w100p">
        <dl>
          <dt>
            <NuxtLink :to="$localePath(`/channel/${feed.user?.channel_id}`)">
              <UserAvatar :user="feed.user" :tag="'span'"></UserAvatar>
            </NuxtLink>
          </dt>

          <dd v-if="feed.user?.name">
            <h2 class="user-name">
              {{ feed.user?.name
              }}<span> uploaded a {{ feed.post_type }} post </span>
            </h2>
            <p>
              <i class="uis uis-clock" style="color: #c1c1c1"></i>
              <span v-if="locale === 'ko'">
                {{ dateFormat(feed.created_at) }}</span
              >
              <span v-else> {{ enDateFormat(feed.created_at) }}</span>
              <TranslateBtn
                :text="feedContent"
                @translatedText="translate"
                @untranslatedText="untranslatedText"
              />
            </p>
          </dd>
          <dd v-else>
            <h2>{{ t('feed.noUser.post') }}</h2>
            <p>
              <i class="uis uis-clock" style="color: #c1c1c1"></i>
              {{ dateFormat(feed.created_at) }}
            </p>
          </dd>

          <slot name="followBtn"></slot>
          <!-- <UserFollowBtn
            :user="user"
            class="follow-btn-feed"
            @refresh="refreshFollow"
          /> -->
        </dl>
      </dt>
      <dd v-if="feed.user?.name">
        <PostDropdown
          :feed="feed"
          @deletePost="emit('refresh')"
          @refresh="emit('refresh')"
        />
      </dd>
    </dl>

    <div>
      <div
        ref="feedDiv"
        class="tapl-content"
        v-html="feedContent"
        @click="$router.push($localePath(`/feed/${feed.id}`))"
      ></div>

      <div v-if="isOverflow" :class="isMoreView ? '' : 'gradient'"></div>
    </div>

    <template v-if="isOverflow">
      <div v-if="!isMoreView" class="more-container">
        <span> <hr class="dot-line" /> </span
        ><a class="pointer" @click="moreView"> {{ t('moreView') }} </a
        ><span>
          <hr class="dot-line" />
        </span>
      </div>

      <div v-else class="more-container">
        <span> <hr class="dot-line" /> </span
        ><a @click="closeView">{{ t('closeView') }} </a
        ><span>
          <hr class="dot-line" />
        </span>
      </div>
    </template>
    <template v-if="initFiles?.length && feed.post_type === 'SNS'">
      <div class="video" v-if="initFiles[0].type === 'video'">
        <video
          style="width: 100%; height: auto"
          controls
          :src="initFiles[0].url"
        ></video>
      </div>
      <div
        v-else-if="initFiles[0].type === 'sound'"
        v-for="file in initFiles"
        class="audio"
      >
        <audio controls :src="file.url"></audio>
        <p>{{ file.name }}</p>
      </div>
      <img
        v-else-if="initFiles?.length === 1"
        style="width: 100%; margin: 0 auto; display: flex"
        :src="initFiles[0].url"
        class="feed-img mt-3"
      />

      <swiper
        v-else
        class="swiper"
        :modules="[Pagination]"
        style="height: 350px"
        :pagination="{ clickable: true }"
        :options="swiperOption"

      >
        <swiper-slide v-for="file in initFiles">
          <img
            v-if="file.type === 'image'"
            style="height: 88%; margin: 0 auto; display: flex"
            :src="file.url"
            class="feed-img mt-3"
          />
        </swiper-slide>
        <div class="swiper-pagination" style="bottom: 10px; left: 0; width: 100%;" slot="pagination"></div>
      </swiper>
    </template>

    <CommunityTarget :communities="feed?.posted_at?.community" :games="feed?.posted_at?.game" />

    <ul class="tapl-option">
      <li>
        <ul>
          <LikeBtn :feed="feed" />
          <li @click="openComments">
            <i
              class="uil uil-comment-alt-dots pointer"
              style="font-size: 22px;"
            ></i>
            {{ feed.comment_cnt }}
          </li>
          <li>
            <a @click="copyUrl"
              ><i class="uil uil-share-alt pointer" style="font-size: 20px"></i
            ></a>
          </li>
        </ul>
      </li>
    </ul>

    <!-- TODO: mobile: 댓글만 보기 -->
    <ClientOnly>
      <div
        v-show="isOpenedComments"
        :class="['tapl-comment', isOpenedComments ? 'open' : 'close']"
      >
        <ul ref="commentEl" style="overflow-y: scroll;max-height: 500px;">
          <li v-for="comment in comments" :key="comment.id">
            <Comment
              :comment="comment"
              :isEdit="isCommentEdit"
              @refresh="commentRefresh"
            >
              <!-- <template #commentEdit>
              <a @click="isCommentEdit = !isCommentEdit">{{ t('comment.edit') }}</a>
            </template> -->
            </Comment>
          </li>
        </ul>
        <!-- <CommentInput :postId="feed.id" @sendComment="editDone" @updateComment="updateDone" /> -->

        <CommentInput :postId="feed.id" @refresh="commentRefresh" />
      </div>
    </ClientOnly>
    <ClientOnly>
      <el-dialog
        v-model="showDeletePostModal"
        append-to-body
        class="modal-area-type"
        width="380px"
      >
        <div class="modal-alert">
          <dl class="ma-header">
            <dt>{{ t('information') }}</dt>
            <dd>
              <button @click="showDeletePostModal = false">
                <i class="uil uil-times"></i>
              </button>
            </dd>
          </dl>
          <div class="ma-content">
            <h2>
              {{ t('post.delete.modal.text1') }} <br />{{
                t('post.delete.modal.text2')
              }}
            </h2>
            <div>
              <button class="btn-default w48p" @click="deletePost">
                {{ t('delete') }}
              </button>
              <button
                class="btn-gray w48p"
                @click="showDeletePostModal = false"
              >
                {{ t('no') }}
              </button>
            </div>
          </div>
        </div>
      </el-dialog>
    </ClientOnly>
  </li>
</template>

<script setup lang="ts">
import Prism from '~/plugins/prism'
import _ from 'lodash'
import { PropType } from 'vue'
import { IFeed } from '~~/types'
import { Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { ElMessage, ElDialog } from 'element-plus'

import 'swiper/css/pagination';
import 'swiper/css';

import {
  dateFormat,
  execCommandCopy,
  htmlToDomElem,
  enDateFormat,
} from '~/scripts/utils'

import { useI18n } from 'vue-i18n'

// import hljs from 'highlight.js'
import { useWindowScroll, useInfiniteScroll } from '@vueuse/core'

const { $localePath } = useNuxtApp()
const { x, y } = useWindowScroll()
const config = useRuntimeConfig()
const { t, locale } = useI18n()
const router = useRouter()

const COMMENT_LIMIT = 5
const MAX_FEED_HEIGHT = 450

const feedMenu = ref()
const showDeletePostModal = ref(false)
const feedId = ref(null)
const feedDiv = ref<HTMLElement>()

const isMoreView = ref(false)
const currScroll = ref(0)

const limit = ref(COMMENT_LIMIT)
const offset = ref(0)
const sort = ref(null)
const comments = ref([])
const isOpenedComments = ref(false)
const commentEl = ref<HTMLElement | null>(null)
const isAddData = ref(false)

const isCommentEdit = ref(false)
const editorKey = ref(0)

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


const swiperOption = ref({
  pagination: {
    el: '.swiper-pagination',
  },
})
const user = ref(props.feed?.user)

const feedContent = ref(props.feed?.content || '')

const emit = defineEmits(['refresh'])

const attatchment_files = computed(() => {
  return props.feed?.attatchment_files?.length
    ? Array.isArray(props.feed.attatchment_files)
      ? props.feed.attatchment_files
      : JSON.parse(props.feed.attatchment_files as string)
    : null
})

const isOverflow = computed(() => {
  return feedDiv.value?.clientHeight > MAX_FEED_HEIGHT ? true : false
})

const initFiles = _.cloneDeep(attatchment_files.value)

onMounted(() => {
  Prism.highlightAll()
  const dom = props.feed?.content && htmlToDomElem(props.feed.content)
})

async function commentRefresh() {
  commentInit()
  isCommentEdit.value = !isCommentEdit.value
  await commentFetch()
}
async function openComments() {
  commentInit()
  isOpenedComments.value = !isOpenedComments.value

  if (isOpenedComments.value && props.feed.comment_cnt > 0) {
    await commentFetch()
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

  const { data, pending, error } = await useCustomAsyncFetch<{ result: [] }>(
    createQueryUrl(`/post/${props.feed.id}/comment/list`, query),
    getComFetchOptions('get', true)
  )

  if (data.value) {
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

  // async comments(post_id: string, obj: any) {
  //     return await this.request('get', `${communityApi}post/${post_id}/comment/list`, obj, false)
  // }

  // this.$api.comments(this.feed.id, obj)
  //     .then((res: any) => {
  //         if (this.isAddData) {
  //             if (res.result.length > 0) {
  //                 this.comments = [...this.comments, ...res.result]
  //             }
  //             else {
  //                 // console.log('no data')
  //             }
  //         }
  //         else {
  //             this.comments = res.result;
  //             this.isAddData = true
  //         }
  //     })
  //     .catch((err: AxiosError) => {

  //     })
  //     .finally(() => {

  //     })
}

//     likeListFetch() {
//         const obj = {
//             post_id: this.feed.id,
//             limit: this.limit,
//             offset: this.offset
//         }
//         this.$api.likeList(obj)
//             .then((res: AxiosResponse) => {
//                 this.likeList = res;
//             })
//             .catch((err: AxiosError) => {

//             })

//     }

function copyUrl() {
  execCommandCopy(`${config.ZEMPIE_URL}/feed/${props.feed.id}`)

  ElMessage.closeAll()
  ElMessage({
    message: t('copied.clipboard'),
    type: 'success',
  })
}

//     moveHashtag(hashtag: string) {
//         this.$router.push(`/${this.$i18n.locale}/search?hashtag=${hashtag}`)
//     }

//     pinPost() {
//         console.log("pinned");
//     }

//     closeModal() {
//         this.$modal.hide('noUser')

//     }

async function deletePost() {
  const { data, error, pending } = await post.delete(feedId.value)

  if (!error.value) {
    ElMessage({
      message: t('posting.deleted'),
      type: 'success',
    })
    emit('refresh')
  }
  showDeletePostModal.value = false
}

//     report() {
//         this.$emit('reportPost', this.feed.id)
//         this.isOpenReportModal = !this.isOpenReportModal
//         this.$modal.show('modalReport')
//     }

function moreView() {
  feedDiv.value.style.maxHeight = '100%'

  isMoreView.value = true
  currScroll.value = y.value
}

function closeView() {
  feedDiv.value.style.maxHeight = '500px'
  isMoreView.value = false
  window.scrollTo(0, currScroll.value)
}

async function translate(text: string) {
  feedContent.value = text
}

function untranslatedText(originText: string) {
  feedContent.value = originText
}

//     /**
//      * 댓글
//      * */

//     deleteComment(commentId: string) {
//         this.commentCnt--;
//         this.commentInit();
//         this.$api.deleteComment(this.feed.id, commentId)
//             .then((res: AxiosResponse) => {
//                 this.commentFetch()
//             })
//             .catch((err: AxiosError) => {

//             })
//     }

//     editDone(comment:any) {
//         this.commentCnt++;
//         this.comments = [comment, ...this.comments]

//         // this.commentInit();
//         // this.commentFetch()
//     }

//     updateDone() {
//         // this.commentInit();
//         // this.commentFetch()
//     }

//     /**
//      * 유저 신고
//      */

//     userReportModalOpen() {
//         this.$emit('reportUser', this.feed.user.id)
//         // this.isOpenReportModal = !this.isOpenReportModal
//         this.$modal.show('modalUserReport')
//     }
</script>

<style lang="scss" scoped>
// .tapl-title {
//   dt {
//     width: 100%;

//     dl {
//       dt {
//         width: 15%;
//       }
//       dd {
//         width: 80%;
//       }
//     }
//   }
// }

// transition

.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.5s ease;
}

.component-fade-enter-from,
.component-fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

// /transition

// 더보기
// .gradient {
//   background: linear-gradient(to top, #fff, #ededed00);
//   height: 50px;
//   width: 100%;
//   position: relative;
//   bottom: 50px;
// }

// .more-container {
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   padding: 20px 20px 0 20px;

//   span,
//   a {
//     flex: 1;
//   }

//   a {
//     display: flex;
//     align-items: center;
//     justify-content: center;
//   }

//   .dot-line {
//     border-top: 1px dashed;
//   }
// }
// .tapl-content {
//   max-height: 500px;
// }
// /더보기

.tapl-comment {
  ul {
    max-height: 500px;
    overflow-y: scroll;
    li:nth-child(1) {
      border-top: none;
      margin-top: 0px;
    }
  }
}

.like-icon:hover,
.comment-icon:hover {
  cursor: pointer;
}


.content-grid {
  transform: translate(199.5px, 0px);
  transition: transform 0.4s ease-in-out 0s;
}

.icon-thumbs-up.active,
.icon-comment.active {
  fill: #4ff461;
  opacity: 1;
}

.thumbs-up.active,
.post-option-text.active {
  color: #fff;
}

.reaction {
  top: 5px;
}

#copied {
  z-index: 999999;
}

.checkbox-wrap input[type='checkbox']:checked + .checkbox-box .icon-check,
.checkbox-wrap input[type='radio']:checked + .checkbox-box .icon-check {
  fill: #ffffff;
}

.checkbox-wrap .checkbox-box .icon-check {
  fill: transparent;
  transition: fill 0.2s ease-in-out;
}

.content-actions {
  height: 92px;
  flex-direction: column;

  .meta-line {
    margin-right: 10px;
    width: 100%;
    margin-top: 16px;
  }
}

.post-icon-wrap {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}

.icon-pinned {
  fill: #616a82;
}

.icon-pinned.active {
  fill: #f39800;
  opacity: 1;
}

.orgin-img-modal {
  .modal-dialog {
    max-width: 100% !important;
  }
}

// .feed-img {
//   padding: 20px 20px 0 20px;
//   max-width: 100%;
// }

.video {
  width: 100%;
  padding: 20px 20px 0 20px;
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

// .swiper-button-next,
// .swiper-button-prev {
//   --swiper-navigation-color: #999;
//   --swiper-navigation-size: 20px;

//   &:hover {
//     --swiper-navigation-color: #ff6216;
//   }
// }

.tapl-comment.close {
  animation: fade-out 1s;
  animation-fill-mode: forwards;
}

.tapl-comment.open {
  animation: fade-in 0.5s;
  animation-fill-mode: forwards;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes fade-out {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

@media all and (max-width: 479px) {
  .tapl-title {
    .user-name {
      span {
        display: none;
      }
    }
  }
}
</style>

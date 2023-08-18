<template>
  <li class="tap-list" v-if="feed">
    <dl class="tapl-title">
      <dt class="w100p">
        <PostHeaderInfo :feed="feed">
          <template #followBtn>
            <slot name="followBtn"></slot>
          </template>
        </PostHeaderInfo>
      </dt>
      <dd v-if="feed.user?.name">
        <PostDropdown :feed="feed" @deletePost="emit('refresh')" @refresh="emit('refresh')" />
      </dd>
    </dl>

    <div>
      <div ref="feedDiv" class="tapl-content" v-html="feedContent">
      </div>

      <div v-if="isOverflow" :class="isMoreView ? '' : 'gradient'"></div>
    </div>

    <template v-if="isOverflow">
      <div v-if="!isMoreView" class="more-container">
        <span>
          <hr class="dot-line" />
        </span><a class="pointer" @click="moreView"> {{ t('moreView') }} </a><span>
          <hr class="dot-line" />
        </span>
      </div>
      <div v-else class="more-container">
        <span>
          <hr class="dot-line" />
        </span><a @click="closeView">{{ t('closeView') }} </a><span>
          <hr class="dot-line" />
        </span>
      </div>
    </template>
    <template v-if="attatchment_files?.length && feed.post_type === 'SNS'">
      <div class="video" v-if="attatchment_files[0].type === 'video'">
        <video style="width: 100%; height: auto" controls :src="attatchment_files[0].url"></video>
      </div>
      <div v-else-if="attatchment_files[0].type === 'sound'" v-for="file in attatchment_files" class="audio">
        <audio controls :src="file.url"></audio>
        <p>{{ file.name }}</p>
      </div>
      <PostImage v-else-if="attatchment_files?.length === 1" :img="attatchment_files[0]" @update-blind="updateBlind" />

      <swiper v-else class="swiper" :modules="[Pagination]" style="height: 350px" :pagination="{ clickable: true }"
        :options="swiperOption">
        <swiper-slide v-for="file in attatchment_files" class="flex items-center content-center w100p"
          style="height:88%;">
          <PostImage v-if="file.type === 'image'" :img="file" @update-blind="updateBlind" />
          <!-- <img v-if="file.type === 'image'" style="max-height:100%; margin: 0 auto; display: flex" :src="file.url"
            class="feed-img mt-3" /> -->
        </swiper-slide>
        <div class="swiper-pagination" style="bottom: 10px; left: 0; width: 100%;" slot="pagination"></div>
      </swiper>

    </template>

    <a v-if="!isObjEmpty(feed.metadata)" :href="feed.metadata?.url" target="_blank">
      <PostLinkPreview :tag-info="feed.metadata" :isEdit="false" class="link-preview" />
    </a>
    <CommunityTarget :communities="feed?.posted_at?.community" :games="feed?.posted_at?.game" />

    <ul class="tapl-option">
      <PostActions :feed="feed" :is-comment-closed="true" @open-comment="openComments" :comment-cnt="commentCount" />
    </ul>
    <ClientOnly>
      <el-dialog v-model="showDeletePostModal" class="modal-area-type" width="380px">
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
              <button class="btn-gray w48p" @click="showDeletePostModal = false">
                {{ t('no') }}
              </button>
            </div>
          </div>
        </div>
      </el-dialog>
    </ClientOnly>
    <ClientOnly>
      <el-dialog v-model="isOpenedComments" class="modal-area-type" width="650px" :fullscreen="isFullScreen"
        @close="openComments(false)">
        <div class="modal-alert comment-modal bg-white">
          <dl class="ma-header bg-white">
            <button @click="isOpenedComments = false" class="pointer mobile-back-btn"
              style="background-color: transparent; border: none; font-size: 24px; color:#333">
              <i class="uil uil-angle-left-b"></i>
            </button>
            <dt>{{ feed.user.nickname }}님의 게시물</dt>
            <dd>
              <button @click="isOpenedComments = false" class="pointer close-btn">
                <i class="uil uil-times"></i>
              </button>
            </dd>
          </dl>
          <div>
            <PostFeed :feed="feed" />
          </div>
        </div>
      </el-dialog>
    </ClientOnly>
  </li>
</template>

<script setup lang="ts">
/**
 * 타임라인에서 보이는 post에서 사용 가능
 */
import _ from 'lodash'
import { PropType } from 'vue'
import { IComment, IFeed } from '~~/types'
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
  isObjEmpty,
} from '~/scripts/utils'

import { useI18n } from 'vue-i18n'

import { useWindowScroll, useInfiniteScroll } from '@vueuse/core'

const { $localePath } = useNuxtApp()
const { x, y } = useWindowScroll()
const config = useRuntimeConfig()
const { t, locale } = useI18n()
const router = useRouter()

const COMMENT_LIMIT = 5
const MAX_FEED_HEIGHT = 450

const showDeletePostModal = ref(false)
const feedId = ref(null)
const feedDiv = ref<HTMLElement>()
const isDragging = ref(false)

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
const totalComment = ref(0)

//반응형
const isFullScreen = ref(false)

const isMobile = computed(() =>
  window.matchMedia('screen and (max-width: 767px)')
)
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
const user = ref(props.feed?.user)

const feedContent = ref(props.feed?.content || '')

const emit = defineEmits(['refresh', 'updateBlind'])

//대댓글
const recomment = ref()
const newRecomments = ref([])


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

// const initFiles = _.cloneDeep(attatchment_files.value)

onMounted(() => {
  const dom = props.feed?.content && htmlToDomElem(props.feed.content)
  onResize()
  window.addEventListener('resize', onResize)


})

function onResize() {
  isFullScreen.value = isMobile.value.matches ? true : false
}

async function openComments(isOpenComment: boolean) {
  isOpenedComments.value = isOpenComment

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



async function deletePost() {
  const { data, error, pending } = await useCustomAsyncFetch(`/post/${feedId.value}`, getComFetchOptions('delete', true))

  if (!error.value) {
    ElMessage({
      message: t('posting.deleted'),
      type: 'success',
    })
    emit('refresh')
  }
  showDeletePostModal.value = false
}


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

function onMouseDown() {
  isDragging.value = false
}
function onMouseUp() {
  if (!isDragging.value) {
    // router.push($localePath(`/feed/${props.feed.id}`))

  }
  isDragging.value = false
}

function getRecomment(comment: IComment) {
  recomment.value = comment
}

function updateBlind(img) {
  emit('updateBlind', img)

}

</script>

<style lang="scss" scoped>
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

/* .fade-leave-active below version 2.1.8 */
  {
  opacity: 0;
}

.link-preview {
  box-shadow: none;
  margin: 20px;
  cursor: pointer;
}

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

.checkbox-wrap input[type='checkbox']:checked+.checkbox-box .icon-check,
.checkbox-wrap input[type='radio']:checked+.checkbox-box .icon-check {
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

.comment-modal {
  max-height: 100%;

  .mobile-back-btn {
    display: none;
  }

  .close-btn {
    display: block;
  }

  .ma-header {
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
  }

  :deep(.tap-list) {
    margin: 0px;
  }
}

@media all and (max-width: 767px) {
  .comment-modal {

    .ma-header {

      .mobile-back-btn {
        display: block;
      }

      .close-btn {
        display: none;
      }

    }
  }
}
</style>

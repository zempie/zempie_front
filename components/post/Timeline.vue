<template>
  <ul class="ta-post">
    <dd>
      <div class="ta-message-send" v-if="isMine">
        <p>
          <UserAvatar :user="user" :tag="'span'"></UserAvatar>
        </p>
        <dl>
          <dt>
            <input
              v-if="isSubscribed"
              type="text"
              :placeholder="t('postModalInput')"
              readonly
              @click="
                isLogin
                  ? (isTextEditorOpen = true)
                  : useModal().openLoginModal()
              "
            />
            <slot v-else name="inputBox" />
          </dt>
          <dd>
            <a><i class="uil uil-message"></i></a>
          </dd>
        </dl>
      </div>

      <div
        v-if="$route.meta.name === 'userChannel'"
        class="tab-search-swiper mobile"
      >
        <div class="swiper-area uppercase">
          <div class="swiper-slide" style="width: 50%; cursor: pointer">
            <a @click="timelineFilter()" :class="media ?? 'active'">
              <p><i class="uil uil-clock-three"></i>TIMELINE</p>
            </a>
          </div>
          <div class="swiper-slide" style="width: 50%; cursor: pointer">
            <NuxtLink
              :to="localePath(`/channel/${paramId}/games`)"
              @click.native="timelineFilter('game')"
              :class="media === 'game' ? 'active' : ''"
            >
              <p><i class="uil uil-map-pin-alt"></i>GAME</p>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- <div class="ta-message-block" v-else-if="ableToPost() === 'block'">
                <i class="uil uil-exclamation-triangle"></i>
                {{ t('post.modal.block.text') }}
            </div> -->
      <ul class="ta-post">
        <div v-if="isPending" class="ta-post-none bg-grey-1">
          <p></p>
        </div>
        <TransitionGroup name="fade" v-else-if="!isPending && feeds?.length">
          <PostFeed
            v-for="feed in feeds"
            :feed="feed"
            :key="feed.id"
            @refresh="refresh"
          />
        </TransitionGroup>
        <div v-else class="ta-post-none">
          <p>
            <span><i class="uil uil-layers-slash"></i></span>
          </p>
          <h2>{{ t('timeline.noPost') }}</h2>
        </div>
      </ul>
      <div ref="triggerDiv"></div>
      <!-- style="width: 10px; height: 10px; background-color: red" -->
    </dd>

    <ClientOnly>
      <el-dialog
        v-model="isTextEditorOpen"
        append-to-body
        custom-class="modal-area-type"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="closeEditor"
        width="700px"
      >
        <TextEditor
          @closeModal="isTextEditorOpen = false"
          :type="type"
          @refresh="refresh"
          :key="editorKey"
          :channelInfo="channelInfo"
        />
      </el-dialog>
    </ClientOnly>
  </ul>
</template>

<script setup lang="ts">
import _ from 'lodash'
import { PropType } from 'vue'
import { IComChannel, IFeed } from '~~/types'
import { useI18n } from 'vue-i18n'
import {
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElSelect,
  ElOption,
  ElMessage,
  ElDialog,
} from 'element-plus'

import { useLocalePath } from 'vue-i18n-routing'
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
const { t, locale } = useI18n()

const LIMIT_SIZE = 30

const route = useRoute()
const localePath = useLocalePath()
const config = useRuntimeConfig()

const feeds = ref<IFeed[]>([])
const isPending = ref(true)

const isTextEditorOpen = ref(false)
const isEditorDestroy = ref(false)
const editorKey = ref(0)

const observer = ref<IntersectionObserver>(null)
const triggerDiv = ref()
const limit = ref(LIMIT_SIZE)
const offset = ref(0)
const media = ref(route.query?.media || null)
const isAddData = ref(false)

const user = computed(() => useUser().user.value.info)
const isLogin = computed(() => useUser().user.value.isLogin)
const gameInfo = computed(() => useGame().game.value.info)

const paramId = computed(() => route.params.id as string)
// const gameId = computed(() => route.params.id as string)

const props = defineProps({
  type: String,
  ableToPost: {
    type: Boolean,
    default: true,
  },
  isSubscribed: {
    type: Boolean,
    default: true,
  },
  isMine: {
    type: Boolean,
    default: true,
  },
  channelInfo: Object as PropType<IComChannel>,
})

const watcher = watch(
  () => route.query,
  (query) => {
    if (query.media) {
      media.value = query.media as string

      refresh()
    } else if (route.meta.name === 'communityChannel') {
      refresh()
    }
  }
)

const userWatcher = watch(
  () => user.value,
  (userInfo) => {
    if (route.meta.name === 'myTimeline' && userInfo?.id) {

      refresh()
    }
  }
)

onMounted(async () => {
  if (paramId.value || route.meta.name === 'myTimeline') {
    const result = await fetch()
    if (result) {
      observer.value = new IntersectionObserver(
        async (entries) => {
          await handleIntersection(entries[0])
        },
        { root: null, threshold: 1 }
      )

      observer.value.observe(triggerDiv.value)
    }
  }
})

async function handleIntersection(target) {
  if (target.isIntersecting) {
    if (isAddData.value) {
      offset.value += limit.value
      await fetch()
    }
  }
}

onBeforeUnmount(() => {
  initPaging()
  watcher()
  userWatcher()
})

async function fetch() {
  const query = {
    limit: limit.value,
    offset: offset.value,
    media: media.value,
  }
  switch (props.type) {
    case 'community':
      if (props.channelInfo) {
        const { data, error, refresh } = await useFetch<{
          result: []
          totalCount: number
        }>(
          createQueryUrl(
            `/timeline/${paramId.value}/channel/${props.channelInfo.id}`,
            query
          ),
          getComFetchOptions('get', true)
        )
        if (data.value) {
          dataPaging(data.value)
        }
        isPending.value = false
        return isAddData.value
      } else {
        const { data, error, refresh } = await useFetch<{
          result: []
          totalCount: number
        }>(
          createQueryUrl(`/timeline/${paramId.value}/post`, query),
          getComFetchOptions('get', true)
        )
        if (data.value) {
          dataPaging(data.value)
        }
        isPending.value = false
        return isAddData.value
      }

    case 'user':
      const { data: userPostData } = await useFetch<{
        result: IFeed[]
        totalCount: number
      }>(
        createQueryUrl(`/timeline/channel/${paramId.value}`, query),
        getComFetchOptions('get', true)
      )

      if (userPostData.value) {
        dataPaging(userPostData.value)
      }
      isPending.value = false
      return isAddData.value
    case 'userAll':
      const { data: userAllPostData } = await useFetch<{
        result: IFeed[]
        totalCount: number
      }>(
        createQueryUrl(`/timeline/mine`, query),
        getComFetchOptions('get', true)
      )

      if (userAllPostData.value) {
        dataPaging(userAllPostData.value)
      }
      isPending.value = false
      return isAddData.value

    // return isAddData.value

    case 'game':
      const { data: gamePostData, error: gameError } = await useFetch<{
        result: []
        totalCount: number
      }>(
        createQueryUrl(`/timeline/game/${paramId.value}`, query),
        getComFetchOptions('get', true)
      )
      if (gamePostData.value) {
        dataPaging(gamePostData.value)
      }
      isPending.value = false
      return isAddData.value
  }
}

function dataPaging(data: { result: IFeed[]; totalCount: number }) {
  const { result, totalCount } = data
  const validFeed = result.filter((feed) => {
    return feed.id !== null
  })
  const uniqueResult = _.uniqBy(validFeed, 'id')

  if (isAddData.value) {
    if (result.length > 0) {
      feeds.value = [...feeds.value, ...uniqueResult]
    } else {
      isAddData.value = false
      observer.value.unobserve(triggerDiv.value)
    }
  } else {
    feeds.value = uniqueResult
    isAddData.value = true
  }
}

function initPaging() {
  limit.value = LIMIT_SIZE
  offset.value = 0
  isAddData.value = false
  feeds.value = []
}

async function refresh() {
  initPaging()
  await fetch()
}

function timelineFilter(selected?: string) {
  media.value = selected
}

function closeEditor() {
  isEditorDestroy.value = true
  editorKey.value = Date.now()
}
</script>

<style scoped lang="scss">
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

.pw-reset {
  padding-bottom: 44px !important;
  padding-top: 44px !important;
}

.pw-reset .pr-content > p {
  display: flex !important;
  justify-content: space-between !important;
}

.btn-default {
  width: 48% !important;
  border-radius: 20px;
}

.quick-post {
  height: 100px;

  .quick-post-body {
    height: 100%;
    display: flex;
  }

  .form-row {
    height: 100%;
  }
}

.entry-post-container {
  border-radius: 10px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100%;
}

.user-avatar {
  display: flex;
}

textarea {
  height: 57px !important;
  width: 500px !important;
  padding: 14px 18px;
}

.block-alarm {
  background-color: red;
  border-radius: 5px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
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

.tab-search-swiper {
  &.mobile {
    display: none;
  }
}

@media all and (max-width: 479px) {
  .ta-message-send {
    margin-top: 20px;
  }

  .tab-search-swiper {
    &.mobile {
      display: block;
      width: 100%;
      margin: 20px 0px 20px 0px;
    }
  }
}

@media all and (min-width: 480px) and (max-width: 767px) {
  .ta-message-send {
    margin-top: 20px;
  }

  .tab-search-swiper {
    &.mobile {
      display: block;
      width: 100%;
      margin: 20px 0px 20px 0px;
    }
  }
}

@media all and (min-width: 768px) and (max-width: 991px) {
  .ta-message-send {
    margin-top: 20px;
  }

  .tab-search-swiper {
    &.mobile {
      display: block;
      width: 100%;
      margin: 20px 0px 20px 0px;
    }
  }
}

@media all and (min-width: 992px) and (max-width: 1199px) {
}
</style>

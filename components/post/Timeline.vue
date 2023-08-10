<template>
  <ul class="ta-post">
    <!-- <iframe id="player" type="text/html" width="640" height="360" src="https://www.youtube.com/embed/P18SutoOFPE"
      frameborder="0"></iframe> -->
    <dd>
      <div class="ta-message-send" v-if="isMine">
        <p>
          <UserAvatar :user="user" :tag="'span'"></UserAvatar>
        </p>
        <dl>
          <dt>
            <input v-if="isSubscribed" type="text" :placeholder="t('postModalInput')" readonly @click="
              isLogin
                ? (isTextEditorOpen = true)
                : useModal().openLoginModal()
              " />
            <slot v-else name="communityInput" />
          </dt>
          <dd>
            <!-- <a><i class="uil uil-message"></i></a> -->
          </dd>
        </dl>
      </div>

      <div v-if="$route.meta.name === 'userChannel'" class="tab-search-swiper mobile">
        <div class="swiper-area uppercase">
          <div class="swiper-slide" style="width: 50%; cursor: pointer">
            <a :class="media ?? 'active'">
              <p><i class="uil uil-clock-three"></i>TIMELINE</p>
            </a>
          </div>
          <div class="swiper-slide" style="width: 50%; cursor: pointer">
            <NuxtLink :to="$localePath(`/${paramId}/games`)" :class="media === 'game' ? 'active' : ''">
              <p><i class="uil uil-map-pin-alt"></i>GAME</p>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- TODO: 차단 기능 추가시 적용 -->
      <!-- <div class="ta-message-block" v-else-if="ableToPost() === 'block'">
                <i class="uil uil-exclamation-triangle"></i>
                {{ t('post.modal.block.text') }}
            </div> -->
      <ul class="ta-post">
        <PostFeedSk v-if="isPending" v-for="feed in 6" :key="feed" />
        <TransitionGroup name="fade" v-else-if="!isPending && feeds?.length">
          <PostFeed v-for="feed in feeds" :feed="feed" :key="feed.id" @refresh="refresh"
            @update-blind="(img) => updateBlind(feed, img)">
            <template #followBtn>
              <UserFollowBtn :user="feed.user" :key="`${feed.user.is_following}`" class="follow-btn-feed"
                @refresh="refreshFollow" />
            </template>
          </PostFeed>
        </TransitionGroup>
        <div v-else class="ta-post-none">
          <p>
            <span><i class="uil uil-layers-slash"></i></span>
          </p>
          <h2>{{ t('timeline.noPost') }}</h2>
        </div>
      </ul>
      <div ref="triggerDiv"></div>
    </dd>

    <PostModal :isTextEditorOpen="isTextEditorOpen">
      <template #textEditor>
        <TextEditor @closeModal="isTextEditorOpen = false" :type="type" @refresh="refresh"
          :isFullScreen="usePost().post.value.isFullScreen" />
        <!-- :channelInfo="channelInfo" -->
      </template>
    </PostModal>
  </ul>
</template>

<script setup lang="ts">
import _ from 'lodash'
import { PropType } from 'vue'
import { IComChannel, ICommunity, IFeed } from '~~/types'
import { useI18n } from 'vue-i18n'
import shared from '~~/scripts/shared'
const { t, locale } = useI18n()

const LIMIT_SIZE = 10

const route = useRoute()
const { $localePath } = useNuxtApp()

const config = useRuntimeConfig()

const feeds = ref<IFeed[]>([])
const isPending = ref(true)

const isTextEditorOpen = ref(false)

const observer = ref<IntersectionObserver>(null)
const triggerDiv = ref<Element>()
const limit = ref(LIMIT_SIZE)
const offset = ref(0)
const media = computed(() => route.query?.media || null)
const isAddData = ref(false)

const user = computed(() => useUser().user.value.info)
const isLogin = computed(() => useUser().user.value.isLogin)

const paramId = computed(() => route.params.id as string)

const isBlocked = computed(() => {
  console.log('useChannel().userChannel.valu', useChannel().userChannel.value)
  return useChannel().userChannel.value.info.is_blocked
})



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
})

const isMobile = computed(() =>
  window.matchMedia('screen and (max-width: 767px)')
)


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
    if (route.meta.name === 'main' && userInfo?.id) {
      refresh()
    }
  }
)

onMounted(async () => {
  console.log('isBlocked', isBlocked)
  if (isBlocked.value) {
    isPending.value = false
    return
  }

  const result = await fetch()
  if (result && triggerDiv.value) {
    observer.value = new IntersectionObserver(
      async (entries) => {
        await handleIntersection(entries[0])
      },
      { root: null, threshold: 1 }
    )

    observer.value.observe(triggerDiv.value)
  }
})

onBeforeUnmount(() => {
  initPaging()
  watcher()
  userWatcher()
})

async function handleIntersection(target) {
  if (target.isIntersecting) {
    if (isAddData.value) {
      offset.value += limit.value
      await fetch()
    }
  }
}

async function fetch() {
  const query = {
    limit: limit.value,
    offset: offset.value,
    media: media.value,
  }

  switch (props.type) {
    case 'community':
      const channelName = computed(() => route.params.channel_name)
      const channel = useCommunity().community.value.info?.channels?.find(
        (channel) => {
          return channel.title === channelName.value
        }
      )
      if (channel) {
        const { data, error, refresh } = await useCustomAsyncFetch<{
          result: []
          totalCount: number
        }>(
          createQueryUrl(
            `/timeline/${paramId.value}/channel/${channel.id}`,
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
        const { data, error, refresh } = await useCustomAsyncFetch<{
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
      const channelId = computed(() => useChannel().userChannel.value.info.channel_id)

      if (!channelId.value) {
        const userId = route.params.id as string
        await useChannel().getChannelInfo(userId)
      }
      const { data: userPostData } = await useCustomAsyncFetch<{
        result: IFeed[]
        totalCount: number
      }>(
        createQueryUrl(`/timeline/channel/${channelId.value}`, query),
        getComFetchOptions('get', true)
      )

      if (userPostData.value) {
        dataPaging(userPostData.value)
      }
      isPending.value = false
      return isAddData.value
    case 'userAll':
      const { data: userAllPostData } = await useCustomAsyncFetch<{
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

    case 'game':
      colorLog('fetch', 'red')

      const { data: gamePostData, error: gameError } = await useCustomAsyncFetch<{
        result: []
        totalCount: number
      }>(
        createQueryUrl(`/timeline/game/${paramId.value}`, query),
        getComFetchOptions('get', true)
      )
      if (gamePostData.value) {
        console.table(gamePostData.value)

        dataPaging(gamePostData.value)
      }
      isPending.value = false
      return isAddData.value
  }
}

function dataPaging(data: { result: IFeed[]; totalCount: number }) {
  const { result, totalCount } = data
  if (result.length) {
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

function refreshFollow(user_id: number) {
  feeds.value
    .filter((feed) => {
      return feed.user_id === user_id
    })
    .map((feed) => {
      feed.user.is_following = !feed.user.is_following
      return feed
    })
}

function updateBlind(feed: IFeed, img) {
  feeds.value = feeds.value
    .map((feed1) => {
      if (feed1.id === feed.id) {
        const attFiles = shared.toArray(feed1.attatchment_files)
        return {
          ...feed1,
          attatchment_files: attFiles
            .map((file) => {
              if (file.url === img.url) {
                return {
                  ...file,
                  is_blind: !file.is_blind
                }
              }
              return file
            })
        }
      }
      return feed1
    })
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

.pw-reset .pr-content>p {
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

@media all and (min-width: 992px) and (max-width: 1199px) {}
</style>

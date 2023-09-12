<template>
  <li>
    <i v-if="!isLiked" @click="setLike" class="xi-heart-o like-icon"
      style="font-size: 22px; color: #ff6e17; cursor: pointer"></i>
    <i v-else @click="unsetLike" class="xi-heart like-icon" style="font-size: 22px; color: #ff6e17; cursor: pointer"></i>
    <span :class="likeCnt >= 1 && 'like-list pointer'" @click="showLikeFetch">
      {{ likeCnt }}</span>
  </li>
  <ClientOnly>
    <el-dialog v-model="isLikeHistoryOpen" class="modal-area-type" width="500px" :before-close="onCloseLike">
      <div class="modal-alert modal-like">
        <dl class="ma-header">
          <dt>{{ $t('like') }}</dt>
          <dd>
            <button @click="closeHistory" class="pointer">
              <IconClose />
            </button>
          </dd>
        </dl>
        <ul class="ma-content" ref="likeEl">
          <li v-for="like in likeList" :key="like.id">
            <div @click="moveUserChannel(like.user.nickname)">
              <UserAvatar :user="like.user" style="width: 40px; height: 40px" />
            </div>
            <div>
              <h2 @click="moveUserChannel(like.user.nickname)">
                {{ like.user.name }}
              </h2>
            </div>
            <div>
              <UserFollowBtn v-if="isLogin" :user="like.user" :customClass="'small-btn'" style="width: 100%" />
            </div>
          </li>
        </ul>
      </div>
    </el-dialog>
  </ClientOnly>
</template>

<script setup lang="ts">
import _ from 'lodash'
import { useInfiniteScroll } from '@vueuse/core'
import { ElDialog } from 'element-plus'
import { IUser } from '~~/types';
import { debounce } from '~/scripts/utils'

const { $localePath } = useNuxtApp()
const router = useRouter()

const props = defineProps({
  feed: Object,
})
const emit = defineEmits(['refresh'])

const LIKE_LIMIT = 10

const isLiked = ref(props.feed.liked)
const likeCnt = ref(props.feed.like_cnt)

const isLikeHistoryOpen = ref(false)
const likeList = ref<{ id: string, post_id: string, user: IUser }[]>()
const likeEl = ref<HTMLElement | null>()
const isAddData = ref(false)
const limit = ref(LIKE_LIMIT)
const offset = ref(0)

const isLogin = computed(() => useUser().user.value.isLogin)

let likeAcceessableCount = 2
let unlikeAcceessableCount = 2


useInfiniteScroll(
  likeEl,
  async () => {
    if (isAddData.value) {
      offset.value += limit.value
      await showLikeFetch()
    }
  },
  { distance: 10 }
)

function onCloseLike() {
  isLikeHistoryOpen.value = false
  resetList()
}

async function setLike() {
  if (!isLogin.value) {
    useModal().openLoginModal()
    return
  }
  likeAcceessableCount = likeAcceessableCount - 1
  if (likeAcceessableCount > 0) {
    isLiked.value = true
    likeCnt.value++
    const { data, error } = await useCustomAsyncFetch(`/post/${props.feed.id}/like`, getComFetchOptions('post', true))
  }
  likeAcceessableCount = likeAcceessableCount + 1
}

async function unsetLike() {
  if (!isLogin.value) {
    useModal().openLoginModal()
    return
  }
  unlikeAcceessableCount = unlikeAcceessableCount - 1
  if (unlikeAcceessableCount > 0) {
    isLiked.value = false
    likeCnt.value--
    const { data, error } = await useCustomAsyncFetch(`/post/${props.feed.id}/unlike`, getComFetchOptions('post', true))


  }
  unlikeAcceessableCount = unlikeAcceessableCount + 1
}


const showLikeFetch = debounce(async () => {

  if (likeCnt.value < 1) return

  const query = {
    offset: offset.value,
    limit: limit.value,
  }

  isLikeHistoryOpen.value = true

  const { data, error, refresh } = await useCustomAsyncFetch<{ id: string, post_id: string, user: IUser }[]>(
    createQueryUrl(`/post/${props.feed.id}/like/list`, query),
    getComFetchOptions('get', true)
  )

  if (data.value) {
    if (isAddData.value) {
      if (data.value.length > 0) {
        likeList.value = [...likeList.value, ...data.value]
      } else {
        isAddData.value = false
      }
    }
    else {
      likeList.value = data.value
      isAddData.value = true
    }
  }
}, 300)

function moveUserChannel(nickname: string) {
  router.push($localePath(`/${nickname}`))
}

function closeHistory() {
  isLikeHistoryOpen.value = false

  resetList()

}

function resetList() {
  offset.value = 0;
  likeList.value = []
}
</script>

<style scoped lang="scss">
.like-list {
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
}
</style>

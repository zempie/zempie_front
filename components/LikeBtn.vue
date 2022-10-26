<template>
  <li>
    <i
      v-if="!isLiked"
      @click="setLike"
      class="xi-heart-o like-icon"
      style="font-size: 22px; color: #ff6e17; cursor: pointer"
    ></i>
    <i
      v-else
      class="xi-heart like-icon"
      style="font-size: 22px; color: #ff6e17; cursor: pointer"
    ></i>
    <span :class="likeCnt >= 1 && 'like-list'" @click="showLikeHistory">
      {{ likeCnt }}</span
    >
  </li>
  <ClientOnly>
    <el-dialog
      v-model="isLikeHistoryOpen"
      custom-class="modal-area-type"
      width="500px"
      @close="closeList"
    >
      <div class="modal-alert">
        <dl class="ma-header">
          <dt>Like</dt>
          <dd>
            <button @click="isLikeHistoryOpen = false">
              <i class="uil uil-times"></i>
            </button>
          </dd>
        </dl>
        <ul ref="likeEl" class="ma-content">
          <li v-for="like in likeList" :key="like.id">
            <div @click="moveUserChannel(like.user.channel_id)">
              <UserAvatar :user="like.user" style="width: 40px; height: 40px" />
            </div>
            <div>
              <h2 @click="moveUserChannel(like.user.channel_id)">
                {{ like.user.name }}
              </h2>
            </div>
            <div>
              <UserFollowBtn
                v-if="isLogin"
                :user="like.user"
                :customClass="'small-btn'"
                style="width: 100%"
              />
            </div>
          </li>
        </ul>
      </div>
    </el-dialog>
  </ClientOnly>
</template>

<script setup lang="ts">
import _ from 'lodash'
import { ElDialog } from 'element-plus'
import { useInfiniteScroll } from '@vueuse/core'

const LIKE_LIMIT = 5
let likeAcceessableCount = 2
let unlikeAcceessableCount = 2

const { $localePath } = useNuxtApp()
const router = useRouter()

const props = defineProps({
  feed: Object,
})
const emit = defineEmits(['refresh'])

const isLiked = ref(props.feed.liked)
const likeCnt = ref(props.feed.like_cnt)

const isLikeHistoryOpen = ref(false)
const likeList = ref()
const offset = ref(0)
const limit = ref(LIKE_LIMIT)
const likeEl = ref<HTMLElement | null>(null)
const isAddData = ref(false)

const isLogin = computed(() => useUser().user.value.isLogin)

useInfiniteScroll(
  likeEl,
  async () => {
    if (isAddData.value) {
      offset.value += limit.value
      await likeFetch()
    }
  },
  { distance: 10 }
)

async function setLike() {
  if (!isLogin.value) {
    useModal().openLoginModal()
    return
  }
  likeAcceessableCount = likeAcceessableCount - 1
  if (likeAcceessableCount > 0) {
    const { data, error } = await useCustomFetch(
      `/post/${props.feed.id}/like`,
      getComFetchOptions('post', true)
    )
    if (!error.value) {
      isLiked.value = true
      likeCnt.value++
    }
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
    const { data, error } = await post.unlike(props.feed.id)
    if (!error.value) {
      isLiked.value = false
      likeCnt.value--
    }
  }
  unlikeAcceessableCount = unlikeAcceessableCount + 1
}

async function showLikeHistory() {
  if (likeCnt.value < 1) return

  isLikeHistoryOpen.value = true

  await likeFetch()
}

async function likeFetch() {
  const query = {
    limit: limit.value,
    offset: offset.value,
  }

  const { data, error, refresh } = await useCustomFetch<[]>(
    createQueryUrl(`/post/${props.feed.id}/like/list`, query),
    getComFetchOptions('get', false)
  )
  if (data.value) {
    if (isAddData.value) {
      if (data.value.length > 0) {
        likeList.value = [...likeList.value, ...data.value]
      } else {
        isAddData.value = false
      }
    } else {
      likeList.value = data.value
      isAddData.value = true
    }
  }
}
function moveUserChannel(channel_id: string) {
  router.push($localePath(`/channel/${channel_id}`))
}

function closeList() {
  offset.value = 0
  limit.value = LIKE_LIMIT
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

.modal-alert {
  min-height: 100px;

  .ma-content {
    padding: 0px;
    border-radius: 10px;
    max-height: 380px;
    overflow-y: auto;
    li {
      display: flex;
      padding: 10px 20px 10px 20px;

      &:not(:last-child) {
        border-bottom: #e9e9e9 1px solid;
      }
      div {
        margin-top: 0px;
      }

      div:nth-child(1) {
        width: 20%;
        display: flex;
        align-items: center;
      }
      div:nth-child(2) {
        width: 50%;
        cursor: pointer;
        h2 {
          text-align: left;
          width: 100%;
        }
      }
      div:nth-child(3) {
        width: 140px;
      }
    }
  }
}
// @media all and (max-width: 479px) {
// }

// @media all and (min-width: 480px) and (max-width: 767px) {
// }

// @media all and (min-width: 768px) and (max-width: 991px) {
// }

// @media all and (min-width: 992px) and (max-width: 1199px) {
// }

// @media all and (min-width: 1200px) {
// }
</style>

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
        <ul class="ma-content">
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
const { $localePath } = useNuxtApp()

const props = defineProps({
  feed: Object,
})
const emit = defineEmits(['refresh'])
const router = useRouter()

const isLiked = ref(props.feed.liked)
const likeCnt = ref(props.feed.like_cnt)

const isLikeHistoryOpen = ref(false)
const likeList = ref()

const isLogin = computed(() => useUser().user.value.isLogin)

let likeAcceessableCount = 2
let unlikeAcceessableCount = 2

async function setLike() {
  if (!isLogin.value) {
    useModal().openLoginModal()
    return
  }
  likeAcceessableCount = likeAcceessableCount - 1
  if (likeAcceessableCount > 0) {
    const { data, error } = await post.like(props.feed.id)
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

  const { data, error, refresh } = await useCustomFetch(
    `/post/${props.feed.id}/like/list`,
    getComFetchOptions('get', false)
  )

  if (data.value) {
    likeList.value = data.value
  }
}

function moveUserChannel(channel_id: string) {
  router.push($localePath(`/channel/${channel_id}`))
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

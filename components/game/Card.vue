<template>
  <li
    v-if="gameInfo"
    @mouseenter="enterCard"
    @mouseleave="leaveCard"
    style="position: relative"
  >
    <img
      v-if="gameInfo.game_jam?.is_awarded"
      src="/images/medal2.png"
      alt="zem-jam-winner"
      style="position: absolute; right: 10px; top: 10px"
    />

    <div
      @click="moveGamePage"
      class="thumbnail"
      :style="`background: url( ${thumbnail} ) center center / cover no-repeat; background-size: cover;`"
    ></div>
    <div class="game-info">
      <div class="game-title">
        <h2 @click="playGame">
          {{ gameInfo.title }}
        </h2>
      </div>
      <div class="user-container" @click="moveUserPage">
        <UserAvatar :user="gameInfo.user" :tag="'p'"></UserAvatar>
        <p @click="moveUserPage">{{ gameInfo.user?.name }}</p>
      </div>
    </div>
  </li>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { IGame } from '~~/types'

import { useLocalePath } from 'vue-i18n-routing'

const localePath = useLocalePath()
const router = useRouter()

const props = defineProps({
  gameInfo: Object as PropType<IGame>,
})

const thumbnail = ref(
  props.gameInfo?.url_thumb_webp ||
    props.gameInfo?.url_thumb ||
    '/images/default.png'
)

function enterCard() {
  thumbnail.value =
    props.gameInfo?.url_thumb_gif ||
    props.gameInfo?.url_thumb_webp ||
    props.gameInfo?.url_thumb
}

function leaveCard() {
  thumbnail.value = props.gameInfo?.url_thumb_webp || props.gameInfo?.url_thumb
}

function playGame() {
  window.open(`/play/${props.gameInfo.pathname}`, '_blank')
}

function moveGamePage() {
  useGame().setGame(props.gameInfo)
  router.push(localePath(`/game/${props.gameInfo?.pathname}`))
}

function moveUserPage() {
  router.push(localePath(`/channel/${props.gameInfo?.user.channel_id}`))
}
</script>

<style scoped lang="scss">
.game-info {
  padding: 10px 20px 10px 20px;
  height: auto;
  .game-title {
    min-height: 30px;
    h2 {
      text-align: left;
      font-weight: bold;
      font-size: 14px;
      word-break: break-all;
    }
  }
  .user-container {
    display: flex;
    align-items: center;
    p:nth-child(1) {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      border: 2px solid #fff;
      box-shadow: 0px 4px 9px rgba(0, 0, 0, 0.06);
      margin-right: 16px;
    }
  }
}
.thumbnail:hover,
.thumbnail {
  transition: 0.5s;
}

.game-title {
}

@media all and (max-width: 479px) {
  li {
    padding-bottom: 0px;
    .game-info {
      padding: 10px;
      height: auto;
      .game-title {
        min-height: 30px;
        h2 {
          text-align: left;
          font-weight: bold;
          font-size: 12px;
          word-break: unset;
          text-overflow: ellipsis;
          overflow: hidden;
          display: -webkit-box;
        }
      }
      .user-container {
        display: flex;
        align-items: center;
        p:nth-child(1) {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          margin-right: 16px;
          border: 2px solid #fff;
          box-shadow: 0px 4px 9px rgba(0, 0, 0, 0.06);
        }
      }
    }
  }
}
@media all and (min-width: 480px) and (max-width: 767px) {
  li {
    padding-bottom: 0px;
    .game-info {
      .game-title {
        h2 {
          text-align: left;
          font-weight: bold;
          font-size: 12px;
          word-break: unset;
          text-overflow: ellipsis;
          overflow: hidden;
          display: -webkit-box;
        }
      }
    }
  }
}
</style>

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
    <dl>
      <dt @click="moveUserPage">
        <UserAvatar :user="gameInfo.user" :tag="'p'"></UserAvatar>
      </dt>
      <dd class="game-title">
        <h2 @click="playGame">
          {{ gameInfo.title }}
        </h2>
        <p @click="moveUserPage">{{ gameInfo.user?.name }}</p>
        <ul>
          <li>
            <img src="/images/zempie_game_icon.svg" alt="game-icon" />
          </li>
        </ul>
      </dd>
    </dl>
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
.thumbnail:hover,
.thumbnail {
  transition: 0.5s;
}

.game-title {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>

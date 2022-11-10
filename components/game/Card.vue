<template>
  <li
    class="game-info"
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
      <dt @click="moveUserPage" >
        <UserAvatar :user="gameInfo.user" :tag="'p'"></UserAvatar>
      </dt>
      <dd>
        <h2 @click="playGame">
          {{ gameInfo.title }}
        </h2>
        <p @click="moveUserPage">{{ gameInfo.user?.name }}</p>
        <ul>
          <li v-if="gameInfo.support_platform === ePlatformType.Android">
            <i class="uil uil-android"></i>
          </li>
          <li v-if="gameInfo.support_platform === ePlatformType.Window">
            <img src="/icons/window_os.svg" alt="window"/>
          </li>
          <li v-if="gameInfo.support_platform === ePlatformType.Mac">
            <i class="uil uil-apple"></i>
          </li>
          <li v-if="gameInfo.support_platform === ePlatformType.Ios">
            <img src="/icons/ios.svg" alt="ios"/>
          </li>

          <li v-if="gameInfo.game_type === eGameType.Download"  style="margin-top: 2px;">
            <i class="uil uil-file-download"></i>
          </li>
         
          <li v-if="gameInfo.game_type === eGameType.Html" style="margin-top: 2px;">
            <i class="uil uil-html5-alt"></i>
          </li>
        </ul>
      </dd>
    </dl>
  </li>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { IGame, eGameType, ePlatformType} from '~~/types'
const { $localePath } = useNuxtApp()

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
  router.push($localePath(`/game/${props.gameInfo?.pathname}`))
}

function moveUserPage() {
  router.push($localePath(`/channel/${props.gameInfo?.user.channel_id}`))
}
</script>

<style scoped lang="scss">
.game-info {
  dl{
    dt{
      margin-top:8px
    }
    dd{
      h2{
        font-size: 16px;
        color: #000;
      }
      ul{
        li{

          .uil-android{
            color:#a4c639
          }

          .uil-apple{
            color:#000;
          }
          .uil-html5-alt{
            color:#f97316
          }
          .uil-file-download{
            color:rgb(48, 166, 216)
          }
          font-size:20px;
        }
      }
    }
  }
  
}
.thumbnail:hover,
.thumbnail {
  transition: 0.5s;
}


@media all and (max-width: 479px) {
  li {
    padding-bottom: 0px;
    
  }
}
@media all and (min-width: 480px) and (max-width: 767px) {
  li {
    padding-bottom: 0px;
    .game-info {
      
    }
  }
}
</style>

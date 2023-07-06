<template>
  <li class="game-info" v-if="gameInfo" @mouseenter="enterCard" @mouseleave="leaveCard" style="position: relative">
    <img v-if="gameInfo.game_jam?.is_awarded" src="/images/medal2.png" alt="zem-jam-winner"
      style="position: absolute; right: 10px; top: 10px" />
    <GameStageTag v-if="gameInfo.stage" :stage="gameInfo.stage" />

    <div @click="moveGamePage" class="thumbnail"
      :style="`background: url( ${thumbnail} ) center center / cover no-repeat; background-size: cover;`"></div>

    <dl>
      <dt>
        <NuxtLink :to="$localePath(`/${gameInfo.user?.nickname}`)">
          <UserAvatar :user="gameInfo.user" tag='p' />
        </NuxtLink>
      </dt>
      <dd>

        <h2 @click="playGame">
          {{ gameInfo.title }}
        </h2>
        <p @click="moveUserPage">{{ gameInfo.user?.nickname }}</p>
        <ul>
          <template v-for="platform in support_platforms">
            <GamePlatformIcon :platform="platform" color="#000" />
          </template>

          <li v-if="gameInfo.game_type === eGameType.Download" style="margin-top: 2px;">
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
import { IGame, eGameType, ePlatformType } from '~~/types'
const { $localePath } = useNuxtApp()

const router = useRouter()
const route = useRoute()

const props = defineProps({
  gameInfo: Object as PropType<IGame>,
})
const support_platforms = computed(() => {
  return props.gameInfo.support_platform?.split(',')
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

  if (props.gameInfo.game_type !== eGameType.Download) {
    window.open(`/play/${props.gameInfo.pathname}`, '_blank')
  } else {
    router.push($localePath(`/game/${props.gameInfo?.pathname}`))
  }
}

function moveGamePage() {
  useGame().setGame(props.gameInfo)
  router.push($localePath(`/game/${props.gameInfo?.pathname}`))
}

function moveUserPage() {
  router.push($localePath(`/${props.gameInfo?.user.nickname}`))
}
</script>

<style scoped lang="scss">
.game-info {

  dl {
    dt {
      margin-top: 8px
    }

    dd {
      h2 {
        font-size: 16px;
        color: #000;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 180px;
        text-align: left;
      }

      p {
        text-align: left;
      }

      ul {
        li {

          .uil-android {
            color: #a4c639
          }

          .uil-apple {
            color: #000;
          }

          .uil-html5-alt {
            color: #f97316
          }

          .uil-file-download {
            color: rgb(48, 166, 216)
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

  .game-info {
    dl {
      dt {
        display: none;
      }

      dd {
        width: 100%;
        margin: 0px;

        h2 {
          width: 100%;
          font-size: 14px;
        }

        p {
          font-size: 12px;
        }
      }
    }
  }
}

@media all and (min-width: 480px) and (max-width: 767px) {
  li {
    padding-bottom: 0px;
  }

  .game-info {
    dl {
      padding: 10px;

      dt {
        display: none;
      }

      dd {
        width: 100%;
        margin: 0px;

        h2 {
          width: 100%;
          font-size: 14px;
        }

        p {
          font-size: 12px;
        }
      }
    }
  }
}


@media all and (min-width: 768px) and (max-width: 991px) {
  .game-info {
    dl {
      dd {
        h2 {
          width: 150px
        }
      }
    }
  }
}

@media all and (min-width: 992px) and (max-width: 1199px) {
  .game-info {
    dl {
      dd {
        h2 {
          width: 200px
        }
      }
    }
  }
}
</style>

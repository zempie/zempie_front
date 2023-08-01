<template>
  <NuxtLayout name="game-channel-header">
    <dl class="three-area">
      <dt>
        <GameComments class="mb20" :game="game" />
        <div class="ta-game-list">
          <dl>
            <dt>{{ $t('game') }}</dt>
          </dl>
          <template v-if="games?.length">
            <ul style="margin-bottom: 20px">
              <li v-for="game in games.slice(0, 5)" @click="$router.push($localePath(`/game/${game?.pathname}`))">
                <p :style="`background:url(${game?.url_thumb_webp ||
                  game?.url_thumb ||
                  '/images/default.png'
                  }) center; background-size:cover;`"></p>
                <h2 style="text-overflow: ellipsis; overflow: hidden">
                  {{ game?.title }}
                </h2>
              </li>
            </ul>
            <div v-if="games.length > 5">
              <NuxtLink :to="$localePath(`/${game?.user.nickname}/games`)" class="btn-default-samll w100p">
                {{ $t('moreView') }}
              </NuxtLink>
            </div>
          </template>
          <ul v-else class="no-game">
            <li>{{ $t('no.game') }}</li>
          </ul>
        </div>

      </dt>
      <dd>
        <PostTimeline type="game" :isMine="isMine" />
      </dd>
      <dt>
        <div class="ta-about">
          <h2>{{ $t('about.game') }}</h2>
          <div class="desc">
            {{ game?.description }}
          </div>
          <dl>
            <dt>{{ $t('version') }}</dt>
            <dd>{{ game?.version }}</dd>
          </dl>
        </div>
        <div class="ta-copy-link">
          <a @click="copyUrl"><em>{{ $t('game.link.copy') }}</em> <span><i class="uil uil-link"></i></span></a>
        </div>
      </dt>
    </dl>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { eGameType, IGame } from '~~/types'
import { execCommandCopy } from '~/scripts/utils'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import shared from '~~/scripts/shared';

const { $localePath } = useNuxtApp()
const config = useRuntimeConfig()
const route = useRoute()
const { t, locale } = useI18n()

const games = ref()

const gamePath = computed(() => route.params.id as string)
const isMine = computed(
  () => game?.user.id === useUser().user.value.info?.id
)


/**
 * seo 반영은 함수안에서 되지 않으므로 최상단에서 진행함
 */
const { data } = await useAsyncData<{ result: { game: IGame } }>('gameInfo', () => $fetch(`/launch/game/${gamePath.value}`, getZempieFetchOptions('get', true)),
  {
    initialCache: false
  }
)
const { game } = data.value?.result

if (game)
  shared.createHeadMeta(game.title, game.description, game.url_thumb)

onMounted(async () => {
  if (game) await gameListFetch()
})

onBeforeUnmount(() => {
  useGame().resetGame()
})

async function gameListFetch() {
  try {
    const response = await useCustomFetch<{ result: any }>(`/channel/${game.user.channel_id}`, getZempieFetchOptions('get', false))

    const target = response?.result?.target
    const gamesList = target?.games ?? []

    games.value = gamesList.filter((gm: IGame) => gm.id !== game?.id)
  } catch (error) {
    console.error(error)
  }
}

function copyUrl() {
  // const url = game.game_type === eGameType.Download ? `${config.ZEMPIE_URL}/${locale.value}/game/${game.pathname}` : `${config.ZEMPIE_URL}/${locale.value}/play/${game.pathname}`

  execCommandCopy(window.location.href)

  ElMessage.closeAll()
  ElMessage({
    message: t('copied.clipboard'),
    type: 'success',
  })
}

</script>

<style scoped lang="scss">
.ta-game-list {
  width: 100%;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0px 10px 50px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.ta-screenshot .swiper-button-next {
  --swiper-navigation-color: #fff;
  --swiper-navigation-size: 10px;

  display: block;
  position: absolute;
  width: 20px;
  height: 20px;
  margin: 15px 15px 0 0;
  text-align: center;
  line-height: 17px;
  border: #fff 1px solid;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  overflow: hidden;
  z-index: 99999999;

  &:hover {
    --swiper-navigation-color: #fff;
    background: #ff6216;
  }
}

.ta-screenshot .swiper-button-prev {
  --swiper-navigation-color: #fff;
  --swiper-navigation-size: 10px;

  display: block;
  position: absolute;
  width: 20px;
  height: 20px;
  margin: 15px 0 0 15px;
  text-align: center;
  line-height: 17px;
  border: #fff 1px solid;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  overflow: hidden;

  &:hover {
    --swiper-navigation-color: #fff;
    background: #ff6216;
  }
}

.ta-copy-link a {
  cursor: pointer;
}

.no-game {
  padding: 20px 20px 0 20px;
  margin-bottom: 20px;

  li {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    cursor: pointer;
    height: 40px;
    margin-top: 0px;
    padding-bottom: 20px;
  }
}

.ta-about {
  .desc {
    color: #000;
    line-break: auto;
    overflow-wrap: anywhere;
  }
}
</style>

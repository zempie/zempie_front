<template>
  <NuxtLayout name="game-channel-header">
    <dl class="three-area">
      <dt>
        <div class="ta-game-list">
          <dl>
            <dt>Games</dt>
          </dl>

          <template v-if="games?.length">
            <ul style="margin-bottom: 20px">
              <li
                v-for="game in games.slice(0, 5)"
                @click="$router.push($localePath(`/game/${game?.pathname}`))"
              >
                <p
                  :style="`background:url(${
                    game?.url_thumb_webp ||
                    game?.url_thumb ||
                    '/images/default.png'
                  }) center; background-size:cover;`"
                ></p>
                <h2 style="text-overflow: ellipsis; overflow: hidden">
                  {{ game?.title }}
                </h2>
              </li>
            </ul>

            <div v-if="games.length > 5">
              <NuxtLink
                :to="$localePath(`/channel/${game?.user.channel_id}/games`)"
                class="btn-default-samll w100p"
              >
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
          <h2>About Us</h2>
          <div class="desc">
            {{ game?.description }}
          </div>
          <dl>
            <dt>Version</dt>
            <dd>{{ game?.version }}</dd>
          </dl>
        </div>
        <div class="ta-copy-link">
          <a @click="copyUrl"
            ><em>Copy Game Link</em> <span><i class="uil uil-link"></i></span
          ></a>
        </div>
      </dt>
    </dl>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { eGameCategory, eGameType, IUserChannel } from '~~/types'
import { execCommandCopy } from '~/scripts/utils'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { $localePath } = useNuxtApp()
const config = useRuntimeConfig()
const route = useRoute()
const { t, locale } = useI18n()

const games = ref()

const game = computed(() => useGame().game.value.info)

const isMine = computed(
  () => game.value?.user.id === useUser().user.value.info?.id
)

watch(
  () => useGame().game.value.info,
  async (info) => {
    if (info) {
      await gameListFetch()
      useHead({
        title: `${info.title} | Zempie game`,
        link: [
          {
            rel: 'alternate',
            href: `${config.ZEMPIE_URL}${route.fullPath}`,
            hreflang: locale,
          },
          {
            rel: 'canonical',
            href: `${config.ZEMPIE_URL}${route.fullPath}`,
          },
        ],
        meta: [
          {
            property: 'og:url',
            content: `${config.ZEMPIE_URL}${route.fullPath}`,
          },
          {
            property: 'og:site_name',
            content: 'Zempie',
          },
          {
            name: 'og:type',
            content: 'website',
          },
          {
            name: 'robots',
            content: 'index, follow',
          },
          {
            name: 'description',
            content: `${info.description}`,
          },
          {
            property: 'og:title',
            content: `${info.title}`,
          },
          {
            property: 'og:description',
            content: `${info.description}`,
          },
          {
            property: 'og:url',
            content: `${config.ZEMPIE_URL}${route.path}`,
          },
          {
            property: 'og:image',
            content: `${game.value?.url_thumb}`,
          },
        ],
      })
    }
  },
  {
    deep: true,
    immediate: true,
  }
)

onMounted(async () => {
  if (game.value) await gameListFetch()
})

onBeforeUnmount(()=>{
  useGame().resetGame()
})

async function gameListFetch() {
  const response = await useCustomFetch<{
    result: any
  }>(
    `/channel/${game.value?.user.channel_id}`,
    getZempieFetchOptions('get', false)
  )

  if (response) {
    const { result } = response

    if (result) {
      const { target } = result

      const list = target?.games?.filter((gm) => {
        return gm.id !== game.value?.id
      })
      games.value = list
    }
  }
}

function copyUrl() {
  let url = ''
  
  if(game.value.game_type === eGameType.Download){
    url = `${config.ZEMPIE_URL}/game/${game.value.pathname}`
  }else{
    url = `${config.ZEMPIE_URL}/play/${game.value.pathname}`
  }
  
  execCommandCopy(url)
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
  margin-bottom:20px;
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
  }
}
</style>

<template>
  <div class="content">
    <div :class="category === 0 ? 'visual-title' : 'jam-visual-title'">
      <h2><span>Games</span></h2>
    </div>
    <div class="tab-search-swiper">

      <div class="swiper-area uppercase">
        <div class="swiper-slide">
          <a @click="clickCategory(0);" :class="category === 0 ? 'active' : ''">
            game
          </a>
        </div>
        <div class="swiper-slide">
          <a @click="clickCategory(3);" :class="category === 3 ? 'active' : ''">
            zem
          </a>
        </div>
      </div>
    </div>
    <!-- TODO: 게임 갯수 표현: 게임 100개 이상일때 주석 제거 -->
    <!-- <dl class="area-title">
      <dt>Games <span>{{ games.length }}</span></dt>
    </dl> -->
    <ul class="card-game">
      <ClientOnly>
        <TransitionGroup name="fade">
          <GameCardSk v-if="isPending" v-for="game in 16" :key="game" />
          <GameCard v-else v-for="(game, index) in games" :gameInfo="game" :key="index" />
        </TransitionGroup>
      </ClientOnly>
    </ul>
    <div ref="triggerDiv"></div>

  </div>
</template>

<script setup lang="ts" >
import _ from 'lodash'

import { useI18n } from 'vue-i18n';
const { t, locale } = useI18n()
const route = useRoute()
const config = useRuntimeConfig()

useHead({
  title: `${t('seo.game.list.title')} | Zempie community`,
  meta: [
    {
      name: 'description',
      content: `${t('seo.game.list.desc')}`
    },
    {
      name: 'og:title',
      content: `${t('seo.game.list.title')}`
    },
    {
      name: 'og:description',
      content: `${t('seo.game.list.desc')}`
    },
    {
      name: 'og:url',
      content: `${config.ZEMPIE_URL}${route.path}`
    },
  ]
})

const LIMIT_SIZE = 20
const el = ref<HTMLElement>(null)
const category = ref(0);
const limit = ref(LIMIT_SIZE)
const offset = ref(0)
// sort: string = 'c';
// dir: string = 'asc'

const triggerDiv = ref()
const observer = ref<IntersectionObserver>(null)
const isAddData = ref(false);

const games = ref<any[]>([])
const isPending = ref(true)

onMounted(async () => {
  observer.value = new IntersectionObserver((entries) => {
    handleIntersection(entries[0])
  }, { root: null, threshold: 1 })
  observer.value.observe(triggerDiv.value)
  await fetch()
})



async function handleIntersection(target) {
  if (target.isIntersecting) {
    if (isAddData.value) {
      offset.value += limit.value;
      await fetch()
    } else {
      await fetch()
    }
  }
}



async function fetch() {
  const payload = {
    limit: limit.value,
    offset: offset.value,
    category: category.value,
  }

  const { data, pending, refresh } = await useFetch<{ result: { games: [] } }>(`/games?_=${Date.now()}&limit=${limit.value}&offset=${offset.value}&category=${category.value}`, getZempieFetchOptions('get', false))

  // await game.list(payload)

  if (data.value) {
    const { games: gameList } = data.value.result

    if (isAddData.value) {
      if (gameList.length > 0) {
        games.value = [...games.value, ...gameList]
      } else {
        isAddData.value = false
        observer.value.unobserve(triggerDiv.value)
      }
    }
    else {
      games.value = gameList;
      isAddData.value = true
    }
    // if (isAddData.value) {
    //   if (result.games.length > 0) {
    //     games.value = [...games.value, ...result.games]
    //   }
    //   else {
    //     isAddData.value = false
    //   }
    // }
    // else {
    //   games.value = result.games;
    //   if (result.games.length < LIMIT_SIZE) {
    //     isAddData.value = false;
    //   } else {
    //     isAddData.value = true
    //   }

    // }

  }
  isPending.value = false
}
// beforeDestroy() {
//     this.$store.dispatch('resetResearchData')
//     this.initData();
//     window.removeEventListener("scroll", this.scrollCheck);
// }

// fetch() {
//     const obj = {
//         limit: this.limit,
//         offset: this.offset,
//         category: this.category,
//         sort: this.sort,
//         dir: this.dir
//     };

//     this.$api.gameList(obj)
//         .then((res: any) => {
//             if (this.isAddData) {
//                 if (res.result.games.length > 0) {
//                     this.games = [...this.games, ...res.result.games]
//                 }
//                 else {
//                     this.hasData = false
//                     window.removeEventListener("scroll", this.scrollCheck);
//                 }
//             }
//             else {
//                 this.games = res.result.games;
//                 this.isAddData = true
//             }

//         })


// }

const clickCategory = _.debounce((selected: number) => {
  category.value = selected
  initData()
  fetch()
}, 300)

function initData() {
  limit.value = LIMIT_SIZE;
  offset.value = 0;
  isAddData.value = false
  games.value = []
}
</script>

<style scoped lang="scss">
.jam-visual-title {
  background-position: center;

  h2 {
    display: none;
  }
}

.swiper-slide {
  cursor: pointer;
  width: 50% !important;
}

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
</style>

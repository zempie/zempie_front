<template>
  <div class="content">
    <div
      :class="
        category === AllGameCategory ? 'visual-title' : 'jam-visual-title'
      "
    >
      <h1><span>Games</span></h1>
    </div>
    <div class="tab-search-swiper">
      <div class="swiper-area uppercase">
        <div class="swiper-slide">
          <a
            @click="clickCategory(AllGameCategory)"
            :class="category === AllGameCategory && 'active'"
          >
            game
          </a>
        </div>
        <div class="swiper-slide">
          <a
            @click="clickCategory('3')"
            :class="category === `${eGameCategory.ZemJam}` && 'active'"
          >
            zem
          </a>
        </div>
        <div class="swiper-slide">
          <a
            @click="clickCategory('4')"
            :class="category === `${eGameCategory.GJ}` && 'active'"
          >
          GJ+
          </a>
        </div>
      </div>
    </div>
    <!-- TODO: 게임 갯수 표현: 게임 100개 이상일때 주석 제거 -->
    <!-- <dl class="area-title">
      <dt>Games <span>{{ games.length }}</span></dt>
    </dl> -->
    <ul class="card-game">
      <!--  -->
      <GameCardSk v-if="isPending" v-for="game in 16" :key="game" />

      <TransitionGroup name="fade" v-else>
        <GameCard
          v-for="(game, index) in games"
          :gameInfo="game"
          :key="game.id"
        />
      </TransitionGroup>
    </ul>
    <div ref="triggerDiv"></div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash'
import { eGameCategory } from '~~/types'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const route = useRoute()
const config = useRuntimeConfig()

definePageMeta({
  layout: 'default',
})

useHead({
  title: `${t('seo.game.list.title')} | Zempie`,
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
      content: `${t('seo.game.list.desc')}`,
    },
    {
      property: 'og:title',
      content: `${t('seo.game.list.title')}`,
    },
    {
      property: 'og:description',
      content: `${t('seo.game.list.desc')}`,
    },
    {
      property: 'og:url',
      content: `${config.ZEMPIE_URL}${route.path}`,
    },
  ],
})

const LIMIT_SIZE = 20
const el = ref<HTMLElement>(null)

//기존 카테고리가 0 : 공식게임 1 : 도전 게임 으로 나뉘어져있던걸 합쳐서 0,1 둘다 호출 해야함
const AllGameCategory = `${eGameCategory.Challenge}, ${eGameCategory.Certified},${eGameCategory.GJ} `
const category = ref(AllGameCategory)
const limit = ref(LIMIT_SIZE)
const offset = ref(0)
// sort: string = 'c';
// dir: string = 'asc'

const triggerDiv = ref<Element>()
const observer = ref<IntersectionObserver>(null)
const isAddData = ref(false)

const games = ref<any[]>([])
const isPending = ref(true)

onMounted(async () => {
  createObserver()
  await fetch()
})

function createObserver() {
  observer.value = new IntersectionObserver(
    (entries) => {
      handleIntersection(entries[0])
    },
    { root: null, threshold: 1 }
  )
  observer.value.observe(triggerDiv.value)
}

async function handleIntersection(target) {
  if (target.isIntersecting) {
    if (isAddData.value) {
      offset.value += limit.value
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

  const { data, pending, refresh } = await useCustomFetch<{
    result: { games: [] }
  }>(
    `/games?_=${Date.now()}&limit=${limit.value}&offset=${
      offset.value
    }&category=${category.value}`,
    getZempieFetchOptions('get', false)
  )

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
    } else {
      games.value = gameList
      isAddData.value = true
    }
  }
  isPending.value = false
}

const clickCategory = _.debounce((selected: string) => {
  category.value = selected
  observer.value.unobserve(triggerDiv.value)
  createObserver()
  initData()
}, 300)

function initData() {
  limit.value = LIMIT_SIZE
  offset.value = 0
  isAddData.value = false
  games.value = []
}
</script>

<style scoped lang="scss">
.visual-title {
  h1 {
    font-weight: 600;
    font-size: 30px;
    line-height: 30px;
    color: #fff;
    span {
      font-size: 30px;
      font-weight: 700;
    }
  }
}
.jam-visual-title {
  background-position: center;

  h1 {
    visibility: hidden;
  }
}

.swiper-slide {
  cursor: pointer;
  width: 33.3% !important;
}

//transition
.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.3s ease;
}

.component-fade-enter,
.component-fade-leave-to

/* .component-fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media all and (max-width: 479px) {
  .visual-title {
    h1 {
      font-size: 30px;
      line-height: 30px;
      span {
        font-size: 30px;
        line-height: 30px;
      }
    }
  }
}

@media all and (min-width: 480px) and (max-width: 767px) {
  .visual-title {
    h1 {
      font-size: 30px;
      line-height: 30px;
      span {
        font-size: 30px;
        line-height: 30px;
      }
    }
  }
}
</style>

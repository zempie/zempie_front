<template>
  <div class="content">
    <div :class="[headerImgClass, 'bg-grey-1']"
      style="height:150px; display: flex;justify-content: center;align-items: center;">
      <h1 style="
      text-align: center;
      font-weight: 600;
      font-size: 30px;
      line-height: 30px;
      color: #fff;"><span>Games</span></h1>
    </div>
    <div class="tab-search-swiper">
      <div class="swiper-area uppercase">
        <div class="swiper-slide">
          <a @click="clickCategory(AllGameCategory)" :class="category === AllGameCategory && 'active'">
            game
          </a>
        </div>
        <div class="swiper-slide">
          <a @click="clickCategory(String(eGameCategory.ZemJam))"
            :class="category === `${eGameCategory.ZemJam}` && 'active'">
            zem
          </a>
        </div>
        <div class="swiper-slide">
          <a @click="clickCategory(String(eGameCategory.GJ))" :class="category === `${eGameCategory.GJ}` && 'active'">
            GJ+
          </a>
        </div>
        <div class="swiper-slide">
          <a @click="clickCategory(String(eGameCategory.GGJ))" :class="category === `${eGameCategory.GGJ}` && 'active'">
            GGJ
          </a>
        </div>
      </div>
    </div>
    <!--  TODO: 게임 갯수 표현: 게임 100개 이상일때 주석 제거
      <dt>Games <span>{{ games.length }}</span></dt> -->
    <dl class="area-title">
      <dt>
        <ClientOnly>
          <el-select v-model="selectedFilter" class="m-2" placeholder="All">
            <el-option v-for="item in stageOptions" :key="item.value" :label="item.label" :value="item.value"
              @click="handleGameFilter" />
          </el-select>
        </ClientOnly>
      </dt>
    </dl>
    <ul class="card-game">
      <GameCardSk v-if="isPending" v-for="game in 16" :key="game" />
      <TransitionGroup name="fade">
        <GameCard v-for="(game, index) in games" :gameInfo="game" :key="game.id" />
      </TransitionGroup>
    </ul>
    <div ref="triggerDiv"></div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash'
import { eGameCategory, IGame } from '~~/types'
import { useI18n } from 'vue-i18n'
import { ElSelect, ElOption } from 'element-plus';
import shared from '~~/scripts/shared';

const { t, locale } = useI18n()

definePageMeta({
  layout: 'default',
})

shared.createHeadMeta(t('seo.game.list.title'), t('seo.game.list.desc'))


const LIMIT_SIZE = 20
const el = ref<HTMLElement>(null)

//기존 카테고리가 0 : 공식게임 1 : 도전 게임 으로 나뉘어져있던걸 합쳐서 0,1 둘다 호출 해야함
const AllGameCategory = `${eGameCategory.Challenge}, ${eGameCategory.Certified}, ${eGameCategory.GJ}, ${eGameCategory.GGJ} `
const category = ref(AllGameCategory)
const limit = ref(LIMIT_SIZE)
const offset = ref(0)
const triggerDiv = ref<Element>()
const observer = ref<IntersectionObserver>(null)
const isAddData = ref(false)

const games = ref<any[]>([])
const isPending = ref(true)

const stageOptions = [
  {
    value: '',
    label: 'All'
  },
  {
    value: 3,
    label: 'Complete',
  },
  {
    value: 2,
    label: 'Early',
  },

]
const selectedFilter = ref('')
const headerImgClass = ref()

onMounted(async () => {
  setHeaderClass()
  createObserver()
  await fetch()
})

function setHeaderClass() {
  switch (category.value) {
    case AllGameCategory:
      headerImgClass.value = 'visual-title'
      break;
    case String(eGameCategory.GJ):
      headerImgClass.value = 'game-gam-plus'
      break;
    case String(eGameCategory.ZemJam):
      headerImgClass.value = 'jam-visual-title'
      break;
    case String(eGameCategory.GGJ):
      headerImgClass.value = 'global-game-jam'
      break;
    default:
      headerImgClass.value = 'visual-title'
      break
  }
}

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

  const { data, pending, refresh } = await useCustomAsyncFetch<{
    result: { games: [] }
  }>(
    `/games?_=${Date.now()}&limit=${limit.value}&offset=${offset.value
    }&category=${category.value}${selectedFilter.value ? '&filter=' + selectedFilter.value : ''}`,
    getZempieFetchOptions('get', false)
  )


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
  setHeaderClass()
  createObserver()
  initData()
}, 300)

function initData() {
  limit.value = LIMIT_SIZE
  offset.value = 0
  isAddData.value = false
  games.value = []
}

async function handleGameFilter() {
  initData()
  await fetch()

}
</script>

<style scoped lang="scss">
.content {
  .visual-title {
    background: url('/images/1200_150_game.jpeg');

    h1 {
      span {
        font-size: 30px;
        font-weight: 700;
      }
    }
  }

  .game-gam-plus {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 1200px;
    margin: 0 auto;
    border-radius: 15px;
    background: url('/images/gj_banner.png');
    background-size: cover;
    box-shadow: 0px 10px 50px rgba(0, 0, 0, 0.1);
    overflow: hidden;

    h1 {
      visibility: hidden;
    }
  }

  .global-game-jam {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 1200px;
    margin: 0 auto;
    border-radius: 15px;
    background: url('/images/GGJ.png');
    background-size: cover;
    box-shadow: 0px 10px 50px rgba(0, 0, 0, 0.1);
    overflow: hidden;

    h1 {
      visibility: hidden;
    }



  }

  .jam-visual-title {
    background-position: center;

    h1 {
      visibility: hidden;
    }
  }

  .area-title {
    display: flex;
    justify-content: flex-end;
    padding: 0px;

  }
}

.swiper-slide {
  cursor: pointer;
  width: 25% !important;
}

//transition
.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.3s ease;
}

.component-fade-enter,
.component-fade-leave-to

/* .component-fade-leave-active below version 2.1.8 */
  {
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

  .game-gam-plus {
    width: 100% !important;
    background-position: center !important;
  }

  .global-game-jam {
    width: 100% !important;
    background: url('/images/GGJ_header.png') !important;
    background-position: center !important;

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

  .game-gam-plus {
    width: 470px !important;
    background-position: center !important;
  }

  .global-game-jam {
    width: 470px !important;
    background: url('/images/GGJ_header.png') !important;
    background-position: center !important;
  }
}

@media all and (min-width: 768px) and (max-width: 991px) {
  .game-gam-plus {
    width: 750px !important;
    background-position: center !important;
  }

  .global-game-jam {
    width: 750px !important;
    background-position: center !important;
  }
}

@media all and (min-width: 992px) and (max-width: 1199px) {
  .game-gam-plus {
    width: 970px !important;
    background-position: center !important;
  }

  .global-game-jam {
    width: 970px !important;
    background-position: center !important;

  }
}
</style>

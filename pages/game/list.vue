<template>
  <div class="content">
    <div class="tab-search-swiper">
      <div class="swiper-area uppercase">
        <div class="swiper-slide">
          <a @click="clickCategory('all')" :class="activeTab === 'all' && 'active'">
            {{ $t('all.game') }}
          </a>
        </div>
        <div class="swiper-slide">
          <a @click="clickType('download')" :class="activeTab === 'pc' && 'active'">
            {{ $t('pc.game') }}
          </a>
        </div>
        <div class="swiper-slide">
          <a @click="clickType('html')" :class="activeTab === 'web' && 'active'">
            {{ $t('web.game') }}
          </a>
        </div>
        <div class="swiper-slide">
          <a @click="clickPlatform('app')" :class="activeTab === 'app' && 'active'">
            {{ $t('app.game') }}
          </a>
        </div>
        <div class="swiper-slide">
          <a @click="clickCategory('gamejam')" :class="activeTab === 'gamejam' && 'active'">
            {{ $t('gamejam') }}
          </a>
        </div>
      </div>
    </div>
    <!--  TODO: 게임 갯수 표현: 게임 100개 이상일때 주석 제거
      <dt>Games <span>{{ games.length }}</span></dt> -->
    <dl class="area-title">
      <!-- <dt class="mr10">
        <ClientOnly>
          <el-select v-model="selectedSort" class="m-2" placeholder="All">
            <el-option v-for="item in sortOptions" :key="item.value" :label="item.label" :value="item.value"
              @click="handleGameSort" />
          </el-select>
        </ClientOnly>
      </dt> -->
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
import { eGameCategory, IGame, eGameType, ePlatformType } from '~~/types'
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

//기존 카테고리가 0 : 공식게임, 1 : 도전 게임 으로 나뉘어져있던걸 합쳐서 0,1 둘다 호출 해야함
const AllGameCategory = `${eGameCategory.Challenge}, ${eGameCategory.Certified}, ${eGameCategory.ZemJam}, ${eGameCategory.GJ}, ${eGameCategory.GGJ} `
const TABS = ['', 'all', 'pc', 'web', 'app', 'gamejam']

const activeTab = ref(TABS[1])
const category = ref(AllGameCategory)
const currGameType = ref()
const currPlatform = ref()

const limit = ref(LIMIT_SIZE)
const offset = ref(0)
const triggerDiv = ref<Element>()
const observer = ref<IntersectionObserver>(null)
const isAddData = ref(false)

const games = ref<any[]>([])
const isPending = ref(true)

const sortOptions = [
  {
    value: 1,
    label: '인기 순'
  },
  {
    value: 2,
    label: '출시 순',
  },
]
const selectedSort = ref(1)

const stageOptions = [
  {
    value: '',
    label: '전체'
  },
  {
    value: 3,
    label: '정식 출시',
  },
  {
    value: 2,
    label: '데모',
  },

]
const selectedFilter = ref('')
const headerImgClass = ref()

onMounted(async () => {
  createObserver()
  await fetch()
})

const clickCategory = _.debounce((selected: string) => {
  initData()
  switch (selected) {
    case 'all':
      activeTab.value = selected
      category.value = AllGameCategory
      break;
    case 'gamejam':
      activeTab.value = selected
      category.value = [eGameCategory.ZemJam, eGameCategory.GJ, eGameCategory.GGJ].toString()
      break
  }

  observer.value.unobserve(triggerDiv.value)
  createObserver()
}, 300)


const clickType = _.debounce((selected: string) => {
  initData()
  switch (selected) {
    case 'download':
      activeTab.value = TABS[2]
      currGameType.value = eGameType.Download
      break;
    case 'html':
      activeTab.value = TABS[3]
      currGameType.value = eGameType.Html
      break;
  }
  observer.value.unobserve(triggerDiv.value)
  createObserver()
}, 300)



const clickPlatform = _.debounce((platform: string) => {
  initData()
  switch (platform) {
    case 'app':
      activeTab.value = TABS[4]
      currPlatform.value = [ePlatformType.Android, ePlatformType.Ios]
      break;

  }
  observer.value.unobserve(triggerDiv.value)
  createObserver()
}, 300)


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
    // support_platform: currGameType.value
  }

  if (selectedFilter.value) {
    payload['filter'] = selectedFilter.value
  }

  if (currPlatform.value) {
    payload['support_platform'] = currPlatform.value
  }

  if (currGameType.value) {
    payload['game_type'] = currGameType.value
  }

  const { data, pending, refresh } = await useCustomAsyncFetch<{
    result: { games: [] }
  }>(createQueryUrl('/games', payload), getZempieFetchOptions('get', false)
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

function initData() {
  limit.value = LIMIT_SIZE
  offset.value = 0
  isAddData.value = false
  games.value = []
  currPlatform.value = null
  currGameType.value = null
  category.value = AllGameCategory

}

async function handleGameFilter() {
  initData()

  await fetch()

}

async function handleGameSort() {
  await fetch()
}

</script>

<style scoped lang="scss">
.content {
  .area-title {
    display: flex;
    justify-content: flex-end;
    padding: 0px;

  }
}

.swiper-slide {
  cursor: pointer;
  width: 20% !important;
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

@media all and (max-width: 479px) {}

@media all and (min-width: 480px) and (max-width: 767px) {}

@media all and (min-width: 768px) and (max-width: 991px) {}

@media all and (min-width: 992px) and (max-width: 1199px) {}
</style>

<template>
  <div class="header-search">
    <div class="input-search-line">
      <i class=flex>
        <LazyIconSearch height="20px" />
      </i>
      <div>
        <ClientOnly>
          <el-dropdown ref="searchDropdown" trigger="click">
            <button v-if="isMobile" class="mobile-btn btn-circle-icon flex items-center content-center">
              <i>
                <LazyIconSearch />
              </i>
            </button>
            <input v-else class="input-btn" type="text" title="keywords" :placeholder="$t('needSearchInput')"
              :value="searchInput" @input="onInputDebounce" @keyup.enter="moveSearchPage" autocomplete="off" />
            <template #dropdown>
              <div v-if="isMobile" style="padding:10px" class="w100p">
                <input type="text" title="keywords" class="w100p" :placeholder="$t('needSearchInput')"
                  :value="searchInput" @input="onInputDebounce" @keyup.enter="moveSearchPage" autocomplete="off" />
              </div>
              <el-dropdown-menu class="header-search-list" style="min-width: 260px" v-if="!isSearchPage">
                <div :class="hasResearchResult || 'no-result'">
                  <template v-if="userList?.length">
                    <h2>{{ $t('user') }}</h2>
                    <el-dropdown-item v-for="user in userList" :key="user.id">
                      <div @click="moveUserPage(user?.nickname)">
                        <dl>
                          <dt>
                            <UserAvatar :user="user" :tag="'span'" style="width:40px" />
                            <div>
                              <h3 class="font14 text-bold"> {{ user?.nickname }}</h3>
                              <h3>{{ user?.name }}</h3>
                            </div>
                          </dt>

                        </dl>
                      </div>
                    </el-dropdown-item>
                  </template>
                  <template v-if="gameList?.length">
                    <h2>{{ $t('addGameInfo.game.name') }}</h2>
                    <el-dropdown-item v-for="game in gameList" :key="game.id">
                      <div @click="moveGamePage(game.pathname)">
                        <dl>
                          <dt>
                            <span :style="`background:url(${game.profile_img || game.url_thumb
                              }) center center / cover no-repeat; background-size:cover;`"></span>
                            {{ game.title }}
                          </dt>
                        </dl>
                      </div>
                    </el-dropdown-item>
                  </template>
                  <template v-if="communityList?.length">
                    <h2>{{ $t('community.name') }}</h2>
                    <el-dropdown-item v-for="community in communityList" :key="community.id">
                      <div @click="moveCommunityPage(community.id)">
                        <dl>
                          <dt>
                            <span
                              :style="`background:url(${community.profile_img}) center center / cover no-repeat; background-size:cover;`"></span>
                            {{ community?.name }}
                          </dt>
                        </dl>
                      </div>
                    </el-dropdown-item>
                  </template>
                  <template v-if="!hasResearchResult">
                    <h2>{{ $t('no.search.result') }}</h2>
                  </template>
                </div>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </ClientOnly>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { debounce } from '~~/scripts/utils'

import {
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem
} from 'element-plus'

const { $localePath } = useNuxtApp()
const router = useRouter()
const route = useRoute()

const searchInput = ref()
const searchDropdown = ref()
const searchMobileDropdown = ref()

const searchInputDropdown = ref()
const isOpenSearchDp = ref(false)


const userList = computed(() => useSearch().search.value.results?.users)
const gameList = computed(() => useSearch().search.value.results?.games)
const communityList = computed(() => useSearch().search.value.results?.community)
const isSearchPage = computed(() => (route.meta?.name as string)?.toLowerCase() === 'search')
const hasResearchResult = computed(() => !!userList.value?.length || !!gameList.value?.length || !!communityList.value?.length ? true : false);

const isMobileSize = computed(() =>
  window.matchMedia('screen and (max-width: 767px)')
)
const isMobile = ref()


onMounted(() => {
  nextTick(() => {
    onResize()
  })
  window.addEventListener("resize", onResize)
})


function onResize() {
  isMobile.value = isMobileSize.value.matches ? true : false
}


function moveSearchPage() {
  router.push({ path: $localePath(`/search`), query: { q: searchInput.value } })
  searchDropdown.value.handleClose()
}


function moveCommunityPage(communityId: string) {
  initSearchData()
  router.push($localePath(`/community/${communityId}`))
}

function moveGamePage(pathname: string) {
  initSearchData()
  router.push($localePath(`/game/${pathname}`))
}

async function onInputDebounce(e: any) {
  searchInput.value = e.target.value
  await onSearchDebounce()
}

const onSearchDebounce = debounce(async () => {
  await search()
}, 300)

async function search() {
  await useSearch().getSearch(searchInput.value)
}

function moveUserPage(nickname: string) {
  initSearchData()
  router.push($localePath(`/${nickname}`))
}

async function onEnterSearch() {
  await search()
  router.push({ path: $localePath(`/search`), query: { q: searchInput.value } })
}

function initSearchData() {
  searchInput.value = ''
  searchDropdown.value.handleClose()
  useSearch().resetResults()
}
</script>
<style scoped lang="scss">
.header-search-list {
  div {
    width: 100%;
  }

  .no-result {
    display: flex;
    height: 50px;
    justify-content: center;
    align-items: center;

    h2 {
      padding-bottom: 0px;
    }
  }
}

.header-search-list>div>li>div {
  padding: 8px 5px;
  cursor: pointer;
  transition: all 0.4s ease-in-out;
}

.header-search-list>div>li>div dl {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-search-list>div>li>div dl dt {
  display: flex;
  align-items: center;
}

.header-search-list>div>li>div dl dt span {
  display: inline-block;
  width: 32px;
  height: 32px;
  margin-right: 10px;
  border-radius: 8px;
}

.header-search-list>div>li>div dl dt em {
  display: inline-block;
  width: 32px;
  height: 32px;
  margin-right: 10px;
  border-radius: 50%;
}

.header-search-list>div>li>div dl dd {
  font-size: 16px;
}

@media all and (max-width: 479px) {
  .header-search {
    .input-search-line {
      border: none;
      padding: 0px;

      >i {
        display: none;
      }
    }
  }
}

@media all and (min-width: 480px) and (max-width: 767px) {
  .header-search {
    .input-search-line {
      border: none;
      padding: 0px;

      >i {
        display: none;
      }
    }
  }
}

@media all and (min-width: 768px) and (max-width: 991px) {}
</style>

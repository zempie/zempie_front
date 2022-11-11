<template>
  <ClientOnly>
    <!-- 상단영역 -->
    <div class="header">
      <dl>
        <dt>
          <div class="header-logo-menu">
            <p>
              <NuxtLink :to="$localePath('/')">
                <nuxt-img
                  class="logo"
                  src="/images/zempie-logo-black.png"
                  alt="zempie-logo"
                />
                <nuxt-img
                  class="mobile-logo"
                  src="/images/zempie_logo_154_155.png"
                  alt="zempie-logo"
                />
              </NuxtLink>
            </p>
            <button
              class="btn-circle-none mobile"
              @click="isHeaderSideMobile = true"
            >
              <i class="uil uil-bars"></i>
            </button>
            <!-- <i class="uil uil-bars" v-on:click="headerSideOpenMobile"></i> -->
            <ul class="menu">
              <li class="uppercase">
                <NuxtLink
                  :to="$localePath('/community/list')"
                  :class="
                    $route.name.toString().includes('community-list') && 'active'"
                >
                  community
                </NuxtLink>
              </li>
              <li class="uppercase">
                <NuxtLink
                  id="gameMenu"
                  :to="$localePath('/game/list')"
                  :class="
                    $route.name.toString().includes('game-list') && 'active' 
                  "
                >
                  games
                </NuxtLink>
              </li>
              <li class="uppercase">
                <NuxtLink
                  :to="$localePath('/zem-jam')"
                  :class="
                    $route.name.toString().includes('zem-jam') && 'active' 
                  "
                >
                  ZEMJAM
                </NuxtLink>
              </li>
              <li class="uppercase">
                <NuxtLink
                  :to="$localePath('/game-jam-plus')"
                  :class="
                    $route.name.toString().includes('game-jam-plus') && 'active' 
                  "
                >
                  GJ+
                </NuxtLink>
              </li>
            </ul>
          </div>
        </dt>

        <dd>
          <div class="header-search">
            <div class="input-search-line">
              <i class="uil uil-search"></i>
              <div>
                <el-dropdown
                  ref="searchDropdown"
                  trigger="click"
                  @command="movePage"
                >
                  <input
                    type="text"
                    name=""
                    title="keywords"
                    :placeholder="t('needSearchInput')"
                    v-model="searchInput"
                    @input="search"
                    @keyup.enter="moveSearchPage"
                  />
                  <template #dropdown>
                    <el-dropdown-menu
                      class="header-search-list"
                      style="min-width: 260px"
                    >
                      <div :class="hasResearchResult ? '' : 'no-result'">
                        <template v-if="userList?.length">
                          <h2>{{ t('user.name') }}</h2>
                          <el-dropdown-item
                            v-for="user in userList"
                            :key="user.id"
                            :command="[(user['isUser'] = true), user]"
                          >
                            <div @click="moveUserPage(user.channel_id)">
                              <dl>
                                <dt>
                                  <UserAvatarSk v-if="isPending" />

                                  <UserAvatar
                                    v-else
                                    :user="user"
                                    :tag="'span'"
                                  />
                                  {{ user.name }}
                                </dt>
                                <dd><i class="uil uil-user"></i></dd>
                              </dl>
                            </div>
                          </el-dropdown-item>
                        </template>
                        <template v-if="gameList?.length">
                          <h2>{{ t('addGameInfo.game.name') }}</h2>
                          <el-dropdown-item
                            v-for="game in gameList"
                            :key="game.id"
                            :command="[(game['isGame'] = true), game]"
                          >
                            <div @click="moveGamePage(game.pathname)">
                              <dl>
                                <dt>
                                  <span
                                    :style="`background:url(${
                                      game.profile_img || game.url_thumb
                                    }) center center / cover no-repeat; background-size:cover;`"
                                  ></span>
                                  {{ game.title }}
                                </dt>
                                <dd><i class="uil uil-robot"></i></dd>
                              </dl>
                            </div>
                          </el-dropdown-item>
                        </template>
                        <template v-if="communityList?.length">
                          <h2>{{ t('community.name') }}</h2>
                          <el-dropdown-item
                            v-for="community in communityList"
                            :key="community.id"
                            :command="[
                              (community['isCommunity'] = true),
                              community,
                            ]"
                          >
                            <div @click="moveCommunityPage(community.id)">
                              <dl>
                                <dt>
                                  <span
                                    :style="`background:url(${community.profile_img}) center center / cover no-repeat; background-size:cover;`"
                                  ></span>
                                  {{ community.name }}
                                </dt>
                                <dd><i class="uil uil-comments"></i></dd>
                              </dl>
                            </div>
                          </el-dropdown-item>
                        </template>
                        <template v-if="!hasResearchResult">
                          <h2>{{ t('no.search.result') }}</h2>
                        </template>
                      </div>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
          </div>

          <!-- FIXME: popper-class: css수정 -->

          <div class="header-language">
            <el-select
              class="hl-select-box"
              v-model="selectedLang"
              :placeholder="t('korean')"
            >
              <el-option
                v-for="item in options"
                :key="item.code"
                :label="item.label"
                :value="item.code"
                @click="switchLangauge"
              />
            </el-select>
          </div>
          <div
            v-if="isLogin"
            class="header-info ml10"
            style="display: flex"
            id="userMenu"
          >
            <el-dropdown trigger="click" ref="userMenu" id="userMenu">
              <UserAvatar
                style="width: 30px; height: 30px"
                :user="user"
                :key="user?.picture"
              />

              <template #dropdown>
                <div
                  slot="body"
                  class="header-setting"
                  style="min-width: 250px"
                  @click="userMenu?.handleClose()"
                >
                  <dl style="margin: 10px 0px 0px 0px">
                    <UserAvatar
                      style="width: 30px; height: 30px"
                      :user="user"
                      :key="user?.picture"
                    />
                    <dd>
                      <NuxtLink
                        :to="$localePath(`/channel/${user?.channel_id}`)"
                      >
                        <h2>{{ user.name }}</h2>
                      </NuxtLink>
                    </dd>
                  </dl>
                  <div>
                    <h2>{{ t('myProfile') }}</h2>
                    <div>
                      <NuxtLink
                        id="myChannel"
                        :to="$localePath(`/channel/${user.channel_id}`)"
                        ><i class="uil uil-user"></i>
                        {{ t('myChannel') }}
                      </NuxtLink>
                      <NuxtLink 
                        id="gameStudio"
                        :to="$localePath('/project/list')"
                        ><i class="uil uil-robot"></i>
                        {{ t('gameStudio') }}
                      </NuxtLink>
                    </div>
                  </div>
                  <div>
                    <h2>{{ t('group') }}</h2>
                    <div>
                      <NuxtLink :to="$localePath(`/myaccount/communities`)"
                        ><i class="uil uil-users-alt"></i>
                        {{ t('joined.group') }}
                      </NuxtLink>
                    </div>
                  </div>
                  <div>
                    <h2>{{ t('account') }}</h2>
                    <div>
                      <NuxtLink :to="$localePath(`/myaccount`)"
                        ><i class="uil uil-setting"></i>
                        {{ t('my.account') }}
                      </NuxtLink>
                    </div>
                  </div>
                  <p>
                    <a class="btn-default w100p" @click="logout">{{
                      t('logout')
                    }}</a>
                  </p>
                </div>
              </template>
            </el-dropdown>
          </div>
          <div v-else class="header-login">
            <p
              v-if="useUser().user.value.isLoading"
              style="
                font-size: 35px;
                display: flex;
                align-items: center;
                border-radius: 50%;
                width: 30px;
                justify-content: center;
              "
            >
              <i class="uil uil-user-circle"></i>
            </p>
            <NuxtLink v-else :to="$localePath('/login')">
              <button class="btn-default">
                <i class="uil uil-user"></i>{{ t('login') }}
              </button>
            </NuxtLink>
          </div>
          <div
            class="header-side-mobile"
            :style="isHeaderSideMobile ? 'left:0px;' : ''"
            id="headerSideMobile"
            v-on-click-outside="clickOutside"
          >
            <div class="hsm-close">
              <i class="uil uil-times" @click="isHeaderSideMobile = false"></i>
            </div>
            <div class="hsm-search">
              <div class="input-search-line-mobile">
                <p><i class="uil uil-search"></i></p>
                <div>
                  <input
                    type="text"
                    name=""
                    title="keywords"
                    v-model="searchInput"
                    @keyup.enter="moveSearchPage"
                    :placeholder="t('needSearchInput')"
                  />
                </div>
              </div>
            </div>
            <div class="hsm-menu">
              <NuxtLink
                :to="$localePath('/community/list')"
                @click.native="isHeaderSideMobile = false"
                ><i class="uil uil-comment"></i>
                Community
              </NuxtLink>
              <NuxtLink
                :to="$localePath('/game/list')"
                @click.native="isHeaderSideMobile = false"
                ><i class="uil uil-robot"></i> Games
              </NuxtLink>
              <NuxtLink
                :to="$localePath('/zem-jam')"
                @click.native="isHeaderSideMobile = false"
                ><i class="uil uil-comment"></i>
                ZEMJAM
              </NuxtLink>
              <NuxtLink
                :to="$localePath('/game-jam-plus')"
                @click.native="isHeaderSideMobile = false"
                ><i class="uil uil-comment"></i>
                GJ+
              </NuxtLink>
            </div>
          </div>
          <div
            class="header-side-bg-mobile"
            :style="isHeaderSideBgMobile ? 'display:block;' : ''"
            id="headerSideBgMobile"
            v-on:click="headerSideCloseMobile"
          >
            &nbsp;
          </div>
        </dd>
      </dl>

      <el-dialog
        v-model="isOpen"
        append-to-body
        class="modal-area-type"
        :show-close="false"
        width="380px"
      >
        <div class="modal-alert">
          <dl class="ma-header">
            <dt>{{ t('information') }}</dt>
            <dd>
              <button @click="useModal().closeLoginModal()">
                <i class="uil uil-times"></i>
              </button>
            </dd>
          </dl>

          <div class="ma-content">
            <h2>{{ t('needLogin.text1') }}<br />{{ t('needLogin.text2') }}</h2>
            <div>
              <button
                class="btn-default"
                style="width: 100%"
                @click="$router.push($localePath('/login'))"
              >
                {{ t('login') }}
              </button>
            </div>
          </div>
        </div>
      </el-dialog>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import _ from 'lodash'
//TODO: 모바일 메뉴 다른 곳 클릭하면 닫히게
import { vOnClickOutside } from '@vueuse/components'

import { useI18n } from 'vue-i18n'
import {
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElSelect,
  ElOption,
  ElMessage,
  ElDialog,
} from 'element-plus'

const { $localePath } = useNuxtApp()

const { t, locale } = useI18n()

const switchLocalePath = useSwitchLocalePath()

const router = useRouter()
const route = useRoute()

const { $firebaseAuth, $cookies } = useNuxtApp()
const config = useRuntimeConfig()

const isLogin = computed(() => useUser().user.value.isLogin)
const user = computed(() => useUser().user.value.info)
const isPending = ref(true)
const userMenu = ref()
const searchDropdown = ref()

const searchInput = ref()
const userList = ref([])
const gameList = ref([])
const communityList = ref([])
const hasResearchResult = ref(false)
const isOpenMessage = ref(false)
const isHeaderSideMobile = ref(false)
const isOpenSearch = ref(false)
const isHeaderSideBgMobile = ref(false)

const options = [
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'English' },
]
const selectedLang = ref(locale.value)

const isOpen = ref(false)
const { loginModal } = useModal()
const nuxt = useNuxtApp()

watch(
  () => loginModal.value.isOpen,
  (state: boolean) => {
    isOpen.value = state
  }
)

watch(
  () => locale,
  (val) => {
    if (val.value === 'ko') {
      selectedLang.value = 'ko'
    } else {
      selectedLang.value = 'en'
    }
  },
  { immediate: true }
)

nuxt.hook('page:finish', () => {
  isPending.value = false
})

function headerSideCloseMobile() {}

function switchLangauge() {
  switchLocalePath(selectedLang.value)
  locale.value = selectedLang.value
  router.replace(route.fullPath)
}

function logout() {
  useUser().logout()
}

const search = _.debounce(async () => {
  const { data, error, pending } = await community.search({
    q: searchInput.value,
  })
  const { posts, games, community: comList, users } = data.value
  userList.value = users
  gameList.value = games
  communityList.value = comList

  if (
    userList.value?.length ||
    gameList.value?.length ||
    communityList.value?.length
  ) {
    hasResearchResult.value = true
  } else {
    hasResearchResult.value = false
  }
}, 300)

function moveSearchPage() {
  isHeaderSideMobile.value = false

  router.push({ path: $localePath(`/search`), query: { q: searchInput.value } })
  searchDropdown.value.handleClose()
}

function movePage(command: any) {
  const searchObj = command[1]
  if (searchObj.isUser) {
    moveUserPage(searchObj.channel_id)
  } else if (searchObj.isCommunity) {
    moveCommunityPage(searchObj.id)
  } else if (searchObj.isGame) {
    moveGamePage(searchObj.pathname)
  }
}

function moveUserPage(channelId: string) {
  initSearchData()
  router.push($localePath(`/channel/${channelId}`))
}
function moveCommunityPage(communityId: string) {
  initSearchData()
  router.push($localePath(`/community/${communityId}`))
}

function moveGamePage(pathname: string) {
  initSearchData()
  router.push($localePath(`/game/${pathname}`))
}

function initSearchData() {
  searchInput.value = ''
  userList.value = []
  gameList.value = []
  communityList.value = []
  hasResearchResult.value = false
  searchDropdown.value.handleClose()
}
function clickOutside() {
  if (isHeaderSideMobile.value) {
    isHeaderSideMobile.value = false
  }
}
</script>

<style lang="scss" scoped>
.mobile-logo {
  display: none;
}

.btn-circle-none {
  padding-top: 5px;

  &.mobile {
    display: none;
  }
}

.menu li .active {
  color: #f97316;
}

.hl-select-box:deep(.el-input, .is-focus) {
  .el-input__wrapper {
    box-shadow: 0 0 0 1px #ededed inset !important;
  }
}

.hl-select-box:deep(.el-input__wrapper) {
  border-radius: 30px;
  height: 38px;
  width: 120px;

  .is-focus {
    box-shadow: 0 0 0 1px #ededed inset !important;
  }

  .el-input__inner {
    height: 38px;
    font-size: 13px;
    padding: 0px 2px;
    border: none;
    border-radius: 0%;
  }

  .el-input__inner:focus {
    box-shadow: none;
  }
}

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

.header-search-list > div > li > div {
  padding: 8px 5px;
  cursor: pointer;
  transition: all 0.4s ease-in-out;
}

.header-search-list > div > li > div dl {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-search-list > div > li > div dl dt {
  display: flex;
  align-items: center;
}

.header-search-list > div > li > div dl dt span {
  display: inline-block;
  width: 32px;
  height: 32px;
  margin-right: 10px;
  border-radius: 8px;
}

.header-search-list > div > li > div dl dt em {
  display: inline-block;
  width: 32px;
  height: 32px;
  margin-right: 10px;
  border-radius: 50%;
}

.header-search-list > div > li > div dl dd {
  font-size: 16px;
}

@media all and (max-width: 479px) {
  .logo {
    display: none;
  }

  .mobile-logo {
    display: block;
    width: 32px;
    height: 32px;
  }

  .btn-circle-none {
    &.mobile {
      display: block;
    }
  }

  .header-language {
    display: block;
  }

  .header-login {
    display: block !important;
    i {
      display: none;
    }
  }
}

@media all and (min-width: 480px) and (max-width: 767px) {
  .btn-circle-none {
    &.mobile {
      display: block;
    }
  }

  .header-language {
    display: block;
  }

  .header-login {
    display: block !important;
    i {
      display: none;
    }
  }
}

@media all and (min-width: 768px) and (max-width: 991px) {
  .header > dl {
    width: 90%;
  }

  .header-login {
    display: block !important;

    i {
      display: none;
    }
  }
}

@media all and (min-width: 992px) and (max-width: 1199px) {
  .header-login {
    display: block !important;

    i {
      display: none;
    }
  }
  .header > dl {
    width: 90%;
  }

  .header-info-mobile {
    display: none;
  }
}

@media all and (min-width: 1200px) {
}
</style>

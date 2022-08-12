<template>
  <ClientOnly>
    <!-- 상단영역 -->
    <div class="header">
      <dl>
        <dt>
          <div class="header-logo-menu">
            <p>
              <NuxtLink to="/">
                <img src="/images/zempie-logo-black.png" />
              </NuxtLink>
            </p>
            <ul class="menu">
              <li class="uppercase">

                <NuxtLink :to="localePath('/community/list')"
                  :class="$route.name.toString().includes('community-list') ? 'active' : ''">
                  community
                </NuxtLink>
              </li>
              <li class="uppercase ">
                <NuxtLink :to="localePath('/game/list')"
                  :class="$route.name.toString().includes('game-list') ? 'active' : ''"> games
                </NuxtLink>
              </li>
              <li class="uppercase">
                <NuxtLink :to="localePath('/join')"
                  :class="$route.name.toString().includes('game-jam') ? 'active' : ''">
                  ZEMJAM </NuxtLink>
              </li>
            </ul>
          </div>
        </dt>

        <dd>
          <div class="header-search">
            <div class="input-search-line">
              <i class="uil uil-search"></i>
              <div>
                <el-dropdown ref="searchDropdown" trigger="click" @command="movePage">
                  <input type="text" name="" title="keywords" :placeholder="$t('needSearchInput')" v-model="searchInput"
                    @input="search" @keyup.enter="moveSearchPage" />
                  <template #dropdown>
                    <el-dropdown-menu class="header-search-list" style="min-width:260px;">
                      <div :class="hasResearchResult ? '' : 'no-result'">
                        <template v-if="userList?.length">
                          <h2>{{ t('user.name') }}</h2>
                          <el-dropdown-item v-for="user in userList" :key="user.id"
                            :command="[user['isUser'] = true, user]">
                            <div @click="moveUserPage(user.channel_id)">
                              <dl>
                                <dt>
                                  <UserAvatar :user="user" :tag="'span'"></UserAvatar>
                                  {{ user.name }}
                                </dt>
                                <dd><i class="uil uil-user"></i></dd>
                              </dl>
                            </div>
                          </el-dropdown-item>
                        </template>
                        <template v-if="gameList?.length">
                          <h2>{{ t('game.name') }}</h2>
                          <el-dropdown-item v-for="game in gameList" :key="game.id"
                            :command="[game['isGame'] = true, game]">
                            <div @click="moveGamePage(game.pathname)">
                              <dl>
                                <dt>
                                  <span
                                    :style="`background:url(${game.profile_img || game.url_thumb}) center center / cover no-repeat; background-size:cover;`"></span>
                                  {{ game.title }}
                                </dt>
                                <dd><i class="uil uil-robot"></i></dd>
                              </dl>
                            </div>
                          </el-dropdown-item>
                        </template>
                        <template v-if="communityList?.length">
                          <h2>{{ t('community.name') }}</h2>
                          <el-dropdown-item v-for="community in communityList" :key="community.id"
                            :command="[community['isCommunity'] = true, community]">
                            <div @click="moveCommunityPage(community.id)">
                              <dl>
                                <dt>
                                  <span
                                    :style="`background:url(${community.profile_img}) center center / cover no-repeat; background-size:cover;`"></span>
                                  {{ community.name }}
                                </dt>
                                <dd><i class="uil uil-comments"></i></dd>

                              </dl>
                            </div>
                          </el-dropdown-item>
                        </template>
                        <template v-if="!hasResearchResult">
                          <h2>{{ t('검색 결과가 없습니다.') }}</h2>

                        </template>

                      </div>

                    </el-dropdown-menu>

                  </template>
                </el-dropdown>
                <!-- @keyup.enter="moveSearchPage"
                                   v-debounce:150ms="searchType" 
                                   -->
              </div>
            </div>
          </div>

          <!-- FIXME: popper-class: css수정 -->
          <div class="header-language ">
            <el-select class="hl-select-box" v-model="selectedLang" :placeholder="$t('korean')">
              <el-option v-for="item in options" :key="item.code" :label="item.label" :value="item.code"
                @click="switchLangauge" />
            </el-select>
          </div>
          <!-- 로그인 했을 때 -->
          <div class="header-info ml10" v-if="isLogin" style="display:flex; ">
            <!-- message -->

            <!-- /message -->

            <button class="btn-circle-none">
              <NuxtLink :to="localePath(`/channel/${user?.channel_id}`)">
                <ClientOnly>
                  <UserAvatar style="width:30px; height:30px;" :user="user" :key="user?.picture" />
                </ClientOnly>

              </NuxtLink>
            </button>
            <el-dropdown trigger="click" ref="userMenu">
              <button class="btn-circle-none" style="padding-top:5px">
                <i class="uil uil-bars"></i>
              </button>
              <template #dropdown>

                <div slot="body" class="header-setting" style="min-width:250px" @click="userMenu.handleClose()">
                  <dl style="margin:10px 0px 0px 0px">

                    <dd>
                      <h2>{{ user.name }}</h2>
                    </dd>
                  </dl>
                  <div>
                    <h2>{{ $t('myProfile') }} </h2>
                    <div>
                      <NuxtLink :to="localePath(`/channel/${user.channel_id}`)"><i class="uil uil-user"></i>
                        {{ $t('myChannel') }}
                      </NuxtLink>
                      <NuxtLink :to="localePath('/project/list')"><i class="uil uil-robot"></i>
                        {{ $t('gameStudio') }}
                      </NuxtLink>

                    </div>
                  </div>
                  <div>
                    <h2>{{ $t('group') }}</h2>
                    <div>
                      <NuxtLink :to="localePath(`/profile/${user.id}/communities`)"><i class="uil uil-users-alt"></i>
                        {{ $t('joined.group') }}
                      </NuxtLink>
                    </div>
                  </div>
                  <div>
                    <h2>{{ $t('account') }}</h2>
                    <div>
                      <NuxtLink :to="localePath(`/profile/${user.id}`)"><i class="uil uil-setting"></i>
                        {{ $t('my account') }}
                      </NuxtLink>
                    </div>
                  </div>
                  <p><a class="btn-default w100p" @click="logout">{{ $t('logout') }}</a></p>
                </div>
              </template>
            </el-dropdown>
          </div>


          <div class="header-login" v-else-if="!useCookie(config.COOKIE_NAME).value">
            <NuxtLink :to="localePath('/login')">
              <button class="btn-default"><i class="uil uil-user"></i>{{ t('login') }}</button>
            </NuxtLink>
          </div>
          <div v-else style="min-width:80px">
          </div>


          <!-- 모바일 - 우측버튼 -->
          <!-- <div class="header-info-mobile" v-if="$store.getters.user"> -->
          <!--                    <button class="btn-none" @click="isOpenMessage = !isOpenMessage">-->
          <!--                        <i class="uil uil-comment" style="font-size:21px;"></i>-->
          <!--                        <span></span>-->
          <!--                    </button>-->
          <!--                    <button class="btn-none" @click="isOpenMessage = !isOpenMessage">-->
          <!--                        <i class="uil uil-bell" style="font-size:23px;"></i>-->
          <!--                        <span></span>-->
          <!--                    </button> -->
          <!-- <button class="btn-none">
            <i class="uil uil-comment"></i>
          </button> -->

          <!-- 모바일 - 우측버튼 끝 -->
          <!-- 모바일 - 좌측영역 -->
          <!-- <div class="header-side-mobile" :style="isHeaderSideMobile ? 'left:0px;' : '' "
                         id="headerSideMobile">
                        <div class="hsm-close"><i class="uil uil-times" v-on:click="headerSideCloseMobile"></i></div>
                        <div class="hsm-search">
                            <div class="input-search-line-mobile" @click="isOpenSearch = !isOpenSearch">
                                <p><i class="uil uil-search"></i>
                                <p>
                                <div><input type="text" name="" title="keywords"
                                            :placeholder="t('needSearchInput')"/></div>
                            </div>
                        </div>
                        <div class="hsm-menu">
                            <router-link :to="`/${$i18n.locale}/communityList`" @click.native="headerSideCloseMobile"><i class="uil uil-comment"></i>
                                Community
                            </router-link>
                            <router-link :to="`/${$i18n.locale}/gameList`" @click.native="headerSideCloseMobile"><i class="uil uil-robot"></i> Games
                            </router-link>
                            <router-link :to="`/${$i18n.locale}/zem-jam`" @click.native="headerSideCloseMobile"><i class="uil uil-comment"></i>
                                ZEMJAM
                            </router-link>
                        </div>

                    </div>
                    <div class="header-side-bg-mobile" :style="isHeaderSideBgMobile ? 'display:block;' : '' "
                         id="headerSideBgMobile" v-on:click="headerSideCloseMobile">
                        &nbsp;-->
          <!-- </div> -->
          <!-- 모바일 - 좌측영역 끝 -->
          <!-- 로그인 했을 때 끝 -->
          <!-- 로그인 안했을 때 -->
          <!-- <div class="header-login" v-else>

          <NuxtLink to="/login">
            <button flat class="btn-default">
              <i class="uil uil-user"></i>{{ $t('login') }}
            </button>
          </NuxtLink>
        </div> -->
          <!-- 로그인 안했을 때 끝 -->

          <!--          <div class="header-info-mobile">-->
          <!--            <button class="btn-none" @click="isOpenMessage = !isOpenMessage">-->
          <!--              <i class="uil uil-comment"></i>-->
          <!--              <span></span>-->
          <!--            </button>-->
          <!--            <button class="btn-none" @click="isOpenMessage = !isOpenMessage">-->
          <!--              <i class="uil uil-bell"></i>-->
          <!--              <span></span>-->
          <!--            </button>-->
          <!--            <button class="btn-none" @click="isOpenSetting = !isOpenSetting">-->
          <!--              <i class="uil uil-setting"></i>-->
          <!--            </button>-->
          <!--          </div>-->

          <!-- <div class="header-search-mobile">
                  <div class="input-search" @click="isOpenSearch = !isOpenSearch">
                    <p><i class="uil uil-search"></i><p>
                    <div><input type="text" name="" title="keywords" placeholder="검색어를 입력하세요." /></div>
                  </div>
                </div> -->

          <!-- 검색 리스트 -->
          <!-- <template v-if="searchInput.length > 0">
                    <dropdown-menu :isOpen="isOpenSearch" @closed="isOpenSearch = false" :overlay="false"
                                   class="header-search-dropdown">

                        <div slot="body" class="header-search-list">
                            <div>
                                <template v-if="userList && userList.length > 0">
                                    <h2>{{ t('user.name') }}</h2>
                                    <div v-for="user in userList"
                                         :key="user.id"
                                         @click="userPage(user.channel_id)">
                                        <dl>
                                            <dt>
                                                <UserAvatar :user="user" :tag="'span'"></UserAvatar>
                                                {{ user.name }}
                                            </dt>
                                            <dd><i class="uil uil-user"></i></dd>
                                        </dl>
                                    </div>
                                </template>
                                <template v-if="gameList && gameList.length > 0">
                                    <h2>{{ t('game.name') }}</h2>
                                    <div v-for="game in gameList" :key="game.id"
                                         @click="moveGamePage(game.pathname)"
                                    >
                                        <dl>
                                            <dt>
                                        <span
                                            :style="`background:url(${game.profile_img ||  game.url_thumb}) center center / cover no-repeat; background-size:cover;`"></span>
                                                {{ game.title }}
                                            </dt>
                                            <dd><i class="uil uil-robot"></i></dd>
                                        </dl>
                                    </div>
                                </template>
                                <template v-if="groupList &&groupList.length > 0">
                                    <h2>{{ t('community.name') }}</h2>
                                    <div v-for="group in groupList" :key="group.id" @click="groupPage(group.id)">
                                        <dl>
                                            <dt>
                                        <span
                                            :style="`background:url(${group.profile_img}) center center / cover no-repeat; background-size:cover;`"></span>
                                                {{ group.name }}
                                            </dt>
                                            <dd><i class="uil uil-comments"></i></dd>
                                        </dl>
                                    </div>
                                </template>

                            </div>
                        </div>
                    </dropdown-menu>
                </template> -->
          <!-- 검색 리스트 끝 -->

          <!-- 신규 메세지 -->
          <!-- 퍼블리싱 페이지에서 붙여와서 사용-->
          <!-- 신규 메세지 끝 -->

          <!-- 설정 -->


          <!-- <dropdown-menu v-if="$store.getters.user" :isOpen="isOpenSetting" @closed="isOpenSetting = false"
                               :overlay="false" class="header-setting-dropdown">

                    <div slot="body" class="header-setting">
                        <dl>
                            <dt>
                                <UserAvatar :user="$store.getters.user" :tag="'span'"></UserAvatar>
                            </dt>
                            <dd>
                                <h2>{{ user.name }}</h2>
                            </dd>
                        </dl>
                        <div>
                            <h2>{{ t('myProfile') }}</h2>
                            <div>
                                <router-link :to="`/${$i18n.locale}/myChannel`" @click.native="isOpenSetting = false"><i
                                    class="uil uil-user"></i>
                                    {{ t('myChannel') }}
                                </router-link>
                                <router-link :to="`/${$i18n.locale}/projectList`"><i class="uil uil-robot"></i>
                                    {{ t('gameStudio') }}
                                </router-link>
                                <router-link :to="`/${$i18n.locale}/user/${user.channel_id}/settings`"
                                             @click.native="isOpenSetting = false"><i
                                    class="uil uil-setting"></i>
                                    {{ t('account.settings') }}
                                </router-link>
                            </div>
                        </div>
                        <div>
                            <h2>{{ t('group') }}</h2>
                            <div>
                                <router-link @click.native="isOpenSetting = false"
                                             :to="`/${$i18n.locale}/user/${user.channel_id}/manageJoinedGroup`"><i
                                    class="uil uil-users-alt"></i>
                                    {{ t('joined.group') }}
                                </router-link>
                            </div>
                        </div>
                        <p @click="logout"><a class="btn-default w100p">{{ t('logout') }}</a></p>
                    </div>
                </dropdown-menu> -->
          <!-- 설정 끝 -->

        </dd>
      </dl>

      <ClientOnly>
        <el-dialog v-model="isOpen" append-to-body custom-class="modal-area-type" :show-close="false">
          <div class="modal-alert">
            <dl class="ma-header">
              <dt>{{ $t('information') }}</dt>
              <dd>
                <button @click="useModal().closeLoginModal()"><i class="uil uil-times"></i></button>
              </dd>
            </dl>

            <div class="ma-content">
              <h2>{{ $t('needLogin.text1') }}<br />{{ $t('needLogin.text2') }}</h2>
              <div>
                <button class="btn-default" style="width: 100%" @click="$router.push(localePath('/login'))">
                  {{ $t('login') }}</button>
              </div>
            </div>

          </div>
        </el-dialog>
      </ClientOnly>


    </div>
  </ClientOnly>
</template>

<script setup lang="ts" >
import _ from 'lodash'
import { useI18n } from 'vue-i18n';
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ElSelect, ElOption, ElMessage, ElDialog } from "element-plus";
import { useLocalePath } from 'vue-i18n-routing';
import { signOut } from 'firebase/auth'


const { t, locale } = useI18n()
const localePath = useLocalePath();
const $router = useRouter();

const { $firebaseAuth, $cookies } = useNuxtApp()
const config = useRuntimeConfig()


const isLogin = computed(() => useUser().user.value.isLogin)
const user = computed(() => useUser().user.value.info)
const isPending = ref(true)
const userMenu = ref()
const searchDropdown = ref()


const searchInput = ref('')
const userList = ref([])
const gameList = ref([])
const communityList = ref([])
const hasResearchResult = ref(false)

const options = [
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'English' },
]
const selectedLang = ref('en')

const isOpen = ref(false)
const { loginModal } = useModal();

watch(
  () => loginModal.value.isOpen,
  (state: boolean) => {
    isOpen.value = state;
  }
)

// const isLogin = computed(() => userStore.$state.isLogin)
// const user = computed(() => userStore.$state.user)

// const fUser = ref(computed(() => userStore.$state.fUser))




onMounted(() => {
  isPending.value = false;
})
function switchLangauge() {
  locale.value = selectedLang.value
}

function logout() {
  useUser().logout();
  // signOut($firebaseAuth)
  //   .then(() => {
  //     useUser().removeUserState();
  //     $cookies.remove(config.COOKIE_NAME, {
  //       path: '/',
  //       domain: config.COOKIE_DOMAIN
  //     })
  //     $router.push('/')
  //   })
  //   .catch((error: any) => {
  //     ElMessage({
  //       message: error.message,
  //       type: 'error'
  //     })
  //   })

}

const search = _.debounce(async () => {
  const { data, error, pending } = await community.search({ q: searchInput.value })
  const { posts, games, community: comList, users } = data.value
  userList.value = users;
  gameList.value = games
  communityList.value = comList

  if (userList.value?.length || gameList.value?.length || communityList.value?.length) {
    hasResearchResult.value = true
  }
  else {
    hasResearchResult.value = false
  }
}, 300)

function moveSearchPage() {
  $router.push(localePath(`/search`) + `?q=${searchInput.value}`)
  // initSearchData()
}


function movePage(command: any) {
  const searchObj = command[1];
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
  $router.push(localePath(`/channel/${channelId}`))
}
function moveCommunityPage(communityId: string) {
  initSearchData()
  $router.push(localePath(`/community/${communityId}`))
}

function moveGamePage(pathname: string) {
  initSearchData()
  $router.push(localePath(`/game/${pathname}`))
}


function initSearchData() {
  searchInput.value = '';
  userList.value = []
  gameList.value = []
  communityList.value = []
  hasResearchResult.value = false
  searchDropdown.value.handleClose()
}


</script>

<style lang="scss" scoped>
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




// q-select

@media all and (max-width: 479px) {

  //.header > dl {width:90%; padding:15px 0;}
  //.header-logo-menu p {display:flex; align-items:center; margin-right:0;}
  //.header-logo-menu p i {display:block; font-size:22px; margin-right:10px;}
  //.header-logo-menu p a img {width:100px;}
  //.header-logo-menu ul {display:none;}
  //.header-search {display:none;}
  //.header-language {display:none;}
  .header-login {
    display: block !important;
  }

  //.header-info {display:none;}
  //.header-info-mobile {display:block;}
}

@media all and (min-width: 480px) and (max-width: 767px) {

  //.header > dl {width:470px; padding:15px 0;}
  //.header-logo-menu p {display:flex; align-items:center; margin-right:0;}
  //.header-logo-menu p i {display:block; font-size:22px; margin-right:10px;}
  //.header-logo-menu p a img {width:100px;}
  //.header-logo-menu ul {display:none;}
  //.header-search {display:none;}
  //.header-language {display:none;}
  .header-login {
    display: block !important;
  }

  //.header-info {display:none;}
  //.header-info-mobile {display:block;}
}

@media all and (min-width: 768px) and (max-width: 991px) {

  //.header > dl {width:750px;}
  //.header-search {display:none;}
  //.header-language {display:none;}
  .header-login {
    display: block !important;

  }

  //.header-info {display:none;}
  //.header-info-mobile {display:block;}
}

@media all and (min-width: 992px) and (max-width: 1199px) {
  .header>dl {
    width: 970px;
  }

  .header-info-mobile {
    display: none;
  }
}

@media all and (min-width: 1200px) {}
</style>

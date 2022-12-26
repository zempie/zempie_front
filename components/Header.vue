<template>
  <div class="header">
    <dl>
      <dt>
        <div class="header-logo-menu">
          <p>
            <NuxtLink :to="$localePath('/')">
              <img
                v-if="showMobileLogo"
                class="mobile-logo"
                src="/images/zempie_logo_154_155.png"
                alt="zempie-logo"
              />
              <img
                v-else
                class="logo"
                src="/images/zempie-logo-black.png"
                alt="zempie-logo"
              />
            </NuxtLink>
          </p>
          <button
            class="btn-circle-none"
            @click="isHeaderSideMobile = true"
            v-if="showHamburger"
          >
            <i class="uil uil-bars"></i>
          </button>
          <ul class="menu">
            <li class="uppercase">
              <NuxtLink
                :to="$localePath('/community/list')"
                :class="$route.name.toString().includes('community-list') && 'active'"
              >
                community
              </NuxtLink>
            </li>
            <li class="uppercase">
              <NuxtLink
                id="gameMenu"
                :to="$localePath('/game/list')"
                :class="
                  $route.name.toString().includes('game-list') && 'active'"
>
                games
              </NuxtLink>
            </li>
            <ClientOnly>
            <el-dropdown trigger="click" class="menu-dropdown uppercase">
              <span class="el-dropdown-link">
              GameJam
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item class="header-menu" @click="router.push($localePath('/zem-jam'))">
                ZEMJAM
              </el-dropdown-item>
                <el-dropdown-item class="header-menu" @click="router.push($localePath('/game-jam-plus'))">
                GJ+
              </el-dropdown-item>
            </el-dropdown-menu>
            </template>
          </el-dropdown>
        </ClientOnly>
          <li class="uppercase pointer">
            <a id="zempieWorldMenu" @click="moveZemWorld">
                Zempie world
            </a>
          </li>
          </ul>
        </div>
      </dt>

      <ClientOnly>
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
                                  <UserAvatar
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
          <div  class="header-info ml0" v-if="isLogin">
            <!-- <el-dropdown
                  ref="notiDropdown"
                  id="notiList"
                  trigger="click"
                >
              <button class="btn-circle-icon ml10" @click="showAlarmList">
                  <i class="uil uil-bell" style="font-size:21px;"></i>
                  <span v-if="hasNewNoti" ></span>
              </button>
              <template #dropdown>
                  <div slot="body" class="header-message">
                  <dl>
                    <dt>Notifications</dt>
                    <dd>
                      <a @click="readAll"><i class="uil uil-comment-alt"></i><em>{{ t('mark.all') }}</em></a>
                    </dd>
                  </dl>
                  <ul>
                    <li v-if="isNotiLoading" v-for="noti in 4">
                      <dl>
                        <dd>
                          <UserAvatarSk style="width:50px; height:50px;"/>
                        </dd>
                        <dt>
                          <h3 class="grey-text skeleton-animation" style="height:20px"></h3>
                          <p class="grey-text skeleton-animation" style="height:20px; width: 300px;"></p>
                        </dt>
                        <dd>
                        </dd>
                      </dl>
                    </li>
                    <template v-else>
                      <li v-if="notiList?.length" v-for="noti in notiList" :key="noti.id" :class="!noti.is_read && 'is-read-active'" >
                        <dl @click.stop="moveAlarm(noti)">
                          <dd>
                              <UserAvatar :user="noti.user" :tag="'span'" :hasRouter="true" />
                          </dd>
                          <dt>
                            <h3><span @click.stop="$router.push($localePath(`/channel/${noti.user.channel_id}`))">{{noti.user.name}}&nbsp;</span>{{noti.type_text}}</h3>
                            <h4>{{noti.content.slice(0,40)}}</h4>
                            <p><i class="uis uis-clock" style="color:#c1c1c1;"></i>{{dateFormat(noti.created_at)}}</p>
                          </dt>
                          <dd>
                          </dd>
                        </dl>
                      </li>
                      <li v-else>
                        <dl>
                          {{ t('no.alarm') }}
                        </dl>
                      </li>
                  </template>
                  </ul>
                  <p class="view-all" @click="goNotiList"><a>{{ t('view.all') }}</a></p>
                  </div>
              </template>
            </el-dropdown> -->
          <div
            class="ml10"
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
              <button class="btn-default" id="loginBtn" style="display: flex;">
                <i class="uil uil-user"></i>{{ t('login') }}
              </button>
            </NuxtLink>
          </div>
          <div
            class="header-side-mobile"
            :style="isHeaderSideMobile && 'left:0px;'"
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
              <a class="pointer" id="zempieWorldMenu"  @click="moveZemWorld">
                <i class="uil uil-globe"></i>
                Zempie world
            </a>
              <NuxtLink
                :to="$localePath('/zem-jam')"
                @click.native="isHeaderSideMobile = false"
                ><i class="uil uil-play"></i>
                ZEMJAM
              </NuxtLink>
              <NuxtLink
                :to="$localePath('/game-jam-plus')"
                @click.native="isHeaderSideMobile = false"
                ><i class="uil uil-keyboard"></i>
                GJ+
              </NuxtLink>

            </div>
          </div>
          <div
            class="header-side-bg-mobile"
            :style="isHeaderSideBgMobile ? 'display:block;' : ''"
            id="headerSideBgMobile"
          >
            &nbsp;
          </div>
        </dd>
    </ClientOnly>
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
</template>

<script setup lang="ts">
import _ from 'lodash'
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
import { INotification, eNotificationType } from '~~/types';
import { dateFormat } from '~/scripts/utils'
import shared from '~/scripts/shared'

const NOTI_LIMIT = 5
const config = useRuntimeConfig()
const { $localePath } = useNuxtApp()
const { t, locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const router = useRouter()
const route = useRoute()

const isLogin = computed(() => useUser().user.value.isLogin)
const user = computed(() => useUser().user.value.info)
const userMenu = ref()
const searchDropdown = ref()

const searchInput = ref()
const userList = ref([])
const gameList = ref([])
const communityList = ref([])
const hasResearchResult = ref(false)
const isHeaderSideMobile = ref(false)
const isHeaderSideBgMobile = ref(false)


const notiDropdown = ref()
const notiList = ref<INotification[]>()
const isNotiLoading = ref(false)
const needAlarmRefresh = ref(false)
const hasNewNoti = ref()

const isMobile = computed(() =>
  window.matchMedia('screen and (max-width: 479px)')
)

const isTablet = computed(() =>
  window.matchMedia('screen and (max-width: 767px)')
)

const showMobileLogo = ref(false)
const showHamburger = ref(false)
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

watch(
  () => useAlarm().alarm.value.newNoti,
  (val) => {
    if( val ) hasNewNoti.value = true
  }
)


watch(
  () => useUser().user.value.info,
  (val) => {
    if( val.new_noti_count ) hasNewNoti.value = true
  }
)

onMounted(()=>{
  nextTick(() => {
    onResize()
  })
  window.addEventListener('resize', onResize)
})


onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
})


function onResize() {
  if (isMobile.value.matches) {
    showMobileLogo.value = true
  } else {
    showMobileLogo.value = false
  }

  if(isTablet.value.matches){
    showHamburger.value = true
  }else{
    showHamburger.value = false
  }
}

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

async function showAlarmList(){

  if(notiList.value && !hasNewNoti.value) return
  if(needAlarmRefresh.value) return

  isNotiLoading.value = true

  const { count, result } = await useCustomFetch<{count:number, result:INotification[]}>(  createQueryUrl('/notification', {offset:0, limit:NOTI_LIMIT}), getComFetchOptions('get', true))

  notiList.value = result.map((noti:INotification)=>{
    return {
      ...noti,
      type_text: shared.notiText(noti.type)
    }

  })
  isNotiLoading.value = false
  needAlarmRefresh.value = false

  useAlarm().resetNewNoti()
  useUser().updateUserKey('new_noti_count', 0)

  hasNewNoti.value = false
}

async function moveAlarm(noti:INotification){

  await shared.commonTryCatch( async () =>{ return await useCustomFetch('/notification', getComFetchOptions('put', true, {id:noti.id}))})
  .then(()=>{
    shared.moveNoti(noti)
    notiDropdown.value.handleClose()
    needAlarmRefresh.value = true
  })
}

function goNotiList(){
  router.push($localePath('/notifications'))
  notiDropdown.value.handleClose()

}




async function readAll(){
  await shared.commonTryCatch( async() => { return await useCustomFetch('/notification/read-all', getComFetchOptions('put', true))})
  .then(()=>{
    notiList.value.map((noti)=>{
      return noti.is_read = true
    })
  })

}

async function moveZemWorld(){
  if(isLogin.value){
    const {result} = await useCustomFetch<{result:{token: string}}>('/create/token', getZempieFetchOptions('post', true))
    if( result ){
      window.open(`${config.ZEMPIE_METAVERSE}?key=${result.token}`, '_blank');
    }
  }else{
    router.push($localePath('/login'))
  }

}

</script>

<style lang="scss" scoped>
.header{

  .header-info{
    display: flex;
    align-items: center;
  }
  .menu {
    li{
      .active {
        color: #f97316;
      }
    }
  }
  .menu-dropdown{
    display: inline-block;
    padding: 20px 20px 20px 0;
    font-weight: 700;
    font-size: 16px;
    line-height: 14px;
    color: #333;
    &:hover{
      cursor: pointer;
      color:#f97316;
    }
  }
  .btn-circle-none {
    padding-top: 5px;

    &.mobile {
      display: none !important;
    }
  }

}
.btn-circle-none .mobile {
  display: none !important;
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

.header-message{
  ul{
    li{
      width: 400px;
      &.is-read-active{
        border-left: 3px solid #ff6e17;
      }
      h3{
        span{
          &:hover{
            color:#ff6e17
          }
        }
      }
      h4{
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
  .view-all{
    &:hover{
      cursor: pointer;
    }
  }
}

@media all and (max-width: 479px) {
  .logo {
    display: none;
  }

  .mobile-logo {
    display: block !important;
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

  .mobile-logo {
   display: none;
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

@media all and (min-width: 768px) and (max-width: 991px) {
  .mobile-logo{
    display: none;
  }
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
   .mobile-logo{
    display: none;
  }
  .header-login {
    display: block !important;

    i {
      display: none;
    }
  }

}

@media all and (min-width: 1200px) {
  .mobile-logo{
    display: none;
  }
  .btn-circle-none {
  padding-top: 5px;
    &.mobile {
      display: none;
    }
  }
}
</style>

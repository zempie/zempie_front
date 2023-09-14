<template>
  <div class="header" :class="headerShowClass">
    <dl style="min-height: 70px;">
      <dt>
        <div class="header-logo-menu">
          <p>
            <NuxtLink :to="$localePath('/')">
              <!-- <img v-if="showMobileLogo" class="mobile-logo" src="/images/zempie_logo_154_155.png" alt="zempie-logo"
                loading="lazy" height="25" width="120" /> -->
              <img class="logo" src="/images/zempie-logo-black.png" alt="zempie-logo" loading="lazy" width="120"
                height="25" />
            </NuxtLink>
          </p>
          <ul class="menu">
            <li class="uppercase">
              <NuxtLink :to="$localePath('/community/list')"
                :class="$route.name?.toString().includes('community-list') && 'active'">
                community
              </NuxtLink>
            </li>
            <li class="uppercase">
              <NuxtLink id="gameMenu" :to="$localePath('/game/list')"
                :class="$route.name.toString().includes('game-list') && 'active'">
                games
              </NuxtLink>
            </li>
            <li class="uppercase pointer">
              <NuxtLink id="zemtownMenu" to="/zemtown">
                Zemtown
              </NuxtLink>
            </li>
          </ul>
        </div>
      </dt>

      <ClientOnly>
        <dd>
          <div class="header-language mr10">
            <el-select class="hl-select-box" v-model="selectedLang" :placeholder="t('korean')">
              <el-option v-for="item in options" :key="item.code" :label="item.label" :value="item.code" />
            </el-select>
          </div>
          <SearchHeader />

          <div class="header-info ml0" v-if="!isLoading && isLogin" :key="user.id">
            <NotificationHeaderButton />
            <button class="btn-circle-icon ml10 flex items-center content-center"
              @click="$router.push($localePath('/dm/list'))">
              <i>
                <IconMessage />
              </i>
              <span class="new-dm-badge" v-if="unreadMsgCount">{{ unreadMsgCount }}</span>
            </button>
            <UserMenu class="user-menu-btn" />
          </div>
          <div v-else-if="!isLoading && !isLogin" class="header-login">
            <NuxtLink :to="$localePath('/login')">
              <button class="btn-default flex" id="loginBtn" style="display: flex;">
                {{ t('login') }}
              </button>
            </NuxtLink>
          </div>
        </dd>
      </ClientOnly>
    </dl>
    <el-dialog v-model="isOpen" append-to-body class="modal-area-type" :show-close="false" width="380px">
      <div class="modal-alert">
        <dl class="ma-header">
          <dt>{{ t('information') }}</dt>
          <dd>
            <button class="pointer" @click="useModal().closeLoginModal()">
              <IconClose />
            </button>
          </dd>
        </dl>
        <div class="ma-content">
          <h2>{{ t('needLogin.text1') }}<br />{{ t('needLogin.text2') }}</h2>
          <div>
            <button class="btn-default" style="width: 100%" @click="$router.push($localePath('/login'))">
              {{ t('login') }}
            </button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
  <MobileMenu />
</template>

<script setup lang="ts">
import _ from 'lodash'
import { useI18n } from "vue-i18n"
import {
  ElSelect,
  ElOption,
  ElDialog,
} from "element-plus"

import shared from '~/scripts/shared'

const config = useRuntimeConfig()
const { $localePath } = useNuxtApp()
const { t, locale } = useI18n()

const router = useRouter()
const route = useRoute()

const isLogin = computed(() => useUser().user.value.isLogin)
const isLoading = computed(() => useUser().user.value.isLoading)
const user = computed(() => useUser().user.value.info)

const showMogera = ref(false)

const isFlutter = computed(() => useMobile().mobile.value.isFlutter)

const unreadMsgCount = computed(() => {
  return user.value?.unread_msg_cnt > 99 ? '99+' : user.value.unread_msg_cnt
})


const isMobileSize = computed(() =>
  window.matchMedia("screen and (max-width: 479px)")
)

const isTablet = computed(() =>
  window.matchMedia("screen and (max-width: 767px)")
)

const isMobile = computed(() => useCommon().common.value.isMobile)

const showMobileLogo = ref(false)
const showHamburger = ref(false)
const options = [
  { code: "ko", label: "한국어" },
  { code: "en", label: "English" },
]
const selectedLang = computed({
  get: () => locale.value,
  set: newValue => {
    shared.switchLang(newValue)
    locale.value = newValue;
  }
})

const isOpen = ref(false)
const { loginModal } = useModal()


const scrollDirection = ref(true); // true: scroll up, false :scroll down
const scrollTrace = ref(0);

const headerShowClass = computed(() => {
  if (!scrollDirection.value) return 'header-off';
  return '';
});

watch(
  () => useCommon().common.value.isPopState,
  (val) => {
    if (!val) {
      isOpen.value = false
    }
  })

watch(
  () => loginModal.value.isOpen,
  (state: boolean) => {
    isOpen.value = state
    if (state) {
      if (isMobile.value) {
        useCommon().setPopState(true)
      }
    }
  }
)

onMounted(() => {
  nextTick(() => {
    onResize()
    onPressMogera()
    scrollHandler()
  })
  window.addEventListener("resize", onResize)
  document.addEventListener('scroll', scrollHandler);
})


onBeforeUnmount(() => {
  window.removeEventListener("resize", onResize)
  document.removeEventListener('scroll', scrollHandler);
})

function onResize() {
  showMobileLogo.value = isMobileSize.value.matches ? true : false
  showHamburger.value = isTablet.value.matches ? true : false
}


async function getGameToken() {
  if (isLogin.value) {
    return await useCustomFetch<{ result: { token: string } }>("/create/token", getZempieFetchOptions("post", true))
  } else {
    router.push($localePath("/login"))
  }
}



function onPressMogera() {
  window.addEventListener('keydown', (e) => {

    if (e.which === 13 && e.ctrlKey) {
      showMogera.value = !showMogera.value
    }
  })
}


function scrollHandler() {
  const headerHeight = 70;
  const space = 40;
  const currentScroll = window.scrollY;
  
  if (window.scrollY <= headerHeight || currentScroll + space < scrollTrace.value) {
    scrollDirection.value = true;
    scrollTrace.value = currentScroll;
  } else if (currentScroll - space > scrollTrace.value) {
    scrollDirection.value = false;
    scrollTrace.value = currentScroll;
  }
}

</script>

<style lang="scss" scoped>
.header {
  .header-info {
    display: flex;
    align-items: center;
  }


  .menu-dropdown {
    display: inline-block;
    padding: 20px 20px 20px 0;
    font-weight: 700;
    font-size: 16px;
    line-height: 14px;
    color: #333;

    &:hover {
      cursor: pointer;
      color: #f97316;
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

.btn-circle {
  display: inline-block;
  width: 40px;
  height: 40px;
  text-align: center;
  font-size: 18px;
  line-height: 18px;
  border: none;
  border-radius: 50%;
  background: #fbf6f2;
  transition: all 0.4s ease-in-out;
  cursor: pointer;
}

.new-dm-badge {
  font-size: 12px;
  padding: 0px 5px;
  color: white;
  width: auto;
  height: auto;
  z-index: 99;
  border-radius: 10px;
}

@media all and (max-width: 479px) {

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
    display: none;
  }

  .header-login {
    display: block !important;

    i {
      display: none;
    }
  }

  .user-menu-btn {
    display: none;
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
    display: none;
  }

  .header-login {
    display: block !important;

    i {
      display: none;
    }
  }

  .user-menu-btn {
    display: none;
  }
}

@media all and (min-width: 768px) and (max-width: 991px) {
  .mobile-logo {
    display: none;
  }

  .header-language {
    display: none;
  }

  .header-login {
    display: block !important;

    i {
      display: none;
    }
  }
}

@media all and (min-width: 992px) and (max-width: 1199px) {
  .header {
    dl {
      width: 100%;
    }

    .mobile-logo {
      display: none;
    }

    .header-login {
      display: block !important;

      i {
        display: none;
      }
    }
  }
}

@media all and (min-width: 1200px) {
  .mobile-logo {
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

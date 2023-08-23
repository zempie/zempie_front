<template>
  <NuxtLayout>
    <noscript v-html="tmIframeCode"></noscript>
    <NuxtPage />
    <div :class="['zemtown-frame', String(route.name).includes('zemtown') ? 'on' : 'off']">
      <ClientOnly>
        <iframe ref="zemtownRef" :src="zemtownUrl" style="width: 100%; height: 99%;" />
      </ClientOnly>
    </div>
  </NuxtLayout>
</template>
<script setup lang="ts">
import { ID_INJECTION_KEY } from 'element-plus'
import { useI18n } from 'vue-i18n'
import flutterBridge from './scripts/flutterBridge';
import shared from './scripts/shared';
import FlutterBridge from '~~/scripts/flutterBridge'


const { t, locale } = useI18n()
const config = useRuntimeConfig()
const switchLocalePath = useSwitchLocalePath()
const route = useRoute()
const router = useRouter()

const cookie = useCookie(config.COOKIE_NAME)
const isFlutter = computed(() => useMobile().mobile.value.isFlutter)
const isLoading = computed(() => useUser().user.value.isLoading)


const zemtownUrl = computed(async () => {
  if (isFlutter.value) {
    const response = await FlutterBridge().getFbCurrentUser()

    FlutterBridge().webLog(`typeof :  ${typeof response.message}`)
    FlutterBridge().webLog(response.message)

    FlutterBridge().webLog(`${config.ZEMTOWN_URL}?token=${response?.message?.idToken}`)

    return `${config.ZEMTOWN_URL}?token=${response.message.idToken}`
  } else {
    return fUser.value ? `${config.ZEMTOWN_URL}?token=${fUser.value.accessToken}` : `${config.ZEMTOWN_URL}`
  }
})

const fUser = computed(() => useUser().user.value.fUser)

const tmIframeCode = `<iframe src="https://www.googletagmanager.com/ns.html?id=${config.TAG_MANAGER_ID}"
height="0" width="0" style="display:none;visibility:hidden"></iframe>`

const userSetting = computed(() => useCommon().setting.value)

const userInfo = computed(() => useUser().user.value.info)

shared.createHeadMeta(
  t('seo.landing.title'),
  t('seo.landing.description')
)

provide(ID_INJECTION_KEY, {
  prefix: 100,
  current: 0,
})


onBeforeMount(async () => {
  colorLog('===App start===', 'red')
  await useMobile().setMobileState()

  try {
    const fUser = await getCurrentUser()
    if (!fUser) {
      useUser().setLoadDone()
    }

    if (isFlutter.value && fUser && !userInfo.value) {
      await useUser().setUserInfo()


    }

  } finally {
    useUser().setLoadDone()
  }

  //기존에 사용하던 쿠키가 있으면 삭제 -> 더 이상 사용하지 않음(기존 유저브라우저에 쿠키가 남았을 여부를 생각해서 남겨둠)
  if (cookie.value) {
    cookie.value = null
  }

  notiPerCheck()


  //언어
  if (isFlutter.value) {
    const lang = await flutterBridge().currentLanguage()
    shared.switchLang(lang)
  }


  // route.name.includes("en")
  if (document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled) {
    // Add an event listener to detect fullscreen changes
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
  }
})

onMounted(() => {
  nextTick(() => {
    FlutterBridge().webLog(zemtownUrl.value)
  })
})

function handleFullscreenChange() {
  var isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;

  if (isFullscreen) {
    console.log('The browser is in fullscreen mode.');
    FlutterBridge().sendFullscreenMode(true)

  } else {
    console.log('The browser is not in fullscreen mode.');
    FlutterBridge().sendFullscreenMode(false)
  }
}

onBeforeUnmount(() => {
  if (document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled) {
    // Add an event listener to detect fullscreen changes
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
    document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
    document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
  }
})

function notiPerCheck() {
  const permissionCheck = Notification.permission;
  switch (permissionCheck) {
    case 'default':
      Notification.requestPermission()
        .then(result => {
          if (result === 'denied') {
            useCommon().setNoti(false)
          } else {
            useCommon().setNoti(true)
          }
        });
      break;
    case 'granted':
      useCommon().setNoti(true)
      break
    case 'denied':
      useCommon().setNoti(false)
      break
  }
}



</script>

<style lang="scss">
@import 'https://unicons.iconscout.com/release/v3.0.3/css/line.css';
@import '~/assets/css/common.css';
@import '~/assets/css/common.scss';
@import '~/assets/css/editor.scss';
@import '~/assets/css/common.css';
@import '~/assets/css/content.css';
@import '~/assets/css/swiper.scss';
@import '~/assets/css/pagination.scss';


body {
  margin: 0px !important;
  //전체 페이지 자간 조정
  letter-spacing: -1px;

  .content {
    min-height: calc(100vh - 200px) !important;
  }


  .my-header {
    display: inline-flex;

    li {
      &:not(:last-child) {
        margin-right: 10px;
      }

      input[type='checkbox']+label {
        color: #0d0c13 !important;
      }
    }
  }


  .zemtown-frame {
    position: relative;
    width: 100%;
    min-height: calc(100vh - 215px - 74px) !important;
    top: 74px;
    background-color: #000;
    margin-bottom: 74px;

    &.on {
      display: flex;
      height: calc(100vh - 74px);
    }

    &.off {
      display: none;
    }
  }


  @media all and (max-width: 479px) {

    .zemtown-frame {
      top: 0px;

      &.on {
        height: 100vh;
      }
    }
  }

  @media all and (min-width: 480px) and (max-width: 767px) {
    .zemtown-frame {
      top: 0px;

      &.on {
        height: 100vh;
      }
    }
  }
}
</style>

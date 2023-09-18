<template>
  <div id="gamePage">
    <ClientOnly>
      <iframe ref="game" class="iframe" :style="`height:${iframeHeight};`" :src="config.ENV === 'local' || config.ENV === 'development'
        ? `${config.LAUNCHER_URL}/#/game/${gamePath}`
        : `${config.LAUNCHER_URL}/game/${gamePath}`
        "></iframe>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { getIdToken } from 'firebase/auth'
import { useI18n } from 'vue-i18n'
import shared from '~~/scripts/shared';
import { IGame } from '~~/types';
import { ElMessageBox, } from 'element-plus'
import { openFullScreen } from '~~/scripts/utils'
import { onBeforeRouteLeave } from 'vue-router';
const HOURTOSEC = 60 * 60

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const { $firebaseAuth, $localePath, $cookies } = useNuxtApp()

const iframeHeight = ref('')
const game = ref<HTMLIFrameElement>()
const initLauncher = ref(false)

const gameData = computed(() => data.value.result.game)
const gamePath = computed(() => route.params.id)
const userInfo = computed(() => useUser().user.value.info)
const fUser = computed(() => useUser().user.value.fUser)
const isMobile = computed(() => useCommon().common.value.isMobile)

definePageMeta({
  layout: 'layout-none',
})

/**
 * seo 반영은 함수안에서 되지 않으므로 최상단에서 진행함
 */
const { data } = await useAsyncData<{ result: { game: IGame; my_emotions: {}; my_heart: boolean } }>('gameInfo', () =>
  $fetch(`/game/${gamePath.value}`, getZempieFetchOptions('get', true)),
  {
    initialCache: false
  }
)

shared.createHeadMeta(data.value?.result?.game.title, data.value?.result?.game.description, data.value?.result?.game.url_thumb)

watch(
  () => userInfo.value,
  (info) => {
    if (info && fUser.value) {
      onChangedToken()
    }
  }
)

watch(
  () => fUser.value,
  (info) => {
    if (info && userInfo.value) {
      onChangedToken()
    }
  }
)

/*
 page 단위에서 isPopState 검사 후 true라면 false로 변경
 이후 component에서 watch로 받아 팝업닫기
*/
onBeforeRouteLeave((to, from, next) => {
  if (useCommon().common.value.isPopState) {
    next(false)
    ElMessageBox.close()
    useCommon().setPopState(false)
  } else {
    next()
  }
})

onMounted(async () => {
  if (process.client) {

    ElMessageBox.confirm(`전체화면으로 전환하시겠습니까?`, {
      confirmButtonText: 'YES',
      cancelButtonText: 'Cancel',
      type: 'info',
    })
      .then(() => {
        openFullScreen()
      })



    window.addEventListener('message', onMessage)
    window.addEventListener('resize', onResize)
    onResize()
  }

  // await fetch()
})

onBeforeUnmount(() => {
  window.removeEventListener('message', onMessage)
  window.removeEventListener('resize', onResize)
})

async function fetch() {
  const { data, error, pending } = await useCustomAsyncFetch<{
    result: { game: {}; my_emotions: {}; my_heart: boolean }
  }>(`/game/${gamePath.value}`, getZempieFetchOptions('get', false))

  if (data.value) {
    const { game, my_emotions, my_heart } = data.value.result
    // gameData.value = game
  }
}

function onResize() {
  iframeHeight.value = `${window.innerHeight}px`
}

function onChangedToken() {
  if (userInfo.value)
    toMessage({
      type: '@updateToken',
      token: userInfo.value.uid && useUser().user.value.fUser?.accessToken
    })
}

async function onMessage(msg: MessageEvent) {
  const { type, channel_id } = msg.data

  switch (type) {
    case '@initLauncher': {
      initLauncher.value = true
      toMessage({ type: '@initParent' })
      onChangedToken()
      break
    }
    case '@refreshToken': {
      if (useUser().user.value.fUser) {
        getIdToken(useUser().user.value.fUser, true).then((idToken) => {
          if (idToken) {
            $cookies.set(config.COOKIE_NAME, idToken, {
              maxAge: HOURTOSEC,
              path: '/',
              domain: config.COOKIE_DOMAIN,
            })
          }
        })
      }
      break
    }
    case '@requestLogin': {
      // this.$store.commit("redirectRouter", route.fullPath);
      await router.replace('/login')
      break
    }
    case '@exit': {
      exit()
      break
    }
    case '@moveChannel': {
      await router.push($localePath(`/${channel_id}`))
      break
    }
  }
}

function toMessage(message: any) {
  const iframe = game.value
  if (iframe.contentWindow) {
    iframe.contentWindow.postMessage(message, '*')
  }
}

function exit() {
  router.back()
}
</script>
<style lang="scss" scoped>
.iframe {
  border: 0;
  display: block;
  width: 100%;
  height: 100vh;
}

.exitButton {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 30px;
  height: 30px;
  line-height: 30px;
  padding: 0;
  background-color: initial;
  border: 0;
  color: #727272;
  border-radius: 5px;
  outline: 0;

  &:hover {
    background-color: #ececec;
  }

  &:active {
    background-color: #dddddd;
  }

  i {
    font-size: 24px;
  }
}
</style>

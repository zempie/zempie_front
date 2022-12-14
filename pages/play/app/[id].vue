<template>
  <iframe
    height="90%"
    id="gamePage"
    ref="game"
    class="iframe"
    :style="`height:${iframeHeight};`"
    :src="url"
  />
</template>

<script setup lang="ts">
import { getIdToken } from 'firebase/auth'
import { useI18n } from 'vue-i18n'
import { ZempieSdk } from '~/scripts/zempieSdk'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const { $firebaseAuth, $localePath } = useNuxtApp()

const url = ref('')
const iframeHeight = ref('')
const game = ref<HTMLIFrameElement>()
const gamePath = computed(() => route.params.id)
const userInfo = computed(() => useUser().user.value.info)

definePageMeta({
  layout: 'layout-none',
})
const result = await $fetch<any>(
  `/launch/game/${gamePath.value}`,
  getZempieFetchOptions('get', false)
)

if (result) {
  url.value = result?.result?.game.url_game
}
watch(
  () => result,
  (data) => {
    if (data) {
      url.value = result.result.game.url_game
    }
  }
)

onMounted(async () => {
  if (process.client) {
    ZempieSdk.useCtrl()
    ZempieSdk.useLading()
    ZempieSdk.postMessage({ type: '@initSdk' })

    window.ZempieSdk = ZempieSdk
    window.addEventListener('message', onMessage)
    window.addEventListener('load', onLoad)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('message', onMessage)
  window.removeEventListener('load', onLoad)
})

function onLoad() {
  ZempieSdk.on('@gamePlay', function () {
    toGameFrame('@gamePlay')
  })
  ZempieSdk.on('@gameRetry', function () {
    toGameFrame('@gameRetry')
  })
  ZempieSdk.on('@gamePause', function () {
    toGameFrame('@gamePause')
  })
  ZempieSdk.on('@gameResume', function () {
    toGameFrame('@gameResume')
  })
  ZempieSdk.on('@soundOn', function () {
    toGameFrame('@soundOn')
  })
  ZempieSdk.on('@soundOff', function () {
    toGameFrame('@soundOff')
  })
}

function toGameFrame(type) {
  console.log(type)
  game.value.contentWindow.postMessage({ type: type }, '*')
}
watch(
  () => userInfo.value,
  (info) => {
    if (info) {
      onChangedToken()
    }
  }
)

function onChangedToken() {
  toMessage({
    type: '@updateToken',
    token: useCookie(config.COOKIE_NAME).value,
  })
}

async function onMessage(message: MessageEvent) {
  var type = message.data.type

  switch (type) {
    case '@gameReady': {
      ZempieSdk.ready()
      console.log('@gameReady')

      break
    }
    case '@updateScore': {
      var score = message.data.score
      console.log('@updateScore', score)

      ZempieSdk.updateScore(score)
      break
    }
    case '@gameOver': {
      console.log('@gameOver')

      var score = message.data.score
      ZempieSdk.gameOver(score)
      getRefreshToken()
      onChangedToken()
      break
    }
    case '@gamePlay': {
      console.log('@gamePlay')

      toGameFrame('@gamePlay')
      break
    }
    case '@gameRetry': {
      console.log('@gameRetry')

      toGameFrame('@gameRetry')
      break
    }
    case '@gamePause': {
      console.log('@gamePause')

      toGameFrame('@gamePause')
      break
    }
    case '@soundOn': {
      console.log('@soundOn')

      toGameFrame('@soundOn')
      break
    }
    case '@soundOff': {
      console.log('@soundOff')

      toGameFrame('@soundOff')
      break
    }
    case '@gameContinue': {
      console.log('@gameContinue')

      // ZempieSdk.gameContinue()

      toGameFrame('@gameContinue')
      break
    }
    case '@gameResume': {
      console.log('@gameResume')

      toGameFrame('@gameResume')
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
  router.push($localePath('/'))
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

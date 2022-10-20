<template>
  <div id="gamePage">
    <ClientOnly>
      <iframe
        ref="game"
        class="iframe"
        :style="`height:${iframeHeight};`"
        :src="
          config.ENV === 'local' || config.ENV === 'development'
            ? `${config.LAUNCHER_URL}/#/game/${gamePath}`
            : `${config.LAUNCHER_URL}/game/${gamePath}`
        "
      ></iframe>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { getIdToken } from 'firebase/auth'
import { useI18n } from 'vue-i18n'

const DAYSTOSEC_30 = 60 * 60 * 24 * 30

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const { $firebaseAuth, $localePath, $cookies } = useNuxtApp()

const url = ref('')
const iframeHeight = ref('')
const game = ref<HTMLIFrameElement>()
const gameData = ref()
const initLauncher = ref(false)
const gamePath = computed(() => route.params.id)
const userInfo = computed(() => useUser().user.value.info)

definePageMeta({
  layout: 'layout-none',
})

const { data, error, pending } = await useCustomFetch<{
  result: { game: {}; my_emotions: {}; my_heart: boolean }
}>(`/game/${gamePath.value}`, getZempieFetchOptions('get', false))

watch(
  () => userInfo.value,
  (info) => {
    if (info) {
      onChangedToken()
    }
  }
)

watch(
  () => data.value,
  (info) => {
    if (info) {
      setHead()
    }
  }
)

onMounted(async () => {
  if (process.client) {
    window.addEventListener('message', onMessage)
    window.addEventListener('resize', onResize)
    onResize()
  }
  setHead()
})

onBeforeUnmount(() => {
  window.removeEventListener('message', onMessage)
  window.removeEventListener('resize', onResize)
})

function setHead() {
  if (data.value) {
    const { game, my_emotions, my_heart } = data.value.result
    gameData.value = game

    useHead({
      title: `${gameData.value.title} | Zempie`,
      link: [
        {
          rel: 'alternate',
          href: `${config.ZEMPIE_URL}${route.fullPath}`,
          hreflang: locale,
        },
      ],
      meta: [
        {
          property: 'og:url',
          content: `${config.ZEMPIE_URL}${route.fullPath}`,
        },
        {
          property: 'og:site_name',
          content: 'Zempie',
        },
        {
          name: 'og:type',
          content: 'website',
        },
        {
          name: 'robots',
          content: 'index, follow',
        },
        {
          name: 'description',
          content: `${gameData.value.title}`,
        },
        {
          property: 'og:title',
          content: `${gameData.value.description}`,
        },
        {
          property: 'og:description',
          content: `${gameData.value.description}`,
        },
        {
          property: 'og:url',
          content: `${config.ZEMPIE_URL}${route.path}`,
        },
        {
          name: 'og:image',
          content: `${gameData.value.url_thumb}`,
        },
      ],
    })
  }
}

function onResize() {
  iframeHeight.value = `${window.innerHeight}px`
}

function onChangedToken() {
  toMessage({
    type: '@updateToken',
    token: useCookie(config.COOKIE_NAME).value,
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
      if (useCookie(config.COOKIE_NAME).value) {
        getIdToken(useUser().user.value.fUser, true).then((idToken) => {
          if (idToken) {
            $cookies.set(config.COOKIE_NAME, idToken, {
              maxAge: DAYSTOSEC_30,
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
      await router.push($localePath(`/channel/${channel_id}`))
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

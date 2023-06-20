<template>
  <NuxtLayout>
    <noscript v-html="tmIframeCode"></noscript>
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup lang="ts">
import { ID_INJECTION_KEY } from 'element-plus'
import { useI18n } from 'vue-i18n'
import flutterBridge from './scripts/flutterBridge';
import shared from './scripts/shared';
const { t, locale } = useI18n()
const config = useRuntimeConfig()
const switchLocalePath = useSwitchLocalePath()
const route = useRoute()
const router = useRouter()

const cookie = useCookie(config.COOKIE_NAME)
const isFlutter = computed(() => useMobile().mobile.value.isFlutter)

const tmIframeCode = `<iframe src="https://www.googletagmanager.com/ns.html?id=${config.TAG_MANAGER_ID}"
height="0" width="0" style="display:none;visibility:hidden"></iframe>`
shared.createHeadMeta(
  t('seo.landing.title'),
  t('seo.landing.description')
)

provide(ID_INJECTION_KEY, {
  prefix: 100,
  current: 0,
})


onBeforeMount(async () => {
  await useMobile().setMobileState()
  const userInfo = useUser().user.value.info

  try {
    const fUser = await getCurrentUser()
    if (!fUser) {
      useUser().setLoadDone()
    }

    if (isFlutter.value && fUser && !userInfo) {
      await useUser().setUserInfo()
    }

  } catch (err) {
    useUser().setLoadDone()
  }







  //기존에 사용하던 쿠키가 있으면 삭제 -> 더 이상 사용하지 않음(기존 유저브라우저에 쿠키가 남았을 여부를 생각해서 남겨둠)
  if (cookie.value) {
    cookie.value = null
  }


  const lang = isFlutter.value ? await flutterBridge().currentLanguage() : navigator.language.split('-')[0]
  // //TODO: 언어 확인
  // if (isFlutter.value) {

  //   const [lang] = await flutterBridge().currentLanguage()

  // } else {

  //   const lang = navigator.language.split('-')[0]
  //   useCommon().setLang(locale.value)
  //   router.replace(route.fullPath)

  // }

  console.log('lang', lang)

  if (lang === 'ko') {
    locale.value = 'ko'
    switchLocalePath('ko')
  } else {
    locale.value = 'en'
    switchLocalePath('en')
  }

  useCommon().setLang(locale.value)
  router.replace(route.fullPath)

})
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
}
</style>

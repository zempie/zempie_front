<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup lang="ts">
import { ID_INJECTION_KEY } from 'element-plus'
import { useI18n } from 'vue-i18n'
import shared from './scripts/shared';
const { t, locale } = useI18n()
const config = useRuntimeConfig()
const switchLocalePath = useSwitchLocalePath()
const route = useRoute()
const router = useRouter()

const cookie = useCookie(config.COOKIE_NAME)
const isFlutter = computed(() => useMobile().mobile.value.isFlutter)

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
    alert(`err: ${JSON.parse(err)}`)
    useUser().setLoadDone()
  }







  //기존에 사용하던 쿠키가 있으면 삭제 -> 더 이상 사용하지 않음
  if (cookie.value) {
    cookie.value = null
  }

  const lang = navigator.language.split('-')[0]

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

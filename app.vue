<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <el-dialog v-model="isOpen" append-to-body :fullscreen="true" class="event-dialog">
    <template #header="{ close, titleId, titleClass }">
      <ul class="my-header">
        <li>
          <input type="checkbox" id="oneDay" :value="showOneDay" @click="clickOneDay">
          <label for="oneDay"><i class="uil uil-check"></i></label>
          <span><label for="oneDay">{{ $t('now.show.today') }}</label></span>
        </li>
        <li>
          <input type="checkbox" id="never" :value="showNever" @click="clickNever">
          <label for="never"><i class="uil uil-check"></i></label>
          <span><label for="never">{{ $t('do.now.show') }}</label></span>
        </li>
      </ul>
    </template>
    <EventGJPlus />
  </el-dialog>
</template>
<script setup lang="ts">
import { ElDialog, ID_INJECTION_KEY } from 'element-plus'
import { useI18n } from 'vue-i18n'
import shared from './scripts/shared';
const { t, locale } = useI18n()
const config = useRuntimeConfig()
const switchLocalePath = useSwitchLocalePath()
const route = useRoute()
const router = useRouter()

const isOpen = ref(false)
const showOneDay = ref(false)
const showNever = ref(false)
const userInfo = computed(() => useUser().user.value.info)
const cookie = useCookie(config.COOKIE_NAME)
const isLogin = computed(() => useUser().user.value.isLogin)


watch(
  () => useUser().user.value.fUser,
  async (fUser) => {
    if (fUser && !userInfo.value) {
      // await useUser().setUserInfo()
    }
  })




shared.createHeadMeta(
  t('seo.landing.title'),
  t('seo.landing.description')
)
provide(ID_INJECTION_KEY, {
  prefix: 100,
  current: 0,
})

onBeforeMount(async () => {

  const fUser = await getCurrentUser()
  if (!fUser) {
    useUser().setLoadDone()
  }


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


function clickOneDay(e: Event) {
  const isChecked = (e.target as HTMLInputElement).checked
  if (isChecked) {
    const date = new Date()
    //다음날 00:00:00 까지
    const expiredTime = new Date(2022, 10, date.getDate() + 1, 0, 0, 0).getTime()
    localStorage.setItem('GJ_POPUP_ONE', expiredTime + '')
    isOpen.value = false;
  }
}

function clickNever(e: Event) {
  const isChecked = (e.target as HTMLInputElement).checked
  if (isChecked) {
    localStorage.setItem('GJ_POPUP_NEVER', 'true')
    isOpen.value = false;
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

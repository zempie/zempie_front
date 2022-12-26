<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <el-dialog
        v-model="isOpen"
        append-to-body
        :fullscreen="true"
        class="event-dialog"
      >
      <template #header="{ close, titleId, titleClass }">
        <ul class="my-header">
          <li>
            <input type="checkbox" id="oneDay" :value="showOneDay" @click="clickOneDay"  >
            <label for="oneDay"><i class="uil uil-check"></i></label>
            <span><label for="oneDay">{{$t('now.show.today')}}</label></span>
          </li>
          <li>
            <input type="checkbox" id="never" :value="showNever"  @click="clickNever"   >
            <label for="never"><i class="uil uil-check"></i></label>
            <span><label for="never">{{$t('do.now.show')}}</label></span>
          </li>
        </ul>
      </template>
      <EventGJPlus/>
    </el-dialog>
</template>
<script setup lang="ts">
import { ElDialog, ID_INJECTION_KEY } from 'element-plus'
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()
const config = useRuntimeConfig()
const switchLocalePath = useSwitchLocalePath()
const route = useRoute()
const router = useRouter()

const isOpen = ref(false)
const showOneDay = ref(false)
const showNever = ref(false)

const userInfo = useUser().user.value.info

watch(
  ()=> useUser().user.value.fUser,
  async (fUser)=>{

    if(useCookie(config.COOKIE_NAME).value && !userInfo){
      await useUser().setUserInfo()
    }
})

useHead({
  title: `${t('seo.landing.title')} | Zempie`,
  link: [
    {
      rel: 'alternate',
      href: `${config.ZEMPIE_URL}${route.fullPath}`,
      hreflang: locale,
    },
    {
      rel: 'canonical',
      href: `${config.ZEMPIE_URL}${route.fullPath}`,
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
      name: 'description',
      content: `${t('seo.landing.desc')}`,
    },
    {
      property: 'og:title',
      content: `${t('seo.landing.title')}`,
    },
    // {
    //   property: 'og:description',
    //   content: `${t('seo.landing.description')}`,
    // },
    {
      property: 'og:url',
      content: `${config.ZEMPIE_URL}${route.path}`,
    },
    // {
    //   property: 'og:image',
    //   content: `${config.OG_IMG}`,
    // },
    {
      property: 'og:type',
      content: 'website',
    },
  ],
})

provide(ID_INJECTION_KEY, {
  prefix: 100,
  current: 0,
})

onBeforeMount(async () => {
  console.log(config.ENV)

  let date = new Date()
  //게임젬플러스 종료 날짜
  let endDate : Date | number= new Date(2022, 10, 20, 23, 59, 59)
  endDate = endDate.setTime(endDate.getTime())
  const now = date.setTime(date.getTime())


  if( now > endDate ){
    isOpen.value = false;
    localStorage.removeItem('GJ_POPUP_ONE')
    localStorage.removeItem('GJ_POPUP_NEVER')
  }

  //유효 기간이 더 크면 팝업 안보이게
  //다시 안보기인 경우 팝업 안보이게
  if((parseInt(localStorage.getItem('GJ_POPUP_ONE') ) >  now) || Boolean(localStorage.getItem('GJ_POPUP_NEVER'))){
    isOpen.value = false
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

  //로그인 확인 처리
  if (useCookie(config.COOKIE_NAME).value){
    await getRefreshToken()
  }

})


function clickOneDay(e:Event){
  const isChecked = (e.target as HTMLInputElement).checked
  if(isChecked){
    const date = new Date()
    //다음날 00:00:00 까지
    const expiredTime = new Date(2022, 10,  date.getDate() + 1, 0, 0,0).getTime()
    localStorage.setItem('GJ_POPUP_ONE', expiredTime +'')
    isOpen.value = false;
  }
}

function clickNever(e:Event){
  const isChecked = (e.target as HTMLInputElement).checked
  if(isChecked){
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



body {
  margin: 0px !important;

  .content {
    min-height: calc(100vh - 200px) !important;
  }


  .my-header{
    display: inline-flex;
    li{
      &:not(:last-child){
        margin-right: 10px;
      }
      input[type='checkbox'] + label{
        color: #0d0c13 !important;
      }
    }
  }
}
</style>

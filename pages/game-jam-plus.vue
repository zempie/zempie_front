<template>
  <div class="wrap is-ready event-popup">
    <div class="container" >
      <h1>Game Jam Plus</h1>
      <h2>[ONLINE]</h2>
  
      <img src="/images/gj_whit_text_logo.png" width="500"/>

      <h3 >{{$t('global.game.zem.info')}}</h3>
        
      <div>
        <a href="https://forms.gle/8NXazCYicG1c3NkQ9" target="_blank">게임젬 플러스 폼 제출하기</a>
      </div>
      
      <h3>게임젬 플러스 공지사항</h3>

      <h3>디스코드에 참여해보세요</h3>
      <div>
        <a :href="config.GAME_JAM_PLUS" target="_blank">디스코드 참여하기</a>
      </div>

      <h3>일정</h3>
      <ul>
        <li>접수 기간 / 11.11(금) - 11.16(수)</li>
        <li>행사 일정 / 11.18(금) - 11.20(일)</li>
        <li>발표 제출 / 11.18(금) - 11.22(화)</li>
      </ul>
      <div>
        <NuxtLink :to="$localePath('/project/upload')">게임 업로드하기</NuxtLink>
      </div>
    </div>
</div>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { $localePath } = useNuxtApp()
const { t, locale } = useI18n()
const route = useRoute()
const config = useRuntimeConfig()

useHead({
  title: `Game Jam Plus | Zempie`,
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
      name: 'og:type',
      content: 'website',
    },
    {
      name: 'robots',
      content: 'index, follow',
    },
    {
      name: 'description',
      content: `${t('global.game.zem.info')}`,
    },

    {
      property: 'og:title',
      content: `Game Jam Plus`,
    },
    {
      property: 'og:description',
      content: `${t('global.game.zem.info')}`,
    },
    {
      property: 'og:url',
      content: `${config.ZEMPIE_URL}${route.path}`,
    },
  ],
})

</script>
<style scoped lang="scss">
@font-face {
  font-family: 'Changa';
  font-style: normal;
  font-weight: 400;
  src: url('/assets/fonts/Changa-Regular.eot');
  /* IE9 Compat Modes */
  src: local(''),
    /* IE6-IE8 */
    url('/assets/fonts/Changa-Regular.woff2') format('woff2'),
    /* Super Modern Browsers */
    url('/assets/fonts/Changa-Regular.woff') format('woff'),
    /* Modern Browsers */
    url('/assets/fonts/Changa-Regular.ttf') format('truetype'),
    /* Safari, Android, iOS */
}
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  src: url('/assets/fonts/Changa-Regular.eot');
  /* IE9 Compat Modes */
  src: local(''),
    /* IE6-IE8 */
    url('/assets/fonts/Changa-Regular.woff2') format('woff2'),
    /* Super Modern Browsers */
    url('/assets/fonts/Changa-Regular.woff') format('woff'),
    /* Modern Browsers */
    url('/assets/fonts/Changa-Regular.ttf') format('truetype'),
    /* Safari, Android, iOS */
}
.wrap{
  background-image: url("/images/gj_background.png");
  .container {
    height: 100vh;
    position: relative;
    top: 75px;
    color:#fff;
    font-family: "Changa, Roboto";

    h1{
      display: flex;
      font-weight: bold;
      font-size: 60px;
      justify-content: center;
      margin: 75px 0px 30px 0px;
    }
    h2{
      font-size:30px;
      display: flex;
      justify-content: center;
      margin: 50px 0px 50px 0px;
    }
    h3{
      font-size: 25px;
      display: flex;
      justify-content: center;
      margin: 30px 0px 30px 0px;
    }
    div{
      display: flex;
      justify-content: center;
    }
    a{
      display: inline-block;
      padding: 20px 30px;
      font-size: 20px;
      line-height: 16px;
      color: #fff;
      border: #fff 1px solid;
      border-radius: 10px;
      width:300px;
      text-align: center;
      
      &:hover{
        color: #fff;
        border: #d64dd8 1px solid;
        background: #d64dd8;
      }
    }
    img{
      display: block;
      margin: 0 auto;
    }
    ul{
      li{
        margin: 15px 0px 15px 0px;
        font-size: 16px;
        display: flex;
        justify-content: center;
      }
    }
}
}
</style>
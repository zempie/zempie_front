<template>
  <div class="wrap is-ready event-popup">
    <div class="container">
      <h1>Game Jam Plus</h1>
      <h2 style="margin-bottom:0px">2022 / 2023 온라인 게임잼</h2>
      <h4>
        <p>FROMtheRED</p>&nbsp;x GAMEJAM+
      </h4>

      <img src="/images/gj_whit_text_logo.png" width="500" />

      <h3>{{ $t('global.game.zem.info') }}</h3>
      <h4>
        안녕하세요 게임SNS <p style="color:#f97316"> 젬파이</p>입니다</h4>
      <h4> 항상 식지 않는 열정과 빛나는 재능으로 나만의 게임을 만들고자 하는 모든 분들을 위해</h4>
      <h4> 글로벌 게임잼 이벤트 “게임잼플러스(GameJamPlus)” 한국 예선을 진행하게 되었습니다.</h4>

      <h4> 아래의 내용을 참고하시고 지금 바로 지원하세요!

      </h4>
      <h2 style="font-weight: bold;">게임젬 플러스 공지사항</h2>

      <h3 style="color:#54b5ff">
        [모집 대상]
      </h3>
      <h4>개발자 / 게임교육기관 / 고등학생 / 대학생</h4>

      <h3 style="color:#54b5ff">
        [주제]
      </h3>
      <h4>한국의 전승 / 구전야담 / 설화 / 신화</h4>

      <h3 style="color:#54b5ff">
        [참가방법]
      </h3>
      <ul>
        <li>

          <strong> STEP 1)</strong>&nbsp; 안내 페이지 하단의 참가 신청 폼 링크&nbsp;<p style="color:#d64dd8; font-weight: bold;"> CLICK
          </p>

        </li>
        <li>
          <strong> STEP 2)</strong>&nbsp; 신청서(구글폼) 작성 및 제출

        </li>
        <li>
          <strong> STEP 3)</strong>&nbsp; 젬파이 및 젬파이 디스코드에 가입하면 준비 완료!<br />
        </li><br />
        <li>※ 디스코드 가입 후 젬파이에서 사용 중인 아이디를 알려주시기 바랍니다.</li>
        <li>※ 게임 제출 작업 관리를 위해 젬파이에 &nbsp; <strong> 가입, 게임 스튜디오 </strong>를 이용해주실 것을 부탁드립니다.</li>

      </ul>
      <div>
        <a href="https://forms.gle/8NXazCYicG1c3NkQ9" target="_blank">게임잼 플러스 신청하기 </a>
      </div>
      <h3 style="color:#54b5ff">
        [준비사항]</h3>
      <ul>
        <li>
          <strong> 1)</strong>&nbsp; 젬파이 ID (내 계정 정보에서 확인)

        </li>
        <li>
          <strong> 2)</strong>&nbsp; 본인의 개발 공간 & 개발 장비

        </li>
        <li>
          <strong> 3)</strong>&nbsp; 본인 소속 팀 내 커뮤니케이션을 위한 장비

        </li>
      </ul>

      <h3 style="color:#54b5ff">[최종 산출물]</h3>
      <ul style="text-align: center;">

        <p style="font-size:20px">산출물</p>

        <li>
          게임 개발 일지 & 게임 프로토타입 빌드 & 발표 영상 자료
        </li>
        <li>


          <ul style="text-align: center;">
            <p style="font-size:20px">제출 방식</p>
            <li>
              <strong>
                1)</strong>&nbsp; 게임 개발 일지 & 게임 프로토타입 빌드 :
              젬파이 게임잼플러스 이벤트 페이지 > 게임 제출 CLICK
            </li>
            <li>
              <strong> 2)</strong>&nbsp; 발표 영상 자료 :
              유튜브에 해당 영상 업로드 > 젬파이 디스코드를 통해 영상 링크 공유
            </li>
          </ul>

        </li>
      </ul>

      <p style="font-size:20px; text-align: center; margin-bottom: 25px;">
        22/23 게임잼플러스 게임잼은 1년 단위로 진행되며 자세한 내용 및 모집 안내는 젬파이 커뮤니티 게시판 및 디스코드를 통해 안내됩니다.
      </p>

      <div>
        <a :href="config.GAME_JAM_PLUS" target="_blank">디스코드 참여하기</a>
      </div>

      <h3>일정</h3>
      <ul>
        <li>접수 기간 / 11월 14일 00:00 ~ 11월 16일 23:59</li>
        <li>행사 일정 / 11월 18일 00:00 ~ 11월 20일 23:59</li>
        <li>발표 제출 / 11월 18일 00:00 ~ 11월 22일 23:59</li>
      </ul>
      <div>
        <NuxtLink :to="$localePath('/project/upload')">게임 업로드하기</NuxtLink>
      </div>

      <h3 style="color:#54b5ff">[자주 묻는 질문]</h3>
      <ul>
        <li style="color:#f97316">Q. 팀 빌딩은 어떻게 하면 되나요?</li>
        <li>
          A. 기존의 다른 게임잼들과는 달리 이번 게임잼의 경우, 신청 기간 내에 참가자 여러분께서 개별적으로 팀 빌딩을 진행하신 후 신청 폼을 작성해주실 것을 권고드립니다.
        </li>
        <li>이외에도 디스코드를 통해 팀 빌딩을 도와드릴 예정이니 자유롭게 문의해주시면 됩니다.</li>


        <li style="color:#f97316">Q. 디스코드 가입은 필수인가요?</li>
        <li>
          A. 필수사항은 아니며 팀 빌딩이나 소통을 원하신다면 가입을 권장드립니다.
        </li>
        <li style="color:#f97316">Q. 심사 기준은 어떻게 되나요?</li>

        <li>
          게임 및 발표 자료 관련 심사 기준이 각기 다르게 적용됩니다.
          게임의 경우, 기획, UI/UX, 그래픽 및 아트 스타일, 사운드 디자인과 게임플레이, 접근성, 주제와의 일관성을 기준으로 평가가 이루어지며,</li>
        <li>발표 자료의 경우 5분 이내로 시간을 엄수했는지 여부와 BM, 일관성 및 구조와 발표 자료를 바탕으로 평가가 진행될 예정입니다.</li>
        <li>
          ※더 궁금하신 내용이 있을 경우 안내 드린 디스코드 서버의 ‘문의사항’ 채널에 <p style="color:#f97316">&nbsp;@Organizer</p>를 소환해 주세요.
        </li>
      </ul>

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

.wrap {
  // background-color: #000;
  background-image: url("/images/gj_bg.png");

  .container {
    // height: 100vh;
    padding-bottom: 200px;
    position: relative;
    top: 75px;
    color: #fff;
    font-family: "Changa, Roboto";

    h1 {
      display: flex;
      font-weight: bold;
      font-size: 60px;
      justify-content: center;
      margin: 75px 0px 30px 0px;
    }

    h2 {
      font-size: 30px;
      display: flex;
      justify-content: center;
      margin: 50px 0px 50px 0px;
    }

    h3 {
      font-size: 25px;
      display: flex;
      justify-content: center;
      margin: 30px 0px 30px 0px;
    }

    h4 {
      font-size: 16px;
      display: flex;
      justify-content: center;
      margin: 15px 0px 15px 0px;
    }

    div {
      display: flex;
      justify-content: center;
    }

    a {
      display: inline-block;
      padding: 20px 30px;
      font-size: 20px;
      line-height: 16px;
      color: #fff;
      border: #fff 1px solid;
      border-radius: 10px;
      width: 300px;
      text-align: center;

      &:hover {
        color: #fff;
        border: #d64dd8 1px solid;
        background: #d64dd8;
      }
    }

    img {
      display: block;
      margin: 0 auto;
    }

    ul {
      li {
        margin: 15px 0px 15px 0px;
        font-size: 16px;
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>
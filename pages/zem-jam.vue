<template>
  <div class="wrap is-ready event-popup">
    <div class="container" ref="eventRef">
      <!-- HEADER -->
      <!-- <div class="header" v-if="$route.name !== 'ZemJam'">
                <div>
                    <dl>
                        <dt class="click-text" @click="neverOpen">
                            <span style=" font-family:'Russo One'"> Don’t Show Again </span>
                        </dt>
                        <dd class="click-text">
                            <span @click="$modal.hide('openEventPopup')" style=" font-family:'Russo One'">Close</span>
            </dd>
            </dl>
        </div>
    </div> -->

      <div class="slogan">
        <div style="font-family: 'Press Start 2P'">
          <h1
            style="font-family: 'Press Start 2P'"
            data-scroll
            data-scroll-speed="1"
            data-scroll-delay="0.05"
          >
            WELCOME TO ZEM JAM
          </h1>
          <h2 data-scroll data-scroll-speed="1.3" data-scroll-delay="0.05">
            [ONLINE]
          </h2>
          <h3
            data-scroll
            data-scroll-speed="1.6"
            data-scroll-delay="0.05"
            style="font-family: 'Russo One', 'NeoDunggeunmo'"
          >
            {{ t('zemjam.info1') }}
            <br /><br />
            {{ t('zemjam.info2') }}
          </h3>
          <div
            data-scroll
            data-scroll-speed="1.9"
            data-scroll-delay="0.05"
            data-scroll-direction=""
            style="font-family: 'Russo One'"
          >
            <a style="font-family: 'Russo One', 'NeoDunggeunmo'"
              >종료된 게임젬</a
            >
            <!-- <router-link :to="`/${$i18n.locale}/uploadGame`" style=" font-family:'Russo One'">UPLOAD GAME
                        </router-link> -->
          </div>
        </div>
      </div>
      <!-- SLOGAN END -->

      <!-- ZEM JAM Is -->
      <div class="zemjam-is">
        <div>
          <h2 data-scroll data-scroll-speed="1" data-scroll-delay="0.05">
            ZEM JAM Is
          </h2>
          <h3
            data-scroll
            data-scroll-speed="1.3"
            data-scroll-delay="0.05"
            style="font-family: 'Russo One', 'NeoDunggeunmo'"
          >
            {{ t('zemjam.info3') }}
          </h3>
          <div>
            <p data-scroll data-scroll-speed="1.6" style="max-width: 100%">
              <img
                style="max-width: 100%"
                class="picnic-pic"
                src="/images/illust_zampie_picnic.png"
                alt="zemjam_picnic_picture"
                title=""
              />
            </p>
            <div
              data-scroll
              data-scroll-direction="horizontal"
              data-scroll-speed="-0.5"
            >
              <img
                class="zem-title"
                src="/images/zemjam_logo_1.png"
                alt=""
                title=""
                width="450"
                height="400"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- ZEM JAM Is END -->

      <!-- GAME SUBMISSION -->
      <div class="game-submission">
        <div>
          <h2 data-scroll data-scroll-speed="1" data-scroll-delay="0.05">
            GAME SUBMISSION IS OPEN
          </h2>
          <h3
            data-scroll
            data-scroll-speed="1.3"
            data-scroll-delay="0.05"
            style="font-family: 'Russo One', 'NeoDunggeunmo'"
          >
            FROM APRIL 1 TO APRIL 11!
          </h3>
          <div data-scroll data-scroll-speed="1.6" data-scroll-delay="0.05">
            <iframe
              width="100%"
              height="615"
              src="https://www.youtube.com/embed/8oLBJ5fp_Rk"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </div>
      <!-- GAME SUBMISSION END -->

      <!-- OUR MISSION -->
      <div class="out-mission">
        <div>
          <dl>
            <dt
              data-scroll
              data-scroll-direction="horizontal"
              data-scroll-speed="-0.1"
            >
              <img src="/images/mission_icon01.png" alt="" title="" />
            </dt>
            <dd>
              <h2 data-scroll data-scroll-speed="1" data-scroll-delay="0.05">
                OUR MISSION
              </h2>
              <h3
                data-scroll
                data-scroll-speed="1"
                data-scroll-delay="0.05"
                style="font-family: 'Russo One', 'NeoDunggeunmo'"
              >
                {{ t('zemjam.info4') }}

                <br /><br />
                {{ t('zemjam.info5') }}
              </h3>
            </dd>
          </dl>
          <ul>
            <li>
              <h2 data-scroll data-scroll-speed="1" data-scroll-delay="0.05">
                ABOUT PARTICIPATING
              </h2>
              <h3
                data-scroll
                data-scroll-speed="1"
                data-scroll-delay="0.05"
                style="font-family: 'Russo One'"
              >
                {{ t('zemjam.info6') }}

                <br /><br />
                {{ t('zemjam.info7') }}
              </h3>
            </li>
            <li
              data-scroll
              data-scroll-direction="horizontal"
              data-scroll-speed="0.1"
            >
              <img src="/images/mission_icon02.png" alt="" title="" />
              <br />
              <img src="/images/mission_icon03.png" alt="" title="" />
            </li>
          </ul>
        </div>
      </div>
      <!-- OUR MISSION END -->

      <!-- OUR PARTNER -->
      <div class="out-partner">
        <div>
          <h2 data-scroll data-scroll-speed="1" data-scroll-delay="0.05">
            WANT TO BECOME OUR PARTNER?
          </h2>
          <h3
            data-scroll
            data-scroll-speed="1"
            data-scroll-delay="0.05"
            style="font-family: 'Russo One', 'NeoDunggeunmo'"
          >
            {{ t('zemjam.info8') }}
          </h3>
        </div>
      </div>
      <!-- OUR PARTNER END -->

      <!-- Footer -->
      <div class="footer">
        <div>
          <p></p>
          <div>
            FROMtheRED Inc. <span>|</span> CEO : SeoSangWook
            <span>|</span> Company registration number : 178-88-00617
            <br />
            Address : Seoul, Seodaemun-go, 105 Bughyun-ro,3rd floor
            <span>|</span> Email : support@fromthered.com
            <br />
            <br />
            ⓒ Fromthered Inc. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const route = useRoute()
const config = useRuntimeConfig()

useHead({
  title: `${t('seo.zemjam.title')} | Zempie`,
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
      content: `${t('seo.zemjam.desc')}`,
    },

    {
      property: 'og:title',
      content: `${t('seo.zemjam.title')}`,
    },
    {
      property: 'og:description',
      content: `${t('seo.zemjam.description')}`,
    },
    {
      property: 'og:url',
      content: `${config.ZEMPIE_URL}${route.path}`,
    },
  ],
})

definePageMeta({
  layout: 'header-only',
})

</script>
<style lang="scss" scoped>
@import '/assets/css/animate.css';
@import '/assets/css/fonts-jam.css';
@import '/assets/css/jquery-ui.css';
@import '/assets/css/locomotive-scroll.css';
@import '/assets/css/niceselect.css';
@import '/assets/css/style-jam.css';

.picnic-pic {
  border-radius: 20px;
  // height: 580px;
  width: 900px !important;
  object-fit: contain;
}

/* 기본 레이아웃[틀]  /////////////////////////////////////////////////////////////////////////*/
.wrap {
  position: relative;
  width: 100%;
  height: 100%;
}

/* 상단영역 - PC */
.header {
  width: 100%;
  position: fixed;
}

.header > div {
  width: 100%;
  background: #01071f;
}

.header > div > dl {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 1200px;
  margin: 0 auto;
  padding: 10px 0;
}

.header > div > dl dd a {
  display: inline-block;
  width: 30px;
  height: 30px;
  padding-top: 3px;
  text-align: center;
  font-size: 18px;
  color: #fff;
  border: #555 1px solid;
  border-radius: 50%;
}

.header > div > dl dd a:hover {
  border: #d64dd8 1px solid;
  background: #d64dd8;
}

.header > ul {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 1200px;
  margin: 0 auto;
  padding: 20px 0;
  border-bottom: rgba(255, 255, 255, 0.3) 1px solid;
}

.header > ul > li:nth-child(1) {
  width: 40%;
}

.header > ul > li:nth-child(1) a {
  display: inline-block;
  margin-right: 30px;
  font-size: 16px;
  color: #fff;
}

.header > ul > li:nth-child(1) a:hover {
  color: #d64dd8;
}

.header > ul > li:nth-child(2) {
  width: 20%;
  text-align: center;
}

.header > ul > li:nth-child(3) {
  width: 40%;
  text-align: right;
}

.header > ul > li:nth-child(3) a {
  display: inline-block;
  margin-left: 10px;
  font-size: 22px;
  color: #fff;
}

.header > ul > li:nth-child(3) a:hover {
  color: #d64dd8;
}

@media all and (max-width: 479px) {
  .header {
    display: none;
  }
}

@media all and (min-width: 480px) and (max-width: 767px) {
  .header {
    display: none;
  }
}

@media all and (min-width: 768px) and (max-width: 991px) {
  .header {
    display: none;
  }
}

@media all and (min-width: 992px) and (max-width: 1199px) {
  .header > div > dl {
    width: 970px;
  }

  .header > ul {
    width: 970px;
  }
}

@media all and (min-width: 1200px) {
}

/* 상단영역 - 모바일 */
.header-mobile {
  position: fixed;
  top: 0px;
  width: 100%;
  border-bottom: #e5e5e5 1px solid;
  background: #000;
  z-index: 999;
}

.header-mobile > .gnb-header {
  margin: 0 20px;
  padding: 11px 0 11px 0;
  overflow: hidden;
}

.header-mobile > .gnb-header > dt {
  float: left;
  width: 25%;
  padding-top: 4px;
  text-align: right;
  font-size: 26px;
  color: #333;
}

.header-mobile > .gnb-header > dt:first-child {
  text-align: left;
}

.header-mobile > .gnb-header > dt i {
  color: #333;
  cursor: pointer;
  transition: 0.3s;
}

.header-mobile > .gnb-header > dt i:hover {
  color: #2d75d9;
}

.header-mobile > .gnb-header > dd {
  float: left;
  width: 50%;
  padding-top: 3px;
  text-align: center;
}

.header-mobile > .gnbMenu {
  position: fixed;
  top: 0;
  width: 300px;
  height: 100%;
  margin-left: -300px;
  background: #fff;
  overflow: auto;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}

.header-mobile > .gnbMenu > dl {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: #e5e5e5 1px solid;
}

.header-mobile > .gnbMenu > dl > dt {
  font-size: 18px;
  line-height: 18px;
  color: #333;
}

.header-mobile > .gnbMenu > dl > dd {
  font-size: 22px;
  line-height: 22px;
  color: #333;
}

.header-mobile > .gnbMenu > ul {
  padding: 20px;
}

.header-mobile > .gnbMenu > ul > li {
  padding: 15px 0;
}

.header-mobile > .gnbMenu > ul > li > a {
  font-size: 16px;
  line-height: 16px;
  color: #333;
}

.header-mobile > .gnbMenu > ul > li ul {
  padding: 15px 10px 0 10px;
}

.header-mobile > .gnbMenu > ul > li ul li {
  padding: 5px 0;
}

.header-mobile > .gnbMenu > ul > li ul li a {
  font-size: 13px;
  line-height: 16px;
  color: #333;
}

@media all and (max-width: 479px) {
}

@media all and (min-width: 480px) and (max-width: 767px) {
}

@media all and (min-width: 768px) and (max-width: 991px) {
}

@media all and (min-width: 992px) and (max-width: 1199px) {
  .header-mobile {
    display: none;
  }
}

@media all and (min-width: 1200px) {
  .header-mobile {
    display: none;
  }
}

/* 하단영역 */

.footer > div {
  width: 1200px;
  margin: 0 auto;
  padding: 300px 0 300px 0;
  text-align: center;
}

.footer > div p a {
  color: #fff;
}

.footer > div p a:hover {
  color: #d64dd8;
}

.footer > div p span {
  display: inline-block;
  padding: 0 15px;
  font-family: 'Open Sans';
}

.footer > div div {
  margin-top: 40px;
}

.footer > div div span {
  display: inline-block;
  padding: 0 15px;
  font-family: 'Open Sans';
}

@media all and (max-width: 479px) {
  .footer > div {
    width: 90%;
    padding: 190px 0 70px 0;
  }
}

@media all and (min-width: 480px) and (max-width: 767px) {
  .footer > div {
    width: 470px;
    padding: 190px 0 70px 0;
  }
}

@media all and (min-width: 768px) and (max-width: 991px) {
  .footer > div {
    width: 750px;
    padding: 190px 0 70px 0;
  }
}

@media all and (min-width: 992px) and (max-width: 1199px) {
  .footer > div {
    width: 970px;
  }
}

@media all and (min-width: 1200px) {
}

/* 상단영역 - PC */
.container {
  width: 100%;
  background: url('/images/bg.jpg') center top no-repeat, #020822;
}

@media all and (max-width: 479px) {
  .container {
    background-size: 350%;
  }
}

@media all and (min-width: 480px) and (max-width: 767px) {
  .container {
    background-size: 250%;
  }
}

@media all and (min-width: 768px) and (max-width: 991px) {
}

@media all and (min-width: 992px) and (max-width: 1199px) {
}

@media all and (min-width: 1200px) {
}

/* 메인  //////////////////////////////////////////////////*/
/* SLOGAN */
.slogan {
  width: 100%;
}

.slogan > div {
  width: 1200px;
  margin: 0 auto;
  padding: 150px 400px 100px 0;
}

.slogan > div h1 {
  font: 75px/85px 'Press Start 2P';
  color: #fff;
}

.slogan > div h2 {
  margin-top: 50px;
  font: 50px/65px 'Press Start 2P';
  color: #fff;
}

.slogan > div h3 {
  margin-top: 50px;
  padding-right: 300px;
  font-size: 20px;
  line-height: 32px;
  color: #fff;
}

.slogan > div div {
  margin-top: 80px;
}

.slogan > div div a {
  display: inline-block;
  padding: 20px 50px;
  font-size: 16px;
  line-height: 16px;
  color: #fff;
  border: #fff 1px solid;
}

.slogan > div div a:hover {
  color: #fff;
  border: #d64dd8 1px solid;
  background: #d64dd8;
}

@media all and (max-width: 479px) {
  .slogan > div {
    width: 90%;
    padding: 120px 0 100px 0;
  }

  .slogan > div h1 {
    font: 40px/50px 'Press Start 2P';
  }

  .slogan > div h2 {
    margin-top: 30px;
    font: 30px/35px 'Press Start 2P';
  }

  .slogan > div h3 {
    margin-top: 30px;
    padding-right: 100px;
    font-size: 16px;
    line-height: 26px;
  }

  .slogan > div div {
    margin-top: 50px;
  }

  .slogan > div div a {
    font-size: 14px;
    line-height: 14px;
  }
}

@media all and (min-width: 480px) and (max-width: 767px) {
  .slogan > div {
    width: 470px;
    padding: 120px 0 100px 0;
  }

  .slogan > div h1 {
    font: 40px/50px 'Press Start 2P';
  }

  .slogan > div h2 {
    margin-top: 30px;
    font: 30px/35px 'Press Start 2P';
  }

  .slogan > div h3 {
    margin-top: 30px;
    padding-right: 100px;
    font-size: 16px;
    line-height: 26px;
  }

  .slogan > div div {
    margin-top: 50px;
  }

  .slogan > div div a {
    font-size: 14px;
    line-height: 14px;
  }
}

@media all and (min-width: 768px) and (max-width: 991px) {
  .slogan > div {
    width: 750px;
    padding: 150px 0 100px 0;
  }

  .slogan > div h1 {
    font: 55px/65px 'Press Start 2P';
  }

  .slogan > div h2 {
    margin-top: 40px;
    font: 40px/45px 'Press Start 2P';
  }

  .slogan > div h3 {
    margin-top: 40px;
    padding-right: 100px;
    font-size: 18px;
    line-height: 28px;
  }

  .slogan > div div {
    margin-top: 60px;
  }
}

@media all and (min-width: 992px) and (max-width: 1199px) {
  .slogan > div {
    width: 970px;
  }
}

@media all and (min-width: 1200px) {
}

/* ZEM JAM Is */
.zemjam-is {
  width: 100%;
}

.zemjam-is > div {
  width: 1200px;
  margin: 0 auto;
  padding: 150px 0 150px 0;
}

.zemjam-is > div h2 {
  margin-top: 50px;
  font: 50px/65px 'Press Start 2P';
  color: #fff;
}

.zemjam-is > div h3 {
  margin-top: 50px;
  padding-right: 400px;
  font-size: 20px;
  line-height: 32px;
  color: #fff;
}

.zemjam-is > div > div {
  position: relative;
  margin-top: 80px;
}

.zemjam-is > div > div div {
  position: absolute;
  top: 100px;
  right: 0;
  margin-left: 350px;
}

@media all and (max-width: 479px) {
  .zemjam-is > div {
    width: 90%;
    padding: 50px 0 100px 0;
  }

  .zemjam-is > div h2 {
    margin-top: 30px;
    font: 30px/35px 'Press Start 2P';
  }

  .zemjam-is > div h3 {
    margin-top: 30px;
    padding-right: 100px;
    font-size: 16px;
    line-height: 26px;
  }

  .zemjam-is > div > div {
    margin-top: 50px;
  }

  .zemjam-is > div > div p img {
    width: 85%;
  }

  .zemjam-is > div > div div {
    top: 120px;
    right: 0;
    margin-left: 350px;
  }

  .zemjam-is > div > div div img {
    width: 150px;
  }
}

@media all and (min-width: 480px) and (max-width: 767px) {
  .zemjam-is > div {
    width: 470px;
    padding: 50px 0 100px 0;
  }

  .zemjam-is > div h2 {
    margin-top: 30px;
    font: 30px/35px 'Press Start 2P';
  }

  .zemjam-is > div h3 {
    margin-top: 30px;
    padding-right: 100px;
    font-size: 16px;
    line-height: 26px;
  }

  .zemjam-is > div > div {
    margin-top: 50px;
  }

  .zemjam-is > div > div p img {
    width: 85%;
  }

  .zemjam-is > div > div div {
    top: 120px;
    right: 0;
    margin-left: 350px;
  }

  .zemjam-is > div > div div img {
    width: 150px;
  }
}

@media all and (min-width: 768px) and (max-width: 991px) {
  .zemjam-is > div {
    width: 750px;
    padding: 80px 0 100px 0;
  }

  .zemjam-is > div h2 {
    margin-top: 40px;
    font: 40px/45px 'Press Start 2P';
  }

  .zemjam-is > div h3 {
    margin-top: 40px;
    padding-right: 100px;
    font-size: 18px;
    line-height: 28px;
  }

  .zemjam-is > div > div {
    margin-top: 60px;
  }

  .zemjam-is > div > div p img {
    width: 85%;
  }

  .zemjam-is > div > div div {
    top: 120px;
    right: 0;
    margin-left: 350px;
  }

  .zemjam-is > div > div div img {
    width: 250px;
  }
}

@media all and (min-width: 992px) and (max-width: 1199px) {
  .zemjam-is > div {
    width: 970px;
  }
}

@media all and (min-width: 1200px) {
}

/* ZEM JAM Is */
.game-submission {
  width: 100%;
}

.game-submission > div {
  width: 1200px;
  margin: 0 auto;
  padding: 100px 0 150px 0;
}

.game-submission > div h2 {
  margin-top: 50px;
  font: 50px/65px 'Press Start 2P';
  color: #fff;
}

.game-submission > div h3 {
  margin-top: 50px;
  padding-right: 400px;
  font-size: 20px;
  line-height: 32px;
  color: #d64dd8;
}

.game-submission > div > div {
  margin-top: 80px;
}

@media all and (max-width: 479px) {
  .game-submission > div {
    width: 90%;
    padding: 50px 0 100px 0;
  }

  .game-submission > div h2 {
    margin-top: 30px;
    font: 30px/35px 'Press Start 2P';
    color: #fff;
  }

  .game-submission > div h3 {
    margin-top: 30px;
    padding-right: 100px;
    font-size: 16px;
    line-height: 26px;
    color: #d64dd8;
  }

  .game-submission > div > div {
    margin-top: 50px;
  }

  .game-submission > div > div iframe {
    height: 260px;
  }
}

@media all and (min-width: 480px) and (max-width: 767px) {
  .game-submission > div {
    width: 470px;
    padding: 50px 0 100px 0;
  }

  .game-submission > div h2 {
    margin-top: 30px;
    font: 30px/35px 'Press Start 2P';
    color: #fff;
  }

  .game-submission > div h3 {
    margin-top: 30px;
    padding-right: 100px;
    font-size: 16px;
    line-height: 26px;
    color: #d64dd8;
  }

  .game-submission > div > div {
    margin-top: 50px;
  }

  .game-submission > div > div iframe {
    height: 260px;
  }
}

@media all and (min-width: 768px) and (max-width: 991px) {
  .game-submission > div {
    width: 750px;
    padding: 80px 0 100px 0;
  }

  .game-submission > div h2 {
    margin-top: 40px;
    font: 40px/45px 'Press Start 2P';
    color: #fff;
  }

  .game-submission > div h3 {
    margin-top: 40px;
    padding-right: 100px;
    font-size: 18px;
    line-height: 28px;
    color: #d64dd8;
  }

  .game-submission > div > div {
    margin-top: 60px;
  }

  .game-submission > div > div iframe {
    height: 420px;
  }
}

@media all and (min-width: 992px) and (max-width: 1199px) {
  .game-submission > div {
    width: 970px;
  }
}

@media all and (min-width: 1200px) {
}

/* OUR MISSION */
.out-mission {
  width: 100%;
  background: url('/images/mission_bg.png') center bottom no-repeat, #00030e;
}

.out-mission > div {
  width: 1200px;
  margin: 0 auto;
  padding: 200px 0 550px 0;
}

.out-mission > div dl {
  display: flex;
  align-items: flex-end;
}

.out-mission > div dl dt {
  width: 30%;
}

.out-mission > div dl dd {
  width: 65%;
  text-align: right;
}

.out-mission > div dl dd h2 {
  font: 50px/65px 'Press Start 2P';
  color: #fff;
}

.out-mission > div dl dd h3 {
  margin-top: 50px;
  font-size: 22px;
  line-height: 34px;
}

.out-mission > div ul {
  display: flex;
  align-items: flex-end;
  margin-top: 150px;
}

.out-mission > div ul li:nth-child(1) {
  width: 65%;
}

.out-mission > div ul li:nth-child(1) h2 {
  font: 50px/65px 'Press Start 2P';
  color: #fff;
  word-break: break-all;
}

.out-mission > div ul li:nth-child(1) h3 {
  margin-top: 50px;
  font-size: 22px;
  line-height: 34px;
}

.out-mission > div ul li:nth-child(2) {
  width: 30%;
  text-align: right;
}

@media all and (max-width: 479px) {
  .zem-title {
    max-height: 200px;
  }
  .out-mission {
    background-size: 150%;
  }

  .out-mission > div {
    width: 90%;
    padding: 100px 0 250px 0;
  }

  .out-mission > div dl {
    flex-wrap: wrap;
  }

  .out-mission > div dl dt {
    width: 100%;
    text-align: center;
  }

  .out-mission > div dl dt img {
    width: 45%;
  }

  .out-mission > div dl dd {
    width: 100%;
    margin-top: 60px;
    text-align: left;
  }

  .out-mission > div dl dd h2 {
    font: 30px/35px 'Press Start 2P';
  }

  .out-mission > div dl dd h3 {
    margin-top: 30px;
    font-size: 16px;
    line-height: 26px;
  }

  .out-mission > div ul {
    flex-wrap: wrap;
    flex-direction: column-reverse;
    margin-top: 100px;
  }

  .out-mission > div ul li:nth-child(1) {
    width: 100%;
    margin-top: 60px;
  }

  .out-mission > div ul li:nth-child(1) h2 {
    font: 30px/35px 'Press Start 2P';
    color: #fff;
  }

  .out-mission > div ul li:nth-child(1) h3 {
    margin-top: 30px;
    font-size: 16px;
    line-height: 26px;
  }

  .out-mission > div ul li:nth-child(2) {
    width: 100%;
    text-align: center;
  }

  .out-mission > div ul li:nth-child(2) img {
    width: 45%;
  }

  .out-mission > div ul li:nth-child(2) img:nth-child(1) {
    display: none;
  }
}

@media all and (min-width: 480px) and (max-width: 767px) {
  .zem-title {
    max-height: 250px;
  }
  .out-mission {
    background-size: 150%;
  }

  .out-mission > div {
    width: 470px;
    padding: 100px 0 250px 0;
  }

  .out-mission > div dl {
    flex-wrap: wrap;
  }

  .out-mission > div dl dt {
    width: 100%;
    text-align: center;
  }

  .out-mission > div dl dt img {
    width: 40%;
  }

  .out-mission > div dl dd {
    width: 100%;
    margin-top: 60px;
    text-align: left;
  }

  .out-mission > div dl dd h2 {
    font: 30px/35px 'Press Start 2P';
  }

  .out-mission > div dl dd h3 {
    margin-top: 30px;
    font-size: 16px;
    line-height: 26px;
  }

  .out-mission > div ul {
    flex-wrap: wrap;
    flex-direction: column-reverse;
    margin-top: 100px;
  }

  .out-mission > div ul li:nth-child(1) {
    width: 100%;
    margin-top: 60px;
  }

  .out-mission > div ul li:nth-child(1) h2 {
    font: 30px/35px 'Press Start 2P';
    color: #fff;
  }

  .out-mission > div ul li:nth-child(1) h3 {
    margin-top: 30px;
    font-size: 16px;
    line-height: 26px;
  }

  .out-mission > div ul li:nth-child(2) {
    width: 100%;
    text-align: center;
  }

  .out-mission > div ul li:nth-child(2) img {
    width: 40%;
  }

  .out-mission > div ul li:nth-child(2) img:nth-child(1) {
    display: none;
  }
}

@media all and (min-width: 768px) and (max-width: 991px) {
  .out-mission {
    background-size: 150%;
  }

  .out-mission > div {
    width: 750px;
    padding: 150px 0 350px 0;
  }

  .out-mission > div dl {
    flex-wrap: wrap;
  }

  .out-mission > div dl dt {
    width: 100%;
    text-align: center;
  }

  .out-mission > div dl dt img {
    width: 30%;
  }

  .out-mission > div dl dd {
    width: 100%;
    margin-top: 80px;
    text-align: left;
  }

  .out-mission > div dl dd h2 {
    font: 40px/45px 'Press Start 2P';
  }

  .out-mission > div dl dd h3 {
    margin-top: 40px;
    font-size: 18px;
    line-height: 28px;
  }

  .out-mission > div ul {
    flex-wrap: wrap;
    flex-direction: column-reverse;
    margin-top: 100px;
  }

  .out-mission > div ul li:nth-child(1) {
    width: 100%;
    margin-top: 80px;
  }

  .out-mission > div ul li:nth-child(1) h2 {
    font: 40px/45px 'Press Start 2P';
    color: #fff;
  }

  .out-mission > div ul li:nth-child(1) h3 {
    margin-top: 40px;
    font-size: 18px;
    line-height: 28px;
  }

  .out-mission > div ul li:nth-child(2) {
    width: 100%;
    text-align: center;
  }

  .out-mission > div ul li:nth-child(2) img {
    width: 30%;
  }

  .out-mission > div ul li:nth-child(2) img:nth-child(1) {
    display: none;
  }
}

@media all and (min-width: 992px) and (max-width: 1199px) {
  .out-mission > div {
    width: 970px;
  }
}

@media all and (min-width: 1200px) {
}

/* OUR PARTNER */
.out-partner {
  width: 100%;
  background: url('/images/partner_bg.jpg') center top no-repeat, #01071f;
}

.out-partner > div {
  width: 1200px;
  margin: 0 auto;
  padding: 280px 600px 280px 0;
}

.out-partner > div h2 {
  font: 50px/65px 'Press Start 2P';
  color: #fff;
}

.out-partner > div h3 {
  margin-top: 50px;
  padding-right: 100px;
  font-size: 22px;
  line-height: 34px;
}

@media all and (max-width: 479px) {
  .out-partner {
    background: url('/images/partner_bg.jpg') -920px top no-repeat, #01071f;
    background-size: cover;
  }

  .out-partner > div {
    width: 90%;
    padding: 150px 0 150px 0;
  }

  .out-partner > div h2 {
    font: 30px/35px 'Press Start 2P';
    color: #fff;
  }

  .out-partner > div h3 {
    margin-top: 50px;
    padding-right: 0;
    font-size: 16px;
    line-height: 26px;
  }
}

@media all and (min-width: 480px) and (max-width: 767px) {
  .out-partner {
    background: url('/images/partner_bg.jpg') -600px top no-repeat, #01071f;
    background-size: cover;
  }

  .out-partner > div {
    width: 470px;
    padding: 150px 0 150px 0;
  }

  .out-partner > div h2 {
    font: 30px/35px 'Press Start 2P';
    color: #fff;
  }

  .out-partner > div h3 {
    margin-top: 50px;
    padding-right: 0;
    font-size: 16px;
    line-height: 26px;
  }
}

@media all and (min-width: 768px) and (max-width: 991px) {
  .out-partner > div {
    width: 750px;
    padding: 280px 200px 280px 0;
  }

  .out-partner > div h2 {
    font: 40px/45px 'Press Start 2P';
    color: #fff;
  }

  .out-partner > div h3 {
    margin-top: 50px;
    padding-right: 0;
    font-size: 18px;
    line-height: 28px;
  }
}

@media all and (min-width: 992px) and (max-width: 1199px) {
  .out-partner > div {
    width: 970px;
  }
}

@media all and (min-width: 1200px) {
}

.slogan {
  font-family: 'Press Start 2P' !important;
}

body {
  font-family: 'Russo One', 'Press Start 2P' !important;
}

.menu-title {
  color: black !important;
}

.click-text {
  color: #fff !important;
  cursor: pointer;
}
</style>

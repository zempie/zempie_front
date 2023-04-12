<template>
  <div style="background-color: #fff; ">
    <ClientOnly>
      <swiper :modules="[Pagination]" :pagination="{ clickable: true }"
        style="height:100vh; width: 100vw; background-color: #FF9F00;" ref="swiperRef">
        <swiper-slide class="flex column" style="align-items: center;">
          <div class="intro-info  items-center column">
            <img src="/images/mobile_intro1.png" style="width: 90vw;" />
            <h3>{{ $t('mobile.intro1.title1') }}</h3>
            <p>{{ $t('mobile.intro1.info1') }}</p>
            <p>{{ $t('mobile.intro1.info2') }}</p>
          </div>
          <MobileTutorialSlide />
        </swiper-slide>
        <swiper-slide class="flex column" style="align-items: center;">
          <div class="intro-info  items-center column">
            <img src="/images/mobile_intro2.png" style="width: 90vw;" />
            <h3>{{ $t('mobile.intro1.title1') }}</h3>
            <p>{{ $t('mobile.intro1.info1') }}</p>
            <p>{{ $t('mobile.intro1.info2') }}</p>
          </div>
          <MobileTutorialSlide />
        </swiper-slide>
        <swiper-slide class="flex column" style="align-items: center;">
          <div class="intro-info  items-center column">
            <img src="/images/mobile_intro3.png" style="width: 90vw;" />
            <h3>{{ $t('mobile.intro1.title1') }}</h3>
            <p>{{ $t('mobile.intro1.info1') }}</p>
            <p>{{ $t('mobile.intro1.info2') }}</p>
          </div>
          <button @click="$router.push('/login')">시작하기</button>
        </swiper-slide>
      </swiper>
    </ClientOnly>
  </div>
</template>
<script setup lang='ts'>
import { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css';
import 'swiper/css/pagination';
import FlutterBridge from '~~/scripts/flutterBridge'

const router = useRouter()

definePageMeta({
  layout: 'layout-none',
});

const isFlutter = await FlutterBridge().FlutterBridge.isFlutter()


if (isFlutter) {
  if (process.env.NODE_ENV !== 'development') {
    router.push('/login')
  }
}


onBeforeMount(() => {
  if (process.env.NODE_ENV !== 'development') {

    const isVisit = localStorage.getItem('zMoF')

    if (isVisit) {
      router.push('/login')
    } else {
      localStorage.setItem('zMoF', 'true')
    }

    if (useUser().user.value.fUser) {
      router.push('/')
    }
  }

})



</script>
<style scoped lang='scss'>
.intro-info {
  position: relative;
  height: 80%;
  justify-content: flex-start;
}

img {
  width: 90vw;
  max-width: 600px;
}

h3 {
  font-weight: 700;
  font-size: 2rem;
  line-height: 87px;
  color: #000000;
  margin-bottom: 0px;
}

p {
  color: #fff;
  font-size: 1rem;

}

button {
  display: flex;
  position: absolute;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 60vw;
  max-width: 300px;
  height: 50px;
  font-size: 20px;
  font-weight: 300;
  color: #fff;
  background: #000000;
  border-color: #000;
  border-radius: 50px;
  max-height: 10%;
  bottom: 3%;
  z-index: 999;
}

::v-deep(.swiper-pagination) {
  color: #fff !important;
  position: absolute;
  height: 10%;
  margin-bottom: 10%;
  // bottom: 20%;
}

::v-deep(.swiper-pagination-bullet) {
  background-color: transparent;
  outline: 1px solid #fff;
  opacity: 0.8;
}

::v-deep(.swiper-pagination-bullet-active) {
  background-color: #fff !important;

}
</style>

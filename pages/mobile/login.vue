<template>
  <div style="background-color: #fff; ">
    <ClientOnly>
      <swiper style="height:100vh; width: 100vw;" ref="swiperRef">
        <swiper-slide class="flex column" style="align-items: center;justify-content: center;">
          <img />
          1
          <MobileTutorialSlide />
          <!-- <button @click="nextSlide">다음</button> -->
        </swiper-slide>
        <swiper-slide class="flex column" style="align-items: center;justify-content: center;">
          <img />
          2
          <MobileTutorialSlide />
        </swiper-slide>
        <swiper-slide class="flex column" style="align-items: center;justify-content: center;">
          <img />
          3
          <button @click="$router.push('/login')">시작하기</button>
        </swiper-slide>
      </swiper>
    </ClientOnly>
  </div>
</template>
<script setup lang='ts'>
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css';
import FlutterBridge from '~~/scripts/flutterBridge'

const router = useRouter()

definePageMeta({
  layout: 'layout-none',
});

const isFlutter = await FlutterBridge().FlutterBridge.isFlutter()

if (!isFlutter) {
  router.push('/login')
}


onBeforeMount(() => {

  const isVisit = localStorage.getItem('zMoF')

  if (isVisit) {
    router.push('/login')
  } else {
    localStorage.setItem('zMoF', 'true')
  }

  if (useUser().user.value.fUser) {
    router.push('/')
  }

})



</script>
<style scoped lang='scss'></style>

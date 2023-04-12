<template>
  <div style="background-color: #fff; ">
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
  </div>
</template>
<script setup lang='ts'>
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css';



definePageMeta({
  layout: 'layout-none',
});



</script>
<style scoped lang='scss'></style>

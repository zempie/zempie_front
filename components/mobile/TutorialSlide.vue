<template>
  <button @click="swiper.slideNext()">다음</button>
</template>
<script setup lang='ts'>
import { useSwiper } from 'swiper/vue';
const swiper = useSwiper()

</script>
<style scoped lang='scss'></style>

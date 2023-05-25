<template>
  <button @click="swiper.slideNext()">다음</button>
</template>
<script setup lang="ts">
import { useSwiper } from 'swiper/vue';
const swiper = useSwiper()

</script>
<style scoped lang="scss">
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
</style>

<template>
  <swiper class="swiper" :modules="[Pagination]" style="height: 350px" :pagination="{ clickable: true }"
    :options="swiperOption">
    <swiper-slide v-for="img in images" class="flex items-center content-center w100p" style="height:88%;">
      <PostImage :img="img" @update-blind="emit('updateBlind', img)" />
    </swiper-slide>
    <div class="swiper-pagination" style="bottom: 10px; left: 0; width: 100%;" slot="pagination"></div>
  </swiper>
</template>
<script setup lang="ts">
import { Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'

const swiperOption = ref({
  pagination: {
    el: '.swiper-pagination',
  },
})

const props = defineProps({
  images: Array
})
const emit = defineEmits(['updateBlind'])

</script>
<style scoped lang="scss"></style>
<template>
  {{ feed.attatchment_files }}
  <swiper class="swiper" :modules="[Pagination]" style="height: 350px" :pagination="{ clickable: true }"
    :options="swiperOption">

    <swiper-slide v-for="file in attatchment_files" class="flex items-center content-center w100p" style="height:88%;">
      <PostImage v-if="file.type === 'image'" :img="file" @update-blind="updateBlind" />
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
  feed: Object
})


const attatchment_files = computed(() => {
  return props.feed.attatchment_files
    && (Array.isArray(props.feed.attatchment_files)
      ? props.feed.attatchment_files
      : JSON.parse(props.feed.attatchment_files))
})
</script>
<style scoped lang="scss"></style>
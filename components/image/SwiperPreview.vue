<template>
  <swiper :modules="[Mousewheel]" class="swiper-area" :slides-per-view="isMobile ? 3 : 5" :space-between="0"
    direction="horizontal" :mousewheel="true">
    <swiper-slide v-for="(img, idx) in imgArr" :src="img.url" :key="idx" style="">
      <div class="img-container" :class="img.is_blind ? 'blur' : ''">
        <img :src="img.url">
        <span class="delete-btn" @click="deleteImg(idx)">
          <IconCloseCircle />
        </span>
      </div>
    </swiper-slide>

    <!-- <div class="swiper-scrollbar" slot="pagination"></div> -->
  </swiper>
</template>
<script setup lang="ts">
/**
 * 1. image fetch와 같이 쓸 경우 삭제한 이미지 ImageUploader에서 지운 후에 업로드 진행해야됨 
 */
import { Pagination, Scrollbar, Mousewheel } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css/scrollbar';

const emit = defineEmits(['deleteImage'])

const props = defineProps({
  images: Array
})


const imgArr = computed({
  get() {
    return props.images
  },
  set(value) {
    props.images = value;
  }
})



const isMobileSize = computed(() =>
  window.matchMedia('screen and (max-width: 479px)')
)
const isMobile = ref(false)


onMounted(() => {
  nextTick(() => {
    onResize()
  })
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
})

function onResize() {
  if (isMobileSize.value.matches) {
    isMobile.value = true
  } else {
    isMobile.value = false
  }
}
function deleteImg(idx: number) {
  imgArr.value.splice(idx, 1)
  emit('deleteImage', idx)
}

</script>
<style scoped lang="scss">
:deep(.swiper-wrapper) {
  justify-content: flex-start !important;

}

.img-container {
  position: relative;

  .delete-btn {
    position: absolute;
    top: 5px;
    right: 5px;
    font-size: 20px;
    color: #333;
    cursor: pointer;

    &:hover {
      color: #f97316;

    }
  }

  img {
    display: flex;
    width: 100%;
    object-fit: contain;
    height: 100px;
    border-radius: 10px;
  }
}
</style>
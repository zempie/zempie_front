<template>
  <div class="video-pre-container" v-for="(video, idx) of videos">
    <span @click="deleteVideo(idx)" class="delete-video-btn"><i class="uil uil-times-circle"></i></span>
    <video :src="video.url" width="320" height="240" controls />
  </div>
</template>
<script setup lang="ts">
/**
 * 1. 우선은 비디오 1개만 업로드가 가능 (서버 전송 속도 문제)
 */

const emit = defineEmits(['deleteVideo'])

const props = defineProps({
  videos: Array
})


const videoArr = computed({
  get() {
    return props.videos
  },
  set(value) {
    props.videos = value;
  }
})


function deleteVideo(idx: number) {
  videoArr.value.splice(idx, 1)
  emit('deleteVideo', idx)

}
</script>
<style scoped lang="scss">
.video-pre-container {
  position: relative;


  .delete-video-btn {
    position: absolute;
    display: flex;
    cursor: pointer;
    z-index: 999;
    right: 5px;
    top: 5px;

    i {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: #f97316;
    }

    &:hover {
      color: #fff;
    }
  }
}
</style>
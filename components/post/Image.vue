<template>
  <div>
    <div :class="[isBlind ? 'blur' : '', 'feed-img mt-3']">
      <img :src="img.url" />
    </div>
    <template v-if="initStatus">
      <button v-if="isBlind" class="btn-default-samll show-btn" @click="openBlind">민감한 컨텐츠</button>
      <button v-else class="btn-default-samll hide-btn" @click="openBlind">숨기기</button>
    </template>
  </div>
</template>
<script setup lang="ts">
import _ from 'lodash'
import { PropType } from 'vue';

const emit = defineEmits(['updateBlind'])


const props = defineProps({
  img: Object as PropType<{ is_blind: boolean, url: string }>
})

const isBlind = computed(() => props.img.is_blind)
const initStatus = _.cloneDeep(props.img.is_blind)

function openBlind() {
  emit('updateBlind', props.img)

}
</script>
<style scoped lang="scss">
div {
  width: auto;
  height: 100%;
  position: relative;
  display: flex;
  margin: 0 auto;
  flex-direction: column;


  .blur::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
  }

  img {
    object-fit: cover;


  }

  button {
    position: absolute;

    &.show-btn {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    &.hide-btn {
      background: #333 !important;
      color: #fff !important;
      bottom: 10%;
      right: 10%;
    }
  }
}
</style>
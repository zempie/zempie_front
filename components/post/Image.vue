<template>
  <div class="post-img">
    <div :class="[isBlind ? 'blur' : '', 'feed-img mt-3']">
      <img :src="img.url" />
    </div>
    <template v-if="initStatus">
      <button v-if="isBlind" class="btn-default-samll show-btn" @click="openBlind">{{ $t('violent.contents') }}</button>
      <button v-else class="btn-default-samll hide-btn" @click="openBlind">{{ $t('hide') }}</button>
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
.post-img {

  position:relative;
  .feed-img {
    max-height: 300px;
    padding: 10px;
  }

  // .blur::before {
  //   content: "";
  //   position: absolute;
  //   width: 100%;
  //   height: 100%;
  //   backdrop-filter: blur(5px);
  //   -webkit-backdrop-filter: blur(5px);
  // }

  .blur {
    backdrop-filter: blur(5px);
    filter: blur(5px);
  }

  img {
    object-fit: cover;
    width: 100%;
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
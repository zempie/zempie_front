<template>
  <div class="post-img">
    <div :class="[isBlind ? 'blur' : '', 'feed-img mt-3']">
      <img :src="img.url" @click="onClickImg" />
    </div>
    <button class="expand-btn" @click="onClickImg">
      <i class="uil uil-expand-arrows"></i>
    </button>
    <template v-if="initStatus">
      <button v-if="isBlind" class="btn-default-samll show-btn" @click="openBlind">{{ $t('violent.contents') }}</button>
      <button v-else class="btn-default-samll hide-btn" @click="openBlind">{{ $t('hide') }}</button>
    </template>
  </div>

  <ImageOriginModal :imgInfo="imgInfo" :open-modal="showOriginImg" @close-modal="showOriginImg = false" />
</template>
<script setup lang="ts">
import _ from 'lodash'
import { PropType } from 'vue';
import { IMessage } from '~~/types';

const emit = defineEmits(['updateBlind'])


const props = defineProps({
  img: Object as PropType<{ is_blind: boolean, url: string }>
})

const showOriginImg = ref(false)
const imgInfo = ref()

const isBlind = computed(() => props.img.is_blind)
const initStatus = _.cloneDeep(props.img.is_blind)

function openBlind() {
  emit('updateBlind', props.img)
}


function onClickImg() {
  if (isBlind.value) return


  const info = {
    url: props.img.url
  }

  imgInfo.value = info
  showOriginImg.value = true
}
</script>
<style scoped lang="scss">
.post-img {
  position: relative;

  .feed-img {
    max-height: 300px;
    padding: 10px;
  }

  .blur {
    backdrop-filter: blur(5px);
    filter: blur(5px);
  }

  img {
    object-fit: contain;
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

.expand-btn {
  position: absolute;
  bottom: 5px;
  right: 5px;
  background: #ffffff44;
  border: none;
  font-size: 16px;
  color: #000;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    color: #f97316;
    background-color: #fff;
  }
}
</style>
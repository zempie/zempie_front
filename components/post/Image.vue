<template>
  <div class="post-img">
    <div :class="[isBlind ? 'blur' : '', 'feed-img mt-3']">
      <img :src="validImg" @click="onClickImg" class="pointer" />
    </div>

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
import { isImageURLValid } from '~~/scripts/utils';

const emit = defineEmits(['updateBlind'])

const props = defineProps({
  img: Object as PropType<{ is_blind: boolean, url: string, thumbnail: string }>
})

const showOriginImg = ref(false)
const imgInfo = ref()

const isBlind = computed(() => props.img.is_blind)
const initStatus = _.cloneDeep(props.img.is_blind)

const validImg = ref(null)


onMounted(() => {
  validateImage()
})


function validateImage() {
  isImageURLValid((props.img.thumbnail), (isValid: Boolean) => {
    if (isValid) {
      validImg.value = props.img.thumbnail
      console.log('valid', validImg.value)
    } else {
      validImg.value = props.img.url
    }
  })
}


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
</style>
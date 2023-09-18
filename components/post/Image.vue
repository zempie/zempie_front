<template>
  <div class="post-img" :class="validImg.isHorizontal ? 'horizonal-img' : 'vertical-img'">
    <div :class="[isBlind ? 'blur' : '', 'feed-img mt-3']">
      <img :src="validImg.url" @click="onClickImg" class="pointer" />
    </div>
    <template v-if="initStatus">
      <button v-if="isBlind" class="btn-default-samll show-btn" @click="openBlind">{{ $t('violent.contents') }}</button>
      <button v-else class="btn-default-samll hide-btn" @click="openBlind">{{ $t('hide') }}</button>
    </template>
  </div>
  <ImageOriginModal :imgInfo="imgInfo" :open-modal="showOriginImg" @close-modal="closeImgModal" />
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
const isMobile = computed(() => useCommon().common.value.isMobile)

const validImg = ref({
  url: null,
  isHorizontal: false
})

watch(
  () => useCommon().common.value.isPopState,
  (val) => {
    if (!val) {
      closeImgModal()
    }
  })

onMounted(() => {
  validateImage()
  checkImgRatio()
})


function validateImage() {
  isImageURLValid((props.img.thumbnail), (isValid: Boolean) => {
    if (isValid) {
      validImg.value.url = props.img.thumbnail
    } else {
      validImg.value.url = props.img.url
    }
  })
}

function checkImgRatio() {
  var image = new Image();
  image.src = props.img.url

  image.onload = function (e) {
    if (image.width >= image.height) {
      validImg.value.isHorizontal = true
    }
  }

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
  showImgModal()
}

function showImgModal() {
  showOriginImg.value = true

  if (isMobile.value) {
    useCommon().setPopState(true)
  }
}

function closeImgModal() {
  showOriginImg.value = false

  if (isMobile.value) {
    useCommon().setPopState(false)
  }
}
</script>
<style scoped lang="scss">
.post-img {
  position: relative;

  &.vertical-img {
    max-width: 552px;
    width: 100%;
    height: 0;
    padding-bottom: 125%;
    overflow: hidden;
  }

  .feed-img {

    img {
      width: 100%;
      height: auto;
      object-fit: cover;
    }

  }

  .blur {
    backdrop-filter: blur(5px);
    filter: blur(5px);
  }

  img {
    object-fit: contain;
    width: 100%;
    // aspect-ratio: 4/5;
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
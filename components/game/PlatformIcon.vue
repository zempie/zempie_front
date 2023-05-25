<template>
  <li v-if="Number(platform) === ePlatformType.Android">
    <i class="uil uil-android" :style="{ 'color': color }"></i>
  </li>
  <li v-if="Number(platform) === ePlatformType.Window">
    <IconWindow :color="color" />
    <!-- <img src="/icons/window_os.svg" alt="window" /> -->
  </li>
  <li v-if="Number(platform) === ePlatformType.Mac">
    <i class="uil uil-apple" :style="{ 'color': color }"></i>
  </li>
  <li v-if="Number(platform) === ePlatformType.Ios">
    <IconIos :color="color" />
    <!-- <img src="/images/ios.svg" alt="ios" /> -->
  </li>
</template>
<script setup lang="ts">
import { ePlatformType } from '~~/types'

defineProps({
  platform: String || Number,
  color: {
    type: String,
    default: '#fff'
  }
})

</script>
<style scoped lang="scss">
.uil-android {
  color: #a4c639
}

.uil-apple {
  color: #000;
}

.uil-html5-alt {
  color: #f97316
}

.uil-file-download {
  color: rgb(48, 166, 216)
}

li {
  list-style: none;
  font-size: 20px;
}
</style>

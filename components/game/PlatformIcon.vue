<template>
  <li v-if="Number(platform) === ePlatformType.Android">
    <i>
      <LazyIconAndroid color="#3ddc84" />
    </i>
  </li>
  <li v-if="Number(platform) === ePlatformType.Window">
    <IconWindow :color="color" />
  </li>
  <li v-if="Number(platform) === ePlatformType.Mac">
    <LazyIconApple />
  </li>
  <li v-if="Number(platform) === ePlatformType.Ios">
    <IconIos :color="color" />
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

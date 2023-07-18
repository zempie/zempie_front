<template>
  <el-tag class="stage-tag mx-1 uppercase" effect="dark" :color="tagColor" v-if="stage !== eGameStage.COMPLETE">
    {{ tagName }}
  </el-tag>
</template>
<script setup lang="ts">
import { ElTag } from 'element-plus';
import { eGameStage } from '~~/types';

const { t, locale } = useI18n()

const props = defineProps({
  stage: Number,
})


const tagColor = computed(() => {
  switch (props.stage) {
    case 1:
      return 'rgb(48, 166, 216)'
    case 2:
      return '#a4c639'
    case 3:
      return '#f97316'
    case 4:
      return '#5624d0'
    default:
      return 'gray'
  }
})

const tagName = computed(() => {
  switch (props.stage) {
    case eGameStage.EARLY:
      return t('demo')
    case eGameStage.DEV:
      return t('dev')
  }
})

</script>
<style scoped lang="scss">
.stage-tag {
  // position: absolute;
  // top: 10px;
  // left: 70px;
  border-color: transparent;
}
</style>

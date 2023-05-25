<template>
  <el-card class="link-card pos-relative" :body-style="{ padding: '0px' }">
    <div class="pos-absolute" style="right:10px; top:10px" v-if="isEdit">
      <span class="material-symbols-outlined pointer" @click="onClickRemove">
        Cancel
      </span>
    </div>
    <div class="img-container" v-if="tagInfo.img">
      <div v-if="tagInfo.type === eMetadataType.website || isEdit" class="tag-img"
        :style="`background:url(${tagInfo.img});`">
      </div>
      <iframe v-else :src="tagInfo.video_url" frameborder="0" allowfullscreen="true" :title="tagInfo.title"
        :key="tagInfo.video_url" class="yt-iframe"></iframe>
    </div>
    <div :class="[!tagInfo.img && 'mr20', 'tag-info-container']">
      <span><strong class="tag-title"> {{ tagInfo.title }}</strong></span>
      <div class="bottom">
        <p class='tag-desc '> {{ tagInfo.desc }}</p>
        <div class="domain-div">
          <p class="tag-favicon" :style="`background:url(${tagInfo.favicon});`">
          </p><strong>{{
            tagInfo.site_name
          }}</strong>
        </div>
      </div>
    </div>
  </el-card>
</template>
<script setup lang="ts">
import { ElCard } from 'element-plus';
import { eMetadataType } from '~~/types';

const props = defineProps({
  tagInfo: Object,
  isEdit: {
    default: true,
    type: Boolean
  }
})

const emit = defineEmits(['removeLink'])


function onClickRemove() {
  emit('removeLink')
}



</script>
<style scoped lang="scss">
.link-card {
  margin: 20px;
}

.pointer {
  &:hover {
    color: #f97316
  }
}

.img-container {

  >div {
    min-height: 200px;
  }

  >.yt-iframe {
    min-height: 360px;
  }

}

.yt-iframe {
  height: auto;
  width: 100%;
}
</style>

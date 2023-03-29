<template>
  <node-view-wrapper class="link-preview">
    <el-card class="link-card" :class="{ active: isClick }" :body-style="{ padding: '0px' }" @click="onClickLink"
      v-on-click-outside="clickOutside" data-drag-handle>
      <div class="tag-img" :style="`background:url(${node.attrs.img_url});`">
      </div>
      <div class="tag-info-container">
        <span><strong class="tag-title"> {{ node.attrs.title }}</strong></span>
        <div class="bottom">
          <p class='tag-desc'> {{ node.attrs.description }}</p>
          <div class="domain-div">
            <p class="tag-favicon" :style="`background:url(${node.attrs.favicon});`">
            </p><strong>{{
              node.attrs.domain
            }}</strong>
          </div>
        </div>
      </div>
    </el-card>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import { ElCard } from 'element-plus';
import { vOnClickOutside } from '@vueuse/components'

const isClick = ref(false)

const props = defineProps({
  node: Object
})


function onClickLink() {
  isClick.value = true
}
function clickOutside() {
  isClick.value = false
}

</script>

<style lang="scss">
.link-card {

  &:hover,
  &.active {
    border: 1px solid #f97316;
  }
}
</style>

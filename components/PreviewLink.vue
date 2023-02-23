<template>
  <node-view-wrapper class="vue-component">
    <el-card :body-style="{ padding: '0px' }">
      <div :style="`background:url(${node.attrs.img_url});
       width: 100%;
       height: 150px;
       background-size: cover;
       background-position: center;
      `"></div>
      <div style="padding: 14px">
        <span><strong> {{ node.attrs.title }}</strong></span>
        <div class="bottom">
          <div style="display:block">

          </div>
          <p> {{ node.attrs.description }}</p>
          <div style=" margin:10px 0px 10px 0px ">
            <p :style="`background:url(${node.attrs.favicon}); width:15px; height:15px;background-position: center;
            background-size: cover; display:inline-block;`"></p><strong>{{
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


const props = defineProps({
  node: Object
})

console.log(props.node)
</script>

<style lang="scss">
.vue-component {
  background: #ededed;
  // border: 3px solid #0D0D0D;
  border-radius: 0.5rem;
  margin: 1rem 0;
  position: relative;
}

.label {
  margin-left: 1rem;
  background-color: #0D0D0D;
  font-size: 0.6rem;
  letter-spacing: 1px;
  font-weight: bold;
  text-transform: uppercase;
  color: #fff;
  position: absolute;
  top: 0;
  padding: 0.25rem 0.75rem;
  border-radius: 0 0 0.5rem 0.5rem;
}

.content {
  margin-top: 1.5rem;
  padding: 1rem;
}
</style>

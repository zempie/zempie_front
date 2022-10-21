<template>
  <node-view-wrapper class="code-block">
    <select contenteditable="false" v-model="selectedLanguage">
      <option :value="null">auto</option>
      <option disabled>—</option>
      <option
        v-for="(language, index) in languages"
        :value="language"
        :key="index"
      >
        {{ language }}
      </option>
    </select>
    <pre><code><node-view-content /></code></pre>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import { lowlight } from 'lowlight'

const props = defineProps(nodeViewProps)

const languages = lowlight.listLanguages()

const selectedLanguage = computed({
  get() {
    return props.node.attrs.language
  },
  set(language) {
    props.updateAttributes({ language })
  },
})
</script>

<style lang="scss" scoped>
.code-block {
  position: relative;

  select {
    position: absolute;
    height: auto !important;
    top: 0.5rem;
    right: 0.5rem;
    color: #fff;
    padding-left: 5px;
  }
}
</style>

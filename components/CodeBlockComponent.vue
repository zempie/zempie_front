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

const languages = [
  'arduino',
  'bash',
  'c',
  'cpp',
  'csharp',
  'css',
  'diff',
  'go',
  'graphql',
  'ini',
  'java',
  'javascript',
  'json',
  'kotlin',
  'less',
  'lua',
  'makefile',
  'markdown',
  'objectivec',
  'perl',
  'php',
  'php-template',
  'plaintext',
  'python',
  'python-repl',
  'r',
  'ruby',
  'rust',
  'scss',
  'shell',
  'sql',
  'swift',
  'typescript',
  'vbnet',
  'wasm',
  'xml',
  'yaml',
]

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

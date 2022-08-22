<template>
  <div style="height: 80vh">
    <EditorContent :editor="editor" class="editor-container blog" />
    <div class="character-count">
      <p>{{ charCount }}/{{ limit }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">

import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'


const editor = useEditor({
  content: '<p>I’m running Tiptap with Vue.js. 🎉</p>',
  extensions: [
    StarterKit,
  ],
})



</script>
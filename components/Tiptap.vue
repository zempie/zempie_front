<template>
  <div style="min-height: 200px; max-height: 80vh">
    <EditorContent
      :editor="editor"
      :class="['editor-container', postType === 'SNS' ? 'sns' : 'blog']"
    />
    <div class="character-count">
      <p>{{ charCount }}/{{ limit }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { IFeed } from '~~/types'
import { useI18n } from 'vue-i18n'

import { useEditor, EditorContent, VueNodeViewRenderer } from '@tiptap/vue-3'
import Link from '@tiptap/extension-link'
import StarterKit from '@tiptap/starter-kit'
import CharacterCount from '@tiptap/extension-character-count'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Placeholder from '@tiptap/extension-placeholder'

import Typography from '@tiptap/extension-typography'
import Highlight from '@tiptap/extension-highlight'
import { lowlight } from 'lowlight/lib/core.js'
import BubbleMenu from '@tiptap/extension-bubble-menu'
import Image from '@tiptap/extension-image'

import CustomImage from '~/scripts/tiptap/customImage'
import CustomAudio from '~~/scripts/tiptap/customAudio'
import CustomVideo from '~~/scripts/tiptap/customVideo'

import ResizableImage from './ResizableImage.vue'
const emit = defineEmits(['editorContent'])
const { t, locale } = useI18n()

const props = defineProps({
  postType: String,
  feed: Object as PropType<IFeed>,
})

const BLOG_LIMIT = 5000
const SNS_LIMIT = 300
const content = ref('')
const charCount = ref(0)

const limit = computed(() =>
  props.postType === 'SNS' ? SNS_LIMIT : BLOG_LIMIT
)

const editor = useEditor({
  content: props.feed?.content || content.value,
  extensions:
    props.postType === 'SNS'
      ? [
          StarterKit.configure({ codeBlock: false }),
          CodeBlockLowlight.configure({ lowlight }),
          Placeholder.configure({
            emptyEditorClass: 'is-editor-empty',
            placeholder: `${t('posting.placeholder')}`,
          }),
          CharacterCount.configure({
            limit: limit.value,
          }),
          Link,
          Typography,
          Highlight,
        ]
      : [
          StarterKit.configure({ codeBlock: false }),
          CodeBlockLowlight.configure({ lowlight }),
          Placeholder.configure({
            emptyEditorClass: 'is-editor-empty',
            placeholder: `${t('posting.placeholder')}`,
          }),
          CharacterCount.configure({
            limit: limit.value,
          }),
          Link,

          Typography,
          Highlight,
          Image.extend({
            addAttributes() {
              return {
                ...this.parent?.(),

                src: {
                  default: '',

                  renderHTML: (attributes) => {
                    return {
                      src: attributes.src,
                    }
                  },
                },
                width: {
                  default: 300,
                  renderHTML: ({ width }) => ({ width }),
                },
                height: {
                  renderHTML: ({ height }) => ({ height }),
                },
                class: {
                  default: 'center',
                  renderHTML: (attributes) => {
                    return {
                      class: attributes.class,
                    }
                  },
                },

                isDraggable: {
                  default: true,

                  renderHTML: (attributes) => {
                    return {}
                  },
                },
              }
            },
            addCommands() {
              return {
                ...this.parent?.(),
                toggleResizable:
                  () =>
                  ({ tr }) => {
                    const { node } = tr?.selection

                    if (node?.type?.name === 'ResizableImage') {
                      node.attrs.isDraggable = !node.attrs.isDraggable
                    }
                  },
              }
            },
            addNodeView() {
              return VueNodeViewRenderer(ResizableImage)
            },
            addOptions() {
              return {
                inline: true,
                HTMLAttributes: {
                  class: 'image-wrapper',
                },
              }
            },
          }),
          CustomVideo.extend({
            addOptions() {
              return {
                inline: true,
                HTMLAttributes: {
                  class: 'video-wrapper',
                },
              }
            },
          }),
          CustomAudio.extend({
            addOptions() {
              return {
                inline: true,
                HTMLAttributes: {
                  class: 'audio-wrapper',
                },
              }
            },
          }),
        ],
  onUpdate: () => {
    charCount.value = editor.value.storage.characterCount.characters()
    emit('editorContent', editor.value)
  },
})

onMounted(() => {
  emit('editorContent', editor.value)
})
</script>

<style lang="scss" scoped>
@use 'sass:math';

.character-count p {
  display: flex !important;
  justify-content: flex-end !important;
  margin: 10px;
}
</style>

<template>
  <div style="min-height: 200px; max-height: 80vh">
    <BubbleMenu :editor="editor" v-if="editor && shouldShow()" class="table-bubble-menu">
      <ul>
        <li @click="editor.chain().focus().addColumnBefore().run()">
          <p><i class="uil uil-plus"></i> add column before</p>
        </li>
        <li @click="editor.chain().focus().addColumnAfter().run()">
          <p><i class="uil uil-plus"></i> add column after</p>
        </li>
        <li @click="editor.chain().focus().addRowBefore().run()">
          <p><i class="uil uil-plus"></i> add row before</p>
        </li>
        <li @click="editor.chain().focus().addRowAfter().run()">
          <p><i class="uil uil-plus"></i> add row after</p>
        </li>
        <li @click="editor.chain().focus().deleteTable().run()">
          <p><i class="uil uil-trash-alt"></i> delete table</p>
        </li>
        <li @click="editor.chain().focus().deleteRow().run()">
          <p><i class="uil uil-minus"></i> delete row</p>
        </li>
        <li @click="editor.chain().focus().deleteColumn().run()">
          <p><i class="uil uil-minus"></i> delete column</p>
        </li>
        <li @click="editor.chain().focus().mergeCells().run()">
          <p><i class="uil uil-arrows-merge"></i> merge</p>
        </li>
        <li @click="editor.chain().focus().splitCell().run()">
          <p><i class="uil uil-arrows-resize-h"></i> split</p>
        </li>
      </ul>
    </BubbleMenu>
    <EditorContent :editor="editor" :class="['editor-container', postType === 'SNS' ? 'sns' : 'blog']"
      @drop="dropEditor" @paste="pasteEditor" @input="handleInput" />

    <div class="character-count">
      <p>{{ charCount }}/{{ limit }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { IFeed } from '~~/types'
import { useI18n } from 'vue-i18n'
import { fileUpload } from '~~/scripts/fileManager'
import {
  useEditor,
  EditorContent,
  VueNodeViewRenderer,
  BubbleMenu,
} from '@tiptap/vue-3'
import Youtube from '@tiptap/extension-youtube'
import Link from '@tiptap/extension-link'
import StarterKit from '@tiptap/starter-kit'
import CharacterCount from '@tiptap/extension-character-count'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Placeholder from '@tiptap/extension-placeholder'

import Typography from '@tiptap/extension-typography'
import Highlight from '@tiptap/extension-highlight'
import { lowlight } from 'lowlight'
import Image from '@tiptap/extension-image'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import CustomImage from '~/scripts/tiptap/customImage'
import CustomAudio from '~~/scripts/tiptap/customAudio'
import CustomVideo from '~~/scripts/tiptap/customVideo'

import ResizableImage from './ResizableImage.vue'
// import PreviewLink from './PreviewLink.vue'
import VueComponent from '~~/scripts/tiptap/extension'
// import { Link } from '~~/scripts/tiptap/customLink'

import CodeBlockComponent from './CodeBlockComponent.vue'

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
        Youtube.configure({
          controls: false,
        }),
        CodeBlockLowlight.extend({
          addNodeView() {
            return VueNodeViewRenderer(CodeBlockComponent)
          },
        }).configure({ lowlight }),
        Placeholder.configure({
          emptyEditorClass: 'is-editor-empty',
          placeholder: `${t('posting.placeholder')}`,
        }),
        CharacterCount.configure({
          limit: limit.value,
        }),
        Link,
        VueComponent,
        Typography,
        Highlight,
      ]
      : [
        StarterKit.configure({ codeBlock: false }),
        Youtube.configure({
          controls: false,
        }),
        CodeBlockLowlight.extend({
          addNodeView() {
            return VueNodeViewRenderer(CodeBlockComponent)
          },
        }).configure({ lowlight }),
        Placeholder.configure({
          emptyEditorClass: 'is-editor-empty',
          placeholder: `${t('posting.placeholder')}`,
        }),
        CharacterCount.configure({
          limit: limit.value,
        }),
        Link,
        VueComponent,
        Table.configure({
          resizable: true,
        }),
        TableRow,
        TableHeader,
        TableCell,
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
  onUpdate: (edit) => {
    charCount.value = editor.value.storage.characterCount.characters()
    emit('editorContent', editor.value)
  },
})

onMounted(() => {
  emit('editorContent', editor.value)
})

function dropEditor(e: DragEvent) {
  e.preventDefault()
  e.stopPropagation()
  addImage(e.dataTransfer)
}

async function pasteEditor(e: ClipboardEvent) {
  addImage(e.clipboardData)
  const link = editor.value.getAttributes('link')
  if (link?.href) {
    const data = await $fetch<{ result: any }>(`/og-tag?url=${link.href}`, getZempieFetchOptions('get', true, { url: link.href }))


    const { result } = data
    const img = result.images[0]
    const favicon = result.favicons[0]


    const url = new URL(result.url);
    let domain = url.hostname;
    domain = domain.replace('www.', '');
    editor.value.commands.insertContent(`<vue-component img_url=${img} title=${result.title} description="${result.description ?? ''}" favicon=${favicon} domain=${domain}></vue-component>`)
  }
}

async function addImage(data: DataTransfer) {
  if (props.postType === 'SNS') return

  const { files } = data

  if (files && files.length > 0) {
    for (const file of Array.from(files)) {
      const [mime] = file.type.split('/')

      if (mime === 'image') {
        //이미지 파일 서버에 바로 저장
        const response = await fileUpload(file)

        if (response) {
          const { url, name, priority } = response.result[0]
          editor?.value
            .chain()
            .focus()
            .setImage({ src: url, alt: name, title: name })
            .run()
        }
      }
    }
  }
}

function shouldShow() {
  return editor.value?.isActive('table')
}

function handleInput() {
  console.log('handleInput', editor.value.getAttributes('link').href)
}
</script>

<style lang="scss" scoped>
@use 'sass:math';

.character-count p {
  display: flex !important;
  justify-content: flex-end !important;
  margin: 10px;
}

.table-bubble-menu {
  background-color: #fff;
  position: absolute;
  min-width: 200px;
  left: 100px;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #888;

  ul {
    li {
      color: black;

      p {
        padding: 5px;
        margin: 5px;
      }

      p:hover {
        background-color: gainsboro;

        border-radius: 10px;
      }
    }

    li:not(:last-child) {
      border-bottom: 1px solid #888;
    }
  }
}
</style>

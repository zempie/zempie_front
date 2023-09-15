<template>
  <div>
    <div style="min-height: 200px; max-height: 80vh;">

      <EditorContent :editor="editor" :class="['editor-container']" @drop="dropEditor" @paste="pasteEditor"
        @input="handleInput" />

      <div class="character-count">
        <p>{{ charCount }}/{{ limit }}</p>
      </div>
    </div>
    <PostLinkPreview v-if="hasLink" :tagInfo="tagInfo" @removeLink="onRemoveLink" />
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
} from '@tiptap/vue-3'
import Link from '@tiptap/extension-link'
import StarterKit from '@tiptap/starter-kit'
import CharacterCount from '@tiptap/extension-character-count'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Placeholder from '@tiptap/extension-placeholder'

import Typography from '@tiptap/extension-typography'
import Highlight from '@tiptap/extension-highlight'
import { lowlight } from 'lowlight'
import CodeBlockComponent from './CodeBlockComponent.vue'
import { isObjEmpty } from '~~/scripts/utils'

const emit = defineEmits(['editorContent', 'sendTagInfo', 'pasteImageFile'])
const { t, locale } = useI18n()


const props = defineProps({
  postType: String,
  feed: Object as PropType<IFeed>,
})

defineExpose(['addImage'])

const LIMIT = 5000
const content = ref('')
const charCount = ref(0)
const tagInfo = ref()
const hasLink = ref(false)

const limit = computed(() => LIMIT)

const editor = useEditor({
  content: props.feed?.content || content.value,
  extensions: [
    StarterKit.configure({ codeBlock: false }),
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
    Typography,
    Highlight,
  ],
  editorProps: {
    handlePaste: function (view, event, slice) {
      const files = Array.from(event.clipboardData?.items || []);
      for (const file of files) {
        if (file.type.indexOf("image") === 0) {
          emit('pasteImageFile', file)
          return true;
        }
      }
      return false;
    }
  },

  onUpdate: (edit) => {
    charCount.value = editor.value.storage.characterCount.characters()
    emit('editorContent', editor.value)
  },
})

onMounted(() => {
  emit('editorContent', editor.value)
  if (!isObjEmpty(props?.feed?.metadata)) {
    tagInfo.value = props.feed.metadata
    console.log('tagInfo', isObjEmpty(tagInfo.value))
    hasLink.value = true
  }
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
    let img = result.images?.[0] ?? ''
    if (isBase64Url(img)) {
      img = ''
    }

    const favicon = result.favicons?.[0] ?? ''
    const { title, description, siteName } = result


    const url = new URL(result.url);
    const domain = url.hostname.replace('www.', '');

    const params = new URLSearchParams(url.search)

    for (let [key, value] of params) {
      console.log('item: ', value)
    }
    const metaTagInfo = {
      img,
      favicon,
      title,
      description,
      site_name: siteName,
      url: url.href,
    }


    tagInfo.value = metaTagInfo
    hasLink.value = true
    emit('sendTagInfo', metaTagInfo)
  }
}


function isBase64Url(url: string) {
  return url.startsWith("data:") && url.indexOf(";base64,") !== -1;
}

async function addImage(data: DataTransfer) {
  if (props.postType === 'SNS') {

    return

  }

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

function onRemoveLink() {
  tagInfo.value = null
  hasLink.value = false
  emit('sendTagInfo', null)

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

<template>
  <div style='min-height:200px'>
    <EditorContent :editor="editor" :class="['editor-container', postType === 'SNS' ? 'sns' : 'blog']" />
    <div class="character-count">
      <p>{{ charCount }}/{{ limit }}</p>
    </div>
  </div>

</template>


<script setup lang="ts">

import { PropType } from 'vue';
import { IFeed } from '~~/types';
import { useI18n } from 'vue-i18n';

import { useEditor, EditorContent, VueNodeViewRenderer } from '@tiptap/vue-3'
import Link from "@tiptap/extension-link";
import StarterKit from '@tiptap/starter-kit'
import CharacterCount from "@tiptap/extension-character-count";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import Placeholder from '@tiptap/extension-placeholder'

import Typography from '@tiptap/extension-typography'
import Highlight from '@tiptap/extension-highlight'

import Image from '~/scripts/tiptap/image'


import { lowlight } from 'lowlight/lib/core.js'


const emit = defineEmits(['editorContent'])
const { t, locale } = useI18n()

const props = defineProps({
  postType: String,
  feed: Object as PropType<IFeed>
})

const BLOG_LIMIT = 5000
const SNS_LIMIT = 300
const content = ref(props.feed?.content || '')
const charCount = ref(0)

const limit = computed(() => props.postType === 'SNS' ? SNS_LIMIT : BLOG_LIMIT)


const editor = useEditor({
  content: content.value,
  extensions: [
    StarterKit,
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
    Image
  ],
  onUpdate: () => {
    charCount.value = editor.value.storage.characterCount.characters()
    emit('editorContent', editor.value)
    //TODO: 블로그 이미지 스토어에 저장 하고 업로드 하기 전에 등록하기 

  },


})

onMounted(() => {
  emit('editorContent', editor.value)
})




// //custom tiptap
// import Video from "@/script/tiptap/customVideo";
// import Audio from "@/script/tiptap/customAudio";
// import Iframe from "@/script/tiptap/iframe";
// import Hashtag from "@/script/tiptap/hashtag";
// import Mention from "@/script/tiptap/mention";
// import Image from "@/script/tiptap/image";

// import HashtagList from "./HashTagList.vue";
// import MentionList from "./MentionList.vue";
// import tippy from "tippy.js";

// export default class TiptapBlog extends Vue {
//   feed!: any;
//   //todo: imgPreviewArr 수정시사용하는지 확인
//   private imgPreviewArr: any[] = [];
//   private postingText: string = "";
//   private editor: Editor | null = null;
//   private user!: any;
//   private limit: number = 5000;
//   private charCnt: number = 0;


//   // 해시태그 멘션
//   private hasTagSuggestion: boolean = false;
//   private postedHashtag: string[] = [];

//   private hasMentionSuggestion: boolean = false;
//   private mentionList: any[] = [];
//   hashTagListTest: string[] = [];

//   async created() {
//     this.editor = new Editor({
//       content: this.postingText,
//       extensions: [
//         StarterKit,
//         Image,
//         CodeBlockLowlight.configure({
//           lowlight,
//         }),
//         Placeholder.configure({
//           emptyEditorClass: 'is-editor-empty',
//           placeholder: `${this.$t('posting.placeholder')}`,
//         }),
//         CharacterCount.configure({
//           limit: this.limit,
//         }),
//         Link,
//         Code,
//         Document,
//         Paragraph,
//         Text,
//         Highlight,
//         Typography,
//         Dropcursor,
//         Video,
//         Iframe,
//         Audio,

//         // Hashtag.configure({
//         //     HTMLAttributes: {
//         //         class: "hashtag",
//         //     },
//         //     renderLabel({options, node}) {
//         //         return `${options.suggestion.char}${
//         //             node.attrs.label ?? node.attrs.id
//         //         }`;
//         //     },
//         //     suggestion: {
//         //         //@ts-ignore
//         //         items: (query) => {
//         //             if (query.length > 0) {
//         //                 return this.hashTagListTest
//         //                     .filter((item) =>
//         //                         item
//         //                             .toLowerCase()
//         //                             .startsWith(query.toLowerCase())
//         //                     )
//         //                     .slice(0, 10);
//         //             }
//         //         },
//         //         render: () => {
//         //             let component;
//         //             let popup;
//         //
//         //             return {
//         //                 onStart: (props) => {
//         //                     component = new VueRenderer(HashtagList, {
//         //                         parent: this,
//         //                         propsData: props,
//         //                     });
//         //
//         //                     popup = tippy("body", {
//         //                         getReferenceClientRect:
//         //                         props.clientRect,
//         //                         appendTo: () => document.body,
//         //                         content: component.element,
//         //                         showOnCreate: true,
//         //                         interactive: false,
//         //                         trigger: "manual",
//         //                         placement: "bottom-start",
//         //                     });
//         //                 },
//         //                 onUpdate: (props) => {
//         //                     component.updateProps(props);
//         //                     if (props.items && props.items.length > 0) {
//         //                         this.hasTagSuggestion = true;
//         //                     }
//         //                     else {
//         //                         this.hasTagSuggestion = false;
//         //                     }
//         //                     popup[0].setProps({
//         //                         getReferenceClientRect:
//         //                         props.clientRect,
//         //                     });
//         //                 },
//         //                 onKeyDown: (props) => {
//         //                     // console.log("onKeyDown", props);
//         //                     if (
//         //                         props.event.key === "Enter" &&
//         //                         !this.hasTagSuggestion &&
//         //                         component.ref?._props.query
//         //                     ) {
//         //                         let id = {
//         //                             id: component.ref?._props.query,
//         //                         };
//         //
//         //                         return component.ref?._props.editor
//         //                             .chain()
//         //                             .focus()
//         //                             .insertContentAt(
//         //                                 component.ref?._props.range,
//         //                                 [
//         //                                     {
//         //                                         type: "hashtag",
//         //                                         attrs: id,
//         //                                     },
//         //                                     {
//         //                                         type: "text",
//         //                                         text: " ",
//         //                                     },
//         //                                 ]
//         //                             )
//         //                             .run();
//         //                     }
//         //                     else {
//         //                         return component.ref?.onKeyDown(props);
//         //                     }
//         //                 },
//         //                 onExit() {
//         //
//         //                     popup[0].destroy();
//         //                     component.destroy();
//         //                 },
//         //             };
//         //         },
//         //     },
//         // }),
//         // Mention.configure({
//         //     HTMLAttributes: {
//         //         class: "mention",
//         //     },
//         //     suggestion: {
//         //         items: (query) => {
//         //             return this.mentionList
//         //                 .filter((item) =>
//         //                     item.nickname
//         //                         .toLowerCase()
//         //                         .startsWith(query.toLowerCase())
//         //                 )
//         //                 .slice(0, 10);
//         //         },
//         //         render: () => {
//         //             let component;
//         //             let popup;
//         //
//         //             return {
//         //                 onStart: (props) => {
//         //                     component = new VueRenderer(MentionList, {
//         //                         parent: this,
//         //                         propsData: props,
//         //                     });
//         //
//         //                     popup = tippy("body", {
//         //                         getReferenceClientRect:
//         //                         props.clientRect,
//         //                         appendTo: () => document.body,
//         //                         content: component.element,
//         //                         showOnCreate: true,
//         //                         interactive: true,
//         //                         trigger: "manual",
//         //                         placement: "bottom-start",
//         //                     });
//         //                     if (props.items && props.items.length > 0) {
//         //                         this.hasMentionSuggestion = true;
//         //                     }
//         //                     else {
//         //                         this.hasMentionSuggestion = false;
//         //                     }
//         //                 },
//         //                 onUpdate: (props) => {
//         //                     component.updateProps(props);
//         //                     if (props.items && props.items.length > 0) {
//         //                         this.hasMentionSuggestion = true;
//         //                     }
//         //                     else {
//         //                         this.hasMentionSuggestion = false;
//         //                     }
//         //
//         //                     popup[0].setProps({
//         //                         getReferenceClientRect:
//         //                         props.clientRect,
//         //                     });
//         //                 },
//         //                 onKeyDown: (props) => {
//         //                     if (
//         //                         props.event.key === "Enter" &&
//         //                         !this.hasMentionSuggestion &&
//         //                         component.ref?._props.query
//         //                     ) {
//         //                         let id = {
//         //                             id: component.ref?._props.query,
//         //                         };
//         //                         this.$store.commit(
//         //                             "userTagList",
//         //                             component.ref?._props.query
//         //                         );
//         //                         return component.ref?._props.editor
//         //                             .chain()
//         //                             .focus()
//         //                             .insertContentAt(
//         //                                 component.ref?._props.range,
//         //                                 [
//         //                                     {
//         //                                         type: "mention",
//         //                                         attrs: id,
//         //                                     },
//         //                                     {
//         //                                         type: "text",
//         //                                         text: " ",
//         //                                     },
//         //                                 ]
//         //                             )
//         //                             .run();
//         //                     }
//         //                     else {
//         //                         return component.ref?.onKeyDown(props);
//         //                     }
//         //                 },
//         //                 onExit() {
//         //                     popup[0].destroy();
//         //                     component.destroy();
//         //                 },
//         //             };
//         //         },
//         //     },
//         // }),
//       ],
//       // autofocus: 'end',
//       onUpdate: () => {
//         this.$emit("isEmpty", this.editor!.isEmpty);
//         this.charCnt = this.editor!.getCharacterCount();
//         this.$store.commit("postContents", this.editor!.getHTML());
//         this.$store.commit("isClearEditor", false);
//       },
//     });
//   }

//   mounted() {
//     this.feed = this.$store.getters.feed;

//     if (this.feed) {
//       this.editor!.commands.setContent(this.feed.content);
//       this.charCnt = this.editor!.getCharacterCount();
//       this.prefill();
//     }
//   }


//   beforeDestroy() {
//     this.editor!.destroy()
//   }

//   prefill() {

//     const attachFiles = Array.isArray(this.feed.attatchment_files) ? this.feed.attatchment_files : JSON.parse(this.feed.attatchment_files)
//     if (attachFiles) {
//       for (const file of attachFiles) {
//         if (file.type === 'image') {
//           this.imgPreviewArr.push(file);
//         }
//       }
//       this.$store.commit('imgArr', this.imgPreviewArr)
//       if (this.feed.attatchment_files.type === 'image') {
//         this.imgPreviewArr = this.feed.attatchment_files.img;
//       }
//     }
//   }

//   @Watch('$store.getters.blogImgArr')
//   blogImgArr() {
//     for (const img of this.$store.getters.blogImgArr) {
//       this.editor!.chain().focus(null).setImage({ src: img.url }).run();
//     }
//   }

//   @Watch('$store.getters.blogVideoArr')
//   blogVideoArr() {
//     for (const video of this.$store.getters.blogVideoArr) {
//       this.editor!.chain().focus(true).setIframe({ src: video.url }).run();
//     }
//   }

//   @Watch('$store.getters.blogAudioArr')
//   blogAudioArr() {
//     for (const audio of this.$store.getters.blogAudioArr) {
//       this.editor!.chain().focus(true).setAudio({ src: audio.url, name: audio.name }).run();
//     }
//   }
// }
</script>

<style lang="scss" scoped>
@use "sass:math";

.character-count p {
  display: flex !important;
  justify-content: flex-end !important;
  margin: 10px;
}

.editor-container {
  height: 100%;
  text-align: left;
  padding: 15px;

  .iframe-wrapper {
    position: relative;
    padding-bottom: math.div(100, 16) * 9%;
    height: 0;
    overflow: hidden;
    width: 100%;
    height: auto;

    &.ProseMirror-selectednode {
      outline: 3px solid #F97316;
    }

    iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }

}
</style>

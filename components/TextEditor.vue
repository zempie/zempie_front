<template>
  <div class="modal-post">
    <ul class="mp-header">
      <li :class="activeTab === 'SNS' ? 'active' : ''" @click="activeTab = 'SNS'"><i class="uil uil-file-landscape"></i>
        SNS
      </li>
      <li :class="activeTab === 'BLOG' ? 'active' : ''" @click="activeTab = 'BLOG'"><i
          class="uil uil-files-landscapes"></i> Blog
      </li>
    </ul>
    <div>
      <!-- <PostBySns v-if="activeTab === 'SNS'" /> -->
      <PostByBlog @editorContent="getEditorContent" :postType='activeTab' />

      <div v-if="attachFiles.img.length && activeTab === 'SNS'" class="mp-image" style="padding-bottom: 0px">
        <dd style="width: 100%;">
          <swiper :modules="[Pagination]" class="swiper-area" :slides-per-view="3" :space-between="10"
            :pagination="{ clickable: true }">
            <swiper-slide v-for="(img, idx) in attachFiles.img" :key="idx"
              :style="`padding-bottom: 43px; background: url(${img.url}) center center / cover no-repeat; background-size:cover;`">
              <span @click="deleteImg(idx)"><i class="uil uil-times-circle"></i></span>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
        </dd>
      </div>
      <div class="mp-category">

      </div>
      <dl class="mp-type">
        <dt>
          <div style="width: 30px" @click="uploadImageFile">
            <a><i class="uil uil-image"></i></a>
            <div style="height: 0px; overflow: hidden">
              <input type="file" @change="onSelectImageFile" multiple accept=image/* ref="image" />
            </div>
          </div>
          <div style="width: 30px" @click="uploaVideoFile">
            <a href="#"><i class="uil uil-play-circle"></i></a>
            <div style="height: 0px; overflow: hidden">
              <input type="file" @change="onSelectVideoFile" accept=video/* ref="video" />
            </div>
          </div>
          <div style="width: 30px" @click="uploadAudioFile">
            <a href="#"><i class="uil uil-music"></i></a>
            <div style="height: 0px; overflow: hidden">
              <input type="file" @change="onSelectAudioFile" multiple accept=".mp3" ref="audio" />
            </div>
          </div>
        </dt>

        <dd>
          <button class="btn-default-samll w100 cancel-btn" @click="emit('closeModal')">Cancel</button>
          <button class="btn-default-samll w100" @click="onSubmit">Post</button>
        </dd>
      </dl>
    </div>

  </div>
</template>

<script setup lang="ts">
import { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/vue';

import { Editor } from "@tiptap/vue-3";
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ElSelect, ElOption, ElMessage, ElDialog } from "element-plus";

import { useI18n } from 'vue-i18n';
const { t, locale } = useI18n()

const route = useRoute()



const activeTab = ref("SNS")
const video = ref<HTMLElement>()
const image = ref<HTMLElement>()
const audio = ref<HTMLElement>()

const props = defineProps({
  type: String,
})

const editor = ref<Editor>()

const attachFiles = ref({
  img: [],
  video: [],
  audio: []
})


const emit = defineEmits(['closeModal', 'fetch'])


const form = reactive({
  post_contents: '',
})

async function onSubmit() {
  const payload = {
    post_contents: form.post_contents,
    post_state: activeTab.value,
    hashtags: [],
  }

  if (attachFiles.value.img.length || attachFiles.value.audio.length || attachFiles.value.video.length) {


    const formData = new FormData();

    for (const img of attachFiles.value.img) {
      formData.append(img.name, img.file)
    }

    const { data, error, pending } = await useFetch<{ result: [] }>('/community/att', getZempieFetchOptions('post', true, formData))

    payload['attatchment_files'] = data.value.result;
  }






  // const imgContent = contentJson.content.filter((tag) => {
  //     if (tag.content?.length > 0) {
  //       return tag.content.filter(elem => elem.type === 'image')
  //     }
  //   }
  // )




  switch (props.type) {
    case 'community':
      const communityId = route.params.id


      payload['community'] = [{
        id: communityId
      }]
      break;
  }



  const { error: uploadError } = await post.upload(payload);

  if (!uploadError.value) {

    emit('closeModal')
    emit('fetch')
    ElMessage({
      message: t('posting.done'),
      type: 'success'
    })
  }

  // this.$api.uploadPost(obj)
  //                 .then((res: AxiosResponse) => {
  //                     this.$emit('reFetch')
  //                     this.toast.successToast(`${this.$t('posting.done')}`)
  //                 })
  //                 .catch((err: AxiosError) => {
  //                     this.toast.failToast(`${this.$t('posting.fail')}`)
  //                 })
  //                 .finally(() => {
  //                     this.$modal.hide("modalPost");
  //                     this.init();
  //                     this.$store.commit('postContents', '')
  //                 })
}

function getEditorContent(content: Editor) {
  editor.value = content
  form.post_contents = content.getHTML()


}

function uploadImageFile() {
  image.value.click()
}

function onSelectImageFile(event: { target: { files: File[], value: string } }) {
  const files = event.target.files;

  for (const file of files) {
    const reader = new FileReader();

    reader.onload = async (e) => {

      const url = e.target!.result as any
      const result = await fetch(url)
      const blob = await result.blob()
      const blobUrl = URL.createObjectURL(blob)
      attachFiles.value.img.push({
        file: file,
        name: file.name,
        url: url
      })
      if (activeTab.value === 'BLOG') {
        editor.value.chain().focus(null).setImage({ src: blobUrl }).run();
      }
    };

    reader.readAsDataURL(file);
  }

  event.target.value = ''
}

function deleteImg(idx: number) {
  attachFiles.value.img.splice(idx, 1)
}

function uploaVideoFile() {
  video.value.click()
  //  if(activeTab === 'SNS') {
  //             if (this.$store.getters.audioArr.length > 0 || this.$store.getters.imgArr.length > 0) {

  //                     this.$modal.show('alertAttrModal')
  //                 }else{
  //                 (this.$refs.video as HTMLElement).click();
  //             }
  //             }
  //             else {
  //                 (this.$refs.video as HTMLElement).click();

  //         }
}

function onSelectVideoFile() {

}


function uploadAudioFile() {
  audio.value.click()
}

function onSelectAudioFile() {

}
</script>

<style lang="scss" >
@use "sass:math";

.modal-post {


  .mp-category {
    width: 100%;
    display: inline-flex;
    padding: 0;
    border-bottom: 0px;
    border-top: 0px;


    .btn-line-small {
      margin-left: 10px;
    }
  }

  .cancel-btn {
    margin-right: 10px;
    background-color: #dc3545;
  }

  .cancel-btn:hover {
    color: #dc3545;
    background: rgba(220, 53, 69, 0.27);
  }

}

.editor-container {
  min-height: 200px;
  text-align: left;
  padding: 15px;


  .ProseMirror {

    height: 100%;
    overflow: auto;

    >*+* {
      margin-top: 0.75em;
    }

    a {
      color: #68cef8
    }


    p.is-editor-empty:first-child::before {
      content: attr(data-placeholder);
      float: left;
      color: #adb5bd;
      pointer-events: none;
      height: 0;
    }


    ul {
      padding: 0 1.5rem;
      list-style-type: disc;
    }

    ol {
      padding: 0 1.5rem;
      list-style-type: decimal;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      line-height: 1.1;
    }



    img {
      max-width: 100%;
      height: auto;


      &.ProseMirror-selectednode {
        margin: 3px;
        outline: 3px solid #F97316;
      }
    }

    hr {
      margin: 1rem 0;
    }

    blockquote {
      padding-left: 1rem;
      border-left: 2px solid rgba(#0D0D0D, 0.1);
    }
  }

  .ProseMirror:focus-visible {
    outline-color: transparent;
  }


  .iframe-wrapper {
    position: relative;
    padding-bottom: math.div(100, 16) * 9%;
    overflow: hidden;

    &.ProseMirror-selectednode {
      outline: 3px solid #F97316;
    }

    iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100% !important;
      height: 100% !important;
    }
  }

  .audio-wrapper {
    margin: 20px 20px 0 20px;
    display: flex;
    align-items: center;
    border-radius: 5px;
    background: #f5f5f5;
    flex-direction: column;

    audio {
      width: 100%;
    }

    p {
      width: 100%;
      height: 30px;
      padding-left: 20px;
    }

    &.ProseMirror-selectednode {
      outline: 3px solid #F97316;
    }
  }
}
</style>
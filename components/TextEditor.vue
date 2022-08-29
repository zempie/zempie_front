<template>
  <div class="modal-post">
    <ul class="mp-header">
      <li :class="activeTab === 'SNS' ? 'active' : ''" @click="postingType('SNS')"><i
          class="uil uil-file-landscape"></i>
        SNS
      </li>
      <li :class="activeTab === 'BLOG' ? 'active' : ''" @click="postingType('BLOG')"><i
          class="uil uil-files-landscapes"></i> Blog
      </li>
    </ul>
    <div>
      <!-- <PostBySns v-if="activeTab === 'SNS'" /> -->
      <!-- <PostEdit v-if="isEdit" @editorContent="getEditorContent" :postType='activeTab' :feed="feed" /> -->
      <Tiptap @editorContent="getEditorContent" :postType='activeTab' :feed="feed" :key="activeTab" />

      <template v-if="activeTab === 'SNS'">
        <div v-if="attachFiles.img?.length" class="mp-image" style="padding-bottom: 0px">
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

        <div v-if="attachFiles.video?.url" class="mp-midi">
          <span @click="deleteVideo" class="delete-video-btn"><i class="uis uis-times-circle"></i></span>
          <video style="width:100%;" :src="attachFiles.video?.url" title="YouTube video player" frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen></video>
        </div>

        <div v-if="attachFiles.audio?.length" class="mp-midi">
          <ul v-for="(audio, idx) in attachFiles.audio" class="audio-wrapper">
            <div class="btn-container">

              <audio controls :src="audio.url"></audio>
              <span class="delete-audio-btn" @click="deleteAudio(idx)"><i class="uis uis-times-circle"></i></span>
            </div>
            <p> {{ audio.name || audio.file.name }}</p>
          </ul>
        </div>
      </template>
      <ClientOnly>
        <div class="mp-category"
          :style="attachFiles.img?.length ? 'border-top: #e9e9e9 1px solid; margin-top:10px; padding-top:10px;' : ''">
          <el-popover name="category" trigger="click" v-model:visible="isCommunityListVisible">
            <template #reference>
              <button class="btn-line-small" style="width:30%;" @click="communityFetch"><i class="uil uil-plus"></i>
                <span v-if="postingChannels.length >= 2">Add</span>
                <span v-else>Add community</span>
              </button>
            </template>

            <div v-if="communityList.length" class="mpc-more-dropdown">
              <button class="category-group group-btn" @click="openChannel(com)"
                :class="isCommunityListOpen ? 'on' : 'off'" v-for="com in communityList">
                <p style="margin: 0 auto;"> {{ com.name }}</p>
              </button>
              <div :class="['channel-btn', isChannelListOpen ? 'on' : 'off']">
                <div class="back-group-btn" @click="backToCommunityList">
                  <button class="category-group">
                    <i class="uil uil-arrow-circle-left"></i>
                    {{ selectedGroup?.name }}
                  </button>
                </div>
                <button class="category-group" v-for="channel in channels" @click="selectChannel(channel)">
                  {{ channel.title }}
                </button>
              </div>
            </div>
            <div v-else>
              {{ t('noJoined.community') }}
            </div>
          </el-popover>
          <swiper v-if="postingChannels.length" class="swiper-area" style="margin-left: 10px;" :space-between="10">
            <swiper-slide class="community-slide" v-for="(postedAt, index) in postingChannels" :key="index">
              <div class="category-select-finish">
                <div>
                  <span>{{ postedAt.group.name }}</span> /
                  <em>{{ postedAt.channel.title }}</em>
                </div>
                <div class="cross-btn" @click="deletePostingChannel(index)"><i class="uil uil-times"></i></div>
              </div>
            </swiper-slide>
          </swiper>

        </div>
      </ClientOnly>
      <dl class="mp-type">
        <dt>
          <div style="width: 30px" @click="uploadImageFile">
            <a><i class="uil uil-image"></i></a>
            <div style="height: 0px; overflow: hidden">
              <input type="file" @change="onSelectImageFile" multiple accept=image/* ref="image" />
            </div>
          </div>
          <div style="width: 30px" @click="uploaVideoFile">
            <a><i class="uil uil-play-circle"></i></a>
            <div style="height: 0px; overflow: hidden">
              <input type="file" @change="onSelectVideoFile" accept=video/* ref="video" />
            </div>
          </div>
          <div style="width: 30px" @click="uploadAudioFile">
            <a><i class="uil uil-music"></i></a>
            <div style="height: 0px; overflow: hidden">
              <input type="file" @change="onSelectAudioFile" multiple accept=".mp3" ref="audio" />
            </div>
          </div>
        </dt>
        <dd>
          <button class="btn-default-samll w100 cancel-btn" @click="closeTextEditor">Cancel</button>
          <button v-if="isEdit" class="btn-default-samll w100" @click="onUpdatePost">Update</button>
          <button v-else class="btn-default-samll w100" @click="onSubmit">Post</button>
        </dd>
      </dl>
    </div>

  </div>
</template>

<script setup lang="ts">
import _ from 'lodash'
import { PropType } from 'vue';
import { IFeed } from '~~/types';
import { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/vue';

import { Editor } from "@tiptap/vue-3";
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ElLoading, ElPopover, ElMessage, ElDialog } from "element-plus";

import { useI18n } from 'vue-i18n';
import { htmlToDomElem, blobToFile } from '~~/scripts/utils'

const { t, locale } = useI18n()

const route = useRoute()
const popover = ref()

const props = defineProps({
  type: String,
  isEdit: {
    type: Boolean,
    default: false
  },
  feed: Object as PropType<IFeed>,
  channelInfo: Object

})

const initFiles = _.cloneDeep(props.feed?.attatchment_files)

const attachFileArr = computed(() => {
  if (props.feed) {
    return Array.isArray(props.feed?.attatchment_files) ? props.feed?.attatchment_files : JSON.parse(props.feed?.attatchment_files as string)
  }
  else {
    return []
  }
})


const attachFiles = ref({
  img: attachFileArr.value[0]?.type === 'image' ? attachFileArr.value : [],
  video: attachFileArr.value[0]?.type === 'video' ? attachFileArr.value[0] : null,
  audio: attachFileArr.value[0]?.type === 'sound' ? attachFileArr.value : []
})


const activeTab = ref(props.feed?.post_type || "SNS")
const video = ref<HTMLElement>()
const image = ref<HTMLElement>()
const audio = ref<HTMLElement>()


const editor = ref<Editor>()



const communityList = ref([])
const isCommunityListOpen = ref(true)
const isChannelListOpen = ref(false)
const selectedGroup = ref()
const channels = ref()
const postingChannels = ref([])
const isCommunityListVisible = ref(false)



const emit = defineEmits(['closeModal', 'refresh'])


const form = reactive({
  post_contents: '',
})

onMounted(() => {
  if (props.type === 'community') {
    if (props.channelInfo) {
      postingChannels.value = [{
        group: useCommunity().community.value.info,
        channel: props.channelInfo
      }]
    } else {
      postingChannels.value = [{
        group: useCommunity().community.value.info,
        channel: useCommunity().community.value.info.channels[0]
      }]
    }
  }

})

function postingType(type: string) {
  activeTab.value = type
  usePost().setType(type)


}

async function onSubmit() {



  const payload = {
    post_contents: form.post_contents,
    post_state: activeTab.value,
    hashtags: [],
    community: [],
  }

  if (postingChannels.value.length) {

    for (const element of postingChannels.value) {

      payload.community.push({
        id: element.group.id,
        community: element.group,
        channel_id: element.channel.id,
        channel: element.channel
      })
    }
  }
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    customClass: 'loading-spinner',
    background: 'rgba(0, 0, 0, 0.7)',
  })

  const dom = htmlToDomElem(form.post_contents)

  const imgArr: any = dom.getElementsByClassName('attr-img')

  if (activeTab.value.toLocaleUpperCase() === 'BLOG') {
    for (const img of imgArr) {

      if (img.src.substring(0, 4) === 'blob' || img.src.substring(0, 4) === 'data') {
        const formData = new FormData();



        await fetch(img.src)
          .then(async (result) => {
            formData.append(img.title, await result.blob())
          })

        const { data, error, pending } = await useFetch<{ result: [] }>('/community/att', getZempieFetchOptions('post', true, formData))
        if (data.value) {
          form.post_contents = form.post_contents.replace(img.src, data.value.result[0].url)
        }
      }
      payload.post_contents = form.post_contents
    }
  } else {


    if (attachFiles.value.img.length || attachFiles.value.audio.length || attachFiles.value.video) {
      const formData = new FormData();

      for (const img of attachFiles.value.img) {
        formData.append(img.name, img.file)
      }

      for (const audio of attachFiles.value.audio) {
        formData.append(audio.name, audio.file)
      }
      if (attachFiles.value.video) {
        formData.append(attachFiles.value.video.name, attachFiles.value.video.file)
      }

      const { data, error, pending } = await useFetch<{ result: [] }>('/community/att', getZempieFetchOptions('post', true, formData))

      payload['attatchment_files'] = data.value.result;
    }
  }
  // const imgContent = contentJson.content.filter((tag) => {
  //     if (tag.content?.length > 0) {
  //       return tag.content.filter(elem => elem.type === 'image')
  //     }
  //   }
  // )
  switch (props.type) {
    case 'community':


      break;
    case 'game':
      payload['game_id'] = useGame().game.value.info.id
      break;
  }



  const { error: uploadError } = await post.upload(payload);

  if (!uploadError.value) {

    emit('closeModal')
    emit('refresh')
    ElMessage({
      message: t('posting.done'),
      type: 'success'
    })
  }
  loading.close()

}

function getEditorContent(content: Editor) {
  editor.value = content
  form.post_contents = content.getHTML()

}

function uploadImageFile() {
  image.value.click()
}

function onSelectImageFile(event: any) {
  if (activeTab.value.toUpperCase() === 'SNS') {
    if (attachFiles.value.video || attachFiles.value.audio.length) {
      ElMessage({
        message: t('post.fileType.err.text1'),
        type: 'warning'
      })
      return;
    }
  }

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
        url: url,
      })

      if (activeTab.value.toUpperCase() === 'BLOG') {
        editor.value.chain().focus(null).setImage({ src: blobUrl, alt: file.name, title: file.name }).run();
        editor.value.commands.setHardBreak();
        editor.value.commands.setHardBreak();

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
}

function onSelectVideoFile(event: any) {
  if (activeTab.value.toUpperCase() === 'SNS') {
    if (attachFiles.value.img.length || attachFiles.value.audio.length) {
      ElMessage({
        message: t('post.fileType.err.text1'),
        type: 'warning'
      })
      return;
    }
  }

  const files = event.target.files;

  for (const file of files) {
    const reader = new FileReader();

    reader.onload = async (e) => {

      const url = e.target!.result as any
      const result = await fetch(url)
      const blob = await result.blob()
      const blobUrl = URL.createObjectURL(blob)

      attachFiles.value.video = {
        file: file,
        name: file.name,
        url: url
      }

      if (activeTab.value === 'BLOG') {
        editor.value.chain().focus(null).setVideo({ src: blobUrl }).run();
      }
    };

    reader.readAsDataURL(file);
  }

  event.target.value = ''

}



function deleteVideo() {
  attachFiles.value.video = null;
}


function uploadAudioFile() {
  if (activeTab.value.toUpperCase() === 'SNS') {
    if (attachFiles.value.video || attachFiles.value.img.length) {
      ElMessage({
        message: t('post.fileType.err.text1'),
        type: 'warning'
      })
      return;
    }
  }
  audio.value.click()
}

function onSelectAudioFile(event: any) {



  const files = event.target.files;

  for (const file of files) {
    const reader = new FileReader();

    reader.onload = async (e) => {

      const url = e.target!.result as any
      const result = await fetch(url)
      const blob = await result.blob()
      const blobUrl = URL.createObjectURL(blob)

      attachFiles.value.audio.push({
        file: file,
        name: file.name,
        url: url
      })

      if (activeTab.value === 'BLOG') {
        editor.value.chain().focus(null).setAudio({ src: blobUrl }).run();
      }
    };

    reader.readAsDataURL(file);
  }

  event.target.value = ''

}

function deleteAudio(idx: number) {
  attachFiles.value.audio.splice(idx, 1)

}

async function onUpdatePost() {
  let attatchment_files = []
  let newImgArr = [];
  let newSoundArr = [];
  let newVideo = null;
  const formData = new FormData();


  if (attachFileArr.value[0]?.type === 'image') {
    attatchment_files = attachFiles.value.img
  }
  newImgArr = attachFiles.value.img.filter(img => {
    return !img.size
  })

  if (attachFileArr.value[0]?.type === 'sound') {
    attatchment_files = attachFiles.value.audio
  }
  newSoundArr = attachFiles.value.audio.filter(audio => {
    return !audio.size
  })

  if (attachFileArr.value[0]?.type === 'video') {

    attatchment_files = attachFiles.value.video !== null ? attachFiles.value.video : []
  }

  newVideo = attachFiles.value.video;


  if (newImgArr.length) {
    for (const img of newImgArr) {
      formData.append(img.name, img.file)
    }
    const { data, error, pending } = await useFetch<{ result: { priority: number, url: string, type: string, name: string, size: number }[] }>('/community/att', getZempieFetchOptions('post', true, formData))

    if (data.value) {
      const { result } = data.value
      for (const data of result) {
        attatchment_files.push({
          priority: data.priority,
          url: data.url,
          type: data.type,
          name: data.name,
          size: data.size
        })
      }

    }
  } else if (newSoundArr.length) {
    for (const sound of newSoundArr) {
      formData.append(sound.name, sound.file)
    }
    const { data, error, pending } = await useFetch<{ result: { priority: number, url: string, type: string, name: string, size: number }[] }>('/community/att', getZempieFetchOptions('post', true, formData))

    if (data.value) {
      const { result } = data.value
      for (const data of result) {
        attatchment_files.push({
          priority: data.priority,
          url: data.url,
          type: data.type,
          name: data.name,
          size: data.size
        })
      }
    }
  } else if (newVideo) {
    formData.append(newVideo.name, newVideo.file)
    const { data, error, pending } = await useFetch<{ result: { priority: number, url: string, type: string, name: string, size: number }[] }>('/community/att', getZempieFetchOptions('post', true, formData))

    if (data.value) {
      const { result } = data.value
      for (const data of result) {
        attatchment_files = [{
          priority: data.priority,
          url: data.url,
          type: data.type,
          name: data.name,
          size: data.size
        }]
      }
    }

  }


  const payload = {
    post_id: props.feed.id,
    post_state: activeTab.value,
    attatchment_files: attatchment_files,
    post_contents: form.post_contents,
    // visibility: this.isPrivate ? "PRIVATE" : "PUBLIC",
    hashtags: [],
    // game_id:  this.$store.getters.currPage?.game_id,
    // channel_id: this.user.channel_id,
    // ...this.$store.getters.currPage,
    // portfolio_ids: [""],
    // scheduled_for: null
  }
  const { data, error, pending } = await useFetch(`/post/${props.feed.id}`, getComFetchOptions('put', true, payload))

  if (!error.value) {

    emit('closeModal')
    emit('refresh')
    ElMessage({
      message: t('posting.edit.done'),
      type: 'success'
    })
  } else {
    ElMessage.error(t('posting.edit.fail'))
  }
  // return await this.request('put', `${communityApi}post/${obj.post_id}`, obj, false);



}

function closeTextEditor() {
  attachFiles.value.img = _.cloneDeep(initFiles)
  emit('closeModal')
}


async function communityFetch() {

  const { data, error, pending } = await useFetch<[]>(`/user/${useUser().user.value.info.id}/list/community`, getComFetchOptions('get', true))

  if (data.value) {
    communityList.value = data.value

  }
  isCommunityListVisible.value = true;

}

function openChannel(community: any) {
  selectedGroup.value = community
  isCommunityListOpen.value = !isCommunityListOpen.value
  isChannelListOpen.value = !isChannelListOpen.value
  channels.value = community.channels
}

function backToCommunityList() {
  isCommunityListOpen.value = !isCommunityListOpen.value
  isChannelListOpen.value = !isChannelListOpen.value
}

function selectChannel(channel: any) {

  postingChannels.value = _.uniqBy([...postingChannels.value, {
    group: selectedGroup.value,
    channel: channel
  }], 'channel.id')

  isCommunityListVisible.value = false;
}

function deletePostingChannel(idx: number) {
  postingChannels.value.splice(idx, 1)

}

</script>

<style lang="scss" >
@use "sass:math";

.modal-post {


  .mp-category {
    width: 100%;
    display: inline-flex;
    padding: 20px;
    border-bottom: 0px;
    border-top: #e9e9e9 1px solid;



  }

  .mp-midi {
    .delete-video-btn {
      display: flex;
      justify-content: flex-end;
      font-size: 20px;
      color: #333;
      cursor: pointer;

      &:hover {
        color: #f97316;
      }
    }


    video {
      max-height: 315px;
    }

    .audio-wrapper {
      display: flex;
      align-items: center;
      border-radius: 5px;
      background: #f5f5f5;
      flex-direction: column;

      .btn-container {
        padding-bottom: 0px !important;
        width: 100%;
        padding-top: 0px !important;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: auto !important;

      }

      .delete-audio-btn {
        font-size: 20px;
        color: #333;
        cursor: pointer;
        display: flex;
        justify-content: flex-end;

        &:hover {
          color: #f97316;
        }
      }

      audio {
        width: 100%;
      }

      p {
        width: 100%;
        height: 30px;
        padding-left: 20px;
      }
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

.category-group {
  width: 100%;
  margin: 10px 10px 0px 0px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  background: #f5f5f5;
  border: none;
  cursor: pointer;

  &.group-btn {
    &.off {

      display: none !important;
    }
  }

}

.back-group-btn {
  .category-group {
    justify-content: flex-start;
    color: #0D0D0D;
  }

  .uil-arrow-circle-left {
    font-size: 20px;
    color: #f97316;
    display: flex;
  }
}

.channel-btn {
  &.off {
    display: none !important;
  }
}

.community-slide {
  width: 200px;


  .category-select-finish {
    max-width: 200px;
    height: 30px;
    justify-content: space-around;

    div {
      margin-left: 10px;

      span {
        text-overflow: ellipsis;
        max-width: 70px;
        overflow: hidden;
        white-space: nowrap;
        display: inline-block;
      }

      em {
        overflow: hidden;
        white-space: nowrap;
        display: inline-block;
      }
    }

    .cross-btn {
      cursor: pointer;

    }
  }
}


@media all and (max-width: 479px) {
  // .mp-category {
  //   .btn-line-small {
  //     span:nth-child(2) {
  //       display: none;
  //     }
  //   }

  // }
}

@media all and (min-width: 480px) and (max-width: 767px) {}

@media all and (min-width: 768px) and (max-width: 991px) {}

@media all and (min-width: 992px) and (max-width: 1199px) {}

@media all and (min-width: 1200px) {}
</style>
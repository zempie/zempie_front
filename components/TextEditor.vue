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
      <Tiptap @editorContent="getEditorContent" :postType='activeTab' :feed="feed" :key="activeTab" />

      <template v-if="activeTab === 'SNS'">
        <div v-if="snsAttachFiles.img?.length" class="mp-image" style="padding-bottom: 0px">
          <dd style="width: 100%;">
            <swiper :modules="[Pagination]" class="swiper-area" :slides-per-view="3" :space-between="10"
              :pagination="{ clickable: true }">
              <swiper-slide v-for="(img, idx) in snsAttachFiles.img" :key="idx"
                :style="`padding-bottom: 43px; background: url(${img.url}) center center / cover no-repeat; background-size:cover;`">
                <span @click="deleteImg(idx)"><i class="uil uil-times-circle"></i></span>
              </swiper-slide>
              <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
          </dd>
        </div>

        <div v-if="snsAttachFiles.video?.url" class="mp-midi">
          <span @click="deleteVideo" class="delete-video-btn"><i class="uis uis-times-circle"></i></span>
          <video style="width:100%;" :src="snsAttachFiles.video?.url" title="YouTube video player" frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen></video>
        </div>

        <div v-if="snsAttachFiles.audio?.length" class="mp-midi">
          <ul v-for="(audio, idx) in snsAttachFiles.audio" class="audio-wrapper">
            <div class="btn-container">
              <audio controls :src="audio.url"></audio>
              <span class="delete-audio-btn" @click="deleteAudio(idx)"><i class="uis uis-times-circle"></i></span>
            </div>
            <p> {{  audio.name || audio.file.name  }}</p>
          </ul>
        </div>
      </template>
      <ClientOnly>
        <div class="mp-category"
          :style="snsAttachFiles.img?.length ? 'border-top: #e9e9e9 1px solid; margin-top:10px; padding-top:10px;' : ''">
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
                <p style="margin: 0 auto;"> {{  com.name  }}</p>
              </button>
              <div :class="['channel-btn', isChannelListOpen ? 'on' : 'off']">
                <div class="back-group-btn" @click="backToCommunityList">
                  <button class="category-group">
                    <i class="uil uil-arrow-circle-left"></i>
                    {{  selectedGroup?.name  }}
                  </button>
                </div>
                <button class="category-group" v-for="channel in channels" @click="selectChannel(channel)">
                  {{  channel.title  }}
                </button>
              </div>
            </div>
            <div v-else>
              {{  t('noJoined.community')  }}
            </div>
          </el-popover>
          <swiper v-if="postingChannels.length" class="swiper-area" style="margin-left: 10px;" :space-between="10">
            <swiper-slide class="community-slide" v-for="(postedAt, index) in postingChannels" :key="index">
              <div class="category-select-finish">
                <div>
                  <span>{{  postedAt.group.name  }}</span> /
                  <em>{{  postedAt.channel.title  }}</em>
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
import _, { result } from 'lodash'
import { PropType } from 'vue';
import { IFeed } from '~~/types';
import { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/vue';

import { Editor } from "@tiptap/vue-3";
import { ElDropdown, ElMessageBox, ElDropdownItem, ElLoading, ElPopover, ElMessage, ElDialog } from "element-plus";

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

const snsAttachFiles = ref({
  img: null,
  video: null,
  audio: null
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


const imgArr = ref([])
const videoArr = ref([])
const audioArr = ref([])



const emit = defineEmits(['closeModal', 'refresh'])


const form = reactive({
  post_contents: '',
})

onMounted(() => {
  if (activeTab.value === 'SNS') {

    if (attachFileArr.value?.length) {
      snsAttachFiles.value = {
        img: attachFileArr.value[0]?.type === 'image' ? attachFileArr.value : [],
        video: attachFileArr.value[0]?.type === 'video' ? attachFileArr.value[0] : null,
        audio: attachFileArr.value[0]?.type === 'sound' ? attachFileArr.value : []
      }
    }
  }

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
  if (snsAttachFiles.value.img?.length || snsAttachFiles.value.audio?.length || snsAttachFiles.value.video ||
    form.post_contents?.length > 7

  ) {

    ElMessageBox.confirm(
      `${t('post.noSave.text1')}${t('post.noSave.text2')}`,
      'Warning',
      {
        confirmButtonText: 'Cancel',
        cancelButtonText: 'Yes',
        type: 'warning',
      }
    )
      .catch(() => {
        snsAttachFiles.value.img = null
        snsAttachFiles.value.audio = null
        snsAttachFiles.value.video = null
        form.post_contents = ''
        activeTab.value = type
        usePost().setType(type)

      })

  } else {
    activeTab.value = type
    usePost().setType(type)
  }

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
    text: 'uploading...',
    customClass: 'loading-spinner',
    background: 'rgba(0, 0, 0, 0.7)',
  })

  const dom = htmlToDomElem(form.post_contents)

  imgArr.value = [...dom.getElementsByClassName('attr-img')]
  videoArr.value = [...dom.getElementsByTagName('video')]
  audioArr.value = [...dom.getElementsByTagName('audio')]


  if (activeTab.value.toLocaleUpperCase() === 'BLOG') {
    const imgFiles = []
    const videoFiles = []
    const audioFiles = []
    let payloadFiles = []

    for (const img of imgArr.value) {
      if (img.src.substring(0, 4) === 'blob' || img.src.substring(0, 4) === 'data') {
        const formData = new FormData();

        await fetch(img.src)
          .then(async (result) => {
            formData.append(img.title, await result.blob())
          })

        const { data, error, pending } = await useFetch<{ result: [] }>('/community/att', getZempieFetchOptions('post', true, formData))
        if (data.value) {
          form.post_contents = form.post_contents.replace(img.src, data.value.result[0].url)
          imgFiles.push(...data.value.result)

        }
      }
      payload.post_contents = form.post_contents
      payloadFiles = [...payloadFiles, ...imgFiles];

    }


    for (const video of videoArr.value) {
      if (video.src.substring(0, 4) === 'blob' || video.src.substring(0, 4) === 'data') {
        const formData = new FormData();

        await fetch(video.src)
          .then(async (result) => {
            formData.append(video.title, await result.blob())
          })

        const { data, error, pending } = await useFetch<{ result: [] }>('/community/att', getZempieFetchOptions('post', true, formData))
        if (data.value) {
          form.post_contents = form.post_contents.replace(video.src, data.value.result[0].url)
          videoFiles.push(...data.value.result)


        }
      }
      payload.post_contents = form.post_contents
      payloadFiles = [...payloadFiles, ...videoFiles];


    }

    for (const audio of audioArr.value) {
      if (audio.src.substring(0, 4) === 'blob' || audio.src.substring(0, 4) === 'data') {
        const formData = new FormData();

        await fetch(audio.src)
          .then(async (result) => {
            formData.append(audio.title, await result.blob())
          })

        const { data, error, pending } = await useFetch<{ result: [] }>('/community/att', getZempieFetchOptions('post', true, formData))
        if (data.value) {
          form.post_contents = form.post_contents.replace(audio.src, data.value.result[0].url)
          audioFiles.push(...data.value.result)

        }
      }
      payload.post_contents = form.post_contents
      payloadFiles = [...payloadFiles, ...audioFiles];
    }

    payload['attatchment_files'] = payloadFiles

  } else {


    if (snsAttachFiles.value.img?.length || snsAttachFiles.value.audio?.length || snsAttachFiles.value?.video) {
      const formData = new FormData();

      if (snsAttachFiles.value.img) {
        for (const img of snsAttachFiles.value.img) {
          formData.append(img.name, img.file)
        }
      }

      if (snsAttachFiles.value.audio) {
        for (const audio of snsAttachFiles.value.audio) {
          formData.append(audio.name, audio.file)
        }
      }
      if (snsAttachFiles.value.video) {
        formData.append(snsAttachFiles.value.video.name, snsAttachFiles.value.video.file)
      }

      const { data, error, pending } = await useFetch<{ result: [] }>('/community/att', getZempieFetchOptions('post', true, formData))

      payload['attatchment_files'] = data.value.result;
    }
  }
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
    if (snsAttachFiles.value.video || snsAttachFiles.value.audio?.length) {
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



      if (activeTab.value.toUpperCase() === 'BLOG') {
        editor.value.chain().focus(null).setImage({ src: blobUrl, alt: file.name, title: file.name }).setHardBreak().setHardBreak().run();
      } else {
        if (snsAttachFiles.value.img) {
          snsAttachFiles.value.img.push({
            file: file,
            name: file.name,
            url: url,
          })
        } else {
          snsAttachFiles.value.img = [{
            file: file,
            name: file.name,
            url: url,
          }]
        }
      }
    };

    reader.readAsDataURL(file);
  }

  event.target.value = ''
}

function deleteImg(idx: number) {
  snsAttachFiles.value.img.splice(idx, 1)
}

function uploaVideoFile() {
  video.value.click()
}

function onSelectVideoFile(event: any) {
  if (activeTab.value.toUpperCase() === 'SNS') {
    if (snsAttachFiles.value.img?.length || snsAttachFiles.value.audio?.length) {
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



      if (activeTab.value === 'BLOG') {

        editor.value.chain().focus(null).setVideo({ src: blobUrl }).run();
      } else {
        if (snsAttachFiles.value.video) {
          snsAttachFiles.value.video = {
            file: file,
            name: file.name,
            url: url
          }
        } else {
          snsAttachFiles.value.video = {
            file: file,
            name: file.name,
            url: url,
          }
          console.log(snsAttachFiles.value)
        }
      }
    };

    reader.readAsDataURL(file);
  }
  console.log(snsAttachFiles.value)
  event.target.value = ''

}



function deleteVideo() {
  snsAttachFiles.value.video = null;
}


function uploadAudioFile() {
  if (activeTab.value.toUpperCase() === 'SNS') {
    if (snsAttachFiles.value.video || snsAttachFiles.value.img?.length) {
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

      if (activeTab.value === 'BLOG') {
        editor.value.chain().focus(null).setAudio({ src: blobUrl, title: file.name }).run();
      } else {


        if (snsAttachFiles.value.audio) {

          snsAttachFiles.value.audio.push({
            file: file,
            name: file.name,
            url: url
          })
        } else {
          snsAttachFiles.value.audio = [{
            file: file,
            name: file.name,
            url: url,
          }]
        }
      }
    };

    reader.readAsDataURL(file);
  }

  event.target.value = ''

}

function deleteAudio(idx: number) {
  snsAttachFiles.value.audio.splice(idx, 1)

}

async function onUpdatePost() {

  let attatchment_files: any = props.feed.attatchment_files ?? []
  let newImgArr = [];
  let newSoundArr = [];
  let newVideo = null;

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

  const formData = new FormData();

  const loading = ElLoading.service({
    lock: true,
    text: 'updating...',
    customClass: 'loading-spinner',
    background: 'rgba(0, 0, 0, 0.7)',
  })

  const dom = htmlToDomElem(form.post_contents)


  imgArr.value = [...dom.getElementsByClassName('attr-img')]
  videoArr.value = [...dom.getElementsByTagName('video')]
  audioArr.value = [...dom.getElementsByTagName('audio')]

  if (activeTab.value.toLocaleUpperCase() === 'BLOG') {
    const imgFiles = []
    const videoFiles = []
    const audioFiles = []

    if (imgArr.value.length) {
      for (const img of imgArr.value) {
        if (img.src.substring(0, 4) === 'blob' || img.src.substring(0, 4) === 'data') {
          const formData = new FormData();

          await fetch(img.src)
            .then(async (result) => {
              formData.append(img.title, await result.blob())
            })

          const { data, error, pending } = await useFetch<{ result: [] }>('/community/att', getZempieFetchOptions('post', true, formData))
          if (data.value) {
            form.post_contents = form.post_contents.replace(img.src, data.value.result[0].url)
            imgFiles.push(...data.value.result)

          }
        }
        payload.post_contents = form.post_contents
        attatchment_files = [...payload.attatchment_files, ...imgFiles]

      }
    } else {
      payload.post_contents = form.post_contents
      attatchment_files = []
    }



    if (videoArr.value.length) {

      for (const video of videoArr.value) {
        if (video.src.substring(0, 4) === 'blob' || video.src.substring(0, 4) === 'data') {
          const formData = new FormData();

          await fetch(video.src)
            .then(async (result) => {
              formData.append(video.title, await result.blob())
            })

          const { data, error, pending } = await useFetch<{ result: [] }>('/community/att', getZempieFetchOptions('post', true, formData))
          if (data.value) {
            form.post_contents = form.post_contents.replace(video.src, data.value.result[0].url)
            videoFiles.push(...data.value.result)

          }
        }
        payload.post_contents = form.post_contents
        attatchment_files = [...attatchment_files, ...videoFiles]
      }
    } else {
      payload.post_contents = form.post_contents
      attatchment_files = [...attatchment_files]
    }
    if (audioArr.value.length) {
      for (const audio of audioArr.value) {
        if (audio.src.substring(0, 4) === 'blob' || audio.src.substring(0, 4) === 'data') {
          const formData = new FormData();

          await fetch(audio.src)
            .then(async (result) => {
              formData.append(audio.title, await result.blob())
            })

          const { data, error, pending } = await useFetch<{ result: [] }>('/community/att', getZempieFetchOptions('post', true, formData))
          if (data.value) {
            form.post_contents = form.post_contents.replace(audio.src, data.value.result[0].url)
            audioFiles.push(...data.value.result)

          }
        }
        payload.post_contents = form.post_contents
        attatchment_files = [...attatchment_files, ...audioFiles]
      }
    } else {
      payload.post_contents = form.post_contents
      attatchment_files = [...attatchment_files]
    }

  } else {

    if (snsAttachFiles.value && snsAttachFiles.value[0]?.type === 'image') {
      attatchment_files = snsAttachFiles.value.img
    }


    newImgArr = attatchment_files?.filter((img, idx) => {
      // if (!img.size) {
      //   attatchment_files.splice(0, idx)
      // }
      return !img.size
    })

    if (snsAttachFiles.value && snsAttachFiles.value[0]?.type === 'sound') {
      attatchment_files = snsAttachFiles.value.audio
    }
    newSoundArr = attatchment_files?.filter((audio, idx) => {
      // if (!audio.size) {
      //   attatchment_files.splice(0, idx)
      // }
      return !audio.size
    })

    if (snsAttachFiles.value && snsAttachFiles.value[0]?.type === 'video') {

      attatchment_files = snsAttachFiles.value.video !== null ? snsAttachFiles.value.video : []
    }

    newVideo = snsAttachFiles.value.video;

    if (newImgArr?.length) {
      for (const img of newImgArr) {
        formData.append(img.name, img.file)
      }



      const { data, error, pending } = await useFetch<{ result: { priority: number, url: string, type: string, name: string, size: number }[] }>('/community/att', getZempieFetchOptions('post', true, formData))

      if (data.value) {
        const { result } = data.value;

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

    } else if (newSoundArr?.length) {
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

  }

  attatchment_files = attatchment_files.filter((file) => {
    return file.size
  })

  Array.isArray(attatchment_files) ? payload.attatchment_files = attatchment_files :
    payload.attatchment_files = JSON.parse(attatchment_files)

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

  loading.close()


}

function closeTextEditor() {
  snsAttachFiles.value.img = _.cloneDeep(initFiles)

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
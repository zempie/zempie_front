<template>
  <div class="modal-post">
    <ul class="mp-header">
      <li
        :class="activeTab === 'SNS' ? 'active' : ''"
        @click="postingType('SNS')"
      >
        <i class="uil uil-file-landscape"></i>
        SNS
      </li>
      <li
        :class="activeTab === 'BLOG' ? 'active' : ''"
        @click="postingType('BLOG')"
      >
        <i class="uil uil-files-landscapes"></i> Blog
      </li>
    </ul>
    <div>
      <Tiptap
        @editorContent="getEditorContent"
        :postType="activeTab"
        :feed="feed"
        :key="activeTab"
      />

      <template v-if="activeTab === 'SNS'">
        <div
          v-if="snsAttachFiles.img?.length"
          class="mp-image"
          style="padding-bottom: 0px"
        >
          <dd style="width: 100%">
            <swiper
              :modules="[Pagination]"
              class="swiper-area"
              :slides-per-view="3"
              :space-between="10"
              :pagination="{ clickable: true }"
            >
              <swiper-slide
                v-for="(img, idx) in snsAttachFiles.img"
                :key="idx"
                :style="`padding-bottom: 43px; background: url(${img.url}) center center / cover no-repeat; background-size:cover;`"
              >
                <span @click="deleteImg(idx)"
                  ><i class="uil uil-times-circle"></i
                ></span>
              </swiper-slide>
              <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
          </dd>
        </div>
        <div v-if="isVideoUploading" class="video-loading">
          <BeatLoader :color="'#ff6e17'" size="20px" />
        </div>
        <div
          v-else-if="!isVideoUploading && snsAttachFiles.video?.url"
          class="mp-midi"
        >
          <span @click="deleteVideo" class="delete-video-btn"
            ><i class="uis uis-times-circle"></i
          ></span>

          <video
            style="width: 100%"
            :src="snsAttachFiles.video?.url"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></video>
        </div>

        <div v-if="isAudioUploading" class="video-loading">
          <BeatLoader :color="'#ff6e17'" size="20px" />
        </div>

        <div
          v-if="!isAudioUploading && snsAttachFiles.audio?.length"
          class="mp-midi"
        >
          <ul
            v-for="(audio, idx) in snsAttachFiles.audio"
            class="audio-wrapper"
          >
            <div class="btn-container">
              <audio controls :src="audio.url"></audio>
              <span class="delete-audio-btn" @click="deleteAudio(idx)"
                ><i class="uis uis-times-circle"></i
              ></span>
            </div>
            <p>{{ audio.name || audio.file.name }}</p>
          </ul>
        </div>
      </template>
      <ClientOnly>
        <div
          class="mp-category"
          :style="
            snsAttachFiles.img?.length
              ? 'border-top: #e9e9e9 1px solid; margin-top:10px; padding-top:10px;'
              : ''
          "
        >
          <el-popover name="category" trigger="click">
            <template #reference>
              <button class="btn-line-small" style="width: 30%">
                <i class="uil uil-plus"></i>
                <template v-if="postingChannels.length >= 2">
                  <span>Add</span>
                </template>
                <template v-else>
                  <span>Add </span><span>community</span>
                </template>
              </button>
            </template>

            <div v-if="communityList.length" class="mpc-more-dropdown">
              <button
                class="category-group group-btn"
                @click="openChannel(com)"
                :class="isCommunityListOpen ? 'on' : 'off'"
                v-for="com in communityList"
              >
                <p style="margin: 0 auto">{{ com.name }}</p>
              </button>
              <div :class="['channel-btn', isChannelListOpen ? 'on' : 'off']">
                <div class="back-group-btn" @click="backToCommunityList">
                  <button class="category-group">
                    <i class="uil uil-arrow-circle-left"></i>
                    {{ selectedGroup?.name }}
                  </button>
                </div>
                <button
                  class="category-group"
                  v-for="channel in channels"
                  @click="selectChannel(channel)"
                >
                  {{ channel.title }}
                </button>
              </div>
            </div>
            <div v-else>
              {{ t('noJoined.community') }}
            </div>
          </el-popover>
          <swiper
            style="width: 100%; margin-left: 10px"
            v-if="postingChannels.length"
            class="swiper-area"
            :space-between="10"
            :slides-per-view="3"
          >
            <swiper-slide
              class="community-slide"
              v-for="(postedAt, index) in postingChannels"
              :key="index"
            >
              <div class="category-select-finish">
                <div>
                  <span>{{ postedAt.group.name }}</span> /
                  <em>{{ postedAt.channel.title }}</em>
                </div>
                <div class="cross-btn" @click="deletePostingChannel(index)">
                  <i class="uil uil-times"></i>
                </div>
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
              <input type="file" @change="onSelectImageFile" multiple
              accept=image/* ref="image" />
            </div>
          </div>
          <div style="width: 30px" @click="uploaVideoFile">
            <a><i class="uil uil-play-circle"></i></a>
            <div style="height: 0px; overflow: hidden">
              <input type="file" @change="onSelectVideoFile" accept=video/*
              ref="video" />
            </div>
          </div>
          <div style="width: 30px" @click="uploadAudioFile">
            <a><i class="uil uil-music"></i></a>
            <div style="height: 0px; overflow: hidden">
              <input
                type="file"
                @change="onSelectAudioFile"
                multiple
                accept=".mp3"
                ref="audio"
              />
            </div>
          </div>
        </dt>
        <dd>
          <button
            class="btn-default-samll w100 cancel-btn"
            @click="closeTextEditor"
          >
            Cancel
          </button>
          <button
            v-if="isEdit"
            class="btn-default-samll w100"
            @click="onUpdatePost"
          >
            Update
          </button>
          <button v-else class="btn-default-samll w100" @click="onSubmit">
            Post
          </button>
        </dd>
      </dl>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash'
import BeatLoader from 'vue-spinner/src/BeatLoader.vue'
import { PropType } from 'vue'
import { IFeed } from '~~/types'
import { Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'

import { Editor } from '@tiptap/vue-3'
import {
  ElDropdown,
  ElMessageBox,
  ElLoading,
  ElPopover,
  ElMessage,
  ElDialog,
} from 'element-plus'

import { useI18n } from 'vue-i18n'
import { htmlToDomElem } from '~~/scripts/utils'

const { t, locale } = useI18n()

const route = useRoute()
const popover = ref()

const isVideoUploading = ref(false)
const isAudioUploading = ref(false)

const props = defineProps({
  type: String,
  isEdit: {
    type: Boolean,
    default: false,
  },
  feed: Object as PropType<IFeed>,
  channelInfo: Object,
})

const initFiles = _.cloneDeep(props.feed?.attatchment_files)

const attachFileArr = computed(() => {
  if (props.feed) {
    return Array.isArray(props.feed?.attatchment_files)
      ? props.feed?.attatchment_files
      : JSON.parse(props.feed?.attatchment_files as string)
  } else {
    return []
  }
})

const snsAttachFiles = ref({
  img: null,
  video: null,
  audio: null,
})

const activeTab = ref(props.feed?.post_type || 'SNS')
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

onMounted(async () => {
  await communityFetch()
  if (props.isEdit) {
    if (props.feed?.posted_at?.community) {
      for (const community of props.feed.posted_at.community) {
        postingChannels.value.push({
          group: community.community,
          channel: community.channel,
        })
      }
    }
    if (activeTab.value === 'SNS') {
      if (attachFileArr.value?.length) {
        snsAttachFiles.value = {
          img:
            attachFileArr.value[0]?.type === 'image' ? attachFileArr.value : [],
          video:
            attachFileArr.value[0]?.type === 'video'
              ? attachFileArr.value[0]
              : null,
          audio:
            attachFileArr.value[0]?.type === 'sound' ? attachFileArr.value : [],
        }
      }
    }
    // loading.close()
  }

  if (props.type === 'community') {
    if (props.channelInfo) {
      postingChannels.value = [
        {
          group: useCommunity().community.value.info,
          channel: props.channelInfo,
        },
      ]
    } else {
      postingChannels.value = [
        {
          group: useCommunity().community.value.info,
          channel: useCommunity().community.value.info.channels[0],
        },
      ]
    }
  }
})

function postingType(type: string) {
  if (
    snsAttachFiles.value.img?.length ||
    snsAttachFiles.value.audio?.length ||
    snsAttachFiles.value.video ||
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
    ).catch(() => {
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
        channel: element.channel,
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

  imgArr.value = [...dom.getElementsByTagName('img')]
  videoArr.value = [...dom.getElementsByTagName('video')]
  audioArr.value = [...dom.getElementsByTagName('audio')]

  if (activeTab.value.toLocaleUpperCase() === 'BLOG') {
    const imgFiles = []
    const videoFiles = []
    const audioFiles = []
    let payloadFiles = []

    for (const img of imgArr.value) {
      if (
        img.src.substring(0, 4) === 'blob' ||
        img.src.substring(0, 4) === 'data'
      ) {
        const formData = new FormData()

        await fetch(img.src).then(async (result) => {
          formData.append(img.title, await result.blob())
        })

        const { data, error, pending } = await useFetch<{ result: [] }>(
          '/community/att',
          getZempieFetchOptions('post', true, formData)
        )
        if (data.value) {
          form.post_contents = form.post_contents.replace(
            img.src,
            data.value.result[0].url
          )
          imgFiles.push(...data.value.result)
        }
      }
    }
    payload.post_contents = form.post_contents
    payloadFiles = [...payloadFiles, ...imgFiles]
    for (const video of videoArr.value) {
      if (
        video.src.substring(0, 4) === 'blob' ||
        video.src.substring(0, 4) === 'data'
      ) {
        const formData = new FormData()

        await fetch(video.src).then(async (result) => {
          formData.append(video.title, await result.blob())
        })

        const { data, error, pending } = await useFetch<{ result: [] }>(
          '/community/att',
          getZempieFetchOptions('post', true, formData)
        )
        if (data.value) {
          form.post_contents = form.post_contents.replace(
            video.src,
            data.value.result[0].url
          )
          videoFiles.push(...data.value.result)
        }
      }
    }
    payload.post_contents = form.post_contents
    payloadFiles = [...payloadFiles, ...videoFiles]
    for (const audio of audioArr.value) {
      if (
        audio.src.substring(0, 4) === 'blob' ||
        audio.src.substring(0, 4) === 'data'
      ) {
        const formData = new FormData()

        await fetch(audio.src).then(async (result) => {
          formData.append(audio.title, await result.blob())
        })

        const { data, error, pending } = await useFetch<{ result: [] }>(
          '/community/att',
          getZempieFetchOptions('post', true, formData)
        )
        if (data.value) {
          form.post_contents = form.post_contents.replace(
            audio.src,
            data.value.result[0].url
          )
          audioFiles.push(...data.value.result)
        }
      }
    }
    payload.post_contents = form.post_contents
    payloadFiles = [...payloadFiles, ...audioFiles]
    payload['attatchment_files'] = payloadFiles
  } else {
    if (
      snsAttachFiles.value.img?.length ||
      snsAttachFiles.value.audio?.length ||
      snsAttachFiles.value?.video
    ) {
      const formData = new FormData()

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
        formData.append(
          snsAttachFiles.value.video.name,
          snsAttachFiles.value.video.file
        )
      }

      const { data, error, pending } = await useFetch<{ result: [] }>(
        '/community/att',
        getZempieFetchOptions('post', true, formData)
      )

      payload['attatchment_files'] = data.value.result
    }
  }
  switch (props.type) {
    case 'community':
      break
    case 'game':
      payload['game_id'] = useGame().game.value.info.id
      break
  }

  const { error: uploadError } = await post.upload(payload)

  if (!uploadError.value) {
    emit('closeModal')
    emit('refresh')
    ElMessage({
      message: t('posting.done'),
      type: 'success',
    })
  }
  loading.close()
}

function getEditorContent(content: Editor) {
  editor.value = content
  form.post_contents = content.getHTML()
}

function uploadImageFile() {
  if (activeTab.value.toUpperCase() === 'SNS') {
    if (snsAttachFiles.value.video || snsAttachFiles.value.audio?.length) {
      ElMessage({
        message: t('post.fileType.err.text1'),
        type: 'warning',
      })
      return
    }
  }
  image.value.click()
}

function onSelectImageFile(event: any) {
  const files = event.target.files

  for (const file of files) {
    const reader = new FileReader()

    reader.onload = async (e) => {
      const url = e.target!.result as any
      const result = await fetch(url)
      const blob = await result.blob()
      const blobUrl = URL.createObjectURL(blob)

      if (activeTab.value.toUpperCase() === 'BLOG') {
        editor.value
          .chain()
          .focus(null)
          .setImage({ src: blobUrl, alt: file.name, title: file.name })
          .setHardBreak()
          .setHardBreak()
          .run()
      } else {
        if (snsAttachFiles.value.img) {
          snsAttachFiles.value.img.push({
            file: file,
            name: file.name,
            url: url,
          })
        } else {
          snsAttachFiles.value.img = [
            {
              file: file,
              name: file.name,
              url: url,
            },
          ]
        }
      }
    }

    reader.readAsDataURL(file)
  }

  event.target.value = ''
}

function deleteImg(idx: number) {
  snsAttachFiles.value.img.splice(idx, 1)
}

function uploaVideoFile() {
  if (activeTab.value.toUpperCase() === 'SNS') {
    if (
      snsAttachFiles.value.img?.length ||
      snsAttachFiles.value.audio?.length
    ) {
      ElMessage({
        message: t('post.fileType.err.text1'),
        type: 'warning',
      })
      return
    }
  }
  video.value.click()
}

function onSelectVideoFile(event: any) {
  isVideoUploading.value = true

  const files = event.target.files

  for (const file of files) {
    const reader = new FileReader()

    reader.onload = async (e) => {
      const url = e.target!.result as any
      const result = await fetch(url)
      const blob = await result.blob()
      const blobUrl = URL.createObjectURL(blob)

      if (activeTab.value === 'BLOG') {
        editor.value.chain().focus(null).setVideo({ src: blobUrl }).run()
      } else {
        if (snsAttachFiles.value.video) {
          snsAttachFiles.value.video = {
            file: file,
            name: file.name,
            url: url,
          }
        } else {
          snsAttachFiles.value.video = {
            file: file,
            name: file.name,
            url: url,
          }
        }
      }
      isVideoUploading.value = false
    }
    reader.readAsDataURL(file)
  }
  event.target.value = ''
}

function deleteVideo() {
  snsAttachFiles.value.video = null
}

function uploadAudioFile() {
  if (activeTab.value.toUpperCase() === 'SNS') {
    if (snsAttachFiles.value.video || snsAttachFiles.value.img?.length) {
      ElMessage({
        message: t('post.fileType.err.text1'),
        type: 'warning',
      })
      return
    }
  }
  audio.value.click()
}

function onSelectAudioFile(event: any) {
  isAudioUploading.value = true
  const files = event.target.files

  for (const file of files) {
    const reader = new FileReader()

    reader.onload = async (e) => {
      const url = e.target!.result as any
      const result = await fetch(url)
      const blob = await result.blob()
      const blobUrl = URL.createObjectURL(blob)

      if (activeTab.value === 'BLOG') {
        editor.value
          .chain()
          .focus(null)
          .setAudio({ src: blobUrl, title: file.name })
          .run()
      } else {
        if (snsAttachFiles.value.audio) {
          snsAttachFiles.value.audio.push({
            file: file,
            name: file.name,
            url: url,
          })
        } else {
          snsAttachFiles.value.audio = [
            {
              file: file,
              name: file.name,
              url: url,
            },
          ]
        }
      }
      isAudioUploading.value = false
    }

    reader.readAsDataURL(file)
  }

  event.target.value = ''
}

function deleteAudio(idx: number) {
  snsAttachFiles.value.audio.splice(idx, 1)
}

async function onUpdatePost() {
  let attatchment_files: any = props.feed.attatchment_files
    ? Array.isArray(props.feed.attatchment_files)
      ? props.feed.attatchment_files
      : JSON.parse(props.feed.attatchment_files)
    : []

  const attachedFile = []
  const payload = {
    post_id: props.feed.id,
    post_state: activeTab.value,
    attatchment_files: attatchment_files,
    post_contents: form.post_contents,
    // visibility: this.isPrivate ? "PRIVATE" : "PUBLIC",
    hashtags: [],
    // game_id:  this.$store.getters.currPage?.game_id,
    channel_id: useUser().user.value.info.channel_id,
    community: [],
    // portfolio_ids: [""],
    // scheduled_for: null
  }

  if (postingChannels.value.length) {
    for (const element of postingChannels.value) {
      payload.community.push({
        id: element.group.id,
        community: element.group,
        channel_id: element.channel.id,
        channel: element.channel,
      })
    }
  }

  const dom = htmlToDomElem(form.post_contents)

  imgArr.value = [...dom.getElementsByTagName('img')]
  videoArr.value = [...dom.getElementsByTagName('video')]
  audioArr.value = [...dom.getElementsByTagName('audio')]

  const loading = ElLoading.service({
    lock: true,
    text: 'updating...',
    customClass: 'loading-spinner',
    background: 'rgba(0, 0, 0, 0.7)',
  })

  switch (activeTab.value.toLocaleUpperCase()) {
    case 'BLOG':
      const imgFiles = []
      const videoFiles = []
      const audioFiles = []
      //블로그 수정 시 이미지가 있는 경우
      for (const img of imgArr.value) {
        //s3 업로드가 필요한 경우
        if (img.src.search('blob:') !== -1 || img.src.search('data:') !== -1) {
          const formData = new FormData()
          await fetch(img.src).then(async (result) => {
            formData.append(img.title, await result.blob())
          })
          const { data, error, pending } = await useFetch<any>(
            '/community/att',
            getZempieFetchOptions('post', true, formData)
          )
          if (data.value) {
            form.post_contents = form.post_contents.replace(
              img.src,
              data.value.result[0].url
            )
            imgFiles.push(...data.value.result)
          }
        }
        //필요없는 경우
        else {
          //기존 파일에서 찾아서 push
          const file = attatchment_files.find((file) => {
            return file.url === img.src
          })
          imgFiles.push(file)
        }
      }
      attachedFile.push(...imgFiles)

      //이미지 로직과 동일
      for (const video of videoArr.value) {
        if (
          video.src.search('blob:') !== -1 ||
          video.src.search('data:') !== -1
        ) {
          const formData = new FormData()
          await fetch(video.src).then(async (result) => {
            formData.append(video.title, await result.blob())
          })
          const { data, error, pending } = await useFetch<any>(
            '/community/att',
            getZempieFetchOptions('post', true, formData)
          )
          if (data.value) {
            form.post_contents = form.post_contents.replace(
              video.src,
              data.value.result[0].url
            )
            videoFiles.push(...data.value.result)
          }
        } else {
          //기존 파일에서 찾아서 push
          const file = attatchment_files.find((file) => {
            return file.url === video.src
          })
          videoFiles.push(file)
        }
      }

      attachedFile.push(...videoFiles)

      //이미지 로직과 동일
      for (const audio of audioArr.value) {
        if (
          audio.src.search('blob:') !== -1 ||
          audio.src.search('data:') !== -1
        ) {
          //블로그 수정 시 이미지가 있는 경우
          const formData = new FormData()
          await fetch(audio.src).then(async (result) => {
            formData.append(audio.title, await result.blob())
          })
          const { data, error, pending } = await useFetch<any>(
            '/community/att',
            getZempieFetchOptions('post', true, formData)
          )
          if (data.value) {
            form.post_contents = form.post_contents.replace(
              audio.src,
              data.value.result[0].url
            )
            audioFiles.push(...data.value.result)
          } else {
            //기존 파일에서 찾아서 push
            const file = attatchment_files.find((file) => {
              return file.url === audio.src
            })
            audioFiles.push(file)
          }
        }
      }
      attachedFile.push(...audioFiles)

      break

    case 'SNS':
      const formData = new FormData()

      if (snsAttachFiles.value.img?.length > 0) {
        for (const img of snsAttachFiles.value.img) {
          //이미지 파일 중 s3 업로드가 필요한 파일 formdata append
          if (
            img.url.search('blob:') !== -1 ||
            img.url.search('data:') !== -1
          ) {
            formData.append(img.name, img.file)
          } else {
            attachedFile.push(img)
          }
        }
        if (!!formData.entries().next().value) {
          const { data, error, pending } = await useFetch<{
            result: {
              priority: number
              url: string
              type: string
              name: string
              size: number
            }[]
          }>('/community/att', getZempieFetchOptions('post', true, formData))

          if (data.value) {
            const { result } = data.value

            for (const data of result) {
              attachedFile.push({
                priority: data.priority,
                url: data.url,
                type: data.type,
                name: data.name,
                size: data.size,
              })
            }
          }
        }
      } else if (snsAttachFiles.value.audio?.length > 0) {
        for (const sound of snsAttachFiles.value.audio) {
          if (
            sound.url.search('blob:') !== -1 ||
            sound.url.search('data:') !== -1
          ) {
            formData.append(sound.name, sound.file)
          } else {
            attachedFile.push(sound)
          }
        }
        if (!!formData.entries().next().value) {
          const { data, error, pending } = await useFetch<{
            result: {
              priority: number
              url: string
              type: string
              name: string
              size: number
            }[]
          }>('/community/att', getZempieFetchOptions('post', true, formData))

          if (data.value) {
            const { result } = data.value
            for (const data of result) {
              attachedFile.push({
                priority: data.priority,
                url: data.url,
                type: data.type,
                name: data.name,
                size: data.size,
              })
            }
          }
        }
      } else if (snsAttachFiles.value.video) {
        if (
          snsAttachFiles.value.video.url.search('blob:') !== -1 ||
          snsAttachFiles.value.video.url.search('data:') !== -1
        ) {
          formData.append(
            snsAttachFiles.value.video.name,
            snsAttachFiles.value.video.file
          )

          const { data, error, pending } = await useFetch<{
            result: {
              priority: number
              url: string
              type: string
              name: string
              size: number
            }[]
          }>('/community/att', getZempieFetchOptions('post', true, formData))

          if (data.value) {
            const { result } = data.value
            for (const data of result) {
              attachedFile.push({
                priority: data.priority,
                url: data.url,
                type: data.type,
                name: data.name,
                size: data.size,
              })
            }
          }
        } else {
          attachedFile.push(snsAttachFiles.value.video)
        }
      }
      if (snsAttachFiles.value.audio?.length) {
      } else if (snsAttachFiles.value.video) {
      }
      break
    default:
      break
  }

  Array.isArray(attachedFile) ? attachedFile : JSON.parse(attatchment_files)

  attachedFile?.filter((file) => {
    return file.size
  })

  payload.attatchment_files = attachedFile

  const { data, error, pending } = await useFetch(
    `/post/${props.feed.id}`,
    getComFetchOptions('put', true, payload)
  )

  if (!error.value) {
    emit('closeModal')
    emit('refresh')
    ElMessage({
      message: t('posting.edit.done'),
      type: 'success',
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
  const { data, error, pending } = await useFetch<[]>(
    `/user/${useUser().user.value.info.id}/list/community`,
    getComFetchOptions('get', true)
  )

  if (data.value) {
    communityList.value = data.value
  }
  isCommunityListVisible.value = true
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

async function selectChannel(channel: any) {
  postingChannels.value = _.uniqBy(
    [
      ...postingChannels.value,
      {
        group: selectedGroup.value,
        channel: channel,
      },
    ],
    'channel.id'
  )

  isCommunityListVisible.value = false
  isCommunityListOpen.value = !isCommunityListOpen.value
  isChannelListOpen.value = !isChannelListOpen.value
}

function deletePostingChannel(idx: number) {
  postingChannels.value.splice(idx, 1)
}
</script>

<style lang="scss">
@use 'sass:math';

.modal-post {
  .mp-category {
    width: 100%;
    display: inline-flex;
    padding: 20px;
    border-bottom: 0px;
    border-top: #e9e9e9 1px solid;
  }

  .video-loading {
    height: 150px;
    background-color: #ededed;
    margin: 20px;
    border-radius: 10px;
    div {
      display: flex;
      height: 100%;
      align-items: center;
      justify-content: center;
      .v-clip {
        height: 50px !important;
        width: 50px !important;
      }
    }
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
    color: #0d0d0d;
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
  max-width: 200px;

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
  .mp-category {
    .btn-line-small {
      span:nth-child(3) {
        display: none;
      }
    }
  }
}

@media all and (min-width: 480px) and (max-width: 767px) {
}

@media all and (min-width: 768px) and (max-width: 991px) {
}

@media all and (min-width: 992px) and (max-width: 1199px) {
}

@media all and (min-width: 1200px) {
}
</style>

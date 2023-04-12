<template>
  <div class="modal-post">
    <ul class="mp-header">
      <li v-if="isFullScreen" @click="closeTextEditor" style="width: 50px">
        <i class="uil uil-angle-left-b"></i>
      </li>
      <li class="title">
        {{ $t('new.post') }}
      </li>
      <li class="close-btn" @click="closeTextEditor">
        <span class="material-symbols-outlined">
          close
        </span>
      </li>
    </ul>
    <div>
      <Tiptap @editorContent="getEditorContent" @send-tag-info="getTagInfo" :postType="activeTab" :feed="feed"
        :key="activeTab" ref="tiptapRef" />

      <template v-if="activeTab === 'SNS'">
        <div v-if="snsAttachFiles.img?.length" class="mp-image" style="padding-bottom: 0px">
          <dd style="width: 100%">

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
        <div v-if="isVideoUploading" class="video-loading">
          <BeatLoader :color="'#ff6e17'" size="20px" />
        </div>
        <div v-else-if="!isVideoUploading && snsAttachFiles.video?.url" class="mp-midi">
          <span @click="deleteVideo" class="delete-video-btn"><i class="uis uis-times-circle"></i></span>

          <video style="width: 100%" :src="snsAttachFiles.video?.url" title="YouTube video player" frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen></video>
        </div>
        <div v-if="isAudioUploading" class="video-loading">
          <BeatLoader :color="'#ff6e17'" size="20px" />
        </div>

        <div v-if="!isAudioUploading && snsAttachFiles.audio?.length" class="mp-midi">
          <ul v-for="(audio, idx) in snsAttachFiles.audio" class="audio-wrapper">
            <div class="btn-container">
              <audio controls :src="audio.url"></audio>
              <span class="delete-audio-btn" @click="deleteAudio(idx)"><i class="uis uis-times-circle"></i></span>
            </div>
            <p>{{ audio.name || audio.file.name }}</p>
          </ul>
        </div>
      </template>
      <ClientOnly>
        <el-cascader class="mp-category" id="cascader" :props="props" v-model="selectedGroup"
          placeholder="Select cagetory" :options="categoryList" :popper-class="'categories'" />
      </ClientOnly>

      <dl class="mp-type">
        <dt>
          <div style="width: 30px" @click="uploadImageFile">
            <a><i class="uil uil-image pointer"></i></a>
            <div style="height: 0px; overflow: hidden">
              <input type="file" @change="onSelectImageFile" multiple id="image-selector" accept=image/* ref="image" />
            </div>
          </div>
          <div style="width: 30px" @click="uploaVideoFile">
            <a><i class="uil uil-play-circle pointer"></i></a>
            <div style="height: 0px; overflow: hidden">
              <input type="file" @change="onSelectVideoFile" accept=video/* ref="video" />
            </div>
          </div>
          <div style="width: 30px" @click="uploadAudioFile">
            <a><i class="uil uil-music pointer"></i></a>
            <div style="height: 0px; overflow: hidden">
              <input type="file" @change="onSelectAudioFile" multiple accept=".mp3" ref="audio" />
            </div>
          </div>
        </dt>
        <!--
           1분마다 자동 저장
         -->
        <Transition name="component-fade" mode="out-in">
          <small class="auto-save" v-if="showSavedTime" style="color: #999">{{ t('autosave') }} <span> {{
            savedTime
          }}</span></small>
        </Transition>
        <dd>
          <button v-if="draftList.length > 0" class="btn-line-small w100 mr10" id="loadPostBtn" @click="onLoadPost">
            Load
          </button>
          <button class="btn-line-small w100 mr10" id="draftPostBtn" @click="saveDraftCloseModal()">
            Draft
          </button>
          <!-- <button v-if="!isFullScreen" class="btn-default-samll w100 cancel-btn" id="cancelPostBtn"
            @click="closeTextEditor">
            Cancel
          </button> -->

          <button v-if="isEdit" class="btn-default-samll w100" id="updatePostBtn" @click="onUpdatePost">
            Update
          </button>
          <button v-else id="submitPostBtn" class="btn-default-samll w100" @click="onSubmit">
            Post
          </button>
        </dd>
      </dl>
    </div>

    <el-dialog v-model="showDraftList" append-to-body class="modal-area-type" width="380px">
      <div class="modal-alert">
        <dl class="ma-header">
          <dt>{{ t('draft') }}</dt>
          <dd>
            <button @click="showDraftList = false">
              <i class="uil uil-times"></i>
            </button>
          </dd>
        </dl>
        <div class="ma-content">
          <ul>
            <li v-for="(draft, index) in draftList" class="draft" @click="selectDraft(draft, index)">
              <div>
                <p>
                  {{ getFirstPostContent(draft.post_contents) }}
                </p>
                <small>{{
                  dayjs(draft.time).format('YYYY.MM.DD HH:mm')
                }}</small>
              </div>
              <div>
                <i @click.stop="deleteDraft(draft, index)" class="uil uil-trash-alt"></i>
              </div>
            </li>

            <li v-if="draftList.length === 0" style="align-items: center">
              <p>{{ $t('no.draft.data') }}</p>
            </li>
          </ul>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import _ from 'lodash'
import BeatLoader from 'vue-spinner/src/BeatLoader.vue'
import { IComChannel, ICommunity, IFeed, IGame } from '~~/types'
import { Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import dayjs from 'dayjs'
import { Editor } from '@tiptap/vue-3'
import {
  ElMessageBox,
  ElLoading,
  ElMessage,
  ElDialog,
  ElCascader
} from 'element-plus'

import { useI18n } from 'vue-i18n'
import { htmlToDomElem, stringToDomElem, isImageUrl } from '~~/scripts/utils'
import { fileUpload } from '~~/scripts/fileManager'

interface IDraft {
  time: number
  key: string
  post_contents: string
  post_type: string
}

const { t, locale } = useI18n()
const isVideoUploading = ref(false)
const isAudioUploading = ref(false)

const emit = defineEmits(['closeModal', 'refresh'])

const props = defineProps({
  type: String,
  isEdit: {
    type: Boolean,
    default: false,
  },
  feed: Object as PropType<IFeed>,
  channelInfo: Object,
  isFullScreen: Boolean,
  multiple: {
    type: Boolean,
    default: true,
  },

})
console.log(props.feed)

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

const tiptapRef = ref()
const activeTab = ref(props.feed?.post_type || 'SNS')
const video = ref<HTMLElement>()
const image = ref<HTMLElement>()
const audio = ref<HTMLElement>()

const editor = ref<Editor>()

const categoryList = ref([])
const selectedGroup = ref([])
const postingChannels = ref([])
const isCommunityListVisible = ref(false)

const imgArr = ref([])
const videoArr = ref([])
const audioArr = ref([])
const metaTagInfo = ref()

const form = reactive({
  post_contents: '',
})


//임시저장
const MAX_LOCAL_SAVE = 3
const showDraftList = ref(false)
const draftList = ref([])

//자동저장
const interval = ref()
const savedTime = ref()
const showSavedTime = ref()
const textInterval = ref()
const prevText = ref()
const saveId = ref(Date.now())

const gameInfo = computed(() => useGame().game.value.info)
const communityInfo = computed(() => useCommunity().community.value.info)

await communityFetch()

onBeforeMount(() => {
  getDraftList()
  autoSave()

  //유저가 직접 저장하지 않은 경우
  if (draftList.value[0]?.save_type === 'cancel') {
    ElMessageBox.confirm(`${t('ask.load.draft.post')}`, {
      confirmButtonText: 'YES',
      cancelButtonText: 'Cancel',
      type: 'info',
    })
      .then(() => {
        insertContet(draftList.value[0])
      })
      .catch(() => { })
      .finally(() => {
        localStorage.removeItem(draftList.value[0].key)
        draftList.value.splice(0, 1)
      })
  }
})

onMounted(async () => {

  colorLog('text editor', 'pink')
  //새로고침 시 알람
  window.addEventListener('beforeunload', refreshPage)

  if (gameInfo.value) {
    //방문한 페이지가 게임페이지인 경우 해당 게임찾아서 리턴
    const game = categoryList.value.find((elem) => {
      if (elem.value.type === 'game') {
        return elem.value.game.id === gameInfo.value.id
      }
    })
    if (game) {
      selectedGroup.value = [
        ...selectedGroup.value,
        {
          type: 'game',
          game: game.value.game,
        }
      ]
    }
  }


  if (communityInfo.value) {

    //general 채널 디폴트 카테고리로 설정
    const generalChannel = communityInfo.value.channels.find(channel => {
      return channel.title === 'general'
    })


    if (community) {
      selectedGroup.value = [
        ...selectedGroup.value,
        [{
          type: 'community',
          community: {
            id: communityInfo.value.id,
            is_certificated: communityInfo.value.is_certificated,
            name: communityInfo.value.name,
            profile_img: communityInfo.value.profile_img,
            url: communityInfo.value.url
          }
        }, {
          type: 'channel',
          channel: generalChannel
        }]
      ]
    }
  }

  const postCommunities = props.feed?.posted_at?.community || props.feed?.posted_at[0].community

  //기존 카테고리 추가
  if (props.isEdit) {
    if (postCommunities) {
      for (const community of postCommunities) {
        const index = selectedGroup.value.findIndex((elem) => {
          if (elem.type !== 'game') {
            const [com, chan] = elem
            return chan.channel.id === community.channel.id
          }
        })
        if (index === -1) {
          selectedGroup.value = [
            ...selectedGroup.value,
            [{
              type: "community",
              community: community.community || community.group
            },
            {
              type: "channel",
              channel: community.channel
            }]
          ]
        } else {
          selectedGroup.value = [
            ...selectedGroup.value]
        }


      }
    }
    const postGame = props.feed?.posted_at?.game || props.feed?.posted_at[0].game


    if (postGame) {
      for (const game of postGame) {
        const index = selectedGroup.value
          .findIndex((elem: { type: string, game: IGame }) => {
            return elem?.game?.id === game.id
          })

        if (index === -1) {
          selectedGroup.value = [
            ...selectedGroup.value,
            {
              type: "game",
              game: game.game
            }
          ]
        }
      }
    }


    if (activeTab.value === 'SNS') {
      const attFileFilter = (type: string) => attachFileArr.value?.filter((file: { type: string, name: string, priority: number, size: number, url: string }) => file.type === type)

      snsAttachFiles.value = {
        img: attFileFilter('image'),
        video: attachFileArr.value?.find((file: { type: string, name: string, priority: number, size: number, url: string }) => file.type === 'video') || null,
        audio: attFileFilter('sounc'),
      }
    }
    metaTagInfo.value = props.feed.metadata

  }



  if (props.type === 'community') {
    if (props.channelInfo) {
      postingChannels.value = [
        {
          group: communityInfo.value,
          channel: props.channelInfo,
        },
      ]

    } else {
      postingChannels.value = [
        {
          group: communityInfo.value,
          channel: communityInfo.value.channels[0],
        },
      ]
    }
  }

})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', refreshPage)
  colorLog('beforeunload END', 'violet')
  clearInterval(interval.value)
  clearTimeout(textInterval.value)
})

function getTagInfo(info) {
  console.log('info', info)
  metaTagInfo.value = info
}

function refreshPage(event: { preventDefault: () => void; returnValue: string }) {
  if (editor.value.isEmpty) return
  event.preventDefault()

  event.returnValue = `${t('leave.router.warning')}` //안뜨는 거 같음
}

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


  //태그 인포 넘기고

  const payload = {
    post_contents: form.post_contents,
    post_state: activeTab.value,
    hashtags: [],
    community: [],
    game: [],
    metadata: metaTagInfo.value
  }


  if (selectedGroup.value) {
    const pl = setCategoryPayload(payload)
    payload.community = pl.community;
    payload.game = pl.game
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

      if (!isImageUrl(img.src)) {
        // const result = await fetch(img.src)
        // const blob = await result.blob()
        // const blobUrl = URL.createObjectURL(blob)
        // const isImage = blob.type.startsWith('image')
        // if (isImage) {
        //   const formData = new FormData()
        //   formData.append(img.title, blob)
        //   const response = await useCustomFetch<{ result: { name: string, priority: number, size: number, type: string, url: string }[] }>('community/att', getZempieFetchOptions('post', true, formData))

        //   if (response) {
        //     const { result } = response
        //     const [imgObj] = result
        //     form.post_contents = form.post_contents.replace(
        //       img.src,
        //       imgObj.url
        //     )
        //   }

        // }
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

        const { data, error, pending } = await useCustomAsyncFetch<{ result: [] }>(
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

        const { data, error, pending } = await useCustomAsyncFetch<{ result: [] }>(
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

      const { data, error, pending } = await useCustomAsyncFetch<{ result: [] }>(
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

  const { error: uploadError } = await useCustomAsyncFetch(
    '/post',
    getComFetchOptions('post', true, payload)
  )

  // post.upload(payload)

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

function onSelectImageFile(event: Event) {
  const files = (event.target as HTMLInputElement).files

  for (const file of files) {
    if (file.type === 'image/svg+xml') {
      alert('svg는 지원하지 않는 확장자 형식입니다')
      continue
    }
    const reader = new FileReader()

    reader.onload = async (e) => {
      console.log('reader', activeTab.value.toUpperCase())

      const url = e.target!.result as string

      if (activeTab.value.toUpperCase() === 'BLOG') {
        const response = await fileUpload(file)

        if (response) {
          const { url, name, priority } = response.result[0]

          editor.value
            .chain()
            .focus(null)
            .setImage({ src: url, alt: file.name, title: file.name })
            .setHardBreak()
            .setHardBreak()
            .run()
        }
      } else {
        snsAttachFiles.value.img = [...(snsAttachFiles.value.img || []),
        { file, name: file.name, url }
        ]
      }
    }

    reader.readAsDataURL(file)
  }

  (event.target as HTMLInputElement).value = ''
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
        snsAttachFiles.value.video = {
          file: file,
          name: file.name,
          url: url,
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

  // 테스트 서버 실서버 디비 환경 차이
  let attatchment_files = props.feed.attatchment_files
    && (Array.isArray(props.feed.attatchment_files)
      ? props.feed.attatchment_files
      : JSON.parse(props.feed.attatchment_files))



  console.log(metaTagInfo.value)

  const attachedFile = []
  const payload = {
    post_id: props.feed.id,
    post_state: activeTab.value,
    attatchment_files: attatchment_files,
    post_contents: form.post_contents,
    hashtags: [],
    channel_id: useUser().user.value.info.channel_id,
    community: [],
    game: [],
    metadata: metaTagInfo.value

  }

  if (selectedGroup.value) {
    const pl = setCategoryPayload(payload)

    console.log('pl', pl)
    payload.community = pl.community;
    payload.game = pl.game
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
          const { data, error, pending } = await useCustomAsyncFetch<any>(
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
          if (!attatchment_files) {
            //기존 파일에서 찾아서 push
            const file = attatchment_files.find((file: { url: any }) => {
              return file.url === img.src
            })
            imgFiles.push(file)
          }

          imgFiles.push({
            url: img.src,
            type: 'image',
            priority: 0
          })

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
          const { data, error, pending } = await useCustomAsyncFetch<any>(
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

          const file = attatchment_files.find((file: { url: any }) => {
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
          const { data, error, pending } = await useCustomAsyncFetch<any>(
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
            const file = attatchment_files.find((file: { url: any }) => {
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
          const { data, error, pending } = await useCustomAsyncFetch<{
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
          const { data, error, pending } = await useCustomAsyncFetch<{
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

          const { data, error, pending } = await useCustomAsyncFetch<{
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


  console.log('attachedFile', attachedFile)
  console.log('attatchment_files', attatchment_files)

  attachedFile?.filter((file) => {
    return file?.size
  })

  payload.attatchment_files = attachedFile

  const { data, error, pending } = await useCustomAsyncFetch(
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


function setCategoryPayload(payload: { post_contents?: string; post_state?: string; hashtags?: any[]; community: any; game: any; post_id?: string; attatchment_files?: any; channel_id?: string }) {

  selectedGroup.value.forEach((selected) => {
    // cascader 산텍시 배열로 넘어오기때문에 객체로 다시 저장
    let target = selected
    if (Array.isArray(selected)) {
      [target] = selected
    }

    switch (target.type) {
      case 'community':
        const [, channel] = selected
        payload.community = [
          ...payload.community,
          {
            id: target.community.id,
            group: target.community,
            channel_id: channel.channel.id,
            channel: channel.channel
          }
        ]
        break;
      case 'game':
        payload.game = [...payload.game, { game: target.game, id: target.game.id }];
        break;
      default:
        break;
    }
  })

  return payload
}

function closeTextEditor() {
  snsAttachFiles.value.img = _.cloneDeep(initFiles)

  //작성한 글이 있는 경우 임시저장 처리
  if (!editor.value.isEmpty) {
    ElMessageBox.confirm(`${t('ask.save.draft.post')}`, {
      confirmButtonText: 'SAVE',
      cancelButtonText: 'LEAVE',
      type: 'info',
    })
      .then(() => {
        form['save_type'] = 'cancel'
        saveDraftCloseModal()
      })
      .catch(() => {
        localStorage.removeItem(
          useUser().user.value.info.channel_id + 'draft:' + saveId.value
        )
        emit('closeModal')
      })
      .finally(() => { })
  } else {
    emit('closeModal')
  }
}

async function communityFetch() {
  const { data, error, pending } = await useCustomAsyncFetch<[]>(
    `/user/${useUser().user.value.info?.id}/list/community`,
    getComFetchOptions('get', true)
  )

  if (data.value) {
    categoryList.value = data.value.map((elem: ICommunity) => {
      return {
        value: {
          type: "community",
          community: {
            id: elem.id,
            is_certificated: elem.is_certificated,
            name: elem.name,
            profile_img: elem.profile_img,
            url: elem.url
          },
        },
        label: elem.name,
        children: elem.channels.map((channel: IComChannel) => {
          return {
            value: {
              type: "channel",
              channel: channel
            },
            label: channel.title
          }
        })
      }
    })
  }
  categoryList.value.push({
    value: "game",
    label: 'Games',
    disabled: true,
  })
  const gameList = useUser().user.value.info.games.map((game: IGame) => {
    return {
      value: {
        type: 'game',
        game: game,
      },
      label: game.title
    }
  })
  categoryList.value = [...categoryList.value, ...gameList]

  categoryList.value.unshift({
    value: 'community',
    label: 'Community',
    disabled: true
  })

  isCommunityListVisible.value = true
}

//임시저장 후 모달 종료
function saveDraftCloseModal() {
  if (editor.value.isEmpty) return
  localStorage.removeItem(
    useUser().user.value.info.channel_id + 'draft:' + saveId.value
  )

  onSavePost()

  ElMessage({
    message: t('save.draft.done'),
    type: 'success',
  })
  emit('closeModal')
}

function onSavePost(time = Date.now()) {
  // 저장시간, 포스팅 내용, 포스팅 타입, 포스팅 uid
  // 저장 시간으로부터 저장 기한 한달
  // 마지막 타이핑을 기준으로 1분마다 자동 저장
  // 유저가 저장한 경우를 제외하고 알람 띄워야함

  if (isFullLocal()) {
    const oldestDraft = getOldestDraft()
    localStorage.removeItem(oldestDraft)
    draftList.value = draftList.value.filter((x) => {
      return x.key !== oldestDraft
    })
  }

  saveOnLocal(time)

  const draftItem = draftList.value.find((draft) => {
    return draft.saveId === saveId.value
  })
  if (draftItem) {
    draftItem.post_contents = JSON.parse(JSON.stringify(form)).post_contents
  } else {
    draftList.value.push(JSON.parse(JSON.stringify(form)))
  }
}

function getOldestDraft(): string {
  let timeList = []

  for (let i = 0; i < localStorage.length; i++) {
    if (
      localStorage
        .key(i)
        .includes(useUser().user.value.info?.channel_id + 'draft:')
    ) {
      timeList.push(localStorage.key(i).split('draft:')[1])
    }
  }

  const oldestDraft = Math.min(...timeList)
  return `${useUser().user.value.info?.channel_id}draft:${oldestDraft}`
}

function isFullLocal(): boolean {
  let count = 0

  for (let i = 0; i < localStorage.length; i++) {
    if (
      localStorage
        .key(i)
        .includes(useUser().user.value.info?.channel_id + 'draft:')
    ) {
      count++
    }
  }
  return count >= MAX_LOCAL_SAVE ? true : false
}

function saveOnLocal(time: number) {
  form['post_type'] = activeTab.value
  form['time'] = Date.now()
  form['key'] = `${useUser().user.value.info?.channel_id}draft:${time}`

  localStorage.setItem(
    `${useUser().user.value.info?.channel_id}draft:${time}`,
    JSON.stringify(form)
  )
}

function getDraftList() {
  draftList.value = []
  for (let i = 0; i < localStorage.length; i++) {
    if (
      localStorage
        .key(i)
        .includes(useUser().user.value.info?.channel_id + 'draft:')
    ) {
      draftList.value.push(
        JSON.parse(localStorage.getItem(localStorage.key(i)))
      )
    }
  }
  //최신순으로 정렬
  draftList.value.sort((a, b) => {
    return b.time - a.time
  })
}

function onLoadPost() {
  showDraftList.value = true
}

function deleteDraft(draft: IDraft, index: number) {

  ElMessageBox.confirm(`${t('ask.delete.draft')}`, {
    confirmButtonText: 'YES',
    cancelButtonText: 'Cancel',
    type: 'info',
  })
    .then(() => {
      insertContet(draft)
      showDraftList.value = false
      ElMessage({
        message: t('delete.draft.done'),
        type: 'success',
      })
    })
    .catch(() => { })
    .finally(() => { })
}

function selectDraft(draft: IDraft, index: number) {
  //작성 중인 글 있는 지 확인
  if (!editor.value.isEmpty) {
    ElMessageBox.confirm(`${t('ask.overwrite.draft')}`, {
      confirmButtonText: 'YES',
      cancelButtonText: 'Cancel',
      type: 'info',
    })
      .then(() => {
        insertContet(draft)
        showDraftList.value = false
        localStorage.removeItem(draft.key)
        draftList.value.splice(index, 1)
      })
      .catch(() => { })
      .finally(() => { })
  } else {
    insertContet(draft)
    showDraftList.value = false
    localStorage.removeItem(draft.key)
    draftList.value.splice(index, 1)
  }
}

function insertContet(draft: IDraft) {
  activeTab.value = draft.post_type

  nextTick(() => {
    editor.value.view.dom.focus()
    editor.value.chain().focus().insertContent(draft.post_contents).run()
  })
}

//바뀐게 있을 경우 자동저장 5초마다 저장
function autoSave() {
  interval.value = setInterval(() => {
    //바뀐게 없거나 텍스트가 없는 경우 종료
    if (prevText.value === form.post_contents || editor.value.isEmpty) {
      return
    }
    savedTime.value = dayjs(Date.now()).format('HH:mm')
    showSavedTime.value = false

    //자동저장 id
    form['saveId'] = saveId.value
    onSavePost(saveId.value)

    showTimeText()
    showSavedTime.value = true
  }, 5000)
}

//텍스트 1.5초간 유지
function showTimeText() {
  textInterval.value = setTimeout(() => {
    showSavedTime.value = false
    prevText.value = _.cloneDeep(form.post_contents)
  }, 1500)
}

function getFirstPostContent(content: string) {
  return (
    stringToDomElem(content).getElementsByTagName('p')[0]?.innerText ||
    stringToDomElem(content).getElementsByTagName('pre')[0]?.innerText ||
    (stringToDomElem(content).getElementsByTagName('img')[0]?.src && 'Image') ||
    (stringToDomElem(content).getElementsByTagName('video')[0]?.src &&
      'Video') ||
    (stringToDomElem(content).getElementsByTagName('audio')[0]?.src && 'Audio')
  )
}
</script>

<style scoped lang="scss">
.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.5s ease;
}

.component-fade-enter-from,
.component-fade-leave-to {
  opacity: 0;
}

.title {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 22px 20px 20px 20px;
  text-align: center;
  font-weight: 600;
  font-size: 16px;
  line-height: 16px;
  border-bottom: #fff 2px solid;
  cursor: default;
  transition: all 0.4s ease-in-out;
}

.close-btn {
  padding: 22px 20px 20px 20px;
  position: absolute;
  right: 0;
  cursor: pointer;


}

.close-btn:hover {
  color: #f97316;

}

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
    max-height: 315px;

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
  .category-select-finish {
    height: 30px;
    justify-content: space-around;

    div {
      margin-left: 10px;

      span {
        text-overflow: ellipsis;
        max-width: 50px;
        overflow: hidden;
        white-space: nowrap;
        display: inline-block;
      }

      em {
        max-width: 40px;
        text-overflow: ellipsis;
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

.ma-header {
  padding: 10px 20px 10px 20px !important;
}

.ma-content {
  padding: 10px 20px 10px 20px !important;

  div {
    margin-top: 0px !important;
  }

  ul {
    li {
      display: flex;
      justify-content: space-between;
      min-height: 50px;
      margin: 10px 0px 10px 0px;

      div {
        text-align: left;
        justify-content: center !important;
        flex-direction: column;

        i {
          font-size: 20px;
        }
      }
    }

    li:not(:last-child) {
      border-bottom: 1px solid #999;
    }
  }

  .draft {
    div {
      p {
        height: 65px;
        text-overflow: ellipsis;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }
    }
  }
}

.mp-type {
  dd {
    button {
      padding: 0px;
      width: 70px !important;
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

  .auto-save {
    span {
      display: block;
    }
  }

  .mp-type {
    dd {
      button {
        padding: 0px;
        width: 50px !important;
      }
    }
  }
}

@media all and (min-width: 480px) and (max-width: 767px) {
  .mp-category {
    .btn-line-small {
      span:nth-child(3) {
        display: none;
      }
    }
  }

  .mp-type {
    dd {
      button {
        padding: 0px;
        width: 70px !important;
      }
    }
  }
}

@media all and (min-width: 768px) and (max-width: 991px) {}

@media all and (min-width: 992px) and (max-width: 1199px) {}

@media all and (min-width: 1200px) {}
</style>

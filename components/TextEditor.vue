<template>
  <div class="modal-post">
    <ul class="mp-header">
      <li class="pl10 flex h100p items-center pointer prev-btn" @click="closeTextEditor" style="z-index: 99;">
        <IconLeftArrow />
      </li>
      <li class="title">
        {{ isEdit ? $t('edit.post') : $t('new.post') }}
      </li>
    </ul>
    <div>
      <Tiptap @editorContent="getEditorContent" @send-tag-info="getTagInfo" :postType="activeTab" :feed="feed"
        :key="activeTab" ref="tiptapRef" />

      <div v-if="snsAttachFiles.img?.length" class="mp-image">
        <dd>
          <swiper :modules="[Pagination]" class="swiper-area" :slides-per-view="3" :space-between="10"
            :pagination="{ clickable: true }">
            <swiper-slide v-for="(img, idx) in snsAttachFiles.img" :key="idx">
              <div class="img-container" :class="img.is_blind ? 'blur' : ''">
                <img :src="img.url">
              </div>
              <div>
                <span @click="deleteImg(idx)">
                  <IconCloseCircle width="20px" />
                </span>
                <span @click="blindImg(idx)">
                  <IconEye width="20px" />
                </span>
              </div>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
        </dd>
      </div>
      <div v-if="isVideoUploading" class="video-loading">
        <BeatLoader :color="'#ff6e17'" size="20px" />
      </div>
      <div v-else-if="!isVideoUploading && snsAttachFiles.video?.url" class="mp-midi">
        <span @click="deleteVideo" class="delete-video-btn">
          <IconCloseCircle />
        </span>

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
            <span class="delete-audio-btn" @click="deleteAudio(idx)">
              <IconCloseCircle />
            </span>
          </div>
          <p>{{ audio.name || audio.file.name }}</p>
        </ul>
      </div>
      <ClientOnly>
        <el-cascader class="mp-category" id="cascader" :props="props" v-model="selectedGroup" style="width:100%"
          placeholder="Select cagetory" :options="categoryList">
        </el-cascader>
      </ClientOnly>

      <dl class="mp-type">
        <dt>
          <!-- <ImageUploader style="width: 30px" ref="imgUploaderRef" :maxLimit="5" @uploadImage="uploadImage" /> -->
          <div style="width: 30px" @click="uploadImageFile">
            <IconScenery color="#888" />
            <div style="height: 0px; overflow: hidden">
              <input type="file" @change="onSelectImageFile" multiple id="image-selector" accept=image/* ref="image" />
            </div>
          </div>
          <div v-if="!isIOS" style="width: 30px" @click="uploaVideoFile">
            <IconPlayCircle color="#888" />
            <div style="height: 0px; overflow: hidden">
              <input type="file" @change="onSelectVideoFile" accept=video/* ref="video" />
            </div>
          </div>
          <div style="width: 30px" @click="uploadAudioFile">
            <IconMusic color="#888" />
            <div style="height: 0px; overflow: hidden">
              <input type="file" @change="onSelectAudioFile" multiple accept=".mp3" ref="audio" />
            </div>
          </div>
        </dt>
        <dd class="post-btn-container">
          <button v-if="isEdit" class="btn-default-samll w100" id="updatePostBtn" @click="onUpdatePost">
            {{ $t('update.post') }}
          </button>
          <button v-else id="submitPostBtn" class="btn-default-samll w100" @click="onSubmit">
            {{ $t('save.post') }}
          </button>
        </dd>
      </dl>
    </div>
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
import { onBeforeRouteLeave } from 'vue-router';

interface IDraft {
  time: number
  key: string
  post_contents: string
  post_type: string
}

const { t, locale } = useI18n()
const route = useRoute()
const isVideoUploading = ref(false)
const isAudioUploading = ref(false)


const imgUploaderRef = ref()

const emit = defineEmits(['closeModal', 'refresh'])

const props = defineProps({
  type: String,
  isEdit: {
    type: Boolean,
    default: false,
  },
  feed: Object as PropType<IFeed>,
  channelInfo: Object,
  multiple: {
    type: Boolean,
    default: true,
  },

})

watch(
  () => useCommon().common.value.isPopState,
  (val) => {
    if (!val) {
      closeDraftList()
      closeMsgBox()
    }
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

const MAX_IMG_COUNT = 4
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

const isIOS = ref(false)


const gameInfo = computed(() => useGame().game.value.info)
const communityInfo = computed(() => useCommunity().community.value.info)
const userGames = computed(() => useUser().user.value.info.games)
const isMobile = computed(() => useCommon().common.value.isMobile)

await communityFetch()

onBeforeMount(() => {
  // getDraftList()
  // autoSave()

  //유저가 직접 저장하지 않은 경우
  if (draftList.value[0]?.save_type === 'cancel') {
    if (isMobile.value) {
      useCommon().setPopState(true)
    }
    ElMessageBox.confirm(`${t('ask.load.draft.post')}`, {
      confirmButtonText: 'YES',
      cancelButtonText: 'Cancel',
      type: 'info',
    })
      .then(() => {
        insertContet(draftList.value[0])
        if (isMobile.value) {
          useCommon().setPopState(false)
        }
      })
      .catch(() => { })
      .finally(() => {
        localStorage.removeItem(draftList.value[0].key)
        draftList.value.splice(0, 1)
      })
  }
})

onMounted(async () => {
  nextTick(() => {
    isIOS.value = /(iPhone|iPod|iPad)/i.test(navigator.userAgent);
    // navigator.userAgent.includes('kakao') || navigator.userAgent.includes('naver')
  })

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


  if (communityInfo.value && !props.isEdit) {
    const currChannelName = route.params.channel_name
    let targetChannel = null

    //선택한 채널 있는 경우
    if (currChannelName) {
      targetChannel = communityInfo.value.channels.find(channel => {
        return channel.title === currChannelName
      })

    } else {
      //지금 선택된 채널 없으면 general 채널 디폴트 카테고리로 설정

      targetChannel = communityInfo.value.channels.find(channel => {
        if (channel.title === 'general') {
          return channel.title === 'general'
        } else {
          return communityInfo.value.channels[0]
        }
      })
    }


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
        channel: targetChannel
      }]
    ]
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
    const postGame = props.feed?.posted_at?.game || props.feed?.posted_at[0]?.game


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


    const attFileFilter = (type: string) => attachFileArr.value?.filter((file: { type: string, name: string, priority: number, size: number, url: string }) => file.type === type)

    snsAttachFiles.value = {
      img: attFileFilter('image'),
      video: attachFileArr.value?.find((file: { type: string, name: string, priority: number, size: number, url: string }) => file.type === 'video') || null,
      audio: attFileFilter('sounc'),
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
  metaTagInfo.value = info
}

function refreshPage(event: { preventDefault: () => void; returnValue: string }) {
  if (editor.value.isEmpty) return
  event.preventDefault()

  event.returnValue = `${t('leave.router.warning')}` //안뜨는 거 같음
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


  if (
    snsAttachFiles.value.img?.length ||
    snsAttachFiles.value.audio?.length ||
    snsAttachFiles.value?.video
  ) {
    const formData = new FormData()

    if (snsAttachFiles.value.img) {
      // const result = await imgUploaderRef.value.fetchImage()
      // console.log('result :', result)
      // payload['attatchment_files'] = result

      for (const img of snsAttachFiles.value.img) {
        formData.append(img.name, img.file)
        formData.append('is_blind', img.is_blind)
      }

    }

    if (snsAttachFiles.value.audio) {
      for (const audio of snsAttachFiles.value.audio) {
        formData.append(audio.name, audio.file)
      }
    }


    const { data, error, pending } = await useCustomAsyncFetch<{ result: [] }>(
      '/community/att',
      getZempieFetchOptions('post', true, formData)
    )



    const thumbRes = data.value.result.map((attr) => {
      if (attr.type === 'image') {
        const urlParts = attr.url.split("/");
        urlParts.splice(3, 0, "thumbnail");

        // Reconstruct the URL
        const modifiedUrl = urlParts.join("/");
        console.log('modifiedUrl', modifiedUrl)

        return {
          ...attr,
          thumbnail: modifiedUrl
        }
      } else {
        return attr
      }
    })

    payload['attatchment_files'] = thumbRes

    if (snsAttachFiles.value.video) {
      payload['attatchment_files'] = [snsAttachFiles.value.video]

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

async function uploadImageFile() {

  if (!validateImgCount(snsAttachFiles.value.img)) return

  if (snsAttachFiles.value.video || snsAttachFiles.value.audio?.length) {
    ElMessage({
      message: t('post.fileType.err.text1'),
      type: 'warning',
    })
    return
  }
  image.value.click()
}



function onSelectImageFile(event: Event) {

  let files = (event.target as HTMLInputElement).files

  if (!validateImgCount(files)) {

    const transfer = new DataTransfer();
    Array.from(files)
      .slice(0, MAX_IMG_COUNT)
      .forEach(file => {
        transfer.items.add(file)
      })
    files = transfer.files;
  }



  for (const file of files) {
    if (file.type === 'image/svg+xml') {
      alert('svg는 지원하지 않는 확장자 형식입니다')
      continue
    }
    const reader = new FileReader()

    reader.onload = async (e) => {

      const url = e.target!.result as string


      snsAttachFiles.value.img = [...(snsAttachFiles.value.img || []),
      { file, name: file.name, url, is_blind: false }
      ]
    }

    reader.readAsDataURL(file)
  }

  (event.target as HTMLInputElement).value = ''
}

function validateImgCount(images: [] | FileList) {
  if ((images && images.length) >= MAX_IMG_COUNT) {
    ElMessage({
      message: `${t('maxFile.count.text1')} ${MAX_IMG_COUNT}${t('maxFile.count.text2')}`,
      type: 'warning',
    })
    return false
  } else {
    return true
  }
}

function deleteImg(idx: number) {
  snsAttachFiles.value.img.splice(idx, 1)
}

async function uploaVideoFile() {

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
  video.value.click()
}

async function onSelectVideoFile(event: any) {
  isVideoUploading.value = true

  const formData = new FormData()



  const files = event.target.files


  for (const file of files) {

    formData.append(
      file.name,
      file
    )

    try {
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

        if (data.value.result)
          snsAttachFiles.value.video = data.value.result[0]

      }
    } finally {
      isVideoUploading.value = false
    }

  }
  event.target.value = ''
}

function deleteVideo() {
  snsAttachFiles.value.video = null
}

async function uploadAudioFile() {

  if (snsAttachFiles.value.video || snsAttachFiles.value.img?.length) {
    ElMessage({
      message: t('post.fileType.err.text1'),
      type: 'warning',
    })
    return
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


  const formData = new FormData()

  if (snsAttachFiles.value.img?.length > 0) {
    for (const img of snsAttachFiles.value.img) {
      //이미지 파일 중 s3 업로드가 필요한 파일 formdata append
      if (
        img.url.search('blob:') !== -1 ||
        img.url.search('data:') !== -1
      ) {
        formData.append(img.name, img.file)
        formData.append('is_blind', img.is_blind)
      } else {
        img['is_blind'] = img['is_blind'] || false;
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
          size: number,
          is_blind: boolean
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
            is_blind: data.is_blind
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


  Array.isArray(attachedFile) ? attachedFile : JSON.parse(attatchment_files)


  attachedFile?.filter((file) => {
    return file?.size
  })
  console.log('attachedFile', attachedFile)

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
            id: target.community?.id,
            group: target.community,
            channel_id: channel.channel?.id,
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
    if (isMobile.value) {
      useCommon().setPopState(true)
    }
    ElMessageBox.confirm(`${t('ask.save.draft.post')}`, {
      confirmButtonText: t('save'),
      cancelButtonText: t('close'),
      type: 'info',
      closeOnClickModal: false
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

function closeMsgBox() {
  ElMessageBox.close()
}

async function communityFetch() {
  const { data, error, pending } = await useCustomAsyncFetch<[]>(
    `/user/${useUser().user.value.info?.id}/list/community`,
    getComFetchOptions('get', true)
  )
  if (data.value.length) {
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
  if (userGames.value?.length) {
    categoryList.value.push({
      value: "game",
      label: t('game'),
      disabled: true,
    })
  }


  const gameList = userGames.value?.map((game: IGame) => {
    return {
      value: {
        type: 'game',
        game: game,
      },
      label: game.title
    }
  })
  categoryList.value = [...categoryList.value, ...gameList]

  if (data.value.length) {
    categoryList.value.unshift({
      value: 'community',
      label: t('community'),
      disabled: true
    })
  }

  if (!categoryList.value.length && !gameList.length) {
    categoryList.value.push({
      value: 'community',
      label: t('no.select.category.info1'),
      disabled: true
    },
      {
        value: 'community',
        label: t('no.select.category.info2'),
        disabled: true
      })
  }
  // console.log(categoryList.value.length, gameList.length)



  isCommunityListVisible.value = true
}

//임시저장 후 포스팅 모달 종료
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
  if (isMobile.value) {
    useCommon().setPopState(true)
  }
}

function deleteDraft(draft: IDraft, index: number) {

  if (isMobile.value) {
    useCommon().setPopState(true)
  }
  ElMessageBox.confirm(`${t('ask.delete.draft')}`, {
    confirmButtonText: 'YES',
    cancelButtonText: 'Cancel',
    type: 'info',
  })
    .then(() => {
      insertContet(draft)
      closeDraftList()
      if (isMobile.value) {
        useCommon().setPopState(false)
      }
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
  if (isMobile.value) {
    useCommon().setPopState(true)
  }
  if (!editor.value.isEmpty) {
    ElMessageBox.confirm(`${t('ask.overwrite.draft')}`, {
      confirmButtonText: 'YES',
      cancelButtonText: 'Cancel',
      type: 'info',
    })
      .then(() => {
        insertContet(draft)
        closeDraftList()
        if (isMobile.value) {
          useCommon().setPopState(false)
        }
        localStorage.removeItem(draft.key)
        draftList.value.splice(index, 1)
      })
      .catch(() => { })
      .finally(() => { })
  } else {
    insertContet(draft)
    closeDraftList()
    if (isMobile.value) {
      useCommon().setPopState(false)
    }
    localStorage.removeItem(draft.key)
    draftList.value.splice(index, 1)
  }
}

function insertContet(draft: IDraft) {
  activeTab.value = draft.post_type

  nextTick(() => {
    editor.value.view.dom.focus()
    editor.value.commands.clearContent()
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

function blindImg(index: number) {
  snsAttachFiles.value.img[index]['is_blind'] = !snsAttachFiles.value.img[index]['is_blind']

}

function uploadImage(images) {
  snsAttachFiles.value.img = [...(snsAttachFiles.value.img || []), ...images]

  console.log('sns: ', snsAttachFiles.value.img)


}

function closeDraftList() {
  showDraftList.value = false
  if (isMobile.value) {
    useCommon().setPopState(false)
  }
}
</script>

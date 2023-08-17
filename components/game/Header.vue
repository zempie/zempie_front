<template>
  <div v-if="gameInfo" class="visual-info-left pos-relative" :style="prevBanner
    ? `background: url(${prevBanner + `?_=${Date.now()}`
    }) center center / cover no-repeat; background-size: cover;`
    : 'background-color: #f973165c'
    ">
    <GameStageTag v-if="gameInfo.stage" :stage="gameInfo.stage" class="pos-absolute" style="top:10px; left: 10px;" />
    <div v-if="isMine" class="pos-absolute banner-btn-container">
      <div style="height: 0px; overflow: hidden">
        <input type="file" @change="onBannerChange"
          accept="image/jpeg, image/png, image/svg, image/jpg, image/webp, image/bmp," ref="bannerImg" name="fileInput" />
      </div>

      <span class="banner-btn" @click="uploadBanner">
        <i class="uil uil-image-edit"></i>
      </span>
    </div>
    <dl>
      <dt class="header-left" :class="gameInfo?.stage === eGameStage.DEV && 'dev-header'">
        <dl>
          <dt class="game-profile-img">
            <div
              :style="`background:url(${gameInfo?.url_thumb}) center center / cover no-repeat; background-size:cover; border-radius: 10%`">
              <!-- <span></span> -->
            </div>
          </dt>
          <dd class="game-tag">
            <div class="inner">
              <h2>
                {{ gameInfo.title }}
              </h2>
              <div class="menu">
                <div class="like-btn row">
                  <i v-if="!isLike" class="xi-heart-o like-icon pointer mr5 font20 zem-color" @click="setLike">
                  </i>
                  <i v-else class="xi-heart like-icon pointer mr5 font20 zem-color" @click="unsetLike">
                  </i>
                  <p class="fontColor-white">{{ likeCnt }}</p>
                </div>
                <ShareMenu :shareInfo="shareInfo" type="game" />
                <CommonDropdown style="display: flex;">
                  <template #options>
                    <li @click="onClickReport">{{ $t('report.game') }}</li>
                  </template>
                </CommonDropdown>
              </div>
            </div>
            <h3 @click="moveUserPage" style="cursor: pointer">
              By <span class="underline">@{{ gameInfo.user?.nickname }}</span>
            </h3>
            <div class="play-btn-container row">
              <a v-if="gameInfo.stage !== eGameStage.DEV && gameInfo.game_type === eGameType.Html" @click="playGame"
                class="btn-default mr10">{{ $t('playgame') }}

                <li v-if="gameInfo.game_type === eGameType.Html" style="margin-top: 2px;">
                  <i class="uil uil-html5-alt"></i>
                </li>
              </a>

              <a v-if="gameInfo.game_type === eGameType.Download" :href="gameInfo.url_game"
                class="btn-default download mr10" :class="isFlutter && 'disabled'" @click="downloadGame">
                <span>{{ $t('download') }}</span>
                <!-- <small style="font-size:10px; font-weight: 300;">&nbsp;( 20 )&nbsp;</small> -->
                &nbsp;
                <Icon icon="ri:kakao-talk-fill" class="icon" />
                <GamePlatformIcon :platform="gameInfo.support_platform" color="#fff" />
              </a>
            </div>
          </dd>
        </dl>
      </dt>


    </dl>
    <el-dialog v-model="showChangeBanner" class="modal-area-game-banner">
      <div class="modal-alert">
        <dl class="ma-header">
          <dt>{{ t('banner.photo') }}</dt>
          <dd>
            <button class="pointer" @click="showChangeBanner = false">
              <i class="uil uil-times"></i>
            </button>
          </dd>
        </dl>
        <div class="banner-container">
          <img ref="editBanner" :src="editBannerUrl" />
        </div>
        <div class="btn-container">
          <div>
            <button v-if="prevBanner" class="btn-gray uppercase" @click="showDeleteBanner = true">
              {{ $t('delete') }} <span> {{ $t('banner') }} </span>
            </button>
          </div>
          <div>
            <button class="btn-line mr10 uppercase" @click="bannerImg.click()">
              {{ $t('change') }} <span>{{ $t('banner') }} </span>
            </button>

            <button v-if="prevBanner" class="btn-default uppercase" @click="updateBannerImg">
              {{ $t('update') }}
            </button>
            <button v-else class="btn-default uppercase" @click="saveBannerImg">
              {{ $t('save') }}
            </button>
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog v-model="showDeleteBanner" append-to-body class="modal-area-type" width="380px">
      <div class="modal-alert">
        <dl class="ma-header">
          <dt>{{ t('information') }}</dt>
          <dd>
            <button class="pointer" @click="showDeleteBanner = false">
              <i class="uil uil-times"></i>
            </button>
          </dd>
        </dl>
        <div class="ma-content">
          <h2>{{ t('delete.banner') }} <br />{{ t('delete.banner.text') }}</h2>
          <div>
            <button class="btn-default w48p" @click="deleteBanner">
              {{ t('delete') }}
            </button>
            <button class="btn-gray w48p" @click="showDeleteBanner = false">
              {{ t('no') }}
            </button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
  <ReportModal :openModal="showReportModal" :reportInfo="reportInfo" @closeModal="showReportModal = false" />
</template>

<script setup lang="ts">
import _ from 'lodash'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import { ElMessage, ElMessageBox, ElTag, ElDialog } from 'element-plus'
import { ePlatformType, eGameStage, eGameType, eReportType } from '~~/types'

import { PropType } from 'vue'
import { useI18n } from 'vue-i18n'

const IMAGE_MAX_SIZE = 4

const config = useRuntimeConfig()
const { $localePath } = useNuxtApp()

const { t, locale } = useI18n()

const router = useRouter()

// const gameInfo = computed(() => useGame().game.value.info)


const gameInfo = computed({
  get() {
    return useGame().game.value.info
  },
  set(value) {
    useGame().game.value.info = value;
  }
})

const hashtags = computed(
  () =>
    gameInfo.value.hashtags?.length > 0 && gameInfo.value.hashtags?.split(',')
)

const isMine = computed(
  () => gameInfo.value.user?.id === useUser().user.value.info?.id
)
const isLike = ref(gameInfo.value?.is_like)
const likeCnt = ref(gameInfo.value?.count_heart)
const bannerImg = ref()
const bannerFile = ref<File>()
// const prevBanner = ref<String | ArrayBuffer>(gameInfo.value?.banner_img)

const showChangeBanner = ref(false)
const editBanner = ref()
const editBannerUrl = ref()
const cropper = ref()
const showDeleteBanner = ref(false)

const showReportModal = ref(false)
const reportInfo = ref()

//중복 클릭 방지용
let likeAcceessableCnt = 2
let unlikeAcceessableCnt = 2

const isFlutter = computed(() => useMobile().mobile.value.isFlutter)

const prevBanner = computed({
  get() {
    return gameInfo.value?.url_banner
  },
  set(value) {
    gameInfo.value = {
      ...gameInfo.value,
      url_banner: value
    };
  }
})


const shareInfo = computed(() => {
  return {
    img_url: gameInfo.value.url_thumb,
    title: gameInfo.value.title,
    desc: gameInfo.value.description,
    user: gameInfo.value.user,
    url: `${config.ZEMPIE_URL}/play/${gameInfo.value.pathname}}`
  }
})


function playGame() {
  window.open(`/play/${gameInfo.value.pathname}`, '_blank')
}


async function setLike() {
  likeAcceessableCnt -= 1

  isLike.value = true

  const payload = {
    game_id: gameInfo.value.id,
    on: true,
  }
  const { data, error, refresh } = await useCustomAsyncFetch(
    `/game/heart`,
    getZempieFetchOptions('post', true, payload)
  )
  if (!error.value) {
    likeCnt.value++
  }
  likeAcceessableCnt += 1

}
async function unsetLike() {
  unlikeAcceessableCnt -= 1

  isLike.value = false

  const payload = {
    game_id: gameInfo.value.id,
    on: false,
  }
  const { data, error, refresh } = await useCustomAsyncFetch(
    `/game/heart`,
    getZempieFetchOptions('post', true, payload)
  )
  if (!error.value) {
    likeCnt.value--
  }
  unlikeAcceessableCnt += 1

}


async function uploadBanner() {
  if (prevBanner.value) {
    showChangeBanner.value = true
    editBannerUrl.value = prevBanner.value
    openCropper()
  } else {
    bannerImg.value.click()
  }
}

function onBannerChange(event: any) {
  const file = event.target.files[0]

  if (file.size < 1024 * 1024 * IMAGE_MAX_SIZE) {
    showChangeBanner.value = true
    bannerFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      editBannerUrl.value = e.target!.result
      openCropper()
    }
    reader.readAsDataURL(file)
    event.target.value = ''
  } else {
    ElMessage.error(t('maxFile.size.4mb'))
  }
}

function openCropper() {
  nextTick(() => {
    const image = editBanner.value
    image.src = editBannerUrl.value
    if (cropper.value) cropper.value.destroy()
    cropper.value = new Cropper(image, {
      autoCropArea: 1,
      aspectRatio: 3.16,
      movable: true,
      preview: '.preview',
      checkCrossOrigin: false,
      checkOrientation: false,
    })

    cropper.value.setData({
      height: 1200,
      width: 380,
    })

    cropper.value.setCropBoxData({
      height: 1200,
      width: 380,
    })
  })
}

async function updateBannerImg() {
  cropper.value.getCroppedCanvas().toBlob(async (blob) => {
    const file = new File([blob], 'banner-img')

    const formData = new FormData()
    formData.append('game_id', String(gameInfo.value.id))
    formData.append('file', file)

    const { data, error, pending } = await useCustomAsyncFetch<{ result: any }>(
      '/game/banner',
      getZempieFetchOptions('put', true, formData)
    )
    if (data.value) {
      const { result } = data.value
      prevBanner.value = result.url_banner + `?_=${Date.now()}`
    }
  })

  showChangeBanner.value = false
}

async function deleteBanner() {
  const { data, error, pending } = await useCustomAsyncFetch(
    '/game/banner',
    getZempieFetchOptions('delete', true, { game_id: gameInfo.value.id })
  )

  if (data.value) {
    prevBanner.value = null
  }
  showChangeBanner.value = false
  showDeleteBanner.value = false
}

function saveBannerImg() {
  cropper.value.getCroppedCanvas().toBlob(async (blob) => {
    const file = new File([blob], 'banner-img')

    const formData = new FormData()
    formData.append('game_id', String(gameInfo.value.id))
    formData.append('file', file)

    const { data, error, pending } = await useCustomAsyncFetch<{ result: any }>(
      '/game/banner',
      getZempieFetchOptions('post', true, formData)
    )
    if (data.value) {
      const { result } = data.value
      prevBanner.value = result.url_banner + `?_=${Date.now()}`
    }
  })

  showChangeBanner.value = false
}

function moveUserPage() {
  router.push($localePath(`/${gameInfo.value.user.nickname}`))
}

function searchHashtag(hashtag: string) {
  router.push({ path: $localePath(`/search`), query: { q: hashtag } })
}

function downloadGame() {
  if (isFlutter.value) {
    ElMessage({
      type: 'error',
      message: t('download.pc.env')
    })
  }
}

function onClickReport() {

  reportInfo.value = {
    type: eReportType.comment,
    target_id: gameInfo.value.id,
    title: t('report.game.title'),
    desc: t('report.post.desc'),
    list: [
      {
        value: 10,
        title: t('report.post.options1'),//'개인정보보호 위반'
      },
      {
        value: 11,
        title: t('report.post.options2'),//'불쾌하거나 민감한 콘텐츠'
      },
      {
        value: 12,
        title: t('report.post.options3'),//'불법 콘텐츠'
      },
      {
        value: 13,
        title: t('report.post.options4'),//'허가되지 않은 광고'
      },
      {
        value: 14,
        title: t('report.post.options5'),//'지식재산권 침해'
      },
      {
        value: 15,
        title: t('etc'),//'기타'
      }

    ]
  }
  showReportModal.value = true
}

</script>

<style lang="scss" scoped>
.visual-info-left {
  .banner-btn-container {
    display: flex;
    justify-content: flex-end;
    top: 10px;
    right: 10px;

    .banner-btn {
      border-radius: 50%;
      background-color: #888;
      width: 30px;
      height: 30px;
      display: flex;
      cursor: pointer;
      align-items: center;

      i {
        font-size: 20px;
        margin-right: 10px;
        color: #fff;
        margin: 0 auto;
      }
    }
  }
}

:deep(.share-menu) {
  a {
    color: #888;
    border: none;

    &:hover {
      color: #f97316;
    }
  }

}

:deep(.custom-dropdown) {
  button {
    &:hover {
      color: #f97316;
    }
  }
}

.header-left {

  &.dev-header {
    padding-bottom: 40px;
  }
}

.game-tag {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 10px 0px 10px 20px;

  .inner {
    width: 100%;
    display: flex;
    align-items: center;

    justify-content: space-between;

    h2 {
      display: inline;
      color: #fff;
      font-size: 20px !important;
      font-weight: bold
    }

    .menu {
      display: flex;
    }
  }
}


.like-btn {
  justify-content: center;
  align-items: center;
}

.secondary {
  a {
    margin-right: 5px;
    margin-bottom: 5px;

    &:hover {
      cursor: pointer;
      color: #fff;
      background-color: #f97316;
    }
  }
}

.modal-alert {
  .banner-container {
    height: 500px;

    img {
      max-width: 100%;
    }
  }

  .btn-container {
    display: flex;
    padding: 20px;

    justify-content: space-between;

    button {
      width: 180px;
    }
  }
}

.play-btn-container {
  margin-top: 10px;
  left: 180px;

  a {
    // width: 110px;
    border: none;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;

    li {
      list-style: none;
    }
  }

  .download {
    background-color: #5552F9;

    &:hover {
      color: #5552F9;
      background-color: #fff;
    }
  }

}

.disabled {
  // pointer-events: none;
  opacity: 0.5;
  background: #ededed !important;
  color: #888;
}

@media all and (max-width: 479px) {
  .visual-info-left {
    width: 100%;
    height: 250px;

    .header-left {
      width: 100%;

      &.dev-header {
        padding-bottom: 0px;
      }
    }

    .game-profile-img {
      margin-left: 10px;
      width: 40%;
      display: flex;
      justify-content: center;

      div {
        position: absolute;
        width: 140px;
        height: 140px;
        margin: -30px 0 0 0 !important;
        border: #fff 5px solid;
        margin: 0px;
      }
    }


    dl {
      padding: 0px;
    }

    .play-btn-container {
      // margin-left: 10px;
      margin-bottom: 10px;
    }
  }

  .modal-alert {
    .ma-header {
      padding: 20px;
    }

    .btn-container {
      button {
        width: 110px;

        span {
          display: none;
        }
      }
    }
  }
}

:deep(.more-list) {
  right: -25px;
  top: 30px;
  width: 150px;
}

@media all and (min-width: 480px) and (max-width: 767px) {

  .visual-info-left {
    width: 100%;
    height: 250px;

    dl {
      padding: 0px;
    }

    .header-left {

      dl {
        flex-wrap: nowrap;
      }

      .game-profile-img {
        margin-left: 10px;
        width: 40%;
        display: flex;
        justify-content: center;

        div {
          position: absolute;
          width: 140px;
          height: 140px;
          margin: -30px 0 0 0 !important;
          border: #fff 5px solid;
          margin: 0px;
        }
      }

      .game-tag {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin: 10px 0px 10px 20px;
      }
    }
  }

  .modal-alert {
    .ma-header {
      padding: 20px;
    }

    .btn-container {
      button {
        width: 110px;

        span {
          display: none;
        }
      }
    }
  }
}

@media all and (min-width: 768px) and (max-width: 991px) {

  .play-btn-container {
    width: calc(100% - 180px);
    justify-content: flex-start;

    a {
      font-size: 12px;
      padding: 10px 10px;

      small,
      span {
        display: none;
      }
    }
  }

  .modal-alert {
    .btn-container {
      button {
        width: 110px;

        span {
          display: none;
        }
      }
    }
  }
}

@media all and (min-width: 992px) and (max-width: 1199px) {
  .header-left {
    width: 100%;

    .game-profile-img {
      width: 20%;
    }

    .game-tag {
      width: 100%;
    }
  }

  .play-btn-container {
    width: calc(100% - 180px);

    a {
      font-size: 12px;
      padding: 10px 15px;

      small {
        visibility: hidden;
      }
    }
  }

  .modal-alert {
    .btn-container {
      button {
        width: 110px;

        span {
          display: none;
        }
      }
    }
  }
}

@media all and (min-width: 1200px) {
  .header-left {

    .game-profile-img {
      width: 18%;
    }

    .game-tag {
      width: 100%;
    }
  }

}
</style>

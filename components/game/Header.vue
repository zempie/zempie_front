<template>
  <div
    v-if="gameInfo"
    class="visual-info-left"
    :style="
      prevBanner
        ? `background: url(${
            prevBanner + `?_=${Date.now()}`
          }) center center / cover no-repeat; background-size: cover;`
        : 'background-color: #f973165c'
    "
  >
    <div
      v-if="isMine"
      style="display: flex; justify-content: flex-end; margin: 20px"
    >
      <div style="height: 0px; overflow: hidden">
        <input
          type="file"
          @change="onBannerChange"
          accept="image/jpeg, image/png, image/svg, image/jpg, image/webp, image/bmp,"
          ref="bannerImg"
          name="fileInput"
        />
      </div>

      <span
        style="
          border-radius: 50%;
          background-color: #888;
          width: 30px;
          height: 30px;
          display: flex;
          cursor: pointer;
          align-items: center;
        "
        @click="uploadBanner"
      >
        <i
          class="uil uil-image-edit"
          style="
            font-size: 20px;
            margin-right: 10px;
            color: #fff;
            margin: 0 auto;
          "
        ></i>
      </span>
    </div>
    <dl>
      <dt class="header-left">
        <dl>
          <dt class="game-profile-img">
            &nbsp;
            <div
              :style="`background:url(${gameInfo?.url_thumb}) center center / cover no-repeat; background-size:cover;`"
            >
              <!--                                <span></span>-->
            </div>
          </dt>
          <dd class="game-tag">
            <h2 style="color: #fff; font-size: 20px; font-weight: bold">
              {{ gameInfo.title }}<span></span>
            </h2>
            <h3 @click="moveUserPage" style="cursor: pointer">
              By {{ gameInfo.user?.name }}
            </h3>

            <div class="tag-item secondary">
              <a
                v-for="hashtag in hashtags"
                :key="hashtag"
                @click="searchHashtag(hashtag)"
                >#{{ hashtag }}
              </a>
            </div>
          </dd>
        </dl>
      </dt>

      <dd class="play-btn-container">
        <div class="like-btn" style="flex-direction: column">
          <i
            v-if="!isLike"
            class="xi-heart-o like-icon"
            style="font-size: 22px; color: #ff6e17; cursor: pointer"
            @click="setLike"
          >
          </i>
          <i
            v-else
            class="xi-heart like-icon"
            style="font-size: 22px; color: #ff6e17; cursor: pointer"
            @click="unsetLike"
          >
          </i>
          <p style="color: #fff">{{ likeCnt }}</p>
        </div>

        <a
          v-if="gameInfo.stage !== eGameStage.DEV && gameInfo.game_type === eGameType.Html"
          @click="playGame"
          class="btn-default w150"
          style="margin-left: 12px"
          >Play Game</a
        >
        <a
          v-if="gameInfo.game_type === eGameType.Download"
          :href="gameInfo.url_game"
          class="btn-default w150 download"
          >Download</a
        >
      </dd>
    </dl>
    <el-dialog v-model="showChangeBanner" class="modal-area-game-banner">
      <div class="modal-alert">
        <dl class="ma-header">
          <dt>{{ t('banner.photo') }}</dt>
          <dd>
            <button @click="showChangeBanner = false">
              <i class="uil uil-times"></i>
            </button>
          </dd>
        </dl>
        <div class="banner-container">
          <img ref="editBanner" :src="editBannerUrl" />
        </div>
        <div class="btn-container">
          <div>
            <button
              v-if="prevBanner"
              class="btn-gray uppercase"
              @click="showDeleteBanner = true"
            >
              delete <span>banner</span>
            </button>
          </div>
          <div>
            <button class="btn-line mr10 uppercase" @click="bannerImg.click()">
              change <span>banner </span>
            </button>

            <button
              v-if="prevBanner"
              class="btn-default uppercase"
              @click="updateBannerImg"
            >
              update
            </button>
            <button v-else class="btn-default uppercase" @click="saveBannerImg">
              save
            </button>
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      v-model="showDeleteBanner"
      append-to-body
      class="modal-area-type"
      width="380px"
    >
      <div class="modal-alert">
        <dl class="ma-header">
          <dt>{{ t('information') }}</dt>
          <dd>
            <button @click="showDeleteBanner = false">
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
</template>

<script setup lang="ts">
import _ from 'lodash'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import { ElMessage, ElMessageBox, ElLoading, ElDialog } from 'element-plus'
import { IGame, eGameStage, eGameType } from '~~/types'

import { PropType } from 'vue'
import { useI18n } from 'vue-i18n'

const IMAGE_MAX_SIZE = 4
const { $localePath } = useNuxtApp()

const { t, locale } = useI18n()

const router = useRouter()

const gameInfo = computed(() => useGame().game.value.info)

console.log('gameInfo:', gameInfo.value)

const hashtags = computed(
  () =>
    gameInfo.value.hashtags?.length > 0 && gameInfo.value.hashtags?.split(',')
)

// const props = defineProps({
//   gameInfo: Object as PropType<IGame>,
// })

const isMine = computed(
  () => gameInfo.value.user?.id === useUser().user.value.info?.id
)
const isLike = ref(gameInfo.value?.is_like)
const likeCnt = ref(gameInfo.value?.count_heart)
const bannerImg = ref()
const bannerFile = ref<File>()
const prevBanner = ref<String | ArrayBuffer>(gameInfo.value?.url_banner)

const showChangeBanner = ref(false)
const editBanner = ref()
const editBannerUrl = ref()
const cropper = ref()
const showDeleteBanner = ref(false)

function playGame() {
  window.open(`/play/${gameInfo.value.pathname}`, '_blank')
}

//TODO: 중복 클릭 처리는 디바운스로 할지 세마포어로 할지 모르겟음
const setLike = _.debounce(async () => {
  isLike.value = true

  const payload = {
    game_id: gameInfo.value.id,
    on: true,
  }
  const { data, error, refresh } = await useCustomFetch(
    `/game/heart`,
    getZempieFetchOptions('post', true, payload)
  )
  if (!error.value) {
    likeCnt.value++
  }
}, 300)

const unsetLike = _.debounce(async () => {
  isLike.value = false

  const payload = {
    game_id: gameInfo.value.id,
    on: false,
  }
  const { data, error, refresh } = await useCustomFetch(
    `/game/heart`,
    getZempieFetchOptions('post', true, payload)
  )
  if (!error.value) {
    likeCnt.value--
  }
}, 300)

function uploadBanner() {
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

    const { data, error, pending } = await useCustomFetch<{ result: any }>(
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
  const { data, error, pending } = await useCustomFetch(
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

    const { data, error, pending } = await useCustomFetch<{ result: any }>(
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
  router.push($localePath(`/channel/${gameInfo.value.user.channel_id}`))
}

function searchHashtag(hashtag: string) {
  router.push({ path: $localePath(`/search`), query: { q: hashtag } })
}
</script>

<style lang="scss" scoped>
.like-btn {
  height: 65px;
  display: inline-flex;
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
.play-btn-container{
  .download{
    margin-left: 12px; background-color: #5552F9;
    &:hover{
      color:#5552F9;
      background-color: #fff;
    }
  }

}

@media all and (max-width: 479px) {
  .visual-info-left {
    width: 100%;
    dl {
      padding: 0px;
    }
    .play-btn-container {
      margin-top: 0px;
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

@media all and (min-width: 480px) and (max-width: 767px) {
  .visual-info-left {
    width: 100%;
    dl {
      padding: 0px;
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
    width: 70%;
    .game-profile-img {
      width: 30%;
    }
    .game-tag {
      width: 70%;
    }
  }
  .play-btn-container {
    width: 30%;
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
    width: 70%;
    .game-profile-img {
      width: 24%;
    }
    .game-tag {
      width: 70%;
    }
  }
  .play-btn-container {
    width: 30%;
  }
}
</style>

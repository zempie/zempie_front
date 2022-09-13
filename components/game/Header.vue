<template>
  <div
    v-if="gameInfo"
    class="visual-info-left"
    :style="
      prevBanner
        ? `background: url(${prevBanner}) center center / cover no-repeat; background-size: cover;`
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

      <i
        class="uil uil-image-edit"
        style="font-size: 20px; margin-right: 10px"
        @click="uploadBanner"
      ></i>
      <i
        v-if="prevBanner"
        class="uil uil-trash-alt"
        style="font-size: 20px; color: red; margin-right: 10px"
        @click="deleteBanner"
      ></i>
      <i
        v-if="bannerFile && gameInfo?.url_banner"
        @click="updateBanner"
        class="uil uil-check-circle"
        style="font-size: 20px; color: forestgreen"
      ></i>
      <i
        v-else-if="bannerFile"
        @click="saveBanner"
        class="uil uil-check-circle"
        style="font-size: 20px; color: forestgreen"
      ></i>
    </div>
    <dl>
      <dt>
        <dl>
          <dt>
            &nbsp;
            <div
              :style="`background:url(${gameInfo?.url_thumb}) center center / cover no-repeat; background-size:cover;`"
            >
              <!--                                <span></span>-->
            </div>
          </dt>
          <dd>
            <h2>{{ gameInfo.title }}<span></span></h2>
            <h3 @click="moveUserPage" style="cursor: pointer">
              By

              {{ gameInfo.user?.name }}
            </h3>

            <div class="tag-item secondary">
              <a v-for="hashtag in hashtags" :key="hashtag">{{ hashtag }}</a>
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
          v-if="gameInfo.stage !== eGameStage.DEV"
          @click="playGame"
          class="btn-default w150"
          style="margin-left: 12px"
          >Play Game</a
        >
      </dd>
    </dl>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash'
import { ElMessage, ElMessageBox, ElLoading, ElTooltip } from 'element-plus'
import { IGame, eGameStage } from '~~/types'
import { useLocalePath } from 'vue-i18n-routing'
import { PropType } from 'vue'
import { useI18n } from 'vue-i18n'

const IMAGE_MAX_SIZE = 4

const { t, locale } = useI18n()
const localePath = useLocalePath()
const router = useRouter()

const hashtags = computed(() =>
  props.gameInfo.hashtags.length > 0
    ? props.gameInfo.hashtags.split(',')
    : undefined
)

const props = defineProps({
  gameInfo: Object as PropType<IGame>,
})

const isMine = computed(
  () => props.gameInfo?.user.id === useUser().user.value.info?.id
)
const isLike = ref(props.gameInfo?.is_like)
const likeCnt = ref(props.gameInfo?.count_heart)
const bannerImg = ref()
const bannerFile = ref<File>()
const prevBanner = ref<String | ArrayBuffer>(props.gameInfo?.url_banner)

function playGame() {
  window.open(`/play/${props.gameInfo.pathname}`, '_blank')
}

//TODO: 중복 클릭 처리는 디바운스로 할지 세마포어로 할지 모르겟음
const setLike = _.debounce(async () => {
  isLike.value = true

  const payload = {
    game_id: props.gameInfo.id,
    on: true,
  }
  const { data, error, refresh } = await useFetch(
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
    game_id: props.gameInfo.id,
    on: false,
  }
  const { data, error, refresh } = await useFetch(
    `/game/heart`,
    getZempieFetchOptions('post', true, payload)
  )
  if (!error.value) {
    likeCnt.value--
  }
}, 300)

function uploadBanner() {
  bannerImg.value.click()
}

function onBannerChange(event: any) {
  const file = event.target.files[0]

  if (file.size < 1024 * 1024 * IMAGE_MAX_SIZE) {
    // this.fileName = event.target.files[0].name
    bannerFile.value = file
    // this.checkActivePublish();
    const reader = new FileReader()
    reader.onload = (e) => {
      prevBanner.value = e.target!.result
      // this.$store.commit('thumbFile', this.thumbFile)

      // localStorage.setItem('thumbnail', this.prevThumbnail);
      // isThumbErr.value = false
    }
    reader.readAsDataURL(file)
  } else {
    ElMessage.error(t('maxFile.size.4mb'))
  }
}

async function saveBanner() {
  const formData = new FormData()
  formData.append('game_id', String(props.gameInfo.id))
  formData.append('file', bannerFile.value)

  const { data, error, pending } = await useFetch(
    '/game/banner',
    getZempieFetchOptions('post', true, formData)
  )
}

async function updateBanner() {
  console.log('updateBanner')
}

async function deleteBanner() {
  const { data, error, pending } = await useFetch(
    '/game/banner',
    getZempieFetchOptions('delete', true)
  )
}

function moveUserPage() {
  router.push(localePath(`/channel/${props.gameInfo.user.channel_id}`))
}
</script>

<style lang="scss" scoped>
.like-btn {
  height: 65px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
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
}

@media all and (min-width: 480px) and (max-width: 767px) {
  .visual-info-left {
    width: 100%;
    dl {
      padding: 0px;
    }
  }
}

@media all and (min-width: 768px) and (max-width: 991px) {
}

@media all and (min-width: 992px) and (max-width: 1199px) {
}

@media all and (min-width: 1200px) {
}
</style>

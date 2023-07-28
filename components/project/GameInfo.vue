<template>
  <div class="studio-upload-input">
  
    <div class="sui-input">
      <div class="suii-title">{{ $t('addGameInfo.title') }}</div>
      <dl class="suii-content">
        <dt>
          {{ $t('addGameInfo.game.title') }}
          <span class="text-red">*</span>
        </dt>
        <dd>
          <input v-model="v$.name.$model" type="text" name="title" title="game title" id="gameTitle"
            :placeholder="$t('addGameInfo.game.title')" class="w100p" />
          <TransitionGroup name="fade">
            <p class="input-errors" v-for="error of v$.name.$errors" :key="error.$uid">
              <i class="uil uil-check"></i>{{ error.$message }}
            </p>
          </TransitionGroup>
        </dd>
      </dl>

      <dl class="suii-content">
        <dt>
          {{ $t('addGameInfo.game.desc') }}<span class="text-red">*</span>
        </dt>
        <dd>
          <textarea v-model="v$.description.$model" name="description" title="game description" id="gameDesc"
            :placeholder="$t('addGameInfo.game.desc')" class="w100p h100"></textarea>

          <TransitionGroup name="fade">
            <p class="input-errors" v-for="error of v$.description.$errors" :key="error.$uid">
              <i class="uil uil-check"></i>{{ error.$message }}
            </p>
          </TransitionGroup>
        </dd>
      </dl>
      <dl class="suii-content">
        <dt>
          {{ $t('addGameInfo.game.tags') }}<span class="text-red">*</span>
        </dt>
        <dd>
          <div class="chip-container">
            <div class="chip" v-for="(chip, i) of hashtagsArr" :key="chip.id">
              {{ chip }}
              <i class="uil uil-times" @click="deleteChip(i)"></i>
            </div>

            <input id="gameTag" v-model="chipInput" @blur="saveChip" @keyup.enter="saveChip"
              @keydown.delete="backspaceDelete" />
          </div>
          <TransitionGroup name="fade">
            <p class="input-errors" v-for="error of v$.hashtags.$errors" :key="error.$uid">
              <i class="uil uil-check"></i>{{ error.$message }}
            </p>
          </TransitionGroup>
          <p class="mt10">
            {{ $t('addGameInfo.game.tags.info') }}
          </p>
        </dd>
      </dl>

      <dl class="suii-content">
        <dt>
          {{ $t('addGameInfo.game.thumbnail') }}
          <span class="text-red">*</span>
        </dt>
        <dd>
          <ul class="image-upload">
            <li>
              <div :style="prevThumbnail && {
                background:
                  'url(' +
                  prevThumbnail +
                  ') center center / cover no-repeat',
                'background-size': 'cover',
                border: '#e9e9e9 2px solid',
              }
                ">
                <div style="height: 0px; overflow: hidden">
                  <input id="image-selector" type="file" @change="onImgChange"
                    accept="image/jpeg, image/png, image/svg, image/jpg, image/webp, image/bmp," ref="thumbnail"
                    name="fileInput" />
                </div>
                <template v-if="!prevThumbnail">
                  <p><i class="uil uil-image-v"></i></p>
                  <h2>
                    {{ $t('addGameInfo.game.thumbnail.size') }} 512* 512<br />
                    (up to 4MB)
                  </h2>
                </template>
              </div>

              <transition name="component-fade" mode="out-in">
                <p class="valid-err" :class="isThumbErr ? 'active' : ''">
                  {{ $t('addGameInfo.game.thumbnail.err') }}
                </p>
              </transition>
              <p style="
                            width: 100%;
                            display: flex;
                            justify-content: space-around;
                          ">
                <button class="btn-gray" @click="uploadThumbnail">
                  <i class="uil uil-upload"></i>&nbsp;
                  {{ $t('addGameInfo.game.thumbnail') }}
                </button>
                <button v-if="prevThumbnail" class="btn-circle-icon" @click="deleteThumbnail">
                  <i class="uil uil-trash-alt"></i>
                </button>
              </p>
            </li>
          </ul>
        </dd>
      </dl>
      <dl class="suii-content">
        <dt>
          {{ $t('previewImage.title') }}
          <el-tooltip effect="customized" :content="$t('studio.preview.info')" placement="bottom">
            <i class="uil uil-question-circle" style="color: #999"></i>
          </el-tooltip>
        </dt>

        <dd>
          <ul class="image-upload">
            <li>
              <div :style="prevGif && {
                background:
                  'url(' +
                  prevGif +
                  ') center center / cover no-repeat',
                'background-size': 'cover',
                border: '#e9e9e9 2px solid',
              }
                ">
                <div style="height: 0px; overflow: hidden">
                  <input type="file" @change="onGifChange" accept=image/gif ref="gifThumbnail" name="fileInput" />
                </div>
                <template v-if="!prevGif">
                  <p><i class="uil uil-image-v"></i></p>
                  <h2>
                    {{ $t('addGameInfo.game.thumbnail.size') }} 512* 512<br />
                    (up to 4MB)
                  </h2>
                </template>
              </div>
              <p style="
                                                                                  width: 100%;
                                                                                  display: flex;
                                                                                  justify-content: space-around;
                                                                                ">
                <button class="btn-gray" @click="uploadGif">
                  <i class="uil uil-upload"></i>
                  {{ $t('addGameInfo.game.thumbnail') }}
                </button>
                <button v-if="prevGif" class="btn-circle-icon" @click="deleteGif">
                  <i class="uil uil-trash-alt"></i>
                </button>
              </p>
            </li>
          </ul>
        </dd>
      </dl>

      <dl class="suii-content">
        <dt style="padding-top: 5px">{{ $t('auto.game.id.generator') }}</dt>
        <dd>
          <label class="switch-button">
            <input type="checkbox" v-model="isAuthGamePath" />
            <span class="onoff-switch"></span>
          </label>
        </dd>
      </dl>
      <transition name="component-fade" mode="out-in">
        <dl class="suii-content" v-if="!isAuthGamePath">
          <dt>
            {{ $t('addGameInfo.game.id') }}
          </dt>
          <dd>
            <input v-model="v$.pathname.$model" type="text" class="game-id-input w90p" :title="$t('addGameInfo.game.id')"
              :placeholder="$t('addGameInfo.game.id')" @input="onInputPathname" />
            <transition name="component-fade" mode="out-in">
              <p class="valid-err" :class="hasPathnameErr && 'active'">
                {{ pathnameValidErrMsg }}
              </p>
            </transition>
          </dd>

          <!-- <ClipLoader v-if="waitGamePath" :color="'#ff6e17'" :size="'20px'"></ClipLoader> -->
          <!-- <a @click="checkPathName" class="btn-default w150">
                {{ $t('addGameInfo.game.id.check') }}
              </a> -->
        </dl>
      </transition>
    </div>
    <ul class="sui-btn" style="justify-content: flex-end">
      <li>
        <a @click="uploadGame" class="btn-default w150">
          {{ $t('upload') }}
        </a>
      </li>
    </ul>

  </div>
</template>
<script setup lang="ts">
import axios from 'axios'
import { required, helpers, maxLength } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import { eGameType, eGameCategory, eGameStage } from '~~/types';
import { ElMessage, ElLoading, ElProgress, ElTooltip } from 'element-plus'

const { t, locale } = useI18n()
const config = useRuntimeConfig()

const isAuthGamePath = ref(true)

const hashtagsArr = ref([])
const chipInput = ref('')

const thumbnail = ref<HTMLElement>()
const thumbFile = ref<File>()
const prevThumbnail = ref<String | ArrayBuffer>('')
const isThumbErr = ref(false)

const gifThumbnail = ref<HTMLElement>()
const gifThumFile = ref<File>()
const prevGif = ref<String | ArrayBuffer>('')

let form = reactive({
  name: '',
  pathname: '',
  description: '',
  hashtags: '',
  project_picture: null,
  project_picture2: null,
})

const rules = computed(() => {
  const formRule = {
    name: {
      required: helpers.withMessage(t('addGameInfo.game.title.err'), required),
    },
    pathname: { required },
    description: {
      required: helpers.withMessage(t('addGameInfo.game.desc.err'), required),
    },
    hashtags: {
      required: helpers.withMessage(t('addGameInfo.game.tags.err'), required),
    },
  }

  return formRule
})

const v$ = useVuelidate(rules, form)

const props = defineProps({
  savedFileId:Number
})
function saveChip() {
  if (
    !hashtagsArr.value.includes(chipInput.value.trim()) &&
    !!chipInput.value.trim()
  ) {
    hashtagsArr.value.indexOf(chipInput.value) === -1 &&
      hashtagsArr.value.push(chipInput.value.trim())
  }

  chipInput.value = ''
}



function backspaceDelete({ which }) {
  which == 8 &&
    chipInput.value === '' &&
    hashtagsArr.value.splice(hashtagsArr.value.length - 1)
}
function loadAutoSave() {

}

async function uploadGame( ){
  const formData = new FormData()


  for (let k in form) {
    formData.append(k, form[k])
  }

  formData.append('category', eGameCategory.Challenge)
  formData.append('file_type', eGameType.Html)
  formData.append('support_platform', '0')
  formData.append('mogera_file_id', props.savedFileId)
  formData.append('stage', String(eGameStage.EARLY))

  const loading = ElLoading.service({
    lock: true,
    text: `Loading...`,
    customClass: 'loading-spinner',
    background: 'rgba(0, 0, 0, 0.7)',
  })
    //onUploadProgress 사용을 위해서 axios 사용.. ohmyfetch가 지원하면 그때 수정
    axios('/studio/project', {
    method: 'post',
    baseURL: config.STUDIO_API,
    data: formData,
    headers: {
      'Context-Type': 'multipart/form-data',
      Authorization: `Bearer ${useUser().user.value.fUser.accessToken}`
    },
    onUploadProgress: (e) => {
      const percentage = Math.round((e.loaded * 100) / e.total)
      loading.setText(`Loading...${percentage}%`)

      if (Number(percentage) === 100) {
        loading.setText('파일이 업로드되었습니다. 잠시만 기다려주세요')

      }
    }
  })
    .then(() => {
      router.push($localePath('/project/list'))
    })
    .finally(() => {
      loading.close()
    })
}
</script>
<style scoped lang="scss">


.chip-container {
  min-height: 48px;
  padding: 0 15px;
  border: #e9e9e9 1px solid;
  border-radius: 5px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  .chip {
    height: 30px;
    color: #fff;
    margin: 4px;
    background: #ff6e17;
    padding: 0px 10px;
    border-radius: 20px;
    display: flex;
    align-items: center;

    i {
      cursor: pointer;
      opacity: 0.56;
      margin-left: 8px;
    }
  }

  input {
    flex: 1 1 auto;
    width: 30px;
    border: none;
    outline: none;
    padding: 4px;
  }
}
</style>
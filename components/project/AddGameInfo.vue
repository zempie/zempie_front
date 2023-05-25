<template>
  <ProjectStepMenu>
    <template #uploadGameBtn>
      <li v-if="isEditInfo" class="publish-btn">
        <h4 class="active" @click="updateGame">{{ $t('update') }}</h4>
      </li>
      <li v-else class="publish-btn">
        <h4 :class="uploadStage === eGameStage.DEV && 'active'" @click="uploadGame">
          {{ $t('publishing') }}
        </h4>
      </li>
    </template>
  </ProjectStepMenu>
  <dd>
    <div class="studio-upload-input">
      <template v-if="!isFormDone">
        <div class="sui-input">
          <div v-if="uploadStage === eGameStage.DEV" class="dev-warning">{{ $t('dev.log.warning') }}</div>
          <div class="suii-title">{{ $t('addGameInfo.title') }}</div>
          <dl class="suii-content">
            <dt>
              {{ $t('addGameInfo.game.title') }}
              <span style="color: red">*</span>
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
              {{ $t('addGameInfo.game.desc') }}<span style="color: red">*</span>
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
              {{ $t('addGameInfo.game.tags') }}<span style="color: red">*</span>
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
              <span style="color: red">*</span>
            </dt>
            <dd>
              <ul class="image-upload">
                <li>
                  <div :style="
                    prevThumbnail && {
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
                  <div :style="
                    prevGif && {
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
                <input v-model="v$.pathname.$model" type="text" class="game-id-input w90p"
                  :title="$t('addGameInfo.game.id')" :placeholder="$t('addGameInfo.game.id')" @input="onInputPathname" />
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
        <ul class="sui-btn">
          <li>
            <a @click="prevPage" class="btn-line w150"><i class="uil uil-angle-left-b"></i>
              {{ $t('previous') }}
            </a>
          </li>
          <li>
            <a v-if="isEditInfo" @click="updateGame" class="btn-default w150">
              {{ $t('update') }}
            </a>
            <a v-else-if="uploadProject.form.stage === eGameStage.DEV" @click="uploadGame" class="btn-default w150">
              {{ $t('upload') }}
            </a>
            <a v-else @click="save" class="btn-default w150">
              {{ $t('next') }}
              <i class="uil uil-angle-right-b"></i></a>
          </li>
        </ul>
        <div v-if="editProject.info?.id" class="sui-input" style="margin-top: 100px">
          <dl class="suii-content delete-area">
            <dt>
              {{ $t('addGameInfo.delete.game') }}
            </dt>
            <dd class="game-delete-btn">
              <a @click="isDeleteModalOpen = true" class="btn-default w150">
                {{ $t('addGameInfo.delete') }}
              </a>
            </dd>
          </dl>
        </div>
      </template>

      <ProjectAddGameFile v-else-if="isFormDone && uploadProject.form.stage !== 1" @cancelFormDone="isFormDone = false"
        @uploadDone="isUploadDone = true" />
    </div>
    <el-dialog v-model="isDeleteModalOpen" append-to-body class="modal-area-type" width="380px">
      <div class="modal-alert">
        <dl class="ma-header">
          <dt>
            {{ $t('addGameInfo.info') }}
          </dt>
          <dd>
            <button @click="isDeleteModalOpen = false">
              <i class="uil uil-times"></i>
            </button>
          </dd>
        </dl>
        <div class="ma-content">
          <h2>
            {{ $t('addGameInfo.delete.modal') }}
            <br />
            {{ $t('addGameInfo.delete.modal.confirm') }}
          </h2>
          <div>
            <button class="btn-default w48p" @click="deleteProject">
              {{ $t('yes') }}
            </button>
            <button class="btn-gray w48p" @click="isDeleteModalOpen = false">
              {{ $t('no') }}
            </button>
          </div>
        </div>
      </div>
    </el-dialog>
  </dd>
</template>

<script setup lang="ts">
import {
  ElMessage,
  ElMessageBox,
  ElLoading,
  ElTooltip,
  ElDialog,
} from 'element-plus'

import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import { eGameCategory, eGameStage } from '~~/types'
import useVuelidate from '@vuelidate/core'
import { required, helpers, maxLength } from '@vuelidate/validators'
import { useI18n } from 'vue-i18n'
import { debounce, randomString } from '~~/scripts/utils.js'
const { $localePath } = useNuxtApp()

const IMAGE_MAX_SIZE = 4

const { t, locale } = useI18n()
const router = useRouter()
const {
  uploadProject,
  editProject,
  resetStage,
  setForm,
  resetForm,
  setStepTwo,
  resetProjectInfo,
  setStepThree,
  resetPurpose
} = useProject()
const isAuthGamePath = ref(true)
const confirmedGamePath = ref()

const hashtagsArr = ref([])
const chipInput = ref('')
const isFormDone = ref(false)
const isUploadDone = ref(false)

const thumbnail = ref<HTMLElement>()
const thumbFile = ref<File>()
const prevThumbnail = ref<String | ArrayBuffer>('')
const isThumbErr = ref(false)

const gifThumbnail = ref<HTMLElement>()
const gifThumFile = ref<File>()
const prevGif = ref<String | ArrayBuffer>('')

const uploadStage = computed(() => uploadProject.value.form.stage)

//게임 id(pathname)
const hasPathnameErr = ref(false)
const pathnameValidErrMsg = ref()
const originPathname = ref('')

const isFlutter = computed(() => useMobile().mobile.value.isFlutter)

//게임 정보 수정
const isEditInfo = ref(false)

let form = reactive({
  name: '',
  pathname: '',
  description: '',
  hashtags: '',
  stage: computed(() => uploadProject.value.form.stage).value,
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

const waitGamePath = ref(false)

const isDeleteModalOpen = ref(false)


onMounted(() => {
  // console.log('useProject().uploadProject.value.form', editProject.value.info)
  window.addEventListener('beforeunload', refreshPage)
  //게임 정보 수정
  if (editProject.value.info?.id) {
    isEditInfo.value = true
    setStepThree()
    const { stage, name, description, hashtags, game, picture, picture2 } =
      editProject.value.info
    form.pathname = game.pathname
    form.description = description
    hashtagsArr.value = hashtags ? hashtags.split(',') : []
    form.hashtags = hashtags
    form.name = name
    form.stage = stage
    prevThumbnail.value = picture
    prevGif.value = picture2
    originPathname.value = game.pathname

  } else {
    //게임 정보 입력
    if (useProject().uploadProject.value.form.stage !== eGameStage.NONE) {
      const {
        stage,
        name,
        pathname,
        description,
        hashtags,
        project_picture,
        project_picture2,
      } = useProject().uploadProject.value.form
      form.description = description
      hashtagsArr.value = hashtags ? hashtags.split(',') : []
      form.hashtags = hashtags
      form.name = name
      form.pathname = pathname
      form.project_picture = project_picture
      form.project_picture2 = project_picture2
      form.stage = stage

      originPathname.value = pathname
    }
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', refreshPage)
  // setStepOne()
  // resetPurpose()
  // useProject().resetForm()
  // useProject().resetProjectInfo()
})

function refreshPage(event) {
  event.preventDefault()

  event.returnValue = `${t('leave.router.warning')}`
}

function prevPage() {
  form.hashtags = hashtagsArr?.value.toString()
  form.project_picture = thumbFile?.value
  form.project_picture2 = gifThumFile?.value

  setForm(form)
  resetStage()
  setStepTwo()
  if (editProject.value.info?.id) useProject().setStepTwoOnEdit()
}

async function checkPathName() {
  waitGamePath.value = true

  if (form.pathname) {
    const { data, error } = await game.verifyPath(form.pathname)
    console.log(data.value.result)
    if (data.value.result) {
      const { success } = data.value.result
      if (success) {
        hasPathnameErr.value = false
      } else {
        hasPathnameErr.value = true
        pathnameValidErrMsg.value = t('game.pathname.duplicated')
      }
    }

    // const result = await this.$api.confirmGamePath(this.gamePath)
    // if (result && result.success) {
    //   this.confirmedGamePath = true;
    //   this.gamePathError = "";
    // }
    // else {
    //   this.gamePathError = `${this.$t('usedId')}`;// '사용중인 아이디 입니다. 다른 아이디를 입력하세요.';
    // }
  }
  waitGamePath.value = false
}

async function save() {
  form.hashtags = hashtagsArr.value.toString()
  form.project_picture = thumbFile.value
  form.project_picture2 = gifThumFile.value
  await createGamePath()
  const isValid = await v$.value.$validate()

  if (!thumbFile.value) isThumbErr.value = true

  if (!isValid || isThumbErr.value) return
  setForm(form)
  isFormDone.value = true

  useProject().setStepFour()
}

async function uploadGame() {
  form.hashtags = hashtagsArr.value.toString()

  if (uploadProject.value.form.stage !== eGameStage.DEV) return

  await save()

  //  const {gameInfoObj, gameFileInfoObj, uploadGameFiles} = this.$store.getters;
  const formData = new FormData()
  for (let k in form) {
    formData.append(k, form[k])
  }
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    customClass: 'loading-spinner',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  const { data, error } = await game.upload(formData)

  if (!error.value) {
    isUploadDone.value = true
    setTimeout(() => {
      loading.close()
      setStepTwo()
      resetForm()

      router.push($localePath('/project/list'))
    }, 1000)
  }

  //  this.$api.createProject(
  //      gameInfoObj,
  //      gameFileInfoObj,
  //      uploadGameFiles
  //  )
  //      .then((res) => {
  //          this.toast.successToast(`${this.$t('devLog.upload.done')}`);
  //          this.$router.push(`/${this.$i18n.locale}/projectList`)
  //      })
  //      .catch((err) => {
  //      })
}

async function createGamePath() {
  let count = 0
  while (!confirmedGamePath.value && count < 10) {
    count++
    form.pathname = randomString(11)
    const { data } = await game.verifyPath(form.pathname)

    if (data.value) {
      confirmedGamePath.value = true
    }
  }
}

async function uploadThumbnail() {
  thumbnail.value.click()
}

function onImgChange(event: any) {
  const file = event.target.files[0]

  if (file.size < 1024 * 1024 * IMAGE_MAX_SIZE) {
    thumbFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      prevThumbnail.value = e.target!.result
      isThumbErr.value = false
    }
    reader.readAsDataURL(file)
  } else {
    ElMessage.error(t('maxFile.size.4mb'))
  }

  event.target.value = ''
}

function deleteThumbnail() {
  prevThumbnail.value = ''
}

function uploadGif() {
  gifThumbnail.value.click()
}
function onGifChange(event: any) {
  const gifFile = event.target.files[0]

  if (gifFile.size < 1024 * 1024 * IMAGE_MAX_SIZE) {
    gifThumFile.value = gifFile
    const reader = new FileReader()
    reader.onload = (e) => {
      prevGif.value = e.target!.result
    }
    reader.readAsDataURL(gifFile)
  } else {
    ElMessage.error(t('maxFile.size.4mb'))
  }
  event.target.value = ''
}

function deleteGif() {
  prevGif.value = ''
}
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

function deleteChip(index: number) {
  hashtagsArr.value.splice(index, 1)
}

function backspaceDelete({ which }) {
  which == 8 &&
    chipInput.value === '' &&
    hashtagsArr.value.splice(hashtagsArr.value.length - 1)
}

const onInputPathname = debounce(async () => {
  checkPathName()
}, 300)

async function updateGame() {

  if (hasPathnameErr.value) return

  isUploadDone.value = true
  form.hashtags = hashtagsArr.value.toString()


  form['file'] = form.project_picture
  form.file = thumbFile.value ?? null
  delete form.project_picture

  form['file2'] = form.project_picture2
  form.file2 = gifThumFile.value ?? null
  delete form.project_picture2

  if (prevThumbnail.value) isThumbErr.value = false

  const isValid = await v$.value.$validate()
  if (!isValid || isThumbErr.value) return

  const formData = new FormData()

  if (useProject().editProject.value.purpose === eGameCategory.NONE) {
    useProject().editProject.value.purpose = useProject().editProject.value.info.game.category
  }
  formData.append('category', useProject().editProject.value.purpose.toString())

  for (let k in form) {
    formData.append(k, form[k])
  }

  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    customClass: 'loading-spinner',
    background: 'rgba(0, 0, 0, 0.7)',
  })

  const { data, error } = await useCustomAsyncFetch(
    `/studio/project/${editProject.value.info.id}`,
    getStudioFetchOptions('post', true, formData)
  )

  setTimeout(() => {
    loading.close()
    useProject().resetProjectInfo()
    if (!error.value) {
      router.push($localePath('/project/list'))
    }
  }, 1000)
}

async function deleteProject() {
  const { data, error } = await project.delete(editProject.value.info.id)

  if (data.value) {
    resetProjectInfo()
    isDeleteModalOpen.value = false
    router.replace($localePath('/project/list'))

    ElMessage({
      message: t('deleted.game.success.msg'),
      type: 'success',
    })
  } else if (error.value) {
    ElMessage.error(t('deleted.game.fail.msg'))
  }
}
</script>

<style scoped lang="scss">
.studio-upload-input {
  .dev-warning {
    height: 45px;
    background-color: #fffdc1;
    border-bottom: 1px solid #ededed;
    border-top: 1px solid #ededed;
    font-size: 14px;
    text-align: center;
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: center;
    color: #888;
  }
}

.input-errors {
  font-size: 12px;
  color: #c5292a;
}

.game-id-input:focus {
  box-shadow: 0px 4px 10px 3px rgb(0 0 0 / 0%) !important;
  border: #e9e9e9 1px solid !important;
}

.delete-area {
  border-top: 0px !important;
}

.game-delete-btn {
  display: flex;
  justify-content: flex-end;

  a {
    background-color: #c5292a;
  }
}

.game-delete-btn:hover {
  a {
    background-color: #c5292a4a;
    color: #c5292a;
  }
}

.btn-line {
  height: 40px;
}

//validation
.valid-err {
  color: #c5292a;
  display: none;

  &.active {
    display: inline-block;
  }
}

// /validation

//transition
.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.3s ease;
}

.component-fade-enter,
.component-fade-leave-to

/* .component-fade-leave-active below version 2.1.8 */
  {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// chips
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

.publish-btn {
  .active {
    background-color: #ff6e17;
    color: #fff;
    cursor: pointer;
  }
}
</style>

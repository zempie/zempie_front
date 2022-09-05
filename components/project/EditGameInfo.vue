<template>
  <dt>
    <ul class="studio-upload-step">
      <li :class="[editProject.step === 1 ? 'active' : '', 'step']">
        <p>STEP 01</p>
        <h3>{{ $t('uploadGame.selectStage.text') }}</h3>
      </li>
      <li :class="[editProject.step === 2 ? 'active' : '', 'step']">
        <p>STEP 02</p>
        <h3>{{ $t('game.info') }}</h3>
      </li>
      <li :class="[editProject.step === 3 ? 'active' : '', 'step']">
        <p>STEP 03</p>
        <h3>{{ $t('file.upload') }}</h3>
      </li>
      <li class="publish-btn">
        <h4 class="active" @click="updateProject">{{ $t('update') }}</h4>
      </li>
    </ul>
  </dt>
  <dd>
    <div class="studio-upload-input">
      <div class="sui-input">
        <div class="suii-title">{{ $t('addGameInfo.title') }}</div>
        <dl class="suii-content">
          <dt>
            {{ $t('addGameInfo.game.title') }}
            <span style="color: red">*</span>
          </dt>
          <dd>
            <input
              v-model="v$.name.$model"
              type="text"
              name=""
              title=""
              :placeholder="$t('addGameInfo.game.title')"
              class="w100p"
            />
            <p
              class="input-errors"
              v-for="error of v$.name.$errors"
              :key="error.$uid"
            >
              <i class="uil uil-check"></i>{{ error.$message }}
            </p>
          </dd>
        </dl>
        <dl class="suii-content">
          <dt>
            {{ $t('addGameInfo.game.desc') }}<span style="color: red">*</span>
          </dt>
          <dd>
            <textarea
              v-model="v$.description.$model"
              name=""
              title=""
              :placeholder="$t('addGameInfo.game.desc')"
              class="w100p h100"
            ></textarea>
            <p
              class="input-errors"
              v-for="error of v$.description.$errors"
              :key="error.$uid"
            >
              <i class="uil uil-check"></i>{{ error.$message }}
            </p>
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
              <input
                v-model="chipInput"
                @blur="saveChip"
                @keyup.enter="saveChip"
                @keydown.delete="backspaceDelete"
              />
            </div>
            <TransitionGroup name="fade">
              <p
                class="input-errors"
                v-for="error of v$.hashtags.$errors"
                :key="error.$uid"
              >
                <i class="uil uil-check"></i>{{ error.$message }}
              </p>
            </TransitionGroup>
            <h2>
              {{ $t('addGameInfo.game.tags.info') }}
            </h2>
          </dd>
        </dl>

        <dl class="suii-content">
          <dt>
            {{ $t('addGameInfo.game.thumbnail') }}
            <span style="color: red">*</span>
          </dt>
          <dd>
            <ul class="image-upload">
              <li v-if="!prevImg">
                <div>
                  <div style="height: 0px; overflow: hidden">
                    <input
                      type="file"
                      @change="onImgFileChange"
                      accept="image/jpeg, image/png, image/svg, image/jpg, image/webp, image/bmp,"
                      ref="thumbnail"
                      name="fileInput"
                    />
                  </div>
                  <p><i class="uil uil-image-v"></i></p>
                  <h2>
                    {{ $t('addGameInfo.game.thumbnail.size') }} 512* 512<br />
                    (up to 4MB)
                  </h2>
                </div>

                <transition name="component-fade" mode="out-in">
                  <p class="valid-err" :class="isThumbErr ? 'active' : ''">
                    {{ $t('addGameInfo.game.thumbnail.err') }}
                  </p>
                </transition>
                <p>
                  <button class="btn-gray" @click="uploadFile">
                    <i class="uil uil-upload"></i>&nbsp;
                    {{ $t('addGameInfo.game.thumbnail') }}
                  </button>
                </p>
              </li>
              <li v-else>
                <div
                  :style="{
                    background:
                      'url(' + prevImg + ') center center / cover no-repeat',
                    'background-size': 'cover',
                  }"
                  style="border: #e9e9e9 2px solid"
                >
                  <div style="height: 0px; overflow: hidden">
                    <input type="file" @change="onImgFileChange" accept=image/*
                    ref="thumbnail" name="fileInput" />
                  </div>
                </div>

                <p style="width: 130%; text-align: left">
                  <button class="btn-gray" @click="uploadFile">
                    <i class="uil uil-upload"></i>&nbsp;
                    {{ $t('addGameInfo.game.thumbnail') }}
                  </button>
                  &nbsp; &nbsp;
                  <button class="btn-circle-icon" @click="deleteThumbnail">
                    <i class="uil uil-trash-alt"></i>
                  </button>
                </p>
              </li>
            </ul>
          </dd>
        </dl>
        <dl class="suii-content">
          <dt>{{ $t('previewImage.title') }}</dt>
          <dd>
            <ul class="image-upload">
              <li v-if="!prevGif">
                <div>
                  <div style="height: 0px; overflow: hidden">
                    <input type="file" @change="onGifChange" accept=image/gif
                    ref="thumbnailGif" name="fileInput" />
                  </div>
                  <p><i class="uil uil-image-v"></i></p>
                  <h2>
                    {{ $t('addGameInfo.game.thumbnail.size') }} 512* 512<br />
                    (up to 4MB)
                  </h2>
                </div>
                <p>
                  <button class="btn-gray" @click="uploadGif">
                    <i class="uil uil-upload"></i>&nbsp;
                    {{ $t('addGameInfo.game.thumbnail') }}
                  </button>
                </p>
              </li>
              <li v-else>
                <div
                  :style="{
                    background:
                      'url(' + prevGif + ') center center / cover no-repeat',
                    'background-size': 'cover',
                  }"
                  style="border: #e9e9e9 2px solid"
                >
                  <div style="height: 0px; overflow: hidden">
                    <input type="file" @change="onGifChange" accept=image/*
                    ref="thumbnailGif" name="fileInput" />
                  </div>
                </div>
                <p style="width: 130%; text-align: left">
                  <button class="btn-gray" @click="uploadGif">
                    <i class="uil uil-upload"></i>&nbsp;
                    {{ $t('addGameInfo.game.thumbnail') }}</button
                  >&nbsp; &nbsp;
                  <button class="btn-circle-icon" @click="deleteThumbGif">
                    <i class="uil uil-trash-alt"></i>
                  </button>
                </p>
              </li>
            </ul>
          </dd>
        </dl>

        <Transition name="component-fade" mode="out-in">
          <dl class="suii-content">
            <dt>
              {{ $t('addGameInfo.game.id') }}
            </dt>
            <dd>
              <input
                v-model="v$.pathname.$model"
                type="text"
                name=""
                class="game-id-input w100p"
                title=""
                placeholder=""
              />
              <!-- <p style="color: #C5292A; margin-top:10px">{{ gamePathError }}</p>
            <p v-if="confirmedGamePath" style="color: #1fc944; margin-top:10px">
              {{ $t('addGameInfo.game.id.passed') }}
            </p> -->
            </dd>
            <!-- <a @click="checkGamePath" class="btn-default w150" v-if="!projectInfo">
            {{ $t('addGameInfo.game.id.check') }}
          </a> -->
          </dl>
        </Transition>
      </div>
      <ul class="sui-btn">
        <li>
          <a @click="prevPage" class="btn-line w150"
            ><i class="uil uil-angle-left-b"></i>
            {{ $t('previous') }}
          </a>
        </li>
        <li>
          <!-- <a v-if="ableFileUpload()" @click="save" class="btn-default w150">
                    {{ $t('next') }}
                    <i class="uil uil-angle-right-b"></i></a> -->

          <a @click="updateProject" class="btn-default w150">
            {{ $t('update') }}
          </a>
        </li>
      </ul>

      <div class="sui-input" style="margin-top: 100px">
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
      <!-- <ClientOnly>
      <el-dialog v-model="isDeleteModalOpen" append-to-body custom-class="modal-area-type" width="90%">
        <div class="modal-alert">
          <dl class="ma-header">
            <dt>
              {{ $t('addGameInfo.info') }}
            </dt>
            <dd>
              <button @click="isDeleteModalOpen = false"><i class="uil uil-times"></i></button>
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

    </ClientOnly> -->
    </div>
  </dd>
</template>

<script setup lang="ts">
import useVuelidate from '@vuelidate/core'
import { required, helpers, maxLength } from '@vuelidate/validators'
import { ElMessage, ElLoading } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { randomString } from '~~/scripts/utils.js'
import { useLocalePath } from 'vue-i18n-routing'

const localePath = useLocalePath()
const { t, locale } = useI18n()
const router = useRouter()

const isAuthGamePath = ref(true)
const confirmedGamePath = ref()

const isDeleteModalOpen = ref(false)
const hashtagsArr = ref([])
const chipInput = ref('')

let form = reactive({
  name: '',
  pathname: '',
  description: '',
  hashtags: '',
  file: null,
  file2: null,
  stage: 0,
})

const { editProject, resetProjectInfo, setStepTwoOnEdit, setStepOneOnEdit } =
  useProject()

const thumbnail = ref<HTMLElement>()
const prevImg = ref(editProject.value.info.picture)
const thumbFile = ref<File | null>()
const isThumbErr = ref(false)

const prevGif = ref('')
const thumbFileGif = ref<File | string | null>()
const thumbnailGif = ref<HTMLElement>()

watch(
  () => editProject.value.info,
  (newVal) => {
    if (newVal.id) {
      form.name = newVal.name
      form.description = newVal.description
      form.pathname = newVal.game.pathname
      hashtagsArr.value = newVal.hashtags ? newVal.hashtags.split(',') : []
    }
  }
)

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

onMounted(() => {
  setStepTwoOnEdit()
  if (editProject.value.info) {
    const { stage, name, description, hashtags, game } = editProject.value.info
    form.pathname = game.pathname
    form.description = description
    hashtagsArr.value = hashtags ? hashtags.split(',') : []
    form.hashtags = hashtags
    form.name = name
    form.stage = stage
  }
})
// @Prop({default: false}) set!: boolean;
// @Prop() projectInfo !: any;
// @Prop() isEditProject !: any;
// @Prop() isUpdateProject !: any;
// toast = new Toast();
// gameStage = eGameStage;

// title: string = '';
// description: string = '';
// hashtagsArr: string[] = [];
// currentInput = ''
// // chips: string[] = [];
// prevImg: any = '';
// prevGif: any = '';
// thumbFile: any = null;
// gamePath: string = ""
// autoGamePath: boolean = true;

// confirmedGamePath: boolean | null = null;

// isTitleErr: boolean = false;
// isDescErr: boolean = false;
// isHashtagErr: boolean = false;
// isThumbErr: boolean = false;

// thumbFile2: any = null;

// gamePathError: string = "";
// waitGamePath: boolean = false;

// beforeRouteLeave(to, from, next) {
//     if (to.name == "AddGameFile") {
//         next();
//     }
//     else if (
//         this.title ||
//         this.description ||
//         this.hashtagsArr.length > 0
//         // ||  this.thumbFileUrl ||
//         // this.thumbFile2Url
//     ) {
//         if (
//             confirm(
//                 "작성하신 글은 저장되지않고 지워집니다. 이 페이지를 나가시겠습니까?"
//             )
//         ) {
//             this.resetLocalStorage();
//             next();

//         }
//         else {
//         }
//     }
//     else {
//         this.resetLocalStorage();
//         next();
//     }
// }

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

// callLocalStorageData() {
//     this.title = localStorage.getItem('title')!
//     this.description = localStorage.getItem('description')!
//     this.hashtagsArr = localStorage.getItem('hashtagsArr')!.split(',')
// }

// @Watch('projectInfo')
// callUpdateProjectData() {
//     const {name, description, picture, picture2, hashtags, game, stage, picture_webp} = this.projectInfo;
//     const {pathname} = game;

//     this.title = name;
//     this.description = description;
//     this.prevImg = (picture_webp || picture) + '?_=' + Date.now();
//     this.prevGif = picture2;
//     this.gamePath = pathname;
//     this.hashtagsArr = hashtags ? hashtags.split(',') : []
//     this.$store.commit("gameStage", stage);
// }

// init() {
//     this.isTitleErr = false;
//     this.isDescErr = false;
//     this.isHashtagErr = false;
//     this.isThumbErr = false;
// }

// resetLocalStorage() {
//     localStorage.removeItem('title')
//     localStorage.removeItem('description')
//     localStorage.removeItem('hashtagsArr')
//     localStorage.removeItem('thumbnail')
// }

// async checkGamePath() {
//     this.waitGamePath = true;
//     if (this.gamePath) {
//         const result = await this.$api.confirmGamePath(this.gamePath);
//         if (result && result.success) {
//             this.confirmedGamePath = true;
//             this.gamePathError = "";
//         }
//         else {
//             this.gamePathError = `${this.$t('usedId')}`;// '사용중인 아이디 입니다. 다른 아이디를 입력하세요.';
//         }
//     }
//     this.waitGamePath = false;
// }

function prevPage() {
  setStepOneOnEdit()
}

async function uploadGame() {
  await createGamePath()
  const isValid = await v$.value.$validate()

  if (!isValid) return

  //  const {gameInfoObj, gameFileInfoObj, uploadGameFiles} = this.$store.getters;
  const formData = new FormData()
  for (let k in form) {
    formData.append(k, form[k])
  }
  const { data, error } = await game.upload(formData)
  if (!error.value) {
    router.push(localePath('/project/list'))
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

//     await this.commitGameInfo();
//     if (this.isEditProject) {
//         // 개발 단계를 변경하면 업로드한 게임 파일이 삭제됩니다. 개발 단계를 변경하시겠습니까?
//         if (this.$store.getters.gameStage === this.gameStage.Dev) {
//             if (this.projectInfo.projectVersions.length === 0) {
//                 this.$emit('gameInfoDone', true)
//             }else{
//                 this.updateProject();
//                 return;
//             }
//         }
//         else {
//             if (this.projectInfo.projectVersions.length === 0) {
//                 this.$emit('gameInfoDone', true)
//             }else{
//                 this.updateProject();
//                 return;
//             }
//             this.$emit('gameInfoDone', true)
//         }

//     }
//     else {
//         // if (this.$store.getters.gameStage === this.gameStage.Dev) {
//         //     this.uploadGame()

//         // }
//         this.$emit('gameInfoDone', true)
//     }

// }

async function updateProject() {
  form.hashtags = hashtagsArr.value.toString()
  form.file = thumbFile.value ?? null
  form.file2 = thumbFileGif.value ?? null

  const isValid = await v$.value.$validate()
  if (!isValid || isThumbErr.value) return

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

  const { data, error } = await useFetch(
    `/studio/project/${editProject.value.info.id}`,
    getStudioFetchOptions('post', true, formData)
  )

  setTimeout(() => {
    loading.close()
    useProject().resetProjectInfo()
    if (!error.value) {
      router.push(localePath('/project/list'))
    }
  }, 1000)
}

// @Watch('isUpdateProject')
// updateProject() {
//     // if (!this.isUpdateProject ) {
//     //     return;
//     // }
//     if (!this.validityCheck()) {
//         this.$emit('gameInfoDone', false)
//         return;
//     }

//     const option: any = {
//         id: this.projectInfo.id,
//         name: localStorage.getItem('title'),
//         description: localStorage.getItem('description'),
//         hashtags: localStorage.getItem('hashtagsArr'),
//         stage: this.$store.getters.gameStage
//     };

//     console.log('this.thumbFile2', this.thumbFile2)

//     this.$api.updateProject(option, this.thumbFile, this.thumbFile2)
//         .then((res) => {

//             this.$store.dispatch('project', this.projectInfo.id)
//             this.toast.clear();
//             this.toast.successToast(`${this.$t('update.done')}`);
//             this.$router.push(`/${this.$i18n.locale}/projectList`)
//         })
//         .catch((err) => {
//         })
// }

// async commitGameInfo() {

//     if (!this.isEditProject) {
//         if (!this.confirmedGamePath) {
//             if (!this.autoGamePath) {
//                 alert(`${this.$t('check.gameId')}`)

//             }
//             else {
//                 await this.createGamePath();
//                 if (!this.confirmedGamePath) {
//                     return;
//                 }
//             }
//         }
//     }

//     const gameInfo = {
//         name: this.title,
//         description: this.description,
//         pathname: this.gamePath,
//         project_picture: this.thumbFile,
//         project_picture2: this.thumbFile2,
//         hashtags: this.hashtagsArr.toString(),
//         stage: this.$store.getters.gameStage,
//     };

//     // this.$store.commit("uploadGameFiles", []);
//     this.$store.commit("gameFileInfoObj", {});
//     this.$store.commit("gameInfoObj", gameInfo);
// }
function uploadFile() {
  thumbnail.value.click()
}

function onImgFileChange(event: any) {
  const file = event.target.files[0]

  if (file.size < 1024 * 1024 * 4) {
    thumbFile.value = file
    // this.checkActivePublish();
    const reader = new FileReader()
    reader.onload = (e) => {
      prevImg.value = e.target!.result as string
      // this.$store.commit('thumbFile', this.thumbFile)
      isThumbErr.value = false
    }
    reader.readAsDataURL(file)
  } else {
    alert(`${this.$t('maxFile.size.4mb')}`)
  }
}

function deleteThumbnail() {
  prevImg.value = ''
}

function uploadGif() {
  thumbnailGif.value.click()
}

function onGifChange(event: any) {
  const file = event.target.files[0]
  if (file.size < 1024 * 1024 * 4) {
    thumbFileGif.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      prevGif.value = e.target!.result as string
    }
    reader.readAsDataURL(file)
  } else {
    alert(`${this.$t('maxFile.size.4mb')}`)
  }
}

function deleteThumbGif() {
  prevGif.value = ''
  thumbFileGif.value = 'rm_file2'
}

// checkActivePublish() {
//     if (this.$store.getters.gameStage === this.gameStage.Dev) {
//         if (this.title && this.description && this.hashtagsArr.length !== 0 && (this.thumbFile || (this.projectInfo && this.projectInfo.picture))) {
//             this.commitGameInfo();
//             this.$emit('isActivePublish', true)
//         }
//         else {
//             this.$emit('isActivePublish', false)
//         }

//     }

// }

// @Watch('$store.getters.gameStage')
// watchGameStage() {
//     this.checkActivePublish()
// }

async function deleteProject() {
  const { data, error } = await project.delete(editProject.value.info.id)

  if (data.value) {
    resetProjectInfo()
    isDeleteModalOpen.value = false
    router.replace(localePath('/project/list'))

    ElMessage({
      message: t('deleted.game.success.msg'),
      type: 'success',
    })
  } else if (error.value) {
    ElMessage.error(t('deleted.game.fail.msg'))
  }
}

// deleteProject() {
//     this.$api.deleteProject(this.projectInfo.id)
//         .then((res) => {
//             this.$store.getters.projects[this.projectInfo.id] = null;
//             this.toast.clear();
//             this.toast.successToast(`${this.$t('deleted.game.success.msg')}`)
//         })
//         .catch(() => {
//             this.toast.clear();
//             this.toast.failToast(`${this.$t('deleted.game.fail.msg')}`)

//         })
//         .finally(() => {
//             this.$modal.hide('deleteProject')
//             this.$router.replace(`/${this.$i18n.locale}/projectList`);
//         })
// }

// uploadGame() {
//     const {gameInfoObj, gameFileInfoObj, uploadGameFiles} = this.$store.getters;

//     this.$api.createProject(
//         gameInfoObj,
//         gameFileInfoObj,
//         uploadGameFiles
//     )
//         .then((res) => {

//             this.toast.successToast(`${this.$t('devLog.upload.done')}`);
//             this.$router.push(`/${this.$i18n.locale}/projectList`)
//         })
//         .catch((err) => {

//         })
// }

// ableFileUpload() {
//     // if (this.$store.getters.gameStage === eGameStage.Dev) {
//     //     console.log('dev 상태')
//     //     return false;
//     // }
//     // else
//     if (this.projectInfo && this.projectInfo.projectVersions.length !== 0) {
//         return false;
//     }
//     else {
//         return true;
//     }
// }

// /**
//  * tag chips
//  */
// saveChip() {
//     const {hashtagsArr, currentInput, set} = this;
//     if (!_.includes(hashtagsArr, currentInput.trim())) {
//         ((set && hashtagsArr.indexOf(currentInput) === -1) || !set) && hashtagsArr.push(currentInput.trim());
//     }
//     this.currentInput = '';
// }

// deleteChip(index) {
//     this.hashtagsArr.splice(index, 1);
// }

// backspaceDelete({which}) {
//     which == 8 && this.currentInput === '' && this.hashtagsArr.splice(this.hashtagsArr.length - 1);
// }

// /**
//  * 게임 정보 local storage 저장
//  */
// autoSave() {

//     if (this.title) {
//         localStorage.setItem('title', this.title)
//         this.isTitleErr = false;
//     }
//     else {
//         localStorage.removeItem('title')
//     }

//     if (this.description) {
//         localStorage.setItem('description', this.description)
//         this.isDescErr = false;
//     }
//     else {
//         localStorage.removeItem('description')
//     }

//     if (this.currentInput) {
//         this.saveChip();
//     }
//     if (this.hashtagsArr.length > 0) {
//         this.isHashtagErr = false;
//         localStorage.setItem('hashtagsArr', this.hashtagsArr.toString())
//     }
//     else {
//         localStorage.removeItem('hashtagsArr')
//     }
//     this.checkActivePublish();
// }

function backspaceDelete({ which }) {
  which == 8 &&
    chipInput.value === '' &&
    hashtagsArr.value.splice(hashtagsArr.value.length - 1)
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
</script>

<style scoped lang="scss">
.publish-btn {
  .active {
    color: #fff;
    background-color: #ff6e17;
    cursor: pointer;
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

/* .component-fade-leave-active below version 2.1.8 */ {
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

// /chips
</style>

<template>
  <ProjectStepMenu>
    <template #uploadGameBtn>
      <li class="publish-btn">
        <h4 :class="uploadStage === eGameStage.DEV ? 'active' : ''" @click="uploadGame">{{ $t('publishing') }}</h4>
      </li>
    </template>
  </ProjectStepMenu>
  <dd>
    <div class="studio-upload-input">
      <template v-if="!isFormDone">
        <div class="sui-input">
          <div class="suii-title">{{ $t("addGameInfo.title") }}</div>
          <dl class="suii-content">
            <dt>
              {{ $t("addGameInfo.game.title") }}
              <span style="color: red">*</span>
            </dt>
            <dd>
              <input v-model="v$.name.$model" type="text" name="" title="" :placeholder="$t('addGameInfo.game.title')"
                class="w100p" />
              <TransitionGroup name="fade">

                <p class="input-errors" v-for="error of v$.name.$errors" :key="error.$uid">
                  <i class="uil uil-check"></i>{{ error.$message }}
                </p>
              </TransitionGroup>
            </dd>
          </dl>

          <dl class="suii-content">
            <dt>
              {{ $t("addGameInfo.game.desc") }}<span style="color: red">*</span>
            </dt>
            <dd>
              <textarea v-model="v$.description.$model" name="" title="" :placeholder="$t('addGameInfo.game.desc')"
                class="w100p h100"></textarea>
              <TransitionGroup name="fade">
                <p class="input-errors" v-for="error of v$.description.$errors" :key="error.$uid">
                  <i class="uil uil-check"></i>{{ error.$message }}
                </p>
              </TransitionGroup>
            </dd>
          </dl>
          <dl class="suii-content">
            <dt>{{ $t('addGameInfo.game.tags') }}<span style="color: red;">*</span></dt>
            <dd>
              <div class="chip-container">
                <div class="chip" v-for="(chip, i) of hashtagsArr" :key="chip.id">
                  {{ chip }}
                  <i class="uil uil-times" @click="deleteChip(i)"></i>
                </div>

                <input v-model="chipInput" @blur="saveChip" @keyup.enter="saveChip" @keydown.delete="backspaceDelete">

              </div>
              <TransitionGroup name="fade">
                <p class="input-errors" v-for="error of v$.hashtags.$errors" :key="error.$uid">
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
              <span style="color: red;">*</span>
            </dt>
            <dd>
              <ul class="image-upload">

                <li v-if="!prevThumbnail">
                  <div>
                    <div style="height: 0px; overflow: hidden">
                      <input type="file" @change="onImgChange"
                        accept="image/jpeg, image/png, image/svg, image/jpg, image/webp, image/bmp," ref="thumbnail"
                        name="fileInput" />
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

                    <button class="btn-gray" @click="uploadThumbnail"><i class="uil uil-upload"></i>&nbsp;
                      {{ $t('addGameInfo.game.thumbnail') }}
                    </button>

                  </p>

                </li>
                <li v-else>
                  <div
                    :style="{ 'background': 'url(' + prevThumbnail + ') center center / cover no-repeat', 'background-size': 'cover' }"
                    style="border:#e9e9e9 2px solid;">
                    <div style="height: 0px; overflow: hidden">
                      <input type="file" @change="onImgChange" accept=image/* ref="thumbnail" name="fileInput" />
                    </div>
                  </div>

                  <p style="width:130%;">
                    <button class="btn-gray" @click="uploadThumbnail"><i class="uil uil-upload"></i>&nbsp;
                      {{ $t('addGameInfo.game.thumbnail') }}

                    </button>
                    &nbsp; &nbsp;
                    <button class="btn-circle-icon" @click="deleteThumbnail"><i class="uil uil-trash-alt"></i>
                    </button>
                  </p>
                </li>
              </ul>
            </dd>
          </dl>
          <dl class="suii-content">
            <dt> {{ $t('previewImage.title') }}</dt>
            <dd>
              <ul class="image-upload">
                <li v-if="!prevGif">
                  <div>
                    <div style="height: 0px; overflow: hidden">
                      <input type="file" @change="onGifChange" accept=image/gif ref="gifThumbnail" name="fileInput" />
                    </div>
                    <p><i class="uil uil-image-v"></i></p>
                    <h2>
                      {{ $t('addGameInfo.game.thumbnail.size') }} 512* 512<br />
                      (up to 4MB)
                    </h2>
                  </div>
                  <p>
                    <button class="btn-gray" @click="uploadGif"><i class="uil uil-upload"></i>&nbsp;
                      {{ $t('addGameInfo.game.thumbnail') }}
                    </button>

                  </p>
                </li>
                <li v-else>
                  <div
                    :style="{ 'background': 'url(' + prevGif + ') center center / cover no-repeat', 'background-size': 'cover' }"
                    style="border:#e9e9e9 2px solid;">
                    <div style="height: 0px; overflow: hidden">
                      <input type="file" @change="onGifChange" accept=image/* ref="gifThumbnail" name="fileInput" />
                    </div>
                  </div>
                  <p style="width:130%;">
                    <button class="btn-gray" @click="uploadGif"><i class="uil uil-upload"></i>&nbsp;
                      {{ $t('addGameInfo.game.thumbnail') }}
                    </button>
                    <button class="btn-circle-icon" @click="deleteGif"><i class="uil uil-trash-alt"></i>
                    </button>
                  </p>
                </li>
              </ul>
            </dd>
          </dl>



          <dl class="suii-content">
            <dt style="padding-top: 5px">{{ $t("auto.game.id.generator") }}</dt>
            <dd>
              <label class="switch-button">
                <input type="checkbox" name="" v-model="isAuthGamePath" />
                <span class="onoff-switch"></span>
              </label>
            </dd>
          </dl>
          <transition name="component-fade" mode="out-in">
            <dl class="suii-content" v-if="!isAuthGamePath">
              <dt>
                {{ $t("addGameInfo.game.id") }}
              </dt>
              <dd>
                <input v-model="v$.pathname.$model" type="text" name="" class="game-id-input w90p" title=""
                  :placeholder="$t('addGameInfo.game.id')" />
                <!-- <p style="color: #C5292A; margin-top:10px">{{ gamePathError }}</p>
            <p v-if="confirmedGamePath" style="color: #1fc944; margin-top:10px">
              {{ $t('addGameInfo.game.id.passed') }}
            </p> -->
              </dd>
              <ClipLoader v-if="waitGamePath" :color="'#ff6e17'" :size="'20px'"></ClipLoader>
              <a @click="checkPathName" class="btn-default w150">
                {{ $t("addGameInfo.game.id.check") }}
              </a>
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
            <a v-if="uploadProject.form.stage === eGameStage.DEV" @click="uploadGame" class="btn-default w150">
              {{ $t("upload") }}
            </a>
            <a v-else @click="save" class="btn-default w150">
              {{ $t('next') }}
              <i class="uil uil-angle-right-b"></i></a>
          </li>
        </ul>
        <!-- 


        <div class="sui-input" style="margin-top:100px;" v-if="projectInfo">
            <dl class="suii-content delete-area">
                <dt>
                    {{ $t('addGameInfo.delete.game') }}
                </dt>
                <dd class="game-delete-btn"><a @click="$modal.show('deleteProject')" class="btn-default w150">
                    {{ $t('addGameInfo.delete') }}
                </a>
                </dd>
            </dl>

        </div> -->

        <!-- <modal :clickToClose="false"
               class="modal-area-type" name="deleteProject" width="90%" height="auto" :maxWidth="380"
               :adaptive="true"
               :scrollable="true">
            <div class="modal-alert">
                <dl class="ma-header">
                    <dt>
                        {{ $t('addGameInfo.info') }}
                    </dt>
                    <dd>
                        <button @click="$modal.hide('deleteProject')"><i class="uil uil-times"></i></button>
                    </dd>
                </dl>
                <div class="ma-content">
                    <h2>
                        {{ $t('addGameInfo.delete.modal') }}
                        <br/>
                        {{ $t('addGameInfo.delete.modal.confirm') }}
                    </h2>
                    <div>
                        <button class="btn-default w48p" @click="deleteProject()">
                            {{ $t('yes') }}
                        </button>
                        <button class="btn-gray w48p" @click="$modal.hide('deleteProject')">
                            {{ $t('no') }}
                        </button>
                    </div>
                </div>
            </div>
        </modal> -->
      </template>
      <ProjectAddGameFile v-else @cancelFormDone="isFormDone = false" @uploadDone="isUploadDone = true" />
    </div>
  </dd>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import ClipLoader from 'vue-spinner/src/ClipLoader.vue';
import { eGameStage } from "~~/types"
import useVuelidate from "@vuelidate/core";
import { required, helpers, maxLength } from "@vuelidate/validators";
import { useI18n } from "vue-i18n";
import { randomString } from "~~/scripts/utils.js";
import { useLocalePath } from "vue-i18n-routing";
import { onBeforeRouteLeave } from 'vue-router';

const IMAGE_MAX_SIZE = 4
const localePath = useLocalePath();
const { t, locale } = useI18n();
const router = useRouter();
const { uploadProject, resetStage, setForm, setStepOne } = useProject();
const isAuthGamePath = ref(true);
const confirmedGamePath = ref();

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

let form = reactive({
  name: "",
  pathname: "",
  description: "",
  hashtags: '',
  stage: computed(() => uploadProject.value.form.stage).value,
  project_picture: null,
  project_picture2: null
});



const rules = computed(() => {
  const formRule = {
    name: {
      required: helpers.withMessage(t("addGameInfo.game.title.err"), required),
    },
    pathname: { required },
    description: {
      required: helpers.withMessage(t("addGameInfo.game.desc.err"), required),
    },
    hashtags: {
      required: helpers.withMessage(t("addGameInfo.game.tags.err"), required),
    },
  };

  return formRule;
});

const v$ = useVuelidate(rules, form);


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
const waitGamePath = ref(false);

onBeforeRouteLeave((to, from, next) => {

  if (isUploadDone.value) {
    next();
    return;
  }

  if (form.name || form.pathname || form.description || form.hashtags || form.project_picture || form.project_picture2) {

    ElMessageBox.confirm(
      "작성하신 글은 저장되지않고 지워집니다. 이 페이지를 나가시겠습니까?",
      'Warning',
      {
        confirmButtonText: 'Cancel',
        cancelButtonText: 'Leave',
        type: 'warning',
      }
    )
      .catch(() => {
        useProject().resetForm()
        next();
      })
  } else {
    useProject().resetForm()
    next()
  }


})


onMounted(() => {

  if (useProject().uploadProject.value.form.stage !== eGameStage.NONE) {
    const { stage, name, pathname, description, hashtags, project_picture, project_picture2 } = useProject().uploadProject.value.form
    form.description = description
    hashtagsArr.value = hashtags ? hashtags.split(',') : []
    form.hashtags = hashtags
    form.name = name
    form.pathname = pathname
    form.project_picture = project_picture
    form.project_picture2 = project_picture2
    form.stage = stage
  }
});



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
//     this.prevThumbnail = (picture_webp || picture) + '?_=' + Date.now();
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

function prevPage() {

  form.hashtags = hashtagsArr?.value.toString();
  form.project_picture = thumbFile?.value;
  form.project_picture2 = gifThumFile?.value;
  setForm(form)

  resetStage()
  setStepOne()



  //     this.resetLocalStorage();
  //     // this.$store.commit("gameStage", null);
  //     this.$emit('stage', null)
  //     this.$emit('isActivePublish', false)
}

// validityCheck() {
//     let isError: boolean = false;

//     if (!this.title) {
//         this.isTitleErr = true;
//         isError = true;
//     }

//     if (!this.description) {
//         this.isDescErr = true;
//         isError = true;
//     }

//     if (this.hashtagsArr.length === 0) {
//         this.isHashtagErr = true;
//         isError = true;
//     }
//     if (!this.thumbFile && !this.prevThumbnail) {
//         this.isThumbErr = true;
//         isError = true;
//     }
//     return isError ? false : true;

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

async function checkPathName() {
  waitGamePath.value = true;

  if (form.pathname) {
    const { data, error } = await game.verifyPath(form.pathname)

    const result = await this.$api.confirmGamePath(this.gamePath);
    // if (result && result.success) {
    //   this.confirmedGamePath = true;
    //   this.gamePathError = "";
    // }
    // else {
    //   this.gamePathError = `${this.$t('usedId')}`;// '사용중인 아이디 입니다. 다른 아이디를 입력하세요.';
    // }
  }
  waitGamePath.value = false;
}

async function save() {

  form.hashtags = hashtagsArr.value.toString();
  form.project_picture = thumbFile.value;
  form.project_picture2 = gifThumFile.value;
  await createGamePath();
  const isValid = await v$.value.$validate();

  if (!thumbFile.value) isThumbErr.value = true;

  if (!isValid || isThumbErr.value) return;
  setForm(form)
  isFormDone.value = true;

  useProject().setStepThree()
}

async function uploadGame() {
  form.hashtags = hashtagsArr.value.toString();

  if (uploadProject.value.form.stage !== eGameStage.DEV) return;

  await save()


  //  const {gameInfoObj, gameFileInfoObj, uploadGameFiles} = this.$store.getters;
  const formData = new FormData();
  for (let k in form) {
    formData.append(k, form[k]);


  }
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    customClass: 'loading-spinner',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  const { data, error } = await game.upload(formData);

  if (!error.value) {
    isUploadDone.value = true;
    setTimeout(() => {
      loading.close()
      useProject().resetForm()

      router.push(localePath("/project/list"));

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
  let count = 0;
  while (!confirmedGamePath.value && count < 10) {
    count++;
    form.pathname = randomString(11);
    const { data } = await game.verifyPath(form.pathname);

    if (data.value) {
      confirmedGamePath.value = true;
    }
  }
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


function uploadThumbnail() {
  thumbnail.value.click();
}


function onImgChange(event: any) {
  const file = event.target.files[0]

  if (file.size < 1024 * 1024 * IMAGE_MAX_SIZE) {

    // this.fileName = event.target.files[0].name
    thumbFile.value = file;
    // this.checkActivePublish();
    const reader = new FileReader();
    reader.onload = e => {
      prevThumbnail.value = e.target!.result;
      // this.$store.commit('thumbFile', this.thumbFile)

      // localStorage.setItem('thumbnail', this.prevThumbnail);
      isThumbErr.value = false;
    };
    reader.readAsDataURL(file);

  }
  else {
    ElMessage.error(t('maxFile.size.4mb'))

  }
}

function deleteThumbnail() {
  // this.prevThumbnail = '';
  // localStorage.removeItem('thumbnail')
}

// deleteThumbnail2() {
//     this.prevGif = '';
//     this.thumbFile2 = 'rm_file2';
// }



function uploadGif() {
  gifThumbnail.value.click();
}
function onGifChange(event: any) {
  const gifFile = event.target.files[0]

  if (gifFile.size < 1024 * 1024 * IMAGE_MAX_SIZE) {
    gifThumFile.value = gifFile;
    // this.fileName = gifFile.name
    // this.updateFile = gifFile
    const reader = new FileReader();
    reader.onload = e => {
      prevGif.value = e.target!.result
    };
    reader.readAsDataURL(gifFile);
  }
  else {
    ElMessage.error(t('maxFile.size.4mb'))
  }
}

function deleteGif() {
  prevGif.value = '';
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

function saveChip() {

  if (!hashtagsArr.value.includes(chipInput.value.trim()) && !!chipInput.value.trim()) {
    ((hashtagsArr.value.indexOf(chipInput.value) === -1)) && hashtagsArr.value.push(chipInput.value.trim());
  }

  chipInput.value = ''
}

function deleteChip(index: number) {
  hashtagsArr.value.splice(index, 1);
}

function backspaceDelete({ which }) {
  which == 8 && chipInput.value === '' && hashtagsArr.value.splice(hashtagsArr.value.length - 1);
}

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
</script>

<style scoped lang="scss">
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
  height: 48px;
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

.publish-btn {
  .active {
    background-color: #ff6e17;
    color: #fff;
    cursor: pointer;
  }


}
</style>

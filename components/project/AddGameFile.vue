<template>
  <div>
    <div class="sui-input">
      <div class="suii-title">{{ $t('addGameFile.title') }}</div>
      <dl class="suii-content">
        <dt>{{ $t('gameUpload') }}</dt>
        <dd>
          <p class="upload-file-container">
            <label for="game-file"
              ><i class="uil uil-file-plus" style="font-size: 18px"></i> &nbsp;
              {{ $t('fileUpload') }}</label
            >
            <input
              @change="onFileChange"
              type="file"
              ref="gameFile"
              id="game-file"
              accept=".zip"
            />

            <ClipLoader
              v-if="isLoadingFile"
              :color="'#ff6e17'"
              :size="'20px'"
            ></ClipLoader>
            <button class="btn-circle-icon" @click="deleteFile" v-if="fileName">
              <i class="uil uil-trash-alt"></i>
            </button>
          </p>
          <Transition name="component-fade" mode="out-in">
            <div v-if="fileName">
              <p class="file-size">
                {{ $t('file.size') }} :
                {{
                  totalSize < 1 ? `${totalSize * 1000} KB` : `${totalSize} MB`
                }}
              </p>
              <p class="file-name">{{ $t('file.name') }} : {{ fileName }}</p>
            </div>
          </Transition>
          <Transition name="component-fade" mode="out-in">
            <h2 :class="isFileEmpty ? 'file-err on' : 'file-err off'">
              {{ $t('addGameFile.selectFile.text1') }}
            </h2>
          </Transition>
          <h2>
            {{ $t('addGameFile.selectFile.text2') }} <br />
            {{ $t('addGameFile.selectFile.text3') }}
          </h2>
        </dd>
      </dl>
      <div class="suii-open" @click="isAdvancedOpen = !isAdvancedOpen">
        <span>{{ $t('advanced.setting') }}</span> &nbsp;<i
          class="uil uil-sliders-v-alt"
        ></i>
      </div>
      <Transition name="component-fade" mode="out-in">
        <div v-if="isAdvancedOpen">
          <dl class="suii-content">
            <dt>{{ $t('addGameFile.select.startFile.text1') }}</dt>
            <dd>
              <select name="" title="" class="w100p">
                <option
                  value=""
                  selected
                  disabled
                  v-if="startFileOptions.length === 0"
                >
                  {{ $t('addGameFile.select.startFile.text2') }}
                </option>
                <option v-for="file in startFileOptions" :value="file">
                  {{ file }}
                </option>
              </select>
            </dd>
          </dl>

          <dl
            class="suii-content"
            v-if="uploadProject.form.stage !== eGameStage.DEV"
          >
            <dt>{{ $t('addGameFile.selectMode') }}</dt>
            <dd>
              <ul>
                <li>
                  <label class="switch-button">
                    <input type="checkbox" name="" v-model="isAutoDeploy" />
                    <span class="onoff-switch"></span>
                  </label>
                </li>
                <li>Auto-deployment mode</li>
              </ul>
              <h2>
                {{ $t('addGameFile.selectMode.text1') }}
                <br />
                {{ $t('addGameFile.selectMode.text2') }}
              </h2>
            </dd>
          </dl>

          <div class="suii-close">
            <button class="btn-line" @click="isAdvancedOpen = !isAdvancedOpen">
              {{ $t('close') }} &nbsp;&nbsp;<i class="uil uil-angle-up"></i>
            </button>
          </div>
        </div>
      </Transition>
    </div>
    <ul class="sui-btn">
      <li>
        <a @click="prevPage" class="btn-line w150"
          ><i class="uil uil-angle-left-b"></i> {{ $t('previous') }}
        </a>
      </li>
      <li>
        <!-- <a v-if="isEditProject" @click="updateProject" class="btn-default w150">
                    <ClipLoader v-if="isLoadingUpload" :color="'#fff'" :size="'20px'" style="height: 20px"></ClipLoader>
                    <span v-else> {{ $t('update') }}</span>
                </a> -->
        <a @click="upload" class="btn-default w150">
          <!-- <ClipLoader v-if="isLoadingUpload" :color="'#fff'" :size="'20px'" style="height: 20px"></ClipLoader> -->
          <span> {{ $t('upload') }}</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import { ElMessage, ElLoading } from 'element-plus'
import ZipUtil from '~~/scripts/zipUtil'
import { eGameStage } from '~~/types'
import { useI18n } from 'vue-i18n'
const { $localePath } = useNuxtApp()

const MAX_FILE_SIZE = 500
// @Prop() isEditProject !: any;
const { uploadProject } = useProject()
const { t, locale } = useI18n()
const router = useRouter()
// eGameStage = eGameStage;
// projectId = this.$route.params.id;

// toast = new Toast();
// limitSize: number = 1024 * 1000 * 500;
// zipFile: File | null = null;
// uploadGameFiles: File[] = [];
const startFileOptions = ref([])
const startFile = ref('')

// versionDescription: string = "";

const zipFile = ref(null as File)
const uploadGameFiles = ref([])

const totalSize = ref(0)
const isLoadingFile = ref(false)
const fileName = ref('')
const limitSize = 1024 * 1000 * MAX_FILE_SIZE
const isFileEmpty = ref(false)
const isAutoDeploy = ref(true)

const isAdvancedOpen = ref(false)

const emit = defineEmits(['cancelFormDone', 'uploadDone'])
// const versionDescription = ref('')

// isLoadingUpload: boolean = false;

// mounted() {
//     this.init();
// }

// init() {
//     this.isLoadingUpload = false;
//     this.uploadGameFiles = [];
//     this.$store.commit('uploadGameFiles', [])
// }

async function onFileChange(e: any) {
  zipFile.value = e.target.files[0]

  isLoadingFile.value = true
  const zip = await ZipUtil.zipFileToZip(zipFile.value)
  const files = await ZipUtil.zipToFiles(zip)

  let size: number = 0

  for (let f in files) {
    size += files[f].size
  }

  if (size > limitSize) {
    ElMessage.error(t('file.upload.overSize.500'))
    isLoadingFile.value = false

    return
  }
  totalSize.value = Number((size / (1024 * 1000)).toFixed(2))
  uploadGameFiles.value = files

  const htmls = uploadGameFiles.value.filter((file: File) => {
    isLoadingFile.value = false

    return file.name.indexOf('.html') > -1
  })
  startFileOptions.value = htmls.map((file) => file.name)
  startFileOptions.value.sort((a, b) => a.length - b.length)

  const indexFiles = startFileOptions.value.filter((name) =>
    name.includes('index')
  )

  if (indexFiles.length) {
    indexFiles.sort((a, b) => a.length - b.length)
    startFile.value = indexFiles[0]
  } else {
    startFile.value = startFileOptions[0]
  }

  if (startFileOptions.value.length) {
    // this.uploadGameFileError = '';
    fileName.value = e.target.files[0].name
  } else {
    ElMessage.error(t('notFoundHtml'))

    fileName.value = ''
    // this.uploadGameFileError = this.$t('projectAddVersion.error.notFoundHtml').toString();
  }

  // if (
  //     uploadGameFiles.value.length > 0 &&        startFileOptions.value.length > 0
  // ) {
  //     this.$store.commit("sendGameFileDone", true);

  //     this.$store.commit("uploadGameFiles", this.uploadGameFiles);
  //     this.isFileEmpty = false;
  // }
  // else {
  //     this.$store.commit("sendGameFileDone", false);
  // }

  isLoadingFile.value = false
  e.target.value = ''
}

function deleteFile() {
  fileName.value = ''
  //     this.$store.commit("uploadGameFiles", []);
  //     this.zipFile = null;
  //     this.uploadGameFiles = [];
  //     this.startFile = '';
  //     this.startFileOptions = [];
  //     this.totalSize = 0;
  //     (this.$refs.gameFile as any).value = '';
}

async function upload() {
  if (isLoadingFile.value) {
    return
  }

  const form = useProject().uploadProject.value.form

  const formData = new FormData()
  for (let k in form) {
    formData.append(k, form[k])
  }

  const gameFileInfo = {
    autoDeploy: isAutoDeploy.value,
    startFile: startFile.value,
    size: totalSize.value,
    // version_description: versionDescription,
  }

  for (let k in gameFileInfo) {
    formData.append(k, gameFileInfo[k])
  }

  for (let i = 0; i < uploadGameFiles.value.length; i++) {
    const file = uploadGameFiles.value[i]
    formData.append(`file_${i + 1}`, file)
  }

  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    customClass: 'loading-spinner',
    background: 'rgba(0, 0, 0, 0.7)',
  })

  const { data, error } = await game.upload(formData)

  loading.close()
  emit('uploadDone')
  useProject().resetForm()

  if (!error.value) {
    router.push($localePath('/project/list'))
  }

  //     const {uploadGameFiles, gameStage} = this.$store.getters;

  //     if (gameStage !== eGameStage.Dev) {
  //         if (!uploadGameFiles) {
  //             this.isFileEmpty = true;
  //         }
  //         else if (uploadGameFiles && uploadGameFiles.length === 0) {
  //             this.isFileEmpty = true;
  //         }
  //         else{
  //             this.isLoadingUpload = true;
  //             this.createProject();
  //         }

  //     }
  //     else {
  //         this.isLoadingUpload = true;
  //         this.createProject();
  //         this.isFileEmpty = false;
}

// }

// createProject() {
//     const {gameInfoObj, uploadGameFiles, gameStage} = this.$store.getters;

//     this.$api.createProject(
//         gameInfoObj,
//         gameFileInfo,
//         uploadGameFiles
//     )
//         .then((res) => {
//             this.toast.successToast(`${this.$t('gameUpload.done')}`);
//             this.$router.push(`/${this.$i18n.locale}/projectList`)

//         })
//         .catch((err) => {
//         })
//         .finally(() => {
//             this.isLoadingUpload = false;
//         })
// }

// async updateProject() {
//     const {gameStage} = this.$store.getters;
//     if (this.isLoadingUpload) {
//         return;
//     }

//     let isError = false;

//     if (gameStage !== eGameStage.Dev) {
//         if (!this.uploadGameFiles.length) {
//             isError = true;
//             this.isFileEmpty = true;
//         }

//         if (!this.startFileOptions.length) {
//             isError = true;
//         }

//         if (isError) {
//             // this.wait = false;
//             return;
//         }
//     }
//     else {
//         this.isFileEmpty = false;
//     }
//     this.isLoadingUpload = true;

//     const option: any = {
//         id: this.projectId,
//         name: localStorage.getItem('title'),
//         description: localStorage.getItem('description'),
//         hashtags: localStorage.getItem('hashtagsArr'),
//         stage: this.$store.getters.gameStage
//     };

//     if (this.$store.getters.gameStage === eGameStage.Dev) {
//         this.autoDeploy = false;
//     }

//     this.$api.updateProject(option, this.$store.getters.thumbFile)
//         .then((res) => {
//             // this.toast.successToast("게임이 업로드되었습니다.");
//             // this.$router.push('/projectList')
//         })
//         .catch((err) => {
//             console.log('err', err)
//             return;
//         })
//         .finally(() => {
//             this.isLoadingUpload = false;
//         })
//     if(this.uploadGameFiles && this.uploadGameFiles.length > 0) {
//         const version = await this.$api.createVersion(this.projectId, '1.0.0', this.uploadGameFiles, this.startFile,
//         this.autoDeploy, this.totalSize, '', this.$store.getters.gameStage);
//     }
//     await this.$router.replace(`/${this.$i18n.locale}/projectList`);
// }

function prevPage() {
  emit('cancelFormDone')

  //     this.$emit('gameInfoDone', false)
}
</script>

<style scoped lang="scss">
.loading-spinner {
  color: #f97316 !important;
}

.file-err {
  color: #c5292a;

  &.on {
    display: inline-block;
  }

  &.off {
    display: none;
  }
}

//upload button
.upload-file-container {
  display: flex;
  align-items: center;

  .btn-circle-icon {
    margin-left: 10px;
  }
}

.file-size,
.file-name {
  margin: 10px 0px 10px;
}

//Transition
.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.3s ease;
}

.component-fade-enter,
.component-fade-leave-to

/* .component-fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

//spinner
.v-spinner {
  margin-left: 10px;
  display: flex;
  align-items: center;
}
</style>

<template>
  <div>
    <div class="sui-input">
      <div class="suii-title">{{ $t('addGameFile.title') }}
      </div>

      <dl class="suii-content">
        <dt>{{$t('file.type')}}</dt>
        
        <dd>
          <p class="upload-file-container">
           <select v-model="selectedType">
             <option v-for="fileType in fileTypes" :value="fileType">{{fileType.name}}</option>
            </select>
          </p>
          <Transition name="component-fade" mode="out-in" v-if="selectedTypeErr">
            <p class="file-type-err" >{{$t('file.type.info')}} </p>
          </Transition>


          <ul class="platform-list" v-if="selectedType.value === 2">
            <li v-for="pf of platforms">
              <input type="checkbox" :id="pf.value" :value="pf.value" :name="pf.name" v-model="selectedPlatform" >
              <label :for="pf.value"><i class="uil uil-check"></i></label>
              <span><label :for="pf.value">{{pf.name}}</label>
              </span>
            </li>
          </ul>
          <Transition name="component-fade" mode="out-in" v-if="selectedPlatformErr">
            <p class="file-type-err" > {{$t('game.support.os.info')}}</p>
          </Transition>
        </dd>
      </dl>

      <Transition name="component-fade" mode="out-in">
        <dl class="suii-content" v-if="selectedType.value" >
          <dt>{{ $t('gameUpload') }}</dt>
          <dd>
            <p class="upload-file-container">
              <template v-if="selectedType.value === eGameType.Html">
              <label for="game-file"
                ><i class="uil uil-file-plus" style="font-size: 18px"></i> &nbsp;
                {{ $t('fileUpload') }}</label
              >
              <input
                @change="onFileChange"
                type="file"
                id="game-file"
                accept=".zip"
              />
            </template>
            <template v-else>
              <label for="game-file"
                ><i class="uil uil-file-plus" style="font-size: 18px"></i> &nbsp;
                {{ $t('fileUpload') }}</label
              >
              <input
                @change="onDownloadFileChange"
                type="file"
                id="game-file"
                accept=".zip"
              />
            </template>
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
              <p v-if="selectedType.value === eGameType.Html">{{ $t('addGameFile.selectFile.text2') }}</p>
              <p>{{ $t('addGameFile.selectFile.text3') }}</p>
            </h2>
          </dd>
        </dl>
      </Transition>

      <div v-if="selectedType.value === eGameType.Html"  class="suii-open" @click="isAdvancedOpen = !isAdvancedOpen">
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
        <a id="game-upload" @click="upload" class="btn-default w150">
          <!-- <ClipLoader v-if="isLoadingUpload" :color="'#fff'" :size="'20px'" style="height: 20px"></ClipLoader> -->
          <span> {{ $t('upload') }}</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import axios from 'Axios'
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import { ElMessage, ElLoading, ElProgress } from 'element-plus'
import ZipUtil from '~~/scripts/zipUtil'
import { eGameStage, eGameType, ePlatformType } from '~~/types'
import { useI18n } from 'vue-i18n'

const MAX_FILE_SIZE = 500

const { $localePath } = useNuxtApp()
const { uploadProject } = useProject()
const { t, locale } = useI18n()
const config = useRuntimeConfig()
const router = useRouter()
const startFileOptions = ref([])
const startFile = ref('')

const zipFile = ref<File>()
const uploadGameFiles = ref()

const totalSize = ref(0)
const isLoadingFile = ref(false)
const fileName = ref('')
const limitSize = 1024 * 1000 * MAX_FILE_SIZE
const isFileEmpty = ref(false)
const isAutoDeploy = ref(true)

const isAdvancedOpen = ref(false)

//다운로드
const downloadFile = ref<File>()
const percentage = ref(0)

//파일 타입
const selectedType = ref({name:'Select type of file', value:null},)
const fileTypes = [{name:'Select type of file', value:null}, {name:'HTML', value:1}, {name:'DOWNLOAD', value:2}]
const selectedTypeErr = ref(false)

//support platform
const platforms=[{name:'Window', value:1}, {name:'Mac', value:2} , {name:'Android', value:3}, {name:'Ios', value:4} ]
const selectedPlatform = ref([])
const selectedPlatformErr = ref(false)

watch(
  ()=>selectedType.value, 
  (type) =>{
    if(type.value){
      fileName.value = '',
      selectedTypeErr.value = false
      selectedPlatform.value = []
    }else{
      selectedTypeErr.value = true
    }
  }
)


watch(
  ()=>selectedPlatform.value, 
  (platform) =>{
    if(platform.length){
      selectedPlatformErr.value = false
    }else{
      selectedPlatformErr.value = true
    }
  }
)


const emit = defineEmits(['cancelFormDone', 'uploadDone'])

// 게임 파일 업로드
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

  //html중 index가 포함된 파일
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
  }

  isLoadingFile.value = false
  e.target.value = ''
}

//다운로드용 파일 업로드
async function onDownloadFileChange(e: any){
  
  downloadFile.value = e.target.files[0]
  const size = downloadFile.value.size
  isLoadingFile.value = true
  
  //file limit check
  if (size > limitSize) {
    ElMessage.error(t('file.upload.overSize.500'))
    isLoadingFile.value = false
    return
  }


  totalSize.value = Number((size / (1024 * 1000)).toFixed(2))
  fileName.value = downloadFile.value.name
  uploadGameFiles.value = downloadFile.value

  isLoadingFile.value = false

  e.target.value = ''

}

function deleteFile() {
  fileName.value = ''
}

async function upload() {
  if(!selectedType.value.value){
    selectedTypeErr.value  = true
    return

  }
  if(!selectedPlatform.value.length && selectedType.value.value === eGameType.Download ){
    selectedPlatformErr.value  = true
    return

  }

  if (isLoadingFile.value || !uploadGameFiles.value) {
    return
  }



  const form = useProject().uploadProject.value.form

  const formData = new FormData()

  formData.append('category', useProject().uploadProject.value.purpose.toString() )
  formData.append('file_type',selectedType.value.value )
  formData.append('support_platform', selectedPlatform.value.toString() || '0')

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

  switch(selectedType.value.value){
    case eGameType.Download:
      formData.append('file',  uploadGameFiles.value)
      break;
    case eGameType.Html:
      for (let i = 0; i < uploadGameFiles.value.length; i++) {
        const file = uploadGameFiles.value[i]
        formData.append(`file_${i + 1}`, file)
      }
      break;
    default:
      break;
  }

  

  const loading = ElLoading.service({
    lock: true,
    text: `Loading...`,
    customClass: 'loading-spinner',
    background: 'rgba(0, 0, 0, 0.7)',
  })


  //onUploadProgress 사용을 위해서 axios 사용.. ohmyfetch가 지원하면 그때 수정
  axios('/studio/project', {
    method:'post',
    baseURL:config.STUDIO_API,
    data:formData,
    headers:{
      'Context-Type' : 'multipart/form-data', 
      Authorization : `Bearer ${useCookie(config.COOKIE_NAME).value}`},
    onUploadProgress : (e) => { 
      const percentage = Math.round((e.loaded * 100) / e.total)
      loading.setText(`Loading...${percentage}%`)
   }
  })
  .then(()=>{
    router.push($localePath('/project/list'))
  })
  .catch((err)=>{
    console.log(err)
  })
  .finally(()=>{
    emit('uploadDone')
    useProject().setStepTwo()
    useProject().resetForm()
    loading.close()
  })

}

function handleProgress(e){
      
}

function prevPage() {
  emit('cancelFormDone')
}

</script>

<style scoped lang="scss">
.suii-content{
  .file-type-err{
    color:#c5292a;
    margin-left:2px;
    margin-top:10px;
  }
  .upload-file-container{
    select{
      width: 250px;
    }
   
  }
  .platform-list{
    margin-top: 20px;
    li{
      span{
        margin-left: 5px;
      }
    }
  }
}
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

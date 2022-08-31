<template>
  <NuxtLayout name="project-manage">
    <dd>
      <div class="studio-upload-input">
        <div class="sui-input">
          <div class="suii-title">{{  $t('versionManage.addVersion')  }}</div>
          <dl class="suii-content">
            <dt>{{  $t('gameUpload')  }}</dt>
            <ProjectZipFileUploader @sendZipFile="setZipFile" />

          </dl>
          <div class="suii-open" :class="isAdvancedOpen ? 'open' : 'close'" @click="isAdvancedOpen = !isAdvancedOpen">
            <span> {{  $t('advanced.setting')  }}</span> &nbsp;<i class="uil uil-sliders-v-alt"></i>
          </div>
          <transition name="component-fade" mode="out-in">
            <div v-show="isAdvancedOpen">
              <dl class="suii-content">
                <dt>{{  $t('addGameFile.select.startFile.text1')  }}</dt>
                <dd>
                  <select name="" title="" class="w100p">
                    <option v-for="file in startFileOptions" :value="file">{{  file  }}</option>
                  </select>
                </dd>
              </dl>
              <dl class="suii-content">
                <dt>{{  $t('addGameFile.selectMode')  }}</dt>
                <dd>
                  <ul>
                    <li>
                      <label class="switch-button">
                        <input type="checkbox" name="" v-model="autoDeploy" />
                        <span class="onoff-switch"></span>
                      </label>
                    </li>
                    <li>Auto-deployment mode</li>
                  </ul>
                  <h2>
                    {{  $t('addGameFile.selectMode.text1')  }}<br />
                    {{  $t('addGameFile.selectFile.text3')  }}
                  </h2>
                </dd>
              </dl>
              <dl class="suii-content">
                <dt>{{  $t('version')  }}</dt>
                <dd>
                  <input v-model="version" type="text" class="w100p">
                  <p v-if="isVersionError" style="color:red; margin:10px 10px 0px 10px;">{{
                     $t('projectAddVersion.error.lowVersion') 
                    }}</p>
                </dd>
              </dl>
              <div class="suii-close">
                <button class="btn-line" @click="isAdvancedOpen = !isAdvancedOpen">{{  $t('close')  }} &nbsp;&nbsp;<i
                    class="uil uil-angle-up"></i></button>
              </div>
            </div>
          </transition>
        </div>

      </div>
      <ul class="sui-btn">
        <li><a @click="upload" class="btn-default w150">
            <span>{{  $t('upload')  }}</span>
          </a></li>
      </ul>
    </dd>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import { IVersion, eGameStage } from '~~/types'
import Version from '~~/scripts/version'
import { useLocalePath } from "vue-i18n-routing";
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n()
const router = useRouter()
const route = useRoute()
const localePath = useLocalePath();
const config = useRuntimeConfig()

useHead({
  title: `${t('seo.project.add.verison.title')} | Zempie Studio`,
  meta: [
    {
      name: 'description',
      content: `${t('seo.project.add.verison.desc')}`
    },
    {
      name: 'og:title',
      content: `${t('seo.project.add.verison.title')}`
    },
    {
      name: 'og:description',
      content: `${t('seo.project.add.verison.description')}`
    },
    {
      name: 'og:url',
      content: `${config.ZEMPIE_URL}${route.path}`
    },
  ]
})


definePageMeta({
  title: 'Add version',
  name: 'addVersion',
  middleware: 'auth'
})


const isAdvancedOpen = ref(false)
const autoDeploy = ref(false)

const startFileOptions = ref([])
const startFile = ref('')
const fileSize = ref(0)
const version = ref()
const uploadGameFiles = ref<File[]>([])

const isVersionError = ref(false)

const { editProject } = useProject()

const projectId = computed(() => route.params.id)


watch(
  () => useProject().editProject.value.info,
  (newVal) => {
    let maxNumVersion = null;
    for (const version of newVal.projectVersions) {
      const ver: IVersion = version;
      if (!maxNumVersion || maxNumVersion.number < ver.number) {
        maxNumVersion = ver;
        console.log(maxNumVersion)
      }
    }
    const ver = new Version(maxNumVersion.version)
    ver.patch++;
    version.value = ver.toString();
  }
)


function setZipFile(gameFile: { startFileList: [], startFile: string, size: number, gameFiles: File[] }) {
  uploadGameFiles.value = gameFile.gameFiles;
  startFileOptions.value = gameFile.startFileList
  startFile.value = gameFile.startFile;
  fileSize.value = gameFile.size

  console.log(gameFile)

}

async function upload() {

  if (!startFile.value) {
    return;
  }


  if (!Version.validity(version.value)) {
    return;
  }
  else {
    const lastVersion = version.value;
    if (lastVersion && Version.validity(lastVersion.version)) {
      const newVersion = new Version(version.value);
      const oldVersion = new Version(lastVersion.version);

      if (!newVersion.isNew(oldVersion)) {
        //이전 버전 보다 작음.
        isVersionError.value = true;
        return;
      }
    }
  }


  if (editProject.value.info.stage === eGameStage.DEV) {
    autoDeploy.value = false;
  }

  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    customClass: 'loading-spinner',
    background: 'rgba(0, 0, 0, 0.7)',
  })

  const formData = new FormData;
  formData.append('project_id', String(editProject.value.info.id));
  formData.append('version', version.value);
  formData.append('startFile', startFile.value);
  formData.append('autoDeploy', String(autoDeploy.value));
  formData.append('description', editProject.value.info.description);
  formData.append('stage', String(editProject.value.info.stage));

  if (fileSize.value) {
    formData.append('size', fileSize.value.toFixed(2));
  }


  for (let i = 0; i < uploadGameFiles.value.length; i++) {
    const file = uploadGameFiles.value[i];
    formData.append(`file_${i + 1}`, file);
  }

  const { data, pending, error } = await useFetch('/studio/version', getStudioFetchOptions('post', true, formData))


  loading.close()
  if (!error.value) {
    router.push(localePath(`/project/${projectId.value}/version-manage`))
  }


}

function deleteFile() {

}
</script>
<!-- <template>
    <dd>
        <div class="studio-upload-input">
            <div class="sui-input">
                <div class="suii-title">{{ $t('versionManage.addVersion') }}</div>
                <dl class="suii-content">
                    <dt>{{ $t('gameUpload') }}</dt>
                    <dd>
                        <p class="upload-file-container">
                            <label for="game-file"><i class="uil uil-file-plus" style="font-size:18px;"></i> &nbsp;
                                {{ $t('fileUpload') }}</label>
                            <input
                                @input="onFileChange"
                                type="file"
                                ref="gameFile"
                                id="game-file"
                                accept=".zip">
                            <ClipLoader v-if="isLoadingFile" :color="'#ff6e17'" :size="'20px'"></ClipLoader>
                            <button class="btn-circle-icon" @click="deleteFile" v-if="fileName"><i
                                class="uil uil-trash-alt"></i>
                            </button>
                        </p>
                        <transition name="component-fade" mode="out-in">
                            <div v-if="fileName">
                                <p class="file-size">{{ $t('file.size') }} : {{
                                        totalSize < 1
                                            ? `${totalSize * 1000} KB`
                                            : `${totalSize} MB`
                                    }}</p>
                                <p class="file-name">{{ $t('file.name') }} : {{ fileName }}</p>
                            </div>
                        </transition>
                        <h2>
                            {{ $t('addGameFile.selectMode.text1') }}<br/>
                            {{ $t('addGameFile.selectFile.text3') }}
                        </h2>
                    </dd>
                </dl>
                <div class="suii-open"
                     :class="isAdvancedOpen ? 'open' : 'close'"
                     @click="isAdvancedOpen = !isAdvancedOpen">
                    <span>  {{ $t('advanced.setting') }}</span> &nbsp;<i class="uil uil-sliders-v-alt"></i>
                </div>
                <transition name="component-fade" mode="out-in">
                    <div v-show="isAdvancedOpen">
                        <dl class="suii-content">
                            <dt>{{ $t('addGameFile.select.startFile.text1') }}</dt>
                            <dd>
                                <select name="" title="" class="w100p">
                                    <option v-for="file in startFileOptions" :value="file">{{ file }}</option>
                                </select>
                            </dd>
                        </dl>
                        <dl class="suii-content">
                            <dt>{{ $t('addGameFile.selectMode') }}</dt>
                            <dd>
                                <ul>
                                    <li>
                                    <li>
                                        <label class="switch-button">
                                            <input type="checkbox" name="" v-model="autoDeploy"/>
                                            <span class="onoff-switch"></span>
                                        </label>
                                    </li>
                                    <li>Auto-deployment mode</li>
                                </ul>
                                <h2>
                                    {{ $t('addGameFile.selectMode.text1') }}<br/>
                                    {{ $t('addGameFile.selectFile.text3') }}
                                </h2>
                            </dd>
                        </dl>
                        <dl class="suii-content">
                            <dt>{{ $t('version') }}</dt>
                            <dd>
                                <input v-model="version" type="text" class="w100p">

                            </dd>
                        </dl>
                        <div class="suii-close">
                            <button class="btn-line" @click="isAdvancedOpen = !isAdvancedOpen">{{ $t('close') }} &nbsp;&nbsp;<i
                                class="uil uil-angle-up"></i></button>
                        </div>
                    </div>
                </transition>
            </div>

        </div>

        <ul class="sui-btn">
            <li><a @click="upload" class="btn-default w150"><ClipLoader v-if="isLoadingUpload" :color="'#fff'" :size="'20px'" style="height: 20px"></ClipLoader>
                <span v-else>{{ $t('upload') }}</span></a></li>
        </ul>


    </dd>
</template>

import {Component, Prop, Vue, Watch} from "vue-property-decorator";
import ZipUtil from "@/script/zipUtil";
import ClipLoader from 'vue-spinner/src/ClipLoader.vue';
import Toast from "@/script/message";
import Version from "@/script/version";
import store from "@/store";
import {eGameStage} from "@/common/enumData";

@Component({
    components: {ClipLoader},
})
export default class AddVersion extends Vue {
    projectId = this.$route.params.id;
    toast = new Toast();
    limitSize: number = 1024 * 1000 * 500;
    totalSize: number = 0;
    uploadGameFile: File | null = null;
    uploadGameFiles: File[] = [];
    isAdvancedOpen: boolean = false;
    startFile: string = '';
    startFileOptions: string[] = [];

    fileName: string = '';
    versionDescription: string = "";

    isLoadingFile: boolean = false;
    autoDeploy: boolean = true;

    version: string = '1.0.1';
    isUpdate: boolean = false;
    description: string = '';

    isLoadingUpload: boolean = false;

    // beforeRouteEnter(to, from, next){
    //
    //     if(eGameStage.Dev === (from.params.id && store.getters.projects[from.params.id].stage)){
    //         alert('개발 단계를 얼리억세스 이상으로 설정하여, 게임 파일을 업로드해주세요')
    //     }else if(!from.params.id){
    //         next('/projectList')
    //     }
    //     else{
    //         next();
    //     }
    //
    // }


    async mounted() {
        await this.$store.dispatch("loginState");
        await this.$store.dispatch("project", this.projectId);

        const lastVersion = this.$store.getters.lastVersion(this.projectId);

        if (lastVersion) {
            const ver = new Version(lastVersion.version)
            ver.patch++;
            this.version = ver.toString();
        }

        const updateVersion = this.$store.getters.updateVersion(this.projectId);
        this.isUpdate = updateVersion && updateVersion.state === 'process';


    }

  

    async onFileChange(e) {

        this.uploadGameFile = e.target.files[0];

        this.isLoadingFile = true;
        const zip = await ZipUtil.zipFileToZip(this.uploadGameFile);

        const files: any = await ZipUtil.zipToFiles(zip);
        let size: number = 0;

        for (let f in files) {
            size += files[f].size;
        }

        if (size > this.limitSize) {
            alert(`${this.$t('file.upload.overSize.500')}`)
            return;

        }

        this.totalSize = Number((size / (1024 * 1000)).toFixed(2));
        this.uploadGameFiles = files;

        const htmls = this.uploadGameFiles.filter((file) => {
            return file.name.indexOf('.html') > -1;
        });

        this.startFileOptions = htmls.map(file => file.name);
        this.startFileOptions.sort((a, b) => a.length - b.length);
        const indexFiles = this.startFileOptions.filter(name => name.includes('index'));

        if (indexFiles.length) {
            indexFiles.sort((a, b) => a.length - b.length);
            this.startFile = indexFiles[0];
        }
        else {
            this.startFile = this.startFileOptions[0];
        }

        this.startFileOptions.sort((a, b) => a.length - b.length);

        if (this.startFileOptions.length) {
            // this.uploadGameFileError = '';
            this.fileName = e.target.files[0].name
        }
        else {
            alert(`${this.$t('notFoundHtml')}`)
            this.fileName = ''
            // this.uploadGameFileError = this.$t('projectAddVersion.error.notFoundHtml').toString();

        }

        if (
            this.uploadGameFiles.length > 0 &&
            this.startFileOptions.length > 0
        ) {
            this.$store.commit("sendGameFileDone", true);

            const gameFileInfo = {
                autoDeploy: this.autoDeploy,
                startFile: this.startFile,
                size: this.totalSize,
                version_description: this.versionDescription,
            };
            console.log('gameFileInfo', gameFileInfo);
            this.$store.commit("gameFileInfoObj", gameFileInfo);
            this.$store.commit("uploadGameFiles", this.uploadGameFiles);
        }
        else {
            this.$store.commit("sendGameFileDone", false);
        }

        this.isLoadingFile = false;
    }

    deleteFile() {
        this.uploadGameFile = null;
        this.uploadGameFiles = [];
        this.startFile = '';
        this.startFileOptions = [];
        this.totalSize = 0;
        this.fileName = '';
        (this.$refs.gameFile as any).value = '';
    }

  

    updateProject() {

    }

    prevPage() {
        this.$emit('gameInfoDone', false)
    }

}
</script>
 -->
<style scoped lang="scss">
.sui-btn {
  width: 1200px;
  margin: 30px auto;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.studio-upload-input {
  width: 1200px;
  margin: 30px auto;
  background-color: #fff;
  box-shadow: 0px 10px 50px rgba(0, 0, 0, 0.05);
  border-radius: 10px;

  .suii-open {
    &.close {
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
    }

    .open {
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;
    }

  }
}

@media all and (max-width: 479px) {

  .studio-upload-input,
  .sui-btn {
    width: 90%;
    margin: 20px auto;
    padding: 0 15px;
  }
}


@media all and (min-width: 480px) and (max-width: 767px) {

  .studio-upload-input,
  .sui-btn {
    width: 470px;
    margin: 20px auto;
    padding: 0 15px;
  }
}


@media all and (min-width: 768px) and (max-width: 991px) {

  .studio-upload-input,
  .sui-btn {
    width: 750px;
  }
}


@media all and (min-width: 992px) and (max-width: 1199px) {

  .studio-upload-input,
  .sui-btn {
    width: 970px;
  }
}


//upload button
.upload-file-container {
  display: flex;
  align-items: center;

  .btn-circle-icon {
    margin-left: 10px
  }
}

.file-size,
.file-name {
  margin: 10px 0px 10px;
}


//transition
.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity .3s ease;
}

.component-fade-enter,
.component-fade-leave-to

/* .component-fade-leave-active below version 2.1.8 */
  {
  opacity: 0;
}
</style>
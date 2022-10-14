<template>
  <NuxtLayout name="project-manage">
    <dd>
      <div class="studio-upload-input">
        <div class="sui-input">
          <div class="suii-title">{{ $t('versionManage.addVersion') }}</div>
          <dl class="suii-content">
            <dt>{{ $t('gameUpload') }}</dt>
            <ProjectZipFileUploader @sendZipFile="setZipFile" />
          </dl>
          <div
            class="suii-open"
            :class="isAdvancedOpen ? 'open' : 'close'"
            @click="isAdvancedOpen = !isAdvancedOpen"
          >
            <span> {{ $t('advanced.setting') }}</span> &nbsp;<i
              class="uil uil-sliders-v-alt"
            ></i>
          </div>
          <transition name="component-fade" mode="out-in">
            <div v-show="isAdvancedOpen">
              <dl class="suii-content">
                <dt>{{ $t('addGameFile.select.startFile.text1') }}</dt>
                <dd>
                  <select name="" title="" class="w100p">
                    <option v-for="file in startFileOptions" :value="file">
                      {{ file }}
                    </option>
                  </select>
                </dd>
              </dl>
              <dl class="suii-content">
                <dt>{{ $t('addGameFile.selectMode') }}</dt>
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
                    {{ $t('addGameFile.selectMode.text1') }}<br />
                    {{ $t('addGameFile.selectFile.text3') }}
                  </h2>
                </dd>
              </dl>
              <dl class="suii-content">
                <dt>{{ $t('version') }}</dt>
                <dd>
                  <input v-model="version" type="text" class="w100p" />
                  <p
                    v-if="isVersionError"
                    style="color: red; margin: 10px 10px 0px 10px"
                  >
                    {{ $t('projectAddVersion.error.lowVersion') }}
                  </p>
                </dd>
              </dl>
              <div class="suii-close">
                <button
                  class="btn-line"
                  @click="isAdvancedOpen = !isAdvancedOpen"
                >
                  {{ $t('close') }} &nbsp;&nbsp;<i class="uil uil-angle-up"></i>
                </button>
              </div>
            </div>
          </transition>
        </div>
      </div>
      <ul class="sui-btn">
        <li>
          <a @click="upload" class="btn-default w150">
            <span>{{ $t('upload') }}</span>
          </a>
        </li>
      </ul>
    </dd>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import { IVersion, eGameStage } from '~~/types'
import Version from '~~/scripts/version'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const router = useRouter()
const route = useRoute()
const config = useRuntimeConfig()
const { $localePath } = useNuxtApp()

const isAdvancedOpen = ref(false)
const autoDeploy = ref(false)

const startFileOptions = ref([])
const startFile = ref('')
const fileSize = ref(0)
const version = ref()
const uploadGameFiles = ref<File[]>([])

const isVersionError = ref(false)

const { editProject } = useProject()

const projectId = computed(() => route.params.id as string)

useHead({
  title: `${t('seo.project.add.verison.title')} | Zempie Studio`,
  link: [
    {
      rel: 'alternate',
      href: `${config.ZEMPIE_URL}${route.fullPath}`,
      hreflang: locale,
    },
    {
      rel: 'canonical',
      href: `${config.ZEMPIE_URL}${route.fullPath}`,
    },
  ],
  meta: [
    {
      property: 'og:url',
      content: `${config.ZEMPIE_URL}${route.fullPath}`,
    },
    {
      property: 'og:site_name',
      content: 'Zempie',
    },
    {
      name: 'og:type',
      content: 'website',
    },
    {
      name: 'robots',
      content: 'noindex, nofollow',
    },
    {
      name: 'description',
      content: `${t('seo.project.add.verison.desc')}`,
    },
    {
      property: 'og:title',
      content: `${t('seo.project.add.verison.title')}`,
    },
    {
      property: 'og:description',
      content: `${t('seo.project.add.verison.description')}`,
    },
    {
      property: 'og:url',
      content: `${config.ZEMPIE_URL}${route.path}`,
    },
  ],
})

definePageMeta({
  title: 'Add version',
  name: 'addVersion',
  //middleware: 'auth',
})

watch(
  () => useProject().editProject.value.info,
  (newVal) => {
    createVersionNum()
  }
)

onMounted(() => {
  if (useProject().editProject.value.info?.projectVersions) {
    createVersionNum()
  }
})

function createVersionNum() {
  let maxNumVersion = null
  //기존의 프로젝트 버전이 존재하는 경우
  if (useProject().editProject.value.info.projectVersions.length) {
    for (const version of useProject().editProject.value.info.projectVersions) {
      const ver: IVersion = version
      if (!maxNumVersion || maxNumVersion.number < ver.number) {
        maxNumVersion = ver
      }
    }
    const ver = new Version(maxNumVersion.version)
    ver.patch++
    version.value = ver.toString()
  } else {
    version.value = '1.0.0'
  }
}

function setZipFile(gameFile: {
  startFileList: []
  startFile: string
  size: number
  gameFiles: File[]
}) {
  uploadGameFiles.value = gameFile.gameFiles
  startFileOptions.value = gameFile.startFileList
  startFile.value = gameFile.startFile
  fileSize.value = gameFile.size
}

async function upload() {
  if (!startFile.value) {
    return
  }

  if (!Version.validity(version.value)) {
    return
  } else {
    const lastVersion = version.value
    if (lastVersion && Version.validity(lastVersion?.version)) {
      const newVersion = new Version(version.value)
      const oldVersion = new Version(lastVersion?.version)

      if (!newVersion.isNew(oldVersion)) {
        //이전 버전 보다 작음.
        isVersionError.value = true
        return
      }
    }
  }

  if (editProject.value.info.stage === eGameStage.DEV) {
    autoDeploy.value = false
  }

  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    customClass: 'loading-spinner',
    background: 'rgba(0, 0, 0, 0.7)',
  })

  const formData = new FormData()
  formData.append('project_id', String(editProject.value.info.id))
  formData.append('version', version.value)
  formData.append('startFile', startFile.value)
  formData.append('autoDeploy', String(autoDeploy.value))
  formData.append('description', editProject.value.info.description)
  formData.append('stage', String(editProject.value.info.stage))

  if (fileSize.value) {
    formData.append('size', fileSize.value.toFixed(2))
  }

  for (let i = 0; i < uploadGameFiles.value.length; i++) {
    const file = uploadGameFiles.value[i]
    formData.append(`file_${i + 1}`, file)
  }

  const { data, pending, error } = await useFetch(
    '/studio/version',
    getStudioFetchOptions('post', true, formData)
  )

  loading.close()

  if (!error.value) {
    useProject().getProjectInfo(projectId.value)
    router.push($localePath(`/project/${projectId.value}/version-manage`))
  }
}
</script>
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
    margin-left: 10px;
  }
}

.file-size,
.file-name {
  margin: 10px 0px 10px;
}

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
</style>

<template>
  <NuxtLayout name="project-manage">
    <div class="info-input">
      <div class="ii-title-one">
        {{ $t('deployManage.deployingVersion') }}
      </div>
      <div v-if="deployVersion" class="ii-form">
        <ul>
          <li>{{ $t('deployManage.show.version') }}</li>
          <li>
            <input
              readonly
              v-model="deployVersion.number"
              type="text"
              name=""
              title=""
              placeholder=""
              class="w100p"
            />
          </li>
        </ul>
        <ul>
          <li>{{ $t('deployManage.show.detailed.version') }}</li>
          <li>
            <input
              readonly
              v-model="deployVersion.version"
              type="text"
              name=""
              title=""
              placeholder=""
              class="w100p"
            />
          </li>
        </ul>
        <ol>
          <li>{{ $t('deployManage.undeploy.title') }}</li>
          <li>{{ $t('deployManage.undeploy.info') }}</li>
          <li>
            <a class="btn-gray w100p" @click="showUndeployModal = true">{{
              $t('deployManage.undeploy.title')
            }}</a>
          </li>
        </ol>
      </div>
      <div v-else class="ii-form">
        <ul>
          <li style="width: 100%">{{ $t('deployManage.noDeployVersion') }}</li>
        </ul>
      </div>
      <div class="ii-title-one-line">
        {{ $t('deployManage.changeDeploy.version.title') }}
      </div>
      <div class="ii-form">
        <ul>
          <li>{{ $t('deployManage.changeDeploy.version.select') }}</li>
          <li v-if="options.length">
            <select name="" title="" class="w100p" v-model="selectVersion">
              <option v-for="option in options" :value="option">
                {{ option }}
              </option>
            </select>
          </li>
          <li v-else>
            <select name="" title="" class="w100p">
              <option value="배포할 버전이 없습니다.">
                {{ $t('deployManage.changeDeploy.noVersion') }}
              </option>
            </select>
          </li>
        </ul>

        <ol style="border-top: 0px">
          <li>{{ $t('deployManage.changeDeploy.state') }}</li>
          <li>{{ $t('deployManage.changeDeploy.state.info') }}</li>
          <li>
            <a @click="deploy" class="btn-default w100p">{{ $t('deploy') }}</a>
          </li>
        </ol>
      </div>
      <ClientOnly>
        <el-dialog
          v-model="showUndeployModal"
          append-to-body
          class="modal-area-type"
        >
          <div class="modal-alert">
            <dl class="ma-header">
              <dt>{{ $t('information') }}</dt>
              <dd>
                <button @click="showUndeployModal = false">
                  <i class="uil uil-times"></i>
                </button>
              </dd>
            </dl>
            <div class="ma-content">
              <h2>{{ $t('deployManage.undeploy.modal') }}</h2>
              <div>
                <button class="btn-default w48p" @click="undeploy">
                  {{ $t('undeploy') }}
                </button>
                <button
                  class="btn-gray w48p"
                  @click="showUndeployModal = false"
                >
                  {{ $t('no') }}
                </button>
              </div>
            </div>
          </div>
        </el-dialog>
        <el-dialog
          v-model="showSelectStageModal"
          append-to-body
          class="modal-area-type"
        >
          <div class="modal-alert">
            <dl class="ma-header">
              <dt>{{ $t('information') }}</dt>
              <dd>
                <button @click="showSelectStageModal = false">
                  <i class="uil uil-times"></i>
                </button>
              </dd>
            </dl>
            <div class="ma-content">
              <h2>
                {{ $t('deployManage.changeStage.modal.info1') }}<br />
                {{ $t('deployManage.changeStage.modal.info2') }}
              </h2>
              <div class="stage-select-container">
                <h2 style="margin-right: 10px">
                  {{ $t('deployManage.changeStage.modal.title') }}
                </h2>
                <select
                  name=""
                  title=""
                  class="stage-select-box"
                  v-model="selectedStage"
                >
                  <option v-for="option in stageOptions" :value="option.stage">
                    {{ option.name }}
                  </option>
                </select>
              </div>
              <div style="margin-bottom: 10px">
                <button class="btn-default w48p" @click="changeStage">
                  {{ $t('change') }}
                </button>
                <button
                  class="btn-gray w48p"
                  @click="showSelectStageModal = false"
                >
                  {{ $t('cancel') }}
                </button>
              </div>
            </div>
          </div>
        </el-dialog>
      </ClientOnly>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ElMessage, ElDialog, ElLoading } from 'element-plus'
import { eGameStage, IProject, IVersion } from '~~/types'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const route = useRoute()
const config = useRuntimeConfig()

definePageMeta({
  title: 'Distribution Mgmt.',
  name: 'deployManage',
  middleware: 'auth',
})

useHead({
  title: `${t('seo.project.deploy.manage.title')} | Zempie Studio`,
  meta: [
    {
      name: 'description',
      content: `${t('seo.project.deploy.manage.desc')}`,
    },
    {
      name: 'og:title',
      content: `${t('seo.project.deploy.manage.title')}`,
    },
    {
      name: 'og:description',
      content: `${t('seo.project.deploy.manage.description')}`,
    },
    {
      name: 'og:url',
      content: `${config.ZEMPIE_URL}${route.path}`,
    },
  ],
})

const options = ref([])
const selectVersion = ref('')
const showUndeployModal = ref(false)
const deployVersion = ref<IVersion>()
const showSelectStageModal = ref(false)
const selectedStage = ref(eGameStage.EARLY)
const stageOptions = [
  { name: 'Early Access', stage: eGameStage.EARLY },
  { name: 'Complete', stage: eGameStage.COMPLETE },
]

const projectId = computed(() => route.params.id as string)

const emit = defineEmits(['refresh'])

const { editProject, getProjectInfo } = useProject()

watch(
  () => editProject.value.info,
  (newVal) => {
    setVersionInfo(newVal)
  }
)

onMounted(() => {
  if (editProject.value.info.id) {
    setVersionInfo(editProject.value.info)
  }
})

function setVersionInfo(info: IProject) {
  deployVersion.value = info.projectVersions.find((version: IVersion) => {
    return version.id === info.deploy_version_id
  })

  const passedList = info.projectVersions.filter((version: IVersion) => {
    return version.state === 'passed'
  })

  options.value = passedList.map((version: IVersion) => version.version)
  if (options.value.length) selectVersion.value = options.value[0]
}

async function undeploy() {
  const formData = new FormData()

  formData.append('id', String(projectId.value))
  formData.append('deploy_version_id', '0')
  formData.append('stage', String(eGameStage.DEV))

  const { data, refresh, error } = await useFetch(
    `/studio/project/${projectId.value}`,
    getStudioFetchOptions('post', true, formData)
  )

  if (!error.value) {
    getProjectInfo(projectId.value)
  }
  showUndeployModal.value = false
}

async function deploy() {
  if (editProject.value.info.stage === eGameStage.DEV) {
    showSelectStageModal.value = true
    return
  }

  const deployVersion: IVersion =
    useProject().editProject.value.info.projectVersions.find(
      (version: IVersion) => {
        return (version.version = selectVersion.value)
      }
    )

  const formData = new FormData()

  formData.append('id', String(projectId.value))
  formData.append('deploy_version_id', String(deployVersion.id))

  const { data, refresh, error } = await useFetch(
    `/studio/project/${projectId.value}`,
    getStudioFetchOptions('post', true, formData)
  )

  if (!error.value) {
    getProjectInfo(projectId.value)

    ElMessage({
      message: t('version.deploy.done.'),
      type: 'success',
    })
  }
}

async function changeStage() {
  const deployVersion: IVersion =
    useProject().editProject.value.info.projectVersions.find(
      (version: IVersion) => {
        return (version.version = selectVersion.value)
      }
    )

  const formData = new FormData()

  formData.append('id', String(projectId.value))
  formData.append('stage', String(selectedStage.value))
  formData.append('deploy_version_id', String(deployVersion.id))

  const { data, refresh, error } = await useFetch(
    `/studio/project/${projectId.value}`,
    getStudioFetchOptions('post', true, formData)
  )

  if (!error.value) {
    getProjectInfo(projectId.value)

    ElMessage({
      message: t('version.deploy.done.'),
      type: 'success',
    })
    showSelectStageModal.value = false
  }
}
</script>

<style lang="scss" scoped>
.stage-select-container {
  display: inline-flex;
  justify-content: center !important;
  margin-top: 0px !important;
  align-items: center !important;
}

.sdc-select-box .vs__dropdown-toggle {
  margin-top: 0px !important;
}
</style>

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
            <input readonly v-model="deployVersion.number" type="text" name="" title="" placeholder="" class="w100p" />
          </li>
        </ul>
        <ul>
          <li>{{ $t('deployManage.show.detailed.version') }}</li>
          <li>
            <input readonly v-model="deployVersion.version" type="text" name="" title="" placeholder="" class="w100p" />
          </li>
        </ul>
        <ol>
          <li>{{ $t('deployManage.undeploy.title') }}</li>
          <li>{{ $t('deployManage.undeploy.info') }}</li>
          <li>
            <a class="btn-gray w100p" style="
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 0px;
              " @click="openUndeployModal">{{ $t('deployManage.undeploy.title') }}</a>
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
                {{ option.version }}
              </option>
            </select>
          </li>
          <li v-else>
            <select name="" title="" class="w100p">
              <option :value="$t('deployManage.changeDeploy.noVersion')">
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
        <el-dialog v-model="showUndeployModal" append-to-body class="modal-area-type" width="500px">
          <div class="modal-alert">
            <dl class="ma-header">
              <dt>{{ $t('information') }}</dt>
              <dd>
                <button @click="closeUndeployModal">
                  <IconClose />
                </button>
              </dd>
            </dl>
            <div class="ma-content">
              <h2>{{ $t('deployManage.undeploy.modal') }}</h2>
              <div>
                <button class="btn-default w48p" @click="undeploy">
                  {{ $t('undeploy') }}
                </button>
                <button class="btn-gray w48p" @click="closeUndeployModal">
                  {{ $t('no') }}
                </button>
              </div>
            </div>
          </div>
        </el-dialog>
        <el-dialog v-model="showSelectStageModal" append-to-body class="modal-area-type" width="500px">
          <div class="modal-alert">
            <dl class="ma-header">
              <dt>{{ $t('information') }}</dt>
              <dd>
                <button @click="closeSelectStageModal">
                  <IconClose />
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
                <select name="" title="" class="stage-select-box" v-model="selectedStage">
                  <option v-for="option in stageOptions" :value="option.stage">
                    {{ option.name }}
                  </option>
                </select>
              </div>
              <div style="margin-bottom: 10px">
                <button class="btn-default w48p" @click="changeStage">
                  {{ $t('change') }}
                </button>
                <button class="btn-gray w48p" @click="closeSelectStageModal">
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
import shared from '~~/scripts/shared';
import { onBeforeRouteLeave } from 'vue-router';

const { t } = useI18n()
const route = useRoute()

const options = ref([])
const selectVersion = ref()
const showUndeployModal = ref(false)
const deployVersion = ref<IVersion>()
const showSelectStageModal = ref(false)
const selectedStage = ref(eGameStage.EARLY)
const stageOptions = [
  { name: 'Early Access', stage: eGameStage.EARLY },
  { name: 'Complete', stage: eGameStage.COMPLETE },
]

const projectId = computed(() => route.params.id as string)

const isMobile = computed(() => useCommon().common.value.isMobile)

const emit = defineEmits(['refresh'])

const { editProject, getProjectInfo } = useProject()

definePageMeta({
  title: 'Distribution Mgmt.',
  name: 'deployManage',
  middleware: 'auth',
})


shared.createHeadMeta(t('seo.project.deploy.manage.title'), t('seo.project.deploy.manage.desc'))

watch(
  () => editProject.value.info,
  (newVal) => {
    setVersionInfo(newVal)
  }
)

onMounted(() => {
  useRouterLeave()
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

  options.value = passedList.map((version: IVersion) => {
    return {
      id: version.id,
      version: version.version
    }
  })

  if (options.value.length) selectVersion.value = options.value[0]
}

async function undeploy() {
  const formData = new FormData()

  formData.append('id', String(projectId.value))
  formData.append('deploy_version_id', '0')
  formData.append('stage', String(eGameStage.DEV))

  const { data, refresh, error } = await useCustomAsyncFetch(
    `/studio/project/${projectId.value}`,
    getStudioFetchOptions('post', true, formData)
  )

  if (!error.value) {
    getProjectInfo(projectId.value)
  }
  closeUndeployModal()
}

async function deploy() {


  if (editProject.value.info.stage === eGameStage.DEV) {
    openSelectStageModal()
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
  formData.append('deploy_version_id', String(selectVersion.value.id))

  const { data, refresh, error } = await useCustomAsyncFetch(
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
    useProject().editProject.value.info.projectVersions.find((project: any) => {
      return project.version === selectVersion.value.version
    })

  const formData = new FormData()

  formData.append('id', String(projectId.value))
  formData.append('stage', String(selectedStage.value))
  formData.append('deploy_version_id', String(deployVersion.id))

  const { data, refresh, error } = await useCustomAsyncFetch(
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

function openUndeployModal() {
  showUndeployModal.value = true
  if (isMobile.value) {
    useCommon().setPopState(true)
  }
}

function closeUndeployModal() {
  showUndeployModal.value = false
  if (isMobile.value) {
    useCommon().setPopState(false)
  }
}

function openSelectStageModal() {
  showSelectStageModal.value = true
  if (isMobile.value) {
    useCommon().setPopState(true)
  }
}

function closeSelectStageModal() {
  showSelectStageModal.value = false
  if (isMobile.value) {
    useCommon().setPopState(false)
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

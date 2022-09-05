<template>
  <NuxtLayout name="user-setting">
    <div class="info-input">
      <div class="ii-title">
        <h2>General Settings</h2>
        <h3>{{ $t('userSetting.title') }}</h3>
      </div>

      <dl class="ii-card">
        <dt>
          <div
            :style="{
              'background-color': 'orange',
              'background-size': 'cover',
            }"
          ></div>
          <p
            :style="
              prevProfile
                ? `background: url(${prevProfile}) center center / cover no-repeat; background-size: cover;`
                : `background: url(/images/300_300_default_profile.png) center center / cover no-repeat; background-size: cover;`
            "
          ></p>
        </dt>
        <dd @click="uploadFile">
          <div style="height: 0px; overflow: hidden">
            <input type="file" @change="onFileChange" accept=image/*
            ref="profileImg" name="fileInput" />
          </div>
          <p><i class="uil uil-image-plus"></i></p>
          <h2>Change Profile</h2>
          <h3>{{ fileName }}</h3>
          <div @click.stop="deleteImg">
            <a><i class="uil uil-trash-alt"></i></a>
          </div>
        </dd>
      </dl>
      <div class="ii-form">
        <ol>
          <li>Email</li>
          <li>
            <input
              type="text"
              name=""
              title=""
              placeholder=""
              class="w100p"
              readonly
              :value="userInfo?.email"
            />
          </li>
          <li>&nbsp;</li>
        </ol>
        <ol>
          <li>{{ $t('userSetting.name') }}</li>
          <li>
            <input
              type="text"
              name=""
              title=""
              readonly
              class="w100p"
              :value="userInfo?.name"
            />
          </li>
        </ol>
      </div>
    </div>

    <div class="area-btn">
      <a v-if="isUpdating" class="btn-default w250">
        <ClipLoader :color="'#fff'" :size="'20px'"></ClipLoader>
      </a>
      <a v-else @click="onSubmit" class="btn-default w250">{{ $t('save') }}</a>
    </div>
    <div class="delete-account" v-if="signUpType === 'password'">
      <h2>{{ $t('userSetting.pwd.change') }}</h2>
      <div>
        <p>
          {{ $t('userSetting.pwd.change.info1') }}
          <span>
            <NuxtLink :to="localePath(`/myaccount/change-password`)">
              {{ $t('click') }}</NuxtLink
            >
          </span>
          {{ $t('userSetting.pwd.change.info2') }}
        </p>
      </div>
    </div>
    <div class="delete-account">
      <h2>{{ $t('userSetting.account.leave') }}</h2>
      <div>
        <p>
          {{ $t('userSetting.account.leave.info1') }}
          <span>
            <NuxtLink :to="localePath(`/myaccount/leave`)"
              >{{ $t('click') }}
            </NuxtLink>
          </span>
          {{ $t('userSetting.pwd.change.info2') }}
        </p>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import { ElMessage } from 'element-plus'

import { useLocalePath } from 'vue-i18n-routing'
import { useI18n } from 'vue-i18n'

const localePath = useLocalePath()
const { t, locale } = useI18n()
const route = useRoute()
const config = useRuntimeConfig()

definePageMeta({
  title: 'my-account',
  name: 'myAccount',
  middleware: 'auth',
})

useHead({
  title: `${t('seo.profile.info.title')} | Zempie`,
  meta: [
    {
      name: 'description',
      content: `${t('seo.profile.info.desc')}`,
    },
    {
      name: 'og:title',
      content: `${t('seo.profile.info.title')}`,
    },
    {
      name: 'og:description',
      content: `${t('seo.profile.info.description')}`,
    },
    {
      name: 'og:url',
      content: `${config.ZEMPIE_URL}${route.path}`,
    },
  ],
})

const MAX_FILE_SIZE = 3
let submitAcceessableCount = 2

const isUpdating = ref(false)

const profileImg = ref<HTMLElement>()
const fileName = ref('')
const prevProfile = ref<string | ArrayBuffer>('')
const updateFile = ref<File | null>()

const signUpType = computed(
  () => useUser().user.value.fUser?.providerData[0].providerId
)
const userInfo = computed(() => useUser().user.value.info)

watch(
  () => userInfo.value,
  (val) => {
    prevProfile.value = val.picture
  }
)

function uploadFile() {
  profileImg.value.click()
}

function onFileChange(event: any) {
  const file = event.target.files[0]
  if (file.size < 1024 * 1024 * MAX_FILE_SIZE) {
    fileName.value = file.name
    updateFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      prevProfile.value = e.target!.result
    }
    reader.readAsDataURL(file)
    event.target.value = ''
  } else {
    ElMessage({
      message: t(
        `${t('maxFile.size.text1')}${MAX_FILE_SIZE}mb${t(
          'maxFile.size.text2'
        )}.`
      ),
      type: 'warning',
    })
  }
}

function deleteImg(e: any) {
  prevProfile.value = ''
  fileName.value = ''
  updateFile.value = null
}

async function onSubmit() {
  submitAcceessableCount = submitAcceessableCount - 1

  if (submitAcceessableCount > 0) {
    isUpdating.value = true
    const formData = new FormData()

    if (updateFile.value) {
      formData.append('file', updateFile.value)
      formData.append('name', userInfo.value.name)

      const { data, error, refresh, pending } = await user.updateInfo(formData)

      if (!error.value) {
        ElMessage({
          message: t('userSetting.done'),
          type: 'success',
        })
        useUser().setProfileImg(
          data.value.result.user.picture + `?_=${Date.now()}`
        )
        updateFile.value = null
      } else {
        ElMessage({
          message: error.error.message,
          type: 'error',
        })
      }
    } else {
      formData.append('rm_picture', 'true')
      const { data, error, refresh, pending } = await user.updateInfo(formData)

      if (!error.value) {
        ElMessage({
          message: t('userSetting.done'),
          type: 'success',
        })
        useUser().setProfileImg(null)
      } else {
        ElMessage({
          message: error.error.message,
          type: 'error',
        })
      }
    }
  }
  isUpdating.value = false
  submitAcceessableCount = submitAcceessableCount + 1
}
</script>

<style lang="scss" scoped>
@media all and (max-width: 479px) {
  .ii-card {
    dd:last-child {
      width: 100%;
    }
  }
}

@media all and (min-width: 480px) and (max-width: 767px) {
  .ii-card {
    dd:last-child {
      width: 100%;
    }
  }
}
</style>

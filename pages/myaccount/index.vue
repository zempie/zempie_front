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
            :style="
              prevBanner
                ? `background: url(${prevBanner}) center center / cover no-repeat; background-size: cover;`
                : `background-color:orange; background-size:cover`
            "
          ></div>
          <p
            :style="
              prevProfile
                ? `background: url(${prevProfile}) center center / cover no-repeat; background-size: cover;`
                : `background: url(/images/300_300_default_profile.png) center center / cover no-repeat; background-size: cover;`
            "
          ></p>
        </dt>
        <dd @click="uploadProfileFile">
          <div style="height: 0px; overflow: hidden">
            <input type="file" @change="onProfileFileChange" accept=image/*
            ref="profileImg" name="fileInput" />
          </div>
          <p><i class="uil uil-image-plus"></i></p>
          <h2>Change Profile</h2>
          <h3>{{ profileFileName }}</h3>
          <div @click.stop="deleteProfileImg">
            <a><i class="uil uil-trash-alt"></i></a>
          </div>
        </dd>
        <dd @click="uploadBannerFile">
          <div style="height: 0px; overflow: hidden">
            <input type="file" @change="onBannerFileChange" accept=image/*
            ref="bannerImg" name="fileInput" />
          </div>
          <p><i class="uil uil-image-plus"></i></p>
          <h2>Change Banner</h2>
          <h3>{{ bannerFileName }}</h3>
          <div @click.stop="deleteBannerImg">
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
            <NuxtLink :to="$localePath(`/myaccount/change-password`)">
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
            <NuxtLink :to="$localePath(`/myaccount/leave`)"
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
import { ElMessage, ElLoading } from 'element-plus'

import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const route = useRoute()
const config = useRuntimeConfig()
const { $localePath } = useNuxtApp()
definePageMeta({
  title: 'my-account',
  name: 'myAccount',
  //middleware: 'auth',
})

useHead({
  title: `${t('seo.profile.info.title')} | Zempie`,
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
      content: `${t('seo.profile.info.desc')}`,
    },
    {
      property: 'og:title',
      content: `${t('seo.profile.info.title')}`,
    },
    {
      property: 'og:description',
      content: `${t('seo.profile.info.description')}`,
    },
    {
      property: 'og:url',
      content: `${config.ZEMPIE_URL}${route.path}`,
    },
  ],
})

const MAX_FILE_SIZE = 3

const isUpdating = ref(false)

const profileImg = ref<HTMLElement>()
const profileFileName = ref('')
const updateProfileFile = ref<File | null>()

const bannerImg = ref<HTMLElement>()
const bannerFileName = ref('')
const updateBannerFile = ref<File | null>()

const signUpType = computed(
  () => useUser().user.value.fUser?.providerData[0].providerId
)
const userInfo = computed(() => useUser().user.value.info)

const prevProfile = ref<string | ArrayBuffer>(
  userInfo.value?.picture ? userInfo.value.picture + `?_=${Date.now()}` : ''
)
const prevBanner = ref<string | ArrayBuffer>(
  userInfo.value?.url_banner
    ? userInfo.value.url_banner + `?_=${Date.now()}`
    : ''
)
watch(
  () => userInfo.value,
  (val) => {
    prevProfile.value = val.picture
    prevBanner.value = val.url_banner
  }
)

function uploadProfileFile() {
  profileImg.value.click()
}

function uploadBannerFile() {
  bannerImg.value.click()
}

function onProfileFileChange(event: any) {
  const file = event.target.files[0]
  if (file.size < 1024 * 1024 * MAX_FILE_SIZE) {
    profileFileName.value = file.name
    updateProfileFile.value = file
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

function deleteProfileImg(e: any) {
  prevProfile.value = ''
  profileFileName.value = ''
  updateProfileFile.value = null
}
function onBannerFileChange(event: any) {
  const file = event.target.files[0]
  if (file.size < 1024 * 1024 * MAX_FILE_SIZE) {
    bannerFileName.value = file.name
    updateBannerFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      prevBanner.value = e.target!.result
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
function deleteBannerImg(e: any) {
  prevBanner.value = ''
  bannerFileName.value = ''
  updateBannerFile.value = null
}

async function onSubmit() {
  isUpdating.value = true
  const formData = new FormData()

  if (updateBannerFile.value) {
    formData.append('banner_file', updateBannerFile.value)
  }
  if (updateProfileFile.value) {
    formData.append('file', updateProfileFile.value)
    formData.append('name', userInfo.value.name)
  }
  if (prevProfile.value === '') {
    formData.append('rm_picture', 'true')
  }
  if (prevBanner.value === '') {
    formData.append('rm_banner', 'true')
  }

  const { data, error, refresh, pending } = await user.updateInfo(formData)

  if (data.value) {
    const { result } = data.value
    const { user } = result
    ElMessage({
      message: t('userSetting.done'),
      type: 'success',
    })
    if (user.picture) {
      useUser().setProfileImg(user.picture + `?_=${Date.now()}`)
    } else {
      useUser().setProfileImg(null)
    }

    if (user.url_banner) {
      useUser().setBannerImg(user.url_banner + `?_=${Date.now()}`)
    } else {
      useUser().setBannerImg(null)
    }

    updateBannerFile.value = null
    updateProfileFile.value = null
  } else {
    ElMessage({
      message: error.error.message,
      type: 'error',
    })
  }

  isUpdating.value = false
}
</script>

<style lang="scss" scoped>
@media all and (max-width: 479px) {
  .ii-card {
    dd {
      width: 100%;
      margin-right: 0px;
    }
  }
}

@media all and (min-width: 480px) and (max-width: 767px) {
  .ii-card {
    dd {
      width: 100%;
      margin-right: 0px;
    }
  }
}

@media all and (min-width: 768px) and (max-width: 991px) {
  .ii-card {
    dt {
      width: 30%;
    }
    dd {
      width: 30%;
    }
  }
}
@media all and (min-width: 992px) and (max-width: 1199px) {
  .ii-card {
    dt {
      width: 30%;
    }
    dd {
      width: 30%;
    }
  }
}
</style>

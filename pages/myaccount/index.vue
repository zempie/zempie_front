<template>
  <NuxtLayout name="user-setting">
    <div class="info-input">
      <div class="ii-title">
        <h2>{{ $t('general.settings') }}</h2>
        <h3>{{ $t('userSetting.title') }}</h3>
      </div>

      <dl class="ii-card">
        <dt>
          <div :style="bannerStyle"></div>
          <p :style="profileStyle"></p>
        </dt>
        <dd @click="uploadProfileFile">
          <div style="height: 0px; overflow: hidden">
            <input type="file" @change="onProfileFileChange" accept=image/* ref="profileImg" name="fileInput" />
          </div>
          <p><i class="flex">
              <LazyIconScenery color="#888" width="50px" height="50px" />
            </i></p>
          <h2>{{ $t('change.profile') }}</h2>
          <h3>{{ profileFileName }}</h3>
          <div @click.stop="deleteProfileImg">
            <a><i>
                <LazyIconTrash color="#fff" />
              </i></a>
          </div>
        </dd>
        <dd @click="uploadBannerFile">
          <div style="height: 0px; overflow: hidden">
            <input type="file" @change="onBannerFileChange" accept=image/* ref="bannerImg" name="fileInput" />
          </div>
          <p><i class="flex">
              <LazyIconScenery color="#888" width="50px" height="50px" />
            </i></p>
          <h2>{{ $t('change.banner') }}</h2>
          <h3>{{ bannerFileName }}</h3>
          <div @click.stop="deleteBannerImg">
            <a><i>
                <LazyIconTrash color="#fff" />
              </i></a>
          </div>
        </dd>
      </dl>
      <div class="ii-form">
        <ol>
          <li>{{ $t('email') }}</li>
          <li>
            <input type="text" class="w100p" readonly :value="userInfo?.email" />
          </li>
          <li>&nbsp;</li>
        </ol>
        <ol>
          <li class="flex items-center">{{ $t('name') }}
            <el-tooltip :content="$t('name.info')">
              <i class="ml5">
                <LazyIconInfoCircle width="20px" />
              </i>
            </el-tooltip>
          </li>
          <li>
            <input type="text" class="w100p" v-model="userName" />
          </li>
        </ol>
        <ol>
          <li class="flex items-center">{{ $t('nickname') }}
            <el-tooltip :content="$t('nickname.info')">
              <i class="ml5">
                <LazyIconInfoCircle width="20px" />
              </i>
            </el-tooltip>
          </li>
          <li>
            <CommonPrefixInput prefix="@" @change-input="onChangeNickname" :inputValue="newNickname" />
            <small class="text-red" v-if="isUsernameErr">{{ userNameErr }}</small>
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
    <div class="info-input">
      <div class="ii-title">
        <h2> {{ t('notification') }}</h2>
      </div>
      <div class="ii-form">
        <ol>
          <li>{{ $t('alarm') }}</li>
          <li>{{ $t('userSetting.alarm.info') }} </li>
          <li>
            <el-switch v-model="isAlarmOn" size="large" active-color="#ff6e17" @click="setAlarmStatus" />
          </li>
        </ol>
        <ol>
          <li>{{ $t('dm') }}</li>
          <li>{{ $t('userSetting.alarm.info') }}</li>
          <li>
            <el-switch v-model="isDmAlarmOn" size="large" active-color="#ff6e17"
              @click="setAlarmStatus(eNotificationType.dm)" />
          </li>
        </ol>
      </div>

    </div>

    <div class="delete-account" v-if="signUpType === 'password'">
      <h2>{{ $t('userSetting.pwd.change') }}</h2>
      <div>
        <p>
          {{ $t('userSetting.pwd.change.info1') }}
          <span>
            <NuxtLink :to="$localePath(`/myaccount/change-password`)">
              {{ $t('click') }}</NuxtLink>
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
            <NuxtLink :to="$localePath(`/myaccount/leave`)">{{ $t('click') }}
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
import { ElMessage, ElTooltip, ElSwitch } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { removeFcmToken, resigterFcmToken } from '~~/scripts/firebase-fcm';
import shared from '~/scripts/shared'
import { fileReader, nicknameRegex } from '~/scripts/utils'
import { eNotificationType } from '~~/types';
import { onBeforeRouteLeave } from 'vue-router';

const { t, locale } = useI18n()
const route = useRoute()
const config = useRuntimeConfig()
const { $localePath } = useNuxtApp()

const specialCharRegex = /[\{\}\[\]\/?,;:|\)*~`!^\-+<>@\#$%&\\\=\(\'\"]/;

const MAX_FILE_SIZE = 10

definePageMeta({
  title: 'my-account',
  name: 'myAccount',
  middleware: 'auth',
})

shared.createHeadMeta(t('seo.profile.info.title'), t('seo.profile.info.desc'))

onMounted(() => {
  useRouterLeave()
})

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

const isAlarmOn = ref(userInfo.value?.setting.alarm)
const isDmAlarmOn = ref(userInfo.value?.setting.dm_alarm)

const currNickname = computed(() => userInfo.value?.nickname)
const nickname = ref()
const newNickname = computed(() => currNickname.value)

const userNameErr = ref('')
const isUsernameErr = ref(false)



watch(
  () => userInfo.value,
  async (info) => {
    if (info?.id) {
      isAlarmOn.value = info.setting.alarm
      isDmAlarmOn.value = info.setting.dm_alarm
    }
  }
)


const userName = computed({
  get: () => userInfo.value?.name,
  set: newValue => userInfo.value.name = newValue
})

const currProfile = computed(() => userInfo.value?.picture && userInfo.value.picture + `?_=${Date.now()}`)
const currBanner = computed(() => userInfo.value?.url_banner && userInfo.value.url_banner + `?_=${Date.now()}`)
const prevProfile = ref<string | ArrayBuffer>()
const prevBanner = ref<string | ArrayBuffer>()

const bannerStyle = computed(() => {
  const url = prevBanner.value || currBanner.value
  return url
    ? `background: url(${url}) center center / cover no-repeat; background-size: cover;`
    : `background-color:orange; background-size:cover`
})

const profileStyle = computed(() => {
  const url = prevProfile.value || currProfile.value
  return url
    ? `background: url(${url}) center center / cover no-repeat; background-size: cover;`
    : `background: url(/images/300_300_default_profile.png) center center / cover no-repeat; background-size: cover;`
})

const isFlutter = computed(() => useMobile().mobile.value.isFlutter)

async function uploadProfileFile() {

  profileImg.value.click()
}

async function uploadBannerFile() {

  bannerImg.value.click()
}

async function onProfileFileChange(event: Event) {
  const [file] = (event.target as HTMLInputElement).files

  if (file.type === 'image/gif') {
    alert(t('not.support.ext'))
    return
  }
  if (isPassFileSize(file)) {
    profileFileName.value = file.name
    updateProfileFile.value = file
    const result = await fileReader(file);
    prevProfile.value = result;
    (event.target as HTMLInputElement).value = ''
  }
}

async function onBannerFileChange(event: Event) {
  const [file] = (event.target as HTMLInputElement).files

  if (file.type === 'image/gif') {
    alert(t('not.support.ext'))
    return
  }

  if (isPassFileSize(file)) {
    bannerFileName.value = file.name
    updateBannerFile.value = file
    const result = await fileReader(file);
    prevBanner.value = result;
    (event.target as HTMLInputElement).value = ''
  }
}

function isPassFileSize(file: File): boolean {
  if (file && (file.size < 1024 * 1024 * MAX_FILE_SIZE)) {
    return true
  } else {
    ElMessage({
      message: t(
        `${t('maxFile.size.text1')}${MAX_FILE_SIZE}mb${t(
          'maxFile.size.text2'
        )}.`
      ),
      type: 'warning',
    })
    return false
  }

}

function deleteProfileImg() {
  prevProfile.value = ''
  profileFileName.value = ''
  updateProfileFile.value = null
}


function deleteBannerImg() {
  prevBanner.value = ''
  bannerFileName.value = ''
  updateBannerFile.value = null
}

async function onSubmit() {
  if (isUsernameErr.value) {
    return
  }

  isUpdating.value = true
  const formData = new FormData()

  if (updateBannerFile.value) {
    formData.append('banner_file', updateBannerFile.value)
  }
  if (updateProfileFile.value) {
    formData.append('file', updateProfileFile.value)
  }
  if (prevProfile.value === '') {
    formData.append('rm_picture', 'true')
  }
  if (prevBanner.value === '') {
    formData.append('rm_banner', 'true')
  }
  if (nickname.value) {
    formData.append('nickname', nickname.value)
  }
  if (userName.value) {
    formData.append('name', userName.value)
  }


  try {
    const { data } = await useCustomAsyncFetch<{ result: any }>('/user/update/info', getZempieFetchOptions('post', true, formData))

    const { result } = data.value;
    const { user: userInfo } = result;

    ElMessage({
      message: t('userSetting.done'),
      type: 'success',
    });

    useUser().setUser(userInfo);
    updateBannerFile.value = null;
    updateProfileFile.value = null;
  } catch (error) {
    ElMessage({
      message: error?.error?.message || t('userSetting.error'),
      type: 'error',
    });
  }
  isUpdating.value = false
}

async function setAlarmStatus(type: number) {
  const userId = useUser().user.value.info.id
  let alarmState
  switch (type) {
    case eNotificationType.dm:
      alarmState = isDmAlarmOn.value
      break;
    default:
      alarmState = isAlarmOn.value

  }
  const { data } = await useCustomAsyncFetch<{ result: { user_setting: { notify_chat: boolean, notify_alarm: boolean } } }>('/user/alarm', getZempieFetchOptions('put', true, { alarm_state: alarmState, type }))


  console.log(data.value)
  if (data.value) {

    const { result } = data.value
    useUser().updateUserSetting('dm_alarm', result.user_setting.notify_chat)
    console.log(userInfo.value)
  }

  // if (response.result === 'success') {
  //   if (isAlarmOn.value) {
  //     await resigterFcmToken(userId)
  //   }
  // }


}


async function onChangeNickname(input?: string) {
  const MAX_LIMIT = 15;
  const MIN_LIMIT = 4;
  nickname.value = input
  clearError();


  if (!nicknameRegex.test(nickname.value)) {
    console.log('error')
    if (nickname.value.length > MAX_LIMIT) {
      showError(`${t('username.max.err1')} ${MAX_LIMIT}${t('username.max.err2')}`);
    } else if (nickname.value.length < MIN_LIMIT) {
      showError(`${t('username.max.err1')} ${MIN_LIMIT}${t('username.min.err2')}`);
    } else if (specialCharRegex.test(nickname.value)) {
      showError(t('join.nickname.format.err'));
    } else {
      showError(t('join.nickname.format.err'));
    }
    return
  }

  try {
    const { data } = await useCustomAsyncFetch<{ result: { success: boolean } }>(
      '/user/has-nickname',
      getZempieFetchOptions('post', false, { nickname: nickname.value })
    );
    if (data.value.result.success) {
      showError(t('used.id'));
    } else {
      clearError();
    }
  } catch (error) {
    console.error(error);
  }

}
function showError(message: string) {
  isUsernameErr.value = true;
  userNameErr.value = message;
}

function clearError() {
  isUsernameErr.value = false;
  userNameErr.value = '';
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

<template>
  <div>
    <div class="login-area">
      <div class="la-content">
        <form>
          <input type="email" v-model="v$.email.$model" name="login-email" title=""
            :placeholder="$t('login.email.placeholder')" class="w100p h60" style="margin-bottom: 10px"
            autocomplete="user-email" @keyup.enter="onSubmit" />
          <h2 class="input-errors" v-for="error of v$.email.$errors" :key="error.$uid">
            <i class="uil uil-check"></i>{{ error.$message }}
          </h2>
          <input type="password" v-model="v$.password.$model" name="login-password" title=""
            autocomplete="current-password" :placeholder="$t('login.pwd.placeholder')" class="w100p h60"
            style="margin-bottom: 10px" @keyup.enter="onSubmit" />

          <h2 class="input-errors" v-for="error of v$.password.$errors" :key="error.$uid">
            <i class="uil uil-check"></i>{{ error.$message }}
          </h2>
        </form>
        <p @click="onSubmit">
          <a class="btn-default-big text-white">{{ $t('login') }}</a>
        </p>
        <slot name="actions"></slot>
      </div>
      <div v-if="isSimple" class="flex content-center">
        <ul class="flex row">
          <li @click="googleLogin" v-if="!isNotGoogleSupport"><img src="/images/login/google_logo_only.png" /></li>
          <li @click="facebookLogin"> <img src="/images/login/fb_logo_only.png" /></li>
          <li @click="appleLogin">
            <img src="/images/login/apple_logo_only.png" />
          </li>
        </ul>
      </div>
      <div v-else class="la-bottom flex column" style="overflow:hidden">
        <ul>
          <li @click="googleLogin" v-if="!isNotGoogleSupport">
            <img src="/images/login/google_login.jpeg" alt="google-login" title="" />
          </li>
          <li @click="facebookLogin" class="mt10">
            <img src="/images/login/facebook_login.jpg" alt="google-login" title="" />
          </li>
          <li @click="appleLogin" class="mt10">
            <img src="/images/login/apple_login.jpg" alt="apple-login" title="" />
          </li>
        </ul>
      </div>

    </div>
    <Loading :is-loading="isLoading" />
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import useVuelidate from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import { useI18n } from 'vue-i18n'
import { emailRegex, passwordRegex } from '~/scripts/utils'
import {
  signInWithEmailAndPassword,
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  OAuthProvider,
  AuthProvider,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence,
} from 'firebase/auth'
import FlutterBridge from '~~/scripts/flutterBridge'
import { setFirebaseToken } from '~~/plugins/firebase.client'

const { $firebaseAuth, $cookies, $localePath } = useNuxtApp()

const { t, locale } = useI18n()
const router = useRouter()

const currUser = ref()
const isPageLoading = ref(true)

const isNotGoogleSupport = ref()

const isLoading = ref(false)

const form = reactive({
  email: '',
  password: '',
})

const emailValidator = helpers.regex(emailRegex)

const rules = computed(() => {
  const formRule = {
    email: {
      required: helpers.withMessage(t('login.empty.email'), required),
      emailValidator: helpers.withMessage(
        t('login.email.format.err'),
        emailValidator
      ),
    },
    password: {
      required: helpers.withMessage(t('login.empty.pwd'), required),
    },
  }

  return formRule
})
const v$ = useVuelidate(rules, form)
const isFlutter = computed(() => useMobile().mobile.value.isFlutter)


const fUser = computed(() => useUser().user.value.fUser)
const userInfo = computed(() => useUser().user.value.info)

const props = defineProps({
  isSimple: {
    type: Boolean,
    default: false
  },
})


watch(
  () => useUser().user.value.info,
  (val) => {
    if (val) {
      if (isPageLoading.value) {
        router.push($localePath('/'))
        isPageLoading.value = false
      }
    }
  })


watch(
  () => useUser().user.value.isLoading,
  (val) => {
    if (!val) {
      isPageLoading.value = false
    }
  })

onBeforeMount(() => {
  if (isFlutter.value) {
    if (useUser().user.value.isLoading) {
      isPageLoading.value = true
    } else {
      isPageLoading.value = false
      if (fUser.value && userInfo.value) {
        router.push($localePath('/'))
      }
    }
  } else {
    isPageLoading.value = false
  }

})


onMounted(() => {
  isNotGoogleSupport.value = navigator.userAgent.includes('kakao') || navigator.userAgent.includes('naver')
  nextTick(() => {
    window.addEventListener("message", receiveMessage, false);
  })
})

onBeforeUnmount(() => {
  window.removeEventListener("message", receiveMessage, false);
})

async function onSubmit() {
  const isValid = await v$.value.$validate()

  if (isFlutter.value) {

    try {
      const result = await FlutterBridge().signInEmail({ email: form.email, password: form.password })
      currUser.value = result
      router.push($localePath('/'))
      await useUser().setUserInfo()
      await setFirebaseToken()
    }
    catch (err) {
      firebaseLoginErr(err)
    }


  } else {
    if (!isValid) return
    setPersistence($firebaseAuth, browserLocalPersistence)
      .then((res) => {
        signInWithEmailAndPassword($firebaseAuth, form.email, form.password)
          .then(async (result) => {
            const { user } = result
            if (user) {
              if (props.isSimple) {
                router.replace($localePath('/zemtown'))
              } else {
                router.push($localePath('/'))
              }
              // await useUser().setUserInfo()
            }
          })
          .catch((err: any) => {
            firebaseLoginErr(err)
          })
      })
      .catch((err: any) => {
        ElMessage.error(err.message)
      })
  }
}

async function receiveMessage(message: any) {
  let data = message.data;
  switch (data.type) {
    case 'IdTokenChanged':
    case 'idTokenChanged': {
      currUser.value = data.user
    }
  }

}

async function googleLogin() {
  isLoading.value = true
  if (isFlutter.value) {
    flutterSocialLogin('google')
  }
  else {
    const provider = new GoogleAuthProvider()
    return socialLogin(provider)
  }
}

async function facebookLogin() {
  isLoading.value = true

  if (isFlutter.value) {
    flutterSocialLogin('facebook')
  } else {
    const provider = new FacebookAuthProvider()
    provider.addScope('email')
    provider.addScope('public_profile')
    return socialLogin(provider)
  }
}


async function appleLogin() {
  isLoading.value = true

  if (isFlutter.value) {
    flutterSocialLogin('apple')
  } else {
    const provider = new OAuthProvider('apple.com')
    provider.addScope('email')
    provider.addScope('name');

    return socialLogin(provider)
  }
}
async function flutterSocialLogin(type: string) {

  let info = undefined
  try {

    switch (type) {
      case 'apple':
        info = await FlutterBridge().signInApple()
        break;
      case 'google':
        info = await FlutterBridge().signInGoogle()
        break;
      case 'facebook':
        info = await FlutterBridge().signInFacebook()
        break;
    }

    if (info) {
      const firebaseUser = {
        ...info.additionalUserInfo.profile,
        accessToken: info.credential.accessToken
      }

      useUser().setFirebaseUser(firebaseUser)

      const userInfo = await useUser().setUserInfo()
      if (userInfo) {
        await setFirebaseToken()
        router.push($localePath('/'))
      }
    } else {
      throw "Firebase information does not exist"
    }
  } catch (err) {
    firebaseJoinErr(err)
  } finally {
    isLoading.value = false
  }

}

async function socialLogin(provider: AuthProvider) {

  try {
    const res = await signInWithPopup($firebaseAuth, provider)
    router.push($localePath('/'))

  } catch (err) {
    firebaseJoinErr(err)
  }
  finally {
    isLoading.value = false
  }
}

function firebaseJoinErr(err: any) {
  if (err && err.message?.includes('auth/account-exists-with-different-credential')) {
    ElMessage.error(`${t('exist.wt.diff.email')}`)
  } else if (err && err.message?.includes('auth/popup-closed-by-user')) {
    return
  }
  else {
    ElMessage.error(err.message)
  }
}

function firebaseLoginErr(err: any) {
  const errorCode = err.code
  const errorMessage = err.message
  let message = errorCode ? errorCode : errorMessage

  switch (errorCode) {
    case 'auth/weak-password':
      message = `${t('login.pwd.format.err')}`
      break
    case 'auth/wrong-password':
      ElMessage.error(`${t('fb.wrong.info')}`)
      break
    case 'auth/user-not-found':
      ElMessage.error(`${t('fb.not.found')}`)
      break
    default:
      ElMessage.error(err.message)
      break
  }
  throw { message }
}

</script>

<style scoped lang="scss">
.input-errors {
  font-size: 12px;
  color: #c5292a;
}

.input-errors:not(:last-child) {
  padding-bottom: 10px;
}

.login-area {
  .la-bottom {
    ul {
      flex-direction: column;

      li {
        img {
          width: 300px;
        }
      }
    }
  }
}
</style>

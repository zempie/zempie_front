<template>
  <div class="login-bg pt50 pb50" style="height: 100vh; min-height: 900px">
    <div class="login-logo">
      <LoginWhiteLogoDt path="/" />
    </div>
    <div class="login-area">
      <div class="la-logo">
        <LoginWhiteLogoMb path="/" />
      </div>
      <div class="la-title">
        <h3>{{ $t('login.text1') }}</h3>
        <p>{{ $t('login.text2') }}</p>
      </div>
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
        <dl>
          <dt>
            <NuxtLink :to="$localePath('/reset-password')">{{
              $t('reset.pwd')
            }}</NuxtLink>
          </dt>
          <dd>|</dd>
          <dt>
            <NuxtLink :to="$localePath('/join')">{{ $t('join') }}</NuxtLink>
          </dt>
        </dl>
      </div>
      <div class="la-bottom">
        <dl>
          <dt></dt>
          <dd>{{ $t('login.text3') }}</dd>
          <dt></dt>
        </dl>
        <ul>
          <li @click="googleLogin">
            <img src="/images/login/google_login.jpeg" alt="google-login" title="" />
          </li>
          <li @click="facebookLogin" class="mt10">
            <img src="/images/login/facebook_login.jpg" alt="google-login" title="" />
          </li>
          <li @click="appleLogin" class="mt10">
            <img src="/images/login/apple_login.jpg" alt="apple-login" title="" />
          </li>
        </ul>
        <p>
          <span><i class="uil uil-info-circle" style="font-size: 16px; line-height: 24px"></i></span>
          {{ $t('login.text4') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as fbFcm from '~~/scripts/firebase-fcm'
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
import shared from '~/scripts/shared'
import FlutterBridge from '~~/scripts/flutterBridge'
import { setFirebaseToken } from '~~/plugins/firebase.client'

const { $firebaseAuth, $cookies, $localePath } = useNuxtApp()

const { t, locale } = useI18n()
const router = useRouter()
const route = useRoute()
const config = useRuntimeConfig()

const currUser = ref()
const isPageLoading = ref(true)


definePageMeta({
  layout: 'layout-none',
  middleware: 'guest-only'
})

shared.createHeadMeta(t('seo.login.title'), t('seo.login.desc'))

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

    const result = await FlutterBridge().signInEmail({ email: form.email, password: form.password })
    currUser.value = result
    console.log('email login', result)
    router.push($localePath('/'))
    await useUser().setUserInfo()
    await setFirebaseToken()


  } else {
    if (!isValid) return
    setPersistence($firebaseAuth, browserLocalPersistence)
      .then((res) => {
        signInWithEmailAndPassword($firebaseAuth, form.email, form.password)
          .then(async (result) => {
            const { user } = result
            if (user) {
              router.push($localePath('/'))
              // await useUser().setUserInfo()
            }
          })
          .catch((err: any) => {
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
                ElMessage.error(errorCode)
                break
            }
            throw { message }
          })
      })
      .catch((err: any) => {
        ElMessage.error(err.message)
      })
  }
}

async function googleLogin() {
  if (isFlutter.value) {
    try {
      const result = await FlutterBridge().signInGoogle()
      await flutterSocialLogin(result)
    } catch (err) {
      if (err.message.includes('auth/account-exists-with-different-credential')) {
        ElMessage.error(`${t('exist.wt.diff.email')}`)
      }
    }
  }
  else {
    const provider = new GoogleAuthProvider()
    return socialLogin(provider)
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

async function facebookLogin() {
  if (isFlutter.value) {
    try {
      const result = await FlutterBridge().signInFacebook()
      await flutterSocialLogin(result)
    } catch (err) {
      if (err.message.includes('auth/account-exists-with-different-credential')) {
        ElMessage.error(`${t('exist.wt.diff.email')}`)
      }
    }
  } else {
    const provider = new FacebookAuthProvider()
    provider.addScope('email')
    provider.addScope('public_profile')
    return socialLogin(provider)
  }
}


async function appleLogin() {
  if (isFlutter.value) {
    try {
      const result = await FlutterBridge().signInApple()
      await flutterSocialLogin(result)
    } catch (err) {
      if (err.message.includes('auth/account-exists-with-different-credential')) {
        ElMessage.error(`${t('exist.wt.diff.email')}`)
      }
    }
  } else {
    const provider = new OAuthProvider('apple.com')
    provider.addScope('email')
    provider.addScope('name');
    return socialLogin(provider)
  }
}
async function flutterSocialLogin(info: any) {

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

}

async function socialLogin(provider: AuthProvider) {
  try {
    const res = await signInWithPopup($firebaseAuth, provider)

    router.push($localePath('/'))

  } catch (err) {
    const errorCode = err.code

    if (err.message.includes('auth/account-exists-with-different-credential')) {
      ElMessage.error(`${t('exist.wt.diff.email')}`)
    }
  }
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

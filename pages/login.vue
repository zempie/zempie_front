<template>
  <!-- <div> -->
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
      currUser {{ currUser }}
      fUser{{ fUser }}
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
            <img src="/images/google_login.png" alt="google-login" title="" />
          </li>
          <li @click="facebookLogin" class="mt10">
            <img src="/images/facebook_login.png" alt="google-login" title="" />
          </li>
        </ul>
        <p>
          <span><i class="uil uil-info-circle" style="font-size: 16px; line-height: 24px"></i></span>
          {{ $t('login.text4') }}
        </p>
      </div>
    </div>
  </div>
  <!-- <div v-else style="width:100vw; height:100vh; display: flex;justify-content: center; align-items: center;">
      {{ useUser().user.value.isLoading }}
      <img src="/images/zempie-logo.png" alt="zempie" title="zempie" class="flex justify-center items-center" />
    </div>
  </div> -->
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

const isVisit = ref()

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

      if (fUser.value) {
        alert(`fuser exists : ${fUser.value}`)
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
    isVisit.value = localStorage.getItem('zMoF')
  })
})

onBeforeUnmount(() => {
  window.removeEventListener("message", receiveMessage, false);
})

async function onSubmit() {
  const isValid = await v$.value.$validate()

  if (isFlutter.value) {

    return FlutterBridge().signInEmail({ email: form.email, password: form.password })
      .then(async (result: any) => {
        //TODO: 등록해야됨
        currUser.value = result
        router.push($localePath('/'))
        await useUser().setUserInfo()

      })
      .catch((err: any) => {
        console.log(err)
      })

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
    return FlutterBridge().signInGoogle()
      .then(async (result: { additionalUserInfo: any, credential: any, stsTokenManager: any }) => {
        if (result) {
          const firebaseUser = {
            ...result.additionalUserInfo.profile,
            accessToken: result.credential.accessToken
          }

          useUser().setFirebaseUser(firebaseUser)

          currUser.value = await FlutterBridge().getFbCurrentUser()
          await useUser().setUserInfo()

          // if (useUser().user.value.info) {
          try {

            await setFirebaseToken()
          } catch (err) {
            alert(err)
          }
          // }

        }
        // state.fUser = result;
      })
      .catch((err) => {
        console.log(err)
      })
  } else {
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
    return FlutterBridge().signInFacebook()
      .then((result) => {
        useUser().setFirebaseUser(result)
        // state.fUser = result;
      });
  } else {
    const provider = new FacebookAuthProvider()
    provider.addScope('email')
    provider.addScope('public_profile')
    return socialLogin(provider)
  }
}

async function socialLogin(provider: AuthProvider) {
  try {
    const res = await signInWithPopup($firebaseAuth, provider)
    router.push($localePath('/'))

  } catch (err) {
    console.error('socialLogin err', err)

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

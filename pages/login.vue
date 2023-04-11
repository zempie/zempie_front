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
} from 'firebase/auth'
import shared from '~/scripts/shared'

const { $firebaseAuth, $cookies, $localePath } = useNuxtApp()

const { t, locale } = useI18n()
const router = useRouter()
const route = useRoute()
const config = useRuntimeConfig()

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
// const isLogin = computed(() => useUser().user.value.isLogin)

// watch(isLogin,
//   async (val) => {
//     if (val) {
//       router.push($localePath('/'))
//       const { token } = await fbFcm.getFcmToken(useUser().user.value.info.id)
//       console.log('token', token)
//       if (!token) {
//         console.log('regi token')
//         await fbFcm.resigterFcmToken(useUser().user.value.info.id)
//       }
//     }
//   })


async function onSubmit() {
  const isValid = await v$.value.$validate()

  if (!isValid) return
  setPersistence($firebaseAuth, browserSessionPersistence)
    .then((res) => {
      signInWithEmailAndPassword($firebaseAuth, form.email, form.password)
        .then(async (result) => {
          const { user } = result
          if (user) {
            router.push($localePath('/'))
            // await useUser().setUserInfo()
          }
        })
        // .then(async () => {
        //   router.push($localePath('/'))
        //   const { token } = await fbFcm.getFcmToken(useUser().user.value.info.id)
        //   console.log('token', token)
        //   if (!token) {
        //     console.log('regi token')
        //     await fbFcm.resigterFcmToken(useUser().user.value.info.id)
        //   }
        // })
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

async function googleLogin() {
  const provider = new GoogleAuthProvider()
  return socialLogin(provider)
}

async function facebookLogin() {
  const provider = new FacebookAuthProvider()
  provider.addScope('email')
  provider.addScope('public_profile')
  return socialLogin(provider)
}

async function socialLogin(provider: AuthProvider) {
  try {
    const res = await signInWithPopup($firebaseAuth, provider)
    //회원가입 정보 없는 경우 ???
    router.push($localePath('/'))

    // useUser().setFirebaseUser(res.user)
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

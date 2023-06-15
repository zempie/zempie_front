<template>
  <div class="login-bg pt50 pb50" style="height:100vh; min-height:900px">
    <div class="login-logo">
      <LoginWhiteLogoDt path='/login' />
    </div>
    <div class="login-join">
      <div class="lj-logo">
        <LoginWhiteLogoMb path='/login' />
      </div>
      <div class="lj-title">
        <h3>{{ $t('join') }}</h3>
        <p>{{ $t('join.text1') }}</p>
      </div>
      <ClientOnly>
        <form class="lj-content">
          <ul>
            <li>
              <input type="text" name="register-email" v-model="v$.email.$model"
                :placeholder="$t('login.email.placeholder')" class="w100p h60" :readonly="fUser ? true : false" />

              <h3 class="input-errors" v-for="error of v$.email.$errors" :key="error.$uid">
                <i class="uil uil-check"></i>{{ error.$message }}
              </h3>
            </li>
            <li v-if="!fUser?.email">
              <input type="password" name="register-password" v-model="v$.password.$model" title=""
                :placeholder="$t('password')" class="w100p h60" autocomplete="off" />

              <h3 class="input-errors" v-for="error of v$.password.$errors" :key="error.$uid">
                <i class="uil uil-check"></i>{{ error.$message }}
              </h3>
            </li>
            <li>
              <input type="text" name="register-username" v-model="v$.username.$model" title="" :placeholder="$t('name')"
                class="w100p h60" autocomplete="off" />
              <h3 class="input-errors" v-for="error of v$.username.$errors" :key="error.$uid">
                <i class="uil uil-check"></i>{{ error.$message }}
              </h3>
            </li>
            <li>
              <input type="text" name="register-nickname" v-model="v$.nickname.$model" title=""
                :placeholder="$t('nickname')" class="w100p h60" autocomplete="off" />
              <h3 class="input-errors" v-for="error of v$.nickname.$errors" :key="error.$uid">
                <i class="uil uil-check"></i>{{ error.$message }}
              </h3>
            </li>
          </ul>
          <div class="login-agreement-container">

            <div class="lam-content">
              <ul>
                <li>
                  <dl>
                    <dt>
                      <input type="checkbox" name="policyAgreement" v-model="form.policyAgreement" title="" id="agree"
                        @click="form.policyAgreement ? errorAgree = true : errorAgree = false" />

                      <label for="agree"><i class="uil uil-check"></i></label>
                      <span><label for="agree" class="ml5 underline">{{ $t('terms') }} ({{
                        $t('required')
                      }})</label></span>
                    </dt>
                    <dd>
                      <NuxtLink :to="$localePath('/terms')" target="_blank">{{ $t('view') }}</NuxtLink>
                    </dd>
                  </dl>
                </li>
                <h3 :class="errorAgree ? 'error-agree' : 'agree'"><i class="uil uil-check"></i>{{
                  $t('agreement.text')
                }}
                </h3>
              </ul>
            </div>
          </div>
          <p>
          <p @click="register" :class="['btn-default-big w100p text-white', isSubmitActive ? 'on' : 'off']">{{ $t('join')
          }}</p>
          </p>
        </form>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as fbFcm from '~~/scripts/firebase-fcm'
import useVuelidate from '@vuelidate/core'
import { ElMessage } from 'element-plus'
import { required, helpers, maxLength } from '@vuelidate/validators'
import { emailRegex, passwordRegex, nicknameRegex } from '~/scripts/utils'
import { useI18n } from 'vue-i18n';
import { browserLocalPersistence, createUserWithEmailAndPassword, setPersistence, signOut } from 'firebase/auth'
import { onBeforeRouteLeave } from 'vue-router';
import shared from '~~/scripts/shared';
import { useGtag } from 'vue-gtag-next';
import flutterBridge from '~~/scripts/flutterBridge'


const { t, locale } = useI18n()
const { $firebaseAuth, $cookies, $localePath } = useNuxtApp()
const router = useRouter();
const gtag = useGtag()

const form = reactive({
  email: "",
  password: "",
  username: "",
  nickname: "",
  policyAgreement: false
})
const errorAgree = ref(false);

const emailValidator = helpers.regex(emailRegex);
const pwdValidator = helpers.regex(passwordRegex);
const nicknameValidator = helpers.regex(nicknameRegex)

const fUser = computed(() => useUser().user.value.fUser)
const isLogin = computed(() => useUser().user.value.isLogin)
const isFlutter = computed(() => useMobile().mobile.value.isFlutter)




const rules = computed(() => {
  const formRule = {
    email: {
      required: helpers.withMessage(t('login.empty.email'), required),
      emailValidator: helpers.withMessage(t('login.email.format.err'), emailValidator)
    },
    password: {
      required: helpers.withMessage(t('login.empty.pwd'), required),
      pwdValidator: helpers.withMessage(t('login.pwd.format.err'), pwdValidator)
    },
    nickname: {
      required: helpers.withMessage(t('join.empty.nickname'), required),
      pwdValidator: helpers.withMessage(t('join.nickname.format.err'), nicknameValidator),

    },
    username: {
      required: helpers.withMessage(t('join.name.empty.err'), required),
      maxLength: helpers.withMessage(t('join.name.format.err'), maxLength(100)),
    }
  }

  if (fUser.value) {
    delete formRule.password
  }
  return formRule
})




watch(isLogin,
  async (val) => {
    if (val) {
      router.push($localePath('/'))

      const { token } = await fbFcm.getFcmToken(useUser().user.value.info.id)
      if (!token) {
        await fbFcm.resigterFcmToken(useUser().user.value.info.id)
      }

    }
  })

definePageMeta({
  layout: 'layout-none',
});

onMounted(() => {
  // window.addEventListener('beforeunload', function (e) {
  //   e.preventDefault();
  //   e.returnValue = '';
  //   removeFbUser()
  // });
  if (fUser.value) {
    form.email = fUser.value.email
    delete form.password
  };

})
shared.createHeadMeta(t('seo.join.title'), t('seo.join.desc'))


onBeforeRouteLeave((to, from, next) => {
  // window.removeEventListener('beforeunload', function (e) {
  //   e.preventDefault();
  //   e.returnValue = '';
  // });
  console.log('router leave??')
  removeFbUser()
  next()

})

//소셜 로그인 회원가입 안 끝내고 페이지 이동하는 경우에 사용 
function removeFbUser() {
  if (fUser.value && !isLogin.value) {
    signOut($firebaseAuth)
      .then(() => {
        useUser().removeUserState();
      })
  }
}



const v$ = useVuelidate(rules, form)

const isSubmitActive = computed(() => {
  if (fUser.value) {
    v$.value.email.$validate()
  }
  return !!form.policyAgreement && !!v$.value.$dirty
})



async function register() {


  if (!isSubmitActive.value) return

  const result = await v$.value.$validate()

  if (!form.policyAgreement) {
    errorAgree.value = true;
    return;
  } else {
    if (!result) return;
  }

  if (isFlutter.value) {
    const result = await flutterBridge().joinEmail({ email: form.email, password: form.password })
    console.log(result)
    await joinZempie();

  } else {

    if (fUser.value) { await joinZempie(); return; }


    try {

      const result = await createUserWithEmailAndPassword($firebaseAuth, form.email, form.password)
      const { user } = result;

      await joinZempie();

    } catch (error: any) {

      const { message } = error
      if (message.includes('auth/email-already-in-use')) {

        ElMessage.error(`${t('fb.using.email')}`)
      }
      else if (message.includes('EMAIL_EXISTS')) {
        ElMessage.error(`${t('fb.using.email')}`)

      } else {
        ElMessage.error(message)

      }
    }
  }
}

/**
 * zempie db 등록
 */
async function joinZempie() {
  console.log('join!')
  const payload = {
    name: form.username,
    nickname: form.nickname
  }

  const { data, error } = await useCustomAsyncFetch<{ result: any }>('/user/sign-up', getZempieFetchOptions('post', true, payload))

  if (data.value) {
    const { user } = data.value.result;

    if (user) {

      useUser().setUser(user);
      useUser().setLogin()
      router.push($localePath('/'))

      gtag.event('click', {
        event_category: 'join',
        event_label: fUser.value.providerData[0].providerId,
      })
    }

  } else if (error.value) {

    ElMessage.error((error.value as any))
  }
}
</script>

<style lang="scss" scoped>
/*약관 동의*/
.lam-content h3 {
  color: #C5292A;
}

.agree {
  display: none !important;
}

.error-agree {
  display: inline-block !important;
  font-size: 12px !important;
  color: #C5292A !important;
}

.form-control+span+h3,
.form-control+span+h2 {
  display: none;
  color: #999;
}

.is-invalid+span+h3,
.form-control+span+h2 {
  font-size: 12px;
  display: inline-block;
  color: #C5292A;
}

.login-agreement-container .lam-content>ul {
  margin-top: 40px;
  padding: 23px 0px;
  border-top: 1px solid #f1f1f1;
  border-bottom: 1px solid #f1f1f1;
}

.login-agreement-container .lam-content>ul>li {
  margin: 7px 0;
  padding: 15px;
  border: 1px solid #e5e5e5;
  border-radius: 5px;
}

.login-agreement-container .lam-content>ul>li:first-child {
  padding: 13px 15px;
  background-color: #f1f1f1;
  box-shadow: 0px 1px 2px rgba(50, 50, 71, 0.08), 0px 0px 1px rgba(50, 50, 71, 0.2);
}

.login-agreement-container .lam-content>ul>li>dl {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.login-agreement-container .lam-content>ul>li>dl>dt>span {
  color: #333;
}

.login-agreement-container .lam-content>ul>li>dl>dd {
  color: #333;
}

.login-agreement-container .lam-content>p {
  margin-top: 40px;
  text-align: center;
}

.login-agreement-container .lam-content>p a {
  width: 100%;
  border-radius: 30px;
}


.btn-default-big {
  &.on {
    background: #f97316;
    color: #fff;



  }

  &.off {
    background: #ffe2d1;
    cursor: no-drop;

    &:hover {
      background: #ffe2d1;
      color: #fff;
    }
  }
}

@media all and (max-width: 479px) {
  .login-agreement-container {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    // padding: 40px 20px;
    background: #fff;
    transform: translate(0, 0);
  }

  .login-agreement-container .lam-logo {
    display: block;
  }

  .login-agreement-container .lam-title>h3 {
    font-size: 20px;
    line-height: 20px;
  }

  .login-agreement-container .lam-title>p {
    font-size: 16px;
    line-height: 14px;
  }

  .login-agreement-container .lam-content {
    margin-top: 15px;
    padding-top: 15px;
  }

  .login-agreement-container .lam-content>p {
    margin-top: 20px;
  }
}

@media all and (min-width: 480px) and (max-width: 767px) {
  .login-agreement-container {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    padding: 40px 20px;
    background: #fff;
    transform: translate(0, 0);
  }

  .login-agreement-container .lam-logo {
    display: block;
  }

  .login-agreement-container .lam-title>h3 {
    font-size: 20px;
    line-height: 20px;
  }

  .login-agreement-container .lam-title>p {
    font-size: 16px;
    line-height: 14px;
  }

  .login-agreement-container .lam-content {
    margin-top: 15px;
    padding-top: 15px;
  }

  .login-agreement-container .lam-content>p {
    margin-top: 20px;
  }
}
</style>

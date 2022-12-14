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
        <h3>{{  $t('join')  }}</h3>
        <p>{{  $t('join.text1')  }}</p>
      </div>
      <ClientOnly>
      <form class="lj-content">
        <ul>
          <li>
            <input type="text" name="register-email" v-model="v$.email.$model"
              :placeholder="$t('login.email.placeholder')" class="w100p h60" :readonly="fUser ? true: false" />

            <h3 class="input-errors" v-for="error of v$.email.$errors" :key="error.$uid">
              <i class="uil uil-check"></i>{{  error.$message  }}
            </h3>
          </li>
          <li v-if="!fUser?.email">
            <input type="password" name="register-password" v-model="v$.password.$model" title=""
              :placeholder="$t('password')" class="w100p h60" autocomplete="off" />

            <h3 class="input-errors" v-for="error of v$.password.$errors" :key="error.$uid">
              <i class="uil uil-check"></i>{{  error.$message  }}
            </h3>


          </li>
          <!-- <li>
            <input type="password" name="register-repeat-password" v-model="v$.repeatPassword.$model" title=""
              :placeholder="$t('login.pwd.placeholder')" class="w100p h60 " />
            <span></span>
            <h3>
            </h3>

          </li> -->
          <li>
            <input type="text" name="register-username" v-model="v$.username.$model" title="" :placeholder="$t('name')"
              class="w100p h60" autocomplete="off" />
            <h3 class="input-errors" v-for="error of v$.username.$errors" :key="error.$uid">
              <i class="uil uil-check"></i>{{  error.$message  }}
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
                    <span><label for="agree" style="text-decoration:underline;">{{  $t('terms')  }} ({{
                         $t('required') 
                        }})</label></span>
                  </dt>
                  <dd>
                    <NuxtLink :to="$localePath('/terms')" target="_blank">{{  $t('view')  }}</NuxtLink>
                  </dd>
                </dl>
              </li>
              <h3 :class="errorAgree ? 'error-agree' : 'agree'"><i class="uil uil-check"></i>{{  $t('agreement.text')  }}
              </h3>
            </ul>
          </div>
        </div>
        <p>
        <p @click="register" class="btn-default-big w100p">{{  $t('join')  }}</p>
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
import { emailRegex, passwordRegex } from '~/scripts/utils'
import { useI18n } from 'vue-i18n';
import { createUserWithEmailAndPassword} from 'firebase/auth'
import { onBeforeRouteLeave } from 'vue-router';
import shared from '~~/scripts/shared';
import { signOut } from 'firebase/auth'


const { t, locale } = useI18n()
const route = useRoute();
const config = useRuntimeConfig()
const { $firebaseAuth, $cookies, $localePath  } = useNuxtApp()
const router = useRouter();

const form = reactive({
  email: "",
  password: "",
  username: "",
  nickname: "",
  // repeatPassword: "",
  policyAgreement: false
})
const errorAgree = ref(false);

const emailValidator = helpers.regex(emailRegex);
const pwdValidator = helpers.regex(passwordRegex);

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

    },
    username: {
      required: helpers.withMessage(t('join.name.empty.err'), required),
      maxLength: helpers.withMessage(t('join.name.format.err'), maxLength(100)),

    }

  }

  return formRule
})

const fUser = computed(() => useUser().user.value.fUser)
const isLogin = computed(() => useUser().user.value.isLogin)

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

useHead({
  title: `${t('seo.join.title')} | Zempie`,
  link: [
    {
      rel: 'alternate',
      href: `${config.ZEMPIE_URL}${route.fullPath}`,
      hreflang: locale,
    },
    {
      rel: 'canonical',
      href: `${config.ZEMPIE_URL}${route.fullPath}`,
    },,
  ],
   meta: [
        {
          property: 'og:url',
          content: `${config.ZEMPIE_URL}${route.fullPath}`,
        },
        {
          property:'og:site_name',
          content:'Zempie'
        },
  {
      name: 'og:type',
      content: 'website',
    },
  {
      name:'robots',
      content:'noindex, nofollow'
    },
    {
      name: 'description',
      content: `${t('seo.join.desc')}`
    },
    {
      property: 'og:title',
      content: `${t('seo.join.title')}`
    },
    {
      property: 'og:description',
      content: `${t('seo.join.description')}`
    },
    {
      property: 'og:url',
      content: `${config.ZEMPIE_URL}${route.path}`
    },
  ]
})

onBeforeRouteLeave((to, from, next)=>{
  console.log('leave', useUser().user.value.fUser)
  
  if(fUser.value && !isLogin.value){
    console.log('here?')
    shared.removeCookies()

    signOut($firebaseAuth)
    .then(()=>{
      useUser().removeUserState();
    })
   
  }

  next()
})

onMounted(() => {

  if (fUser.value) form.email = fUser.value.email;

})

const v$ = useVuelidate(rules, form)

async function register() {


  if (fUser.value) { await joinZempie(); return; }
  const result = await v$.value.$validate()

  if (!form.policyAgreement) {
    errorAgree.value = true;
    return;
  } else {
    if (!result) return;
  }
  try {
    
    const result = await createUserWithEmailAndPassword($firebaseAuth, form.email, form.password)
    const { user } = result;
    await joinZempie();

  } catch (error: any) {
    
    const { message } = error
    if (message.includes('auth/email-already-in-use')) {
      // const { result } = await useCustomAsyncFetch<{result:any}>('/user/has-email', getZempieFetchOptions('post', false, { email: form.email }))

      ElMessage.error(`${t('fb.using.email')}`)
    } 
    // else if (message.includes('auth/weak-password')) {

    // } 
    else if (message.includes('EMAIL_EXISTS')) {
      ElMessage.error(`${t('fb.using.email')}`)

    }else{
      ElMessage.error(message)

    }
  }
}

/**
 * zempie db 등록
 */
async function joinZempie() {
  const payload = {
    name: form.username,
  }

    const { data,error } = await useCustomAsyncFetch<{result:any}>('/user/sign-up',getZempieFetchOptions('post', true, payload))
   
    if(data.value){
    const { user } = data.value.result;

    if (user) {
      useUser().setUser(user);
      useUser().setLogin();
      // useUser().unsetSignup()
    }

  } else if(error.value) {
    ElMessage.error((error.value as any).data.error)
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

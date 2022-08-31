<template>
  <div class="login-bg pt50 pb50 " style="height:100vh; min-height:900px">
    <ClientOnly>

      <div class="login-logo">
        <LoginWhiteLogoDt path='/' />
      </div>

      <div class="login-area">
        <div class="la-logo">
          <LoginWhiteLogoMb path="/" />

        </div>
        <div class="la-title">
          <h3>{{  $t('login.text1')  }}</h3>
          <p>{{  $t('login.text2')  }}</p>
        </div>
        <div class="la-content">
          <form>
            <input type="email" v-model="v$.email.$model" name="login-email" title=""
              :placeholder="$t('login.email.placeholder')" class="w100p h60 " style="margin-bottom:10px"
              autocomplete="user-email" @keyup.enter="onSubmit" />
            <h2 class="input-errors" v-for="error of v$.email.$errors" :key="error.$uid">
              <i class="uil uil-check"></i>{{  error.$message  }}
            </h2>


            <input type="password" v-model="v$.password.$model" name="login-password" title=""
              autocomplete="current-password" :placeholder="$t('login.pwd.placeholder')" class="w100p h60"
              style="margin-bottom:10px" @keyup.enter="onSubmit" />

            <h2 class="input-errors" v-for="error of v$.password.$errors" :key="error.$uid">
              <i class="uil uil-check"></i>{{  error.$message  }}
            </h2>

          </form>
          <p @click="onSubmit"><a class="btn-default-big">{{  $t('login')  }}</a></p>


          <dl>
            <dt>
              <NuxtLink :to="localePath('/reset-password')">{{  $t('reset.pwd')  }}</NuxtLink>
            </dt>
            <dd>|</dd>
            <dt>
              <NuxtLink :to="localePath('/join')">{{  $t('join')  }}</NuxtLink>
            </dt>
          </dl>
        </div>
        <div class="la-bottom">
          <dl>
            <dt></dt>
            <dd>{{  $t('login.text3')  }}</dd>
            <dt></dt>
          </dl>
          <ul>

            <li @click="google">
              <img src="/images/google_login_btn_small.png" alt="google-login" title="" />
            </li>
          </ul>
          <p>
            <span><i class="uil uil-info-circle" style="font-size:16px; line-height:24px;"></i></span>
            {{  $t('login.text4')  }}
          </p>
        </div>
      </div>
    </ClientOnly>

  </div>
</template>

<script setup lang="ts">
import useVuelidate from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import { useI18n } from 'vue-i18n';
import { emailRegex, passwordRegex } from '~/scripts/utils'
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, type UserCredential } from 'firebase/auth'
import { useLocalePath } from 'vue-i18n-routing';

const { $firebaseAuth, $cookies } = useNuxtApp()

const { t, locale } = useI18n()
const router = useRouter();
const route = useRoute();
const localePath = useLocalePath();
const config = useRuntimeConfig()


useHead({
  title: `${t('seo.login.title')} | Zempie`,
  meta: [
    {
      name: 'description',
      content: `${t('seo.login.desc')}`
    },
    {
      name: 'og:title',
      content: `${t('seo.login.title')}`
    },
    {
      name: 'og:description',
      content: `${t('seo.login.description')}`
    },
    {
      name: 'og:url',
      content: `${config.ZEMPIE_URL}${route.path}`
    },
  ]
})


const form = reactive({
  email: '',
  password: '',
})

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
    }
  }

  return formRule
})
const v$ = useVuelidate(rules, form)
onMounted(() => {

})



async function onSubmit() {
  const isValid = await v$.value.$validate()

  if (!isValid) return;
  signInWithEmailAndPassword($firebaseAuth,
    form.email,
    form.password
  ).then(async (result) => {
    const { user } = result;
    useUser().setFirebaseUser(user);

  })
}




//     private redirect: string = "";
//     private form = {email: "", password: ""};

//     // private googleRegister: boolean = false;
//     // private isClickedLoginBtn: boolean = false;
//     private isGoolgeLoginDone: boolean = false;
//     // private isClickedRegisterTab: boolean = false;

//     // private googleBtn: string = "img/btn_google_signin_dark_normal_web.png";


// vuelidate
// validateState(name) {
//   const { $dirty, $error } = this.$v.form[name]!;
//   return $dirty ? !$error : null;
// }

//     //login enter key event
//     checkLogin(event) {
//         if (event.which === 13) {
//             this.login();
//         }
//     }

//     async login() {
//         this.$v.form.$touch();
//         if (this.$v.form.$anyError) {
//             return;
//         }

//         try {
//             const result = await firebase
//                 .auth()
//                 .signInWithEmailAndPassword(
//                     this.form.email,
//                     this.form.password
//                 );

//             if (result.user) {
//                 const token = await firebase.auth().currentUser!.getIdToken();
//                 this.$store.commit("idToken", token);

//                 const result = await Vue.$api.user();
//                 // if( result.error && result.error && result.error.message === '잘 못 된 유저 아이디입니다' ) {
//                 if (result?.error?.code === 20001) {
//                     // alert( this.$t('login.joinError') as string );
//                     this.$store.commit("loginState", LoginState.no_user);

//                     // this.googleRegister = false;
//                     // await this.$router.replace("/joinEmailContinue");
//                     return;
//                 }

//                 const {user} = result;
//                 this.$store.commit("user", user);
//                 await LoginManager.login();
//                 // this.$store.commit('loginState', LoginState.login );

//                 if (this.$store.getters.redirectRouter) {
//                     const router = this.$store.getters.redirectRouter;
//                     this.$store.commit("redirectRouter", null);
//                     await this.$router.replace(router);
//                 }
//                 else if (this.$store.getters.redirectUrl) {
//                     const url = this.$store.getters.redirectUrl;
//                     this.$store.commit("redirectUrl", null);
//                     window.location.href = url;
//                 }
//                 else {
//                     await this.$router.replace('/');
//                 }
//             }
//         }
//         catch (e) {
//             const code = e.code;
//             // console.log(code);
//             if (code) {
//                 switch (code) {
//                     case "auth/wrong-password":
//                         this.$modal.show('wrongInfo')
//                         // this.passwordError = '잘못된 비밀번호 입니다. 다시 입력하세요.'
//                         break;
//                     case "auth/user-not-found":
//                         this.$modal.show('noUser')
//                         // alert(this.$t('login.firebaseError.userNotFound') as string);
//                         break;
//                     default:
//                         // alert('잠시 후 다시 시도해주세요.');
//                         break;
//                 }
//             }
//         }
//     }

//     async mounted() {
//         //로그인
//         const loginState = await this.$store.dispatch("loginState");
//         switch (loginState) {
//             case LoginState.login:
//                 // if(this.redirect) {
//                 //     window.location.href = this.redirect;
//                 // }
//                 // else {
//                 //     await this.$router.replace('/');
//                 // }

//                 await this.$router.replace('/');
//                 break;
//         }

//         this.redirect = UrlHelper.getParameterByName("z_redirect_url");

//         if (this.redirect) {
//             // console.log(this.redirect);
//             this.$store.commit("redirectUrl", this.redirect);
//         }
//     }

async function google() {
  const provider = new GoogleAuthProvider();

  await signInWithPopup($firebaseAuth, provider);



  // if (user) {
  //   useUser().setFirebaseUser(user);
  //   //  const token = await firebase.auth().currentUser?.getIdToken();
  // }


}
//     async google() {
//         await this.$store.dispatch("loginState");

//         const provider = new firebase.auth.GoogleAuthProvider();
//         const result: any = await firebase.auth().signInWithPopup(provider);



//         if (result.user) {
//             const token = await firebase.auth().currentUser?.getIdToken();
//             this.$store.commit("idToken", token);
//             Vue.$api.user()
//                 .then(async (res: any) => {
//                     const {user} = res;
//                     this.$store.commit("user", user);
//                     await LoginManager.login();
//                     // this.$store.commit('loginState', LoginState.login );
//                     // await this.$router.replace('/');
//                     if (this.$store.getters.redirectRouter) {

//                         const router = this.$store.getters.redirectRouter;
//                         this.$store.commit("redirectRouter", null);
//                         await this.$router.replace(router);
//                     }
//                     else if (this.$store.getters.redirectUrl) {
//                         const url = this.$store.getters.redirectUrl;
//                         this.$store.commit("redirectUrl", null);
//                         window.location.href = url;
//                     }
//                     else {
//                         await this.$router.push(`/${this.$i18n.locale}/channel/${this.$store.getters.user.channel_id}/timeline`
//                         );
//                     }

//                 })
//                 .catch((err: any) => {
//                     if (err.error.code === 20001) {
//                         this.$store.commit("loginState", LoginState.no_user);
//                         this.$router.replace(`/${this.$i18n.locale}/googleJoin`);
//                         return;
//                     }
//                 })

//             // const result = await Vue.$api.user();
//             // if( result.error && result.error && result.error.message === '잘 못 된 유저 아이디입니다' ) {


//         }
//     }


//     findPwd() {
//         document.getElementById("forgotPwdBtn")!.click();
//         (this.$refs.forgotPwdBtn as any).click();
//     }

//     googleRegisterDone() {
//         (this.$refs.registerBtn as any).click();
//         this.isGoolgeLoginDone = !this.isGoolgeLoginDone;
//     }

//     closeModal() {
//         this.$modal.hide('noUser')
//     }


definePageMeta({
  layout: false,
});
</script>

<style scoped lang="scss">
.input-errors {
  font-size: 12px;
  color: #c5292a;
}

.input-errors:not(:last-child) {
  padding-bottom: 10px;

}
</style>

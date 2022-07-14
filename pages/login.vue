<template>
  <div class="login-bg pt50 pb50">
    <div class="login-logo">
      <router-link to="/"
        ><img src="../assets/images/zempie_logo.png" alt="zempie-logo" title=""
      /></router-link>
    </div>
    <div class="login-area">
      <div class="la-logo">
        <router-link to="#"
          ><img
            src="../assets/images/logo.svg"
            width="140"
            alt="zempie-logo"
            title=""
        /></router-link>
      </div>

      <div class="la-title">
        <h3>{{ i18n.t('login.text1') }}</h3>
        <p>{{ i18n.t('login.text2') }}</p>
      </div>
      <div class="la-content">
        <form @submit.prevent="submitForm">
          <input
            v-model="email"
            style="margin-bottom: 16px"
            type="email"
            name="login-email"
            :placeholder="`${i18n.t('login.email.placeholder')}`"
            class="w100p h60"
            required
          />
          <input
            v-model="password"
            type="password"
            name="login-password"
            :placeholder="`${i18n.t('login.pwd.placeholder')}`"
            class="w100p h60"
            required
          />

          <button
            style="border-radius: 30px; width: 100%; margin-top: 40px"
            type="submit"
            class="btn-default-big"
          >
            {{ i18n.t('login') }}
          </button>
        </form>

        <!--                <div>-->
        <!--                    <input type="checkbox" name="" title="" id="id-save"/> <label for="id-save"><i-->
        <!--                    class="uil uil-check"></i></label>&nbsp; <span><label for="id-save">아이디저장</label></span>-->
        <!--                    <input type="checkbox" name="" title="" id="auto-login"/> <label for="id-save"><i-->
        <!--                    class="uil uil-check"></i></label>&nbsp; <span><label for="auto-login">자동로그인</label></span>-->
        <!--                </div>-->

        <dl>
          <dt>
            <router-link to="password-search">{{
              i18n.t('reset.pwd')
            }}</router-link>
          </dt>
          <dd>|</dd>
          <dt>
            <NuxtLink :to="`/join`">{{ i18n.t('join') }}</NuxtLink>
          </dt>
        </dl>
      </div>
      <div class="la-bottom">
        <dl>
          <dt></dt>
          <dd>{{ i18n.t('login.text3') }}</dd>
          <dt></dt>
        </dl>
        <ul>
          <!--                    <li>-->
          <!--                        <router-link to="#"><img src="../assets/images/kakao_icon.png" alt="" title=""/></router-link>-->
          <!--                    </li>-->
          <li>
            <img
              src="../assets/images/google_icon.png"
              alt="goolge-login"
              title=""
            />
          </li>
          <!--                    <li>-->
          <!--                        <router-link to="#"><img src="../assets/images/naver_icon.png" alt="" tile=""/></router-link>-->
          <!--                    </li>-->
          <!--                    <li>-->
          <!--                        <router-link to="#"><img src="../assets/images/facebook_icon.png" alt="" title=""/>-->
          <!--                        </router-link>-->
          <!--                    </li>-->
          <!--                    <li>-->
          <!--                        <router-link to="#"><img src="../assets/images/twitter_icon.png" alt="" title=""/></router-link>-->
          <!--                    </li>-->
        </ul>
        <p>
          <span
            ><i
              class="uil uil-info-circle"
              style="font-size: 16px; line-height: 24px"
            ></i
          ></span>
          {{ i18n.t('login.text4') }}&nbsp;
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  reactive,
  onMounted,
  useContext,
  computed,
} from '@nuxtjs/composition-api'
import firebase from '../scripts/firebase'
import * as Api from '../api'
import { useUserStore } from '../store/user'

const { i18n } = useContext()
const fUser = ref(computed(() => firebase.state.fUser))
// import { emailValidator, pwValidator } from 'src/scripts/utils';

const userStore = useUserStore()

const email = ref('')
const password = ref('')

async function submitForm(e: any) {
  console.log('email', email.value)
  console.log('password', password.value)
  console.log('fUser', fUser)

  try {
    await firebase.signInEmail(email.value, password.value)

    // console.log(userStore.$state.user.accessToken)
    // const result = await Vue.$api.user();
    sessionStorage.setItem('access_token', userStore.$state.fUser.accessToken)

    await userStore.setUserInfo()

    // const { result } = await Api.auth.getUserInfo()
    // if (result.user) {
    //   userStore.$state.user = result.user
    //   userStore.$state.isLogin = true
    // }

    console.log('result: ', userStore.$state.user)
  } catch (err: any) {
    console.log(err)
    // $q.notify(err.message)
  }

  // try {

  //         const result = await firebase
  //             .auth()
  //             .signInWithEmailAndPassword(
  //                 this.form.email,
  //                 this.form.password
  //             );

  //         if (result.user) {
  //             const token = await firebase.auth().currentUser!.getIdToken();
  //             this.$store.commit("idToken", token);

  //             const result = await Vue.$api.user();
  //             // if( result.error && result.error && result.error.message === '잘 못 된 유저 아이디입니다' ) {
  //             if (result?.error?.code === 20001) {
  //                 // alert( this.$t('login.joinError') as string );
  //                 this.$store.commit("loginState", LoginState.no_user);

  //                 // this.googleRegister = false;
  //                 // await this.$router.replace("/joinEmailContinue");
  //                 return;
  //             }

  //             const {user} = result;
  //             this.$store.commit("user", user);
  //             await LoginManager.login();
  //             // this.$store.commit('loginState', LoginState.login );

  //             if (this.$store.getters.redirectRouter) {
  //                 const router = this.$store.getters.redirectRouter;
  //                 this.$store.commit("redirectRouter", null);
  //                 await this.$router.replace(router);
  //             }
  //             else if (this.$store.getters.redirectUrl) {
  //                 const url = this.$store.getters.redirectUrl;
  //                 this.$store.commit("redirectUrl", null);
  //                 window.location.href = url;
  //             }
  //             else {
  //                 await this.$router.replace('/');
  //             }
  //         }
  //     }
  //     catch (e) {
  //         const code = e.code;
  //         // console.log(code);
  //         if (code) {
  //             switch (code) {
  //                 case "auth/wrong-password":
  //                     this.$modal.show('wrongInfo')
  //                     // this.passwordError = '잘못된 비밀번호 입니다. 다시 입력하세요.'
  //                     break;
  //                 case "auth/user-not-found":
  //                     this.$modal.show('noUser')
  //                     // alert(this.$t('login.firebaseError.userNotFound') as string);
  //                     break;
  //                 default:
  //                     // alert('잠시 후 다시 시도해주세요.');
  //                     break;
  //             }
  //         }
  //     }
}

// onMounted(() => {
// });
</script>

<style scoped lang="scss">
.login-bg {
  height: 100vh;

  .q-input {
    margin: 10px 0 10px 0 !important;
  }
  :deep(.q-field__control-container) {
    input {
      height: 60px !important;
    }
  }
  :deep(.q-field__bottom) {
    margin-left: 5px;
  }
}
//.btn-default-big {
//    width: 100%;
//    border-radius: 30px;
//}

// .btn-default {
//   width: 100%;
// }

//   margin: 10px 0 10px 0;
// }

// .form-control + .invalid-feedback {
//   display: none;
//   color: #999;
// }

// .is-invalid + .invalid-feedback {
//   font-size: 12px;
//   display: inline-block;
//   color: red;
// }

// .modal-text {
//   display: flex;
//   justify-content: center;
// }
</style>

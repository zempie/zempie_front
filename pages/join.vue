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
      <form class="lj-content">
        <ul>
          <li>
            <!-- FIXME: error message margin, padding -->
            <input type="text" name="register-email" v-model="v$.email.$model"
              :placeholder="$t('login.email.placeholder')" class="w100p h60" :readonly="fUser?.email" />

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
          <!--                    todo:백엔드에 닉네임 추가후 입력 -->
          <!--                    <li>-->
          <!--                        <b-form-group>-->
          <!--                            <b-form-input type="text" name="register-nickname"-->
          <!--                                          v-model="$v.form.nickname.$model"-->
          <!--                                          :state="-->
          <!--                                    register-->
          <!--                                        ? validateState('nickname')-->
          <!--                                        : undefined"-->
          <!--                                          @focusout="checkNickname"-->
          <!--                                          @input="watchNickname"-->
          <!--                                          placeholder="닉네임"-->
          <!--                                          :readonly="isNameReadOnly"-->
          <!--                                          class="w100p h60"></b-form-input>-->
          <!--                            <span></span>-->
          <!--                            <h3>-->
          <!--                                <b-form-invalid-feedback-->
          <!--                                    v-if="!$v.form.nickname.required"-->
          <!--                                ><i class="uil uil-check"></i>닉네임은 최소 두글자 이상입력해주세요-->
          <!--                                </b-form-invalid-feedback>-->
          <!--                                <b-form-invalid-feedback-->
          <!--                                    v-if="!$v.form.nickname.maxLength"-->
          <!--                                ><i class="uil uil-check"></i>닉네임은 20글자 이내로 작성해주세요.-->
          <!--                                </b-form-invalid-feedback>-->
          <!--                            </h3>-->
          <!--                            <h3 :style="isDuplicatedNickname ? 'display:block;' : 'display:none;'">-->
          <!--                                <i class="uil uil-check"></i>중복된 닉네임입니다.-->
          <!--                            </h3>-->
          <!--                        </b-form-group>-->
          <!--                    </li>-->
        </ul>
        <div class="login-agreement-container">

          <div class="lam-content">
            <ul>
              <!--                            <li>-->
              <!--                                <dl>-->
              <!--                                    <dt>-->
              <!--                                        <input @click="allAgree" type="checkbox" name="" title="" id="agree1"-->
              <!--                                               v-model="allAgreement"/>-->
              <!--                                        <label for="agree1"><i class="uil uil-check"></i></label>&nbsp;-->
              <!--                                        <span><label for="agree1">네 모두 동의합니다.</label></span>-->
              <!--                                    </dt>-->
              <!--                                    <dd></dd>-->

              <!--                                </dl>-->
              <!--                            </li>-->


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
                    <NuxtLink :to="localePath('/terms')" target="_blank">{{  $t('view')  }}</NuxtLink>
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
        <!--                <dl>
                                    <dt></dt>
                                    <dd>또는 다른 서비스 계정으로 로그인</dd>
                                    <dt></dt>
                                </dl>-->
      </form>
      <!--            <div class="lj-bottom">-->
      <!--                <dl @click="google">-->
      <!--                    <dt><img src="../../assets/images/google_icon.svg" alt=""></dt>-->
      <!--                    <dd>구글 계정으로 가입</dd>-->
      <!--                    <dt></dt>-->
      <!--                </dl>-->
      <!--                <p><i class="uil uil-info-circle" style="font-size:16px; line-height:24px;"></i> &nbsp;SNS계정으로 간편하게 가입하여-->
      <!--                    서비스를 이용하실 수 있습니다.</p>-->
      <!--            </div>-->
    </div>


  </div>
</template>

<script setup lang="ts">
import useVuelidate from '@vuelidate/core'
import { ElMessage } from 'element-plus'
import { required, helpers, maxLength } from '@vuelidate/validators'
import { emailRegex, passwordRegex } from '~/scripts/utils'
import { useI18n } from 'vue-i18n';
import { createUserWithEmailAndPassword, type UserCredential } from 'firebase/auth'
import { useLocalePath } from "vue-i18n-routing";

const { t, locale } = useI18n()
const route = useRoute();
const config = useRuntimeConfig()
const { $firebaseAuth, $cookies } = useNuxtApp()
const localePath = useLocalePath();
const router = useRouter();

useHead({
  title: `${t('seo.join.title')} | Zempie`,
  meta: [
    {
      name: 'description',
      content: `${t('seo.join.desc')}`
    },
    {
      name: 'og:title',
      content: `${t('seo.join.title')}`
    },
    {
      name: 'og:description',
      content: `${t('seo.join.description')}`
    },
    {
      name: 'og:url',
      content: `${config.ZEMPIE_URL}${route.path}`
    },
  ]
})


const form = reactive({
  email: "",
  password: "",
  username: "",
  nickname: "",
  // repeatPassword: "",
  policyAgreement: false
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
    },
    // repeatPassword: {

    // },
    nickname: {

    },
    username: {
      required: helpers.withMessage(t('join.name.empty.err'), required),
      maxLength: helpers.withMessage(t('join.name.format.err'), maxLength(100)),

    }

  }

  return formRule
})

const fUser = ref(computed(() => useUser().user.value.fUser))

definePageMeta({
  layout: 'layout-none',
});

onMounted(() => {
  if (fUser.value) form.email = fUser.value.email;

  // console.log('fb', $firebaseApp)

})



const v$ = useVuelidate(rules, form)



// isEmailReadOnly = false;
// isNameReadOnly = false;

const errorAgree = ref(false);

onBeforeMount(() => {
  //로그임 분기 처리 해야될듯

})
// allAgreement = false;

// isDuplicatedNickname = false;

// async mounted() {
//   const loginState = await this.$store.dispatch("loginState");

//   switch (loginState) {
//     case LoginState.login:
//       await this.$router.replace("/").catch(() => {
//       });
//       return;
//   }

// }


// beforeDestroy() {
//   this.isEmailReadOnly = false;
//   this.isNameReadOnly = false;
// }

// // vuelidate
// validateState(name) {
//   const { $dirty, $error } = this.$v.form[name]!;
//   return $dirty ? !$error : null;
// }
// @Watch('this.form.nickname')
// watchNickname() {
//   if (this.form.nickname.length === 0)
//     this.isDuplicatedNickname = false;
// }

// checkNickname() {
//   this.$api.hasNickname(this.form.nickname)
//     .then((res: any) => {
//       if (res.result === true) {
//         this.isDuplicatedNickname = true;
//       } else {
//         this.isDuplicatedNickname = false;
//       }
//     })
// }

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
    useUser().setSignup()
    const result = await createUserWithEmailAndPassword($firebaseAuth, form.email, form.password)
    const { user } = result;
    await joinZempie();
    // await useUser().login()-
    // useUser().setFirebaseUser(user);

  } catch (error: any) {

    const { message } = error
    if (message.includes('auth/email-already-in-use')) {
      const { result } = await auth.hasEmail({ email: form.email })
      // if (data.value) {

      //   const { data: res } = data.value.result
      //   if (res) {
      //     ElMessage({
      //       message: `${t('joined.email')}`,
      //       type: 'error',
      //     })

      //   } else {
      // await joinZempie();
      // }
      // }

    } else if (message.includes('auth/weak-password')) {

    } else if (message.includes('EMAIL_EXISTS')) {
      ElMessage.error(t('joined.email'))

    }

  }



}

/**
 * zempie db 등록
 */
async function joinZempie() {
  const payload = {
    name: form.username,
    // nickname:form.nickname,
  }

  try {
    const { data } = await auth.signUp(payload)
    const { user } = data.value.result;

    if (user) {
      useUser().setUser(user);
      useUser().setLogin();
      useUser().unsetSignup()
    }


    window.location.href = localePath('/')

    //FIXME: router.push가 왜 안되는지 모르겠음 => blank page
    // router.push(localePath('/'))
  } catch (err: any) {
    console.error(err)
  }


}
  // this.$api.signUp(obj)
  //   .then(async (result: any) => {
  //     const { user } = result;
  //     this.$store.commit("user", user);
  //     await LoginManager.login();
  //     // await this.$router.replace('/');

  //     if (this.$store.getters.redirectRouter) {
  //       const router = this.$store.getters.redirectRouter;
  //       this.$store.commit("redirectRouter", null);
  //       await this.$router.replace(router).catch(() => {
  //       });
  //     }
  //     else if (this.$store.getters.redirectUrl) {
  //       const url = this.$store.getters.redirectUrl;
  //       this.$store.commit("redirectUrl", null);
  //       window.location.href = url;
  //     }
  //     else {
  //       await this.$router.replace("/").catch(() => {
  //       });
  //     }
  //   })
  //   .catch((result: any) => {
  //     if (result?.error?.code === 40101) {
  //       alert(`${this.$t('name.err.text')}`);
  //       // todo 닉네임 필터 에러 처리
  //       // alert(this.$t('join.joinNicknameError'));
  //     }
  //     else {
  //       console.error((result && result.error) || "error");
  //       result && result.error && alert(result.error.message);
  //     }
  //   })
//   event.preventDefault();
//   this.$v.form.$touch();
//   let isReturn = false;
//   if (this.$v.form.$anyError) {
//     isReturn = true;
//   }
//   if (!this.form.policyAgreement1) {
//     isReturn = true;
//     this.errorAgree1 = true;
//   }
//   if (this.isDuplicatedNickname) {
//     this.isDuplicatedNickname = true;
//     isReturn = true;
//   }

//   if (isReturn) return;


//   try {
//     await firebase
//       .auth()
//       .createUserWithEmailAndPassword(
//         this.form.email,
//         this.form.password
//       );
//     const currentUser = firebase.auth().currentUser;
//     const idToken = await currentUser!.getIdToken();

//     this.$store.commit("idToken", idToken);

//     this.joinZempie();

//     // const obj={
//     //     name:this.form.username,
//     //     // nickname:this.form.nickname
//     // }
//     //
//     // this.$api.signUp(obj)
//     // .then(async (result:any)=>{
//     //     const {user} = result;
//     //     this.$store.commit("user", user);
//     //     await LoginManager.login();
//     //     // await this.$router.replace('/');
//     //
//     //     if (this.$store.getters.redirectRouter) {
//     //         const router = this.$store.getters.redirectRouter;
//     //         this.$store.commit("redirectRouter", null);
//     //         await this.$router.replace(router).catch(() => {
//     //         });
//     //     }
//     //     else if (this.$store.getters.redirectUrl) {
//     //         const url = this.$store.getters.redirectUrl;
//     //         this.$store.commit("redirectUrl", null);
//     //         window.location.href = url;
//     //     }
//     //     else {
//     //         await this.$router.replace("/").catch(() => {
//     //         });
//     //     }
//     // })
//     // .catch((result:any)=>{
//     //     if (result?.error?.code === 40101) {
//     //         alert("사용할 수 없는 이름입니다");
//     //         // todo 닉네임 필터 에러 처리
//     //         // alert(this.$t('join.joinNicknameError'));
//     //     }
//     //     else {
//     //         console.error((result && result.error) || "error");
//     //         result && result.error && alert(result.error.message);
//     //     }
//     // })

//   }
//   catch (error) {
//     const code = error.code;
//     if (code) {
//       switch (code) {
//         case 'auth/wrong-password':
//           alert(`${this.$t('wrong.pwd')}`)
//           break;
//         case 'auth/user-not-found':
//           alert(`${this.$t('login.email.fail')}`)
//           break;
//         case 'auth/email-already-in-use':
//           const result = await this.$api.hasEmail(this.form.email)
//           if (result === true) {
//             alert(`${this.$t('joined.email')}`)
//           } else {
//             this.joinZempie();
//           }
//           break;
//       }
//     }
//   }
// }

// 



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
    font-size: 14px;
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
    font-size: 14px;
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

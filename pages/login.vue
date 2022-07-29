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
<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: ["auth"]
});
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

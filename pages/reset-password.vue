<template>
  <NuxtLayout name="user-setting">
    <div class="login-bg pt50 pb50">
      <div class="login-logo">
        <NuxtLink to="/login"><img src="/images/zempie_logo.png" alt="" title="" /></NuxtLink>
      </div>

      <div class="pw-find">
        <div class="pf-title">
          <h3>{{ $t('find.pwd.text') }}</h3>
          <p>{{ $t('find.pwd.desc') }}</p>
        </div>
        <div class="pf-content">
          <div><i class="uil uil-info-circle" style="font-size:16px; line-height:24px;"></i>&nbsp;&nbsp;{{
              $t('find.pwd.input.text')
          }}</div>
          <ul>
            <li>
              <div>

                <input @keyup.enter="sendEmail" type="text" name="" title=""
                  :placeholder="$t('login.email.placeholder')" class="w100p h60" />
              </div>
            </li>
          </ul>
          <p><button @click="sendEmail" class="btn-default-big">
              {{ $t('send.email.btn') }}</button></p>
        </div>
      </div>


      <!-- <modal :clickToClose="false" class="modal-area-type" name="checkMailModal" width="90%" height="auto"
        :maxWidth="380" :scrollable="true" :adaptive="true">
        <div class="modal-alert">
          <dl class="ma-header">
            <dt>{{ $t('information') }}</dt>
            <dd>
              <button @click="$modal.hide('checkMailModal')"><i class="uil uil-times"></i></button>
            </dd>
          </dl>
          <div class="ma-content">
            <h2>{{ $t('send.email.modal.text1') }}<br />
              {{ $t('send.email.modal.text2') }}</h2>
            <div>
              <button class="btn-default" style="width: 100%" @click="closeModal">{{ $t('confirm') }}</button>
            </div>
          </div>
        </div>
      </modal> -->

    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
// import { Component, Prop, Vue } from "vue-property-decorator";


// import firebase from "firebase/app";
// import { LoginState } from "@/store/modules/user";

// import { validationMixin } from "vuelidate";
// import { required } from "vuelidate/lib/validators";
// import { helpers } from "vuelidate/lib/validators";

// const notExist = (value, vm) => {
//     if (vm.submitError) {
//         // clear error after 1st display
//         const error = vm.submitError;
//         vm.submitErrorMessage = error;
//         vm.submitError = false;
//         return false;
//     }
//     return true;
// };

// const emailValidator = helpers.regex(
//     "emailValidator",
//     /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
// );

// @Component({
//     components: {},
//     mixins: [validationMixin],
//     validations: {
//         email: {
//             required,
//             emailValidator,
//             notExist,
//         },
//     },
// })
// export default class PasswordSearch extends Vue {
//     private email: string = "";
//     private show: boolean = false;

const email = ref('')

function sendEmail() {

}

//     async sendEmail(event) {
//         //todo: 존재하는 이메일인지 아닌지확인

//         event.preventDefault();
//         this.$v.email.$touch();
//         // if (this.$v.email.$anyError) {
//         //     return;
//         // }
//         try {
//             const result = await firebase
//                 .auth()
//                 .sendPasswordResetEmail(this.email);
//             this.$modal.show('checkMailModal')
//         } catch {
//             // this.submitError = true;
//         }
//     }

//     closeModal() {
//         this.$modal.hide('checkMailModal')
//         this.$router.push(`/${this.$i18n.locale}/login`)
//     }

// }
</script>

<style scoped>
.btn-default-big {
  width: 100%;
  border-radius: 30px;
}

.vue-modal {
  border-radius: 20px !important;
}
</style>

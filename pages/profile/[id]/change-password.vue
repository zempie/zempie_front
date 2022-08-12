<template>
  <NuxtLayout name="user-setting">

    <div class="info-input">
      <div class="ii-title">
        <h2>{{ $t('changePwd.title') }}</h2>
        <h3>&nbsp;{{ $t('changePwd.info') }}</h3>
      </div>
      <dl class="ii-card">
        <!-- TODO: 비밀번호를 다시 입력해야되지 않나 -->

        <div>
          <input @keyup.enter="sendEmail" type="text" v-model="email" name="" title=""
            :placeholder="$t('login.email.placeholder')" @input="isEmailErr = false" class="w100p h60" />
          <p :class="isEmailErr ? 'email-error' : 'email-no-error'">{{ $t('login.email.format.err') }}
          </p>
        </div>

        <p>
          <button @click="sendEmail" class="btn-default-big">
            {{ $t('send.email') }}</button>
        </p>
      </dl>
    </div>

    <!-- <modal :clickToClose="false" class="modal-area-type" name="checkMailModal" width="90%" height="auto" :maxWidth="380"
      :adaptive="true" :scrollable="true">
      <div class="modal-alert">
        <dl class="ma-header">
          <dt>{{ $t('information') }}</dt>
          <dd>
            <button @click="$modal.hide('checkMailModal')"><i class="uil uil-times"></i></button>
          </dd>
        </dl>
        <div class="ma-content">
          <h2>{{ $t('send.email.info1') }}<br />
            {{ $t('send.email.info2') }}</h2>
          <div>
            <button class="btn-default" style="width: 100%" @click="$modal.hide('checkMailModal')">{{ $t('confirm') }}
            </button>
          </div>
        </div>
      </div>
    </modal> -->
  </NuxtLayout>

</template>

<script setup lang="ts">

const email = ref('')
const user = computed(() => useUser().user.value.info)
const isEmailErr = ref(false)

function sendEmail() {

}
// import {Component, Prop, Vue} from "vue-property-decorator";
// import firebase from "firebase";
// import {mapGetters} from "vuex";

// @Component({
//     components: {},
//     computed: {...mapGetters(["user"])},
// })
// export default class ChangePwd extends Vue {
//     user!: any;
//     email = '';
//     isEmailErr = false;

//     async sendEmail() {

//         if (this.email === this.user.email) {
//             try {
//                 const result = await firebase
//                     .auth()
//                     .sendPasswordResetEmail(this.email);
//                 this.$modal.show('checkMailModal')
//             }
//             catch {
//                 // this.submitError = true;
//             }
//         }
//         else {
//             this.isEmailErr = true;
//         }
//     }

// }
</script>

<style scoped lang="scss">
.ii-card {
  div {
    width: 100%;
    margin-bottom: 16px;
  }

  p {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
}

.email-no-error {
  display: none !important;
}

.email-error {
  margin-top: 10px;
  display: inline-block !important;
  color: #c5292a;
  justify-content: left !important;

}
</style>

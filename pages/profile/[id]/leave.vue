<template>
  <NuxtLayout name="user-setting">

    <div class="delete-account">
      <h2>{{  $t('leave.account.title')  }}</h2>
      <ul>
        <li>
          <h3>{{  $t('leave.account.info.title')  }}</h3>
          <p>- {{  $t('leave.account.info.text1')  }}</p>

          <p>- {{  $t('leave.account.info.text2')  }}</p>

          <p>- {{  $t('leave.account.info.text3')  }}</p>

          <p>- {{  $t('leave.account.info.text4')  }}</p>
        </li>
        <li>
          <h3>{{  $t('leave.account.info2.title')  }}</h3>
          <p>- {{  $t('leave.account.info2.text1')  }}</p>
          <p>- {{  $t('leave.account.info2.text2')  }}</p>
        </li>
        <li>
          <h3>{{  $t('leave.account.info3.title')  }}</h3>
          <h4>
            <input v-model="reason" type="text" />
          </h4>
        </li>
        <li>
          <div>
            <input @click="isAgree ? isAgreeError = true : isAgreeError = false" type="checkbox" v-model="isAgree"
              id="agree" /> <label for="agree"><i class="uil uil-check"></i></label><span>{{
               $t('leave.account.agreement') 
              }}</span>
          </div>
          <p class="mt10" v-if="isAgreeError" style="color:red">회원 탈퇴를 원하시면 동의해주세요</p>
        </li>
      </ul>
      <!--           todo:모달 혹은 확인창 필요하고 @click="leave(true)"-->
      <p><a class="btn-default w200" @click="openConfirnModal">{{  $t('leave.account.title')  }}</a></p>
    </div>
    <!-- <modal :clickToClose="false" class="modal-area-type" name="deleteAccount" width="90%" height="auto"
               :maxWidth="380"
               :adaptive="true"
               :scrollable="true">
            <div class="modal-alert">
                <dl class="ma-header">
                    <dt>{{ $t('information') }}</dt>
                    <dd>
                        <button @click="$modal.hide('deleteAccount')"><i class="uil uil-times"></i></button>
                    </dd>
                </dl>
                <div class="ma-content">
                    <h2>{{ $t('leave.account.modal.text1') }} <br/>{{ $t('leave.account.modal.text2') }} </h2>
                    <div>
                        <button class="btn-default w48p" @click="leave(true)">{{ $t('yes') }}</button>
                        <button class="btn-gray w48p" @click="$modal.hide('deleteAccount')">{{ $t('no') }}</button>
                    </div>
                </div>
            </div>
        </modal> -->
    <ClientOnly>
      <el-dialog v-model="openModal" append-to-body custom-class="modal-area-type" :show-close="false">

        <div class="modal-alert">
          <dl class="ma-header">
            <dt>{{  $t('information')  }}</dt>
            <dd>
              <button @click="openModal = false"><i class="uil uil-times"></i></button>
            </dd>
          </dl>
          <div class="ma-content">
            <h2>{{  $t('leave.account.modal.text1')  }} <br />{{  $t('leave.account.modal.text2')  }} </h2>
            <div>
              <button class="btn-default w48p" @click="leave">{{  $t('yes')  }}</button>
              <button class="btn-gray w48p" @click="openModal = false">{{  $t('no')  }}</button>
            </div>
          </div>
        </div>
      </el-dialog>
    </ClientOnly>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ElDialog, ElMessage } from "element-plus";
import { useI18n } from 'vue-i18n';
import { onBeforeRouteLeave } from "vue-router";

const route = useRoute();
const config = useRuntimeConfig()
const { t, locale } = useI18n()
const router = useRouter()

useHead({
  title: `${t('seo.leave.title')} | Zempie`,
  meta: [
    {
      name: 'description',
      content: `${t('seo.leave.desc')}`
    },
    {
      name: 'og:title',
      content: `${t('seo.leave.title')}`
    },
    {
      name: 'og:description',
      content: `${t('seo.leave.description')}`
    },
    {
      name: 'og:url',
      content: `${config.ZEMPIE_URL}${route.path}`
    },
  ]
})

const reason = ref('')
const isAgree = ref(false)
const isAgreeError = ref(false)
const openModal = ref(false)

async function openConfirnModal() {

  if (!isAgree.value) {
    isAgreeError.value = true;
    return
  }
  openModal.value = true

}

async function leave() {
  const { data, error, pending } = await user.leave({ text: reason.value, num: '0' })

  if (!error.value) {

    setTimeout(() => {
      ElMessage({
        message: t('leave.done'),
        type: 'success'
      })
      useUser().logout();

    }, 1000);



  } else {
    ElMessage({
      message: error.error.message,
      type: 'error'
    })
  }
}

// import {Vue, Component, Watch} from "vue-property-decorator";
// import {LoginState} from "@/store/modules/user";
// import Login from "@/script/login";

// @Component({
//     components: {},
// })
// export default class Leave extends Vue {
//     reason: string = "";
//     check1: boolean = false;
//     check2: boolean = false;

//     async mounted() {
//         const loginState = await this.$store.dispatch("loginState");
//         switch (loginState) {
//             case LoginState.login:
//                 return;
//         }
//     }

//     async leave(state: boolean) {
//         if (state) {
//             const result = await this.$api.leave(this.reason);
//             if (!result || result.error) {
//                 result && result.error && alert(result.error.message);
//                 console.error((result && result.error) || "error");
//             }
//             else {
//                 await Login.logout();
//                 await this.$router.replace("/");
//             }
//             console.log(result);
//         }
//     }

//     openModal() {
//         if (!this.check1) {
//             alert(this.$t('leave.account.agreement.required'))
//         }
//         else {
//             this.$modal.show('deleteAccount')
//         }
//     }
// }
</script>
<style lang="scss" scoped>
h3 {
  font-weight: bold;
  font-size: 16px;
}

p {
  color: #333333c2;
}

.textColor {
  color: #b7b7b7;
}

.list {
  padding-left: 18px;
}

li {
  color: #b7b7b7;
  list-style: none;
}

.leave-reason {
  border-bottom: 1px solid #3f485f !important;
  border-top: none !important;
  border-left: none !important;
  border-right: none !important;
  border-radius: 0% !important;
}

input[type="text"]:focus {
  box-shadow: none !important;
}

.delete-account-btn {
  button {
    width: 15% !important;
  }
}

.checkbox-wrap input[type="checkbox"]:checked+.checkbox-box .icon-check,
.checkbox-wrap input[type="radio"]:checked+.checkbox-box .icon-check {
  fill: #ffffff;
}

.checkbox-wrap .checkbox-box .icon-check {
  fill: transparent;
  transition: fill 0.2s ease-in-out;
}
</style>

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
          <p class="mt10" v-if="isAgreeError" style="color:red">{{  $t('agreement.leave.text')  }}</p>
        </li>
      </ul>
      <p style="width:100%; justify-content: flex-end;"><a class="btn-default w200" @click="openConfirnModal">{{
           $t('leave.account.title') 
          }}</a></p>
    </div>

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

const route = useRoute();
const config = useRuntimeConfig()
const { t, locale } = useI18n()
const router = useRouter()

definePageMeta({
  title: 'leave-account',
  name: 'leaveAccount',
  middleware: 'auth'
})

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

</script>
<style lang="scss" scoped>
h3 {
  font-weight: bold;
  font-size: 16px;
}

p {
  color: #333333c2;
}


li {
  color: #b7b7b7;
  list-style: none;
}


input[type="text"]:focus {
  box-shadow: none !important;
}
</style>

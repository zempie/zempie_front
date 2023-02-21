<template>
  <div class="login-bg pt50 pb50" style="height: 100vh; min-height: 900px">
    <div class="login-logo">
      <LoginWhiteLogoDt path="/" />
    </div>
    <div class="pw-find">
      <div class="pf-title">
        <h3>{{ $t('find.pwd.text') }}</h3>
        <p>{{ $t('find.pwd.desc') }}</p>
      </div>
      <div class="pf-content">
        <div>
          <i class="uil uil-info-circle" style="font-size: 16px; line-height: 24px"></i>&nbsp;&nbsp;{{
            $t('find.pwd.input.text')
          }}
          <p style="margin-left:22px">{{ $t('find.pwd.input.info') }}메일이 오지 않는 경우 스팸함을 확인해주세요</p>
        </div>
        <ul>
          <li>
            <div>
              <input v-model="email" @input="email ? (isEmailErr = false) : (isEmailErr = true)"
                @keyup.enter="sendEmail" type="text" :placeholder="$t('login.email.placeholder')" class="w100p h60" />
              <h3 class="input-errors" v-if="isEmailErr">
                <i class="uil uil-check"></i>{{ $t('login.empty.email') }}
              </h3>
            </div>
          </li>

        </ul>
        <p>
          <button @click="sendEmail" class="btn-default-big">
            {{ $t('send.email.btn') }}
          </button>
        </p>
      </div>
    </div>

    <el-dialog v-model="openModal" append-to-body class="modal-area-type" :show-close="false" width="380px">
      <div class="modal-alert">
        <dl class="ma-header">
          <dt>{{ $t('information') }}</dt>
          <dd>
            <button @click="closeModal"><i class="uil uil-times"></i></button>
          </dd>
        </dl>
        <div class="ma-content">
          <h2>
            {{ $t('send.email.modal.text1') }}<br />
            {{ $t('send.email.modal.text2') }}
          </h2>
          <div>
            <button class="btn-default" style="width: 100%" @click="closeModal">
              {{ $t('confirm') }}
            </button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ElDialog, ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { sendPasswordResetEmail } from 'firebase/auth'
import shared from '~/scripts/shared'

const route = useRoute()
const config = useRuntimeConfig()
const { t, locale } = useI18n()
const { $firebaseAuth, $localePath } = useNuxtApp()
const router = useRouter()

const openModal = ref(false)
const email = ref('')
const isEmailErr = ref(false)


shared.createHeadMeta(t('seo.reset.pwd.title'), t('seo.reset.pwd.desc'))


definePageMeta({
  layout: 'layout-none',
})

async function sendEmail() {
  if (!email.value) {
    isEmailErr.value = true
    return
  }

  const { data, error } = await useCustomAsyncFetch<{ result: string }>(
    '/user/has-email',
    getZempieFetchOptions('post', false, { email: email.value })
  )

  if (data.value.result) {
    try {
      await sendPasswordResetEmail($firebaseAuth, email.value)
      openModal.value = true
    } catch (error: any) {
      ElMessage({
        message: error.message,
        type: 'error',
      })
    }
  } else {
    ElMessage({
      message: t('login.err.text1'),
      type: 'error',
    })
  }
}

function closeModal() {
  openModal.value = false
  router.push($localePath(`/login`))
}
</script>

<style scoped>
.btn-default-big {
  width: 100%;
  border-radius: 30px;
}
</style>

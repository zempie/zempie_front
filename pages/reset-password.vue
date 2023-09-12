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
          <i style="font-size: 16px;">
            <LazyIconInfoCircle width="15px" class="pt10" />
          </i>&nbsp;&nbsp;{{
            $t('find.pwd.input.text')
          }}
          <p style="margin-left:22px">{{ $t('find.pwd.input.info') }}</p>
        </div>
        <ul>
          <li>
            <div>
              <input v-model="email" @input="email ? (isEmailErr = false) : (isEmailErr = true)" @keyup.enter="sendEmail"
                type="text" :placeholder="$t('login.email.placeholder')" class="w100p h60" />
              <h3 class="input-errors" v-if="isEmailErr">
                {{ $t('login.empty.email') }}
              </h3>
            </div>
          </li>

        </ul>
        <p>
          <button @click="sendEmail" class="btn-default-big text-white">
            {{ $t('send.email.btn') }}
          </button>
        </p>
      </div>
    </div>

    <el-dialog v-model="showModal" append-to-body class="modal-area-type" :show-close="false" width="380px">
      <div class="modal-alert">
        <dl class="ma-header">
          <dt>{{ $t('information') }}</dt>
          <dd>
            <button @click="closeModal">
              <IconClose />
            </button>
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
import { onBeforeRouteLeave } from 'vue-router';

const route = useRoute()
const config = useRuntimeConfig()
const { t, locale } = useI18n()
const { $firebaseAuth, $localePath } = useNuxtApp()
const router = useRouter()

const showModal = ref(false)
const email = ref('')
const isEmailErr = ref(false)
const isMobile = computed(() => useCommon().common.value.isMobile)

shared.createHeadMeta(t('seo.reset.pwd.title'), t('seo.reset.pwd.desc'))

watch(
  () => useCommon().common.value.isPopState,
  (val) => {
    if (!val) {
      closeModal()
    }
  })

definePageMeta({
  layout: 'layout-none',
})

onMounted(() => {
  useRouterLeave()
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
      openModal()
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


function openModal() {
  showModal.value = true
  if (isMobile.value) {
    useCommon().setPopState(true)
  }
}

function closeModal() {
  showModal.value = false
  if (isMobile.value) {
    useCommon().setPopState(false)
  }
  router.push($localePath(`/login`))
}
</script>

<style scoped>
.btn-default-big {
  width: 100%;
  border-radius: 30px;
}
</style>

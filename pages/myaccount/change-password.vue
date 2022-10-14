<template>
  <NuxtLayout name="user-setting">
    <div class="info-input">
      <div class="ii-title">
        <h2>{{ t('changePwd.title') }}</h2>
        <h3>&nbsp;{{ t('changePwd.info') }}</h3>
      </div>
      <dl class="ii-card">
        <div>
          <input
            @input="email ? (isEmailErr = false) : (isEmailErr = true)"
            @keyup.enter="sendEmail"
            type="text"
            v-model="email"
            :placeholder="t('login.email.placeholder')"
            class="w100p h60"
          />
          <p v-if="isEmailErr" class="email-error">
            {{ t('login.empty.email') }}
          </p>
        </div>

        <p>
          <button @click="sendEmail" class="btn-default-big">
            {{ t('send.email') }}
          </button>
        </p>
      </dl>
    </div>
    <el-dialog
      v-model="openModal"
      append-to-body
      custom-class="modal-area-type"
      :show-close="false"
    >
      <div class="modal-alert">
        <dl class="ma-header">
          <dt>{{ t('information') }}</dt>
          <dd>
            <button @click="openModal = false">
              <i class="uil uil-times"></i>
            </button>
          </dd>
        </dl>
        <div class="ma-content">
          <h2>
            {{ t('send.email.info1') }}<br />
            {{ t('send.email.info2') }}
          </h2>
          <div>
            <button
              class="btn-default"
              style="width: 100%"
              @click="openModal = false"
            >
              {{ t('confirm') }}
            </button>
          </div>
        </div>
      </div>
    </el-dialog>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ElDialog, ElMessage } from 'element-plus'
import { sendPasswordResetEmail } from 'firebase/auth'

import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const route = useRoute()
const config = useRuntimeConfig()

definePageMeta({
  title: 'change-pwd',
  name: 'changePwd',
  //middleware: 'auth',
})

useHead({
  title: `${t('seo.profile.change.pwd.title')} | Zempie`,
  link: [
    {
      rel: 'alternate',
      href: `${config.ZEMPIE_URL}${route.fullPath}`,
      hreflang: locale,
    },
    {
      rel: 'canonical',
      href: `${config.ZEMPIE_URL}${route.fullPath}`,
    },
  ],
  meta: [
    {
      property: 'og:url',
      content: `${config.ZEMPIE_URL}${route.fullPath}`,
    },
    {
      property: 'og:site_name',
      content: 'Zempie',
    },
    {
      name: 'og:type',
      content: 'website',
    },
    {
      name: 'robots',
      content: 'noindex, nofollow',
    },
    {
      name: 'description',
      content: `${t('seo.profile.change.pwd.desc')}`,
    },
    {
      property: 'og:title',
      content: `${t('seo.profile.change.pwd.title')}`,
    },
    {
      property: 'og:description',
      content: `${t('seo.profile.change.pwd.description')}`,
    },
    {
      property: 'og:url',
      content: `${config.ZEMPIE_URL}${route.path}`,
    },
  ],
})

const email = ref('')
const isEmailErr = ref(false)
const openModal = ref(false)

const { $firebaseAuth } = useNuxtApp()

const user = computed(() => useUser().user.value.info)

async function sendEmail() {
  if (!email.value) {
    isEmailErr.value = true
    return
  }

  if (email.value !== user.value.email) {
    ElMessage({
      message: t('email.not.matched'),
      type: 'error',
    })
    return
  }

  try {
    await sendPasswordResetEmail($firebaseAuth, email.value)
    openModal.value = true
  } catch (error: any) {
    ElMessage({
      message: error.message,
      type: 'error',
    })
  }
}
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
  margin-left: 10px;
  margin-top: 10px;
  display: inline-block !important;
  color: #c5292a;
  justify-content: left !important;
}
</style>

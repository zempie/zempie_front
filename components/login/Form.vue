<template>
  <form>
    <input type="email" v-model="v$.email.$model" name="login-email" title="" :placeholder="$t('login.email.placeholder')"
      class="w100p h60" style="margin-bottom: 10px" autocomplete="user-email" @keyup.enter="onSubmit" />
    <h2 class="input-errors" v-for="error of v$.email.$errors" :key="error.$uid">
      <i class="uil uil-check"></i>{{ error.$message }}
    </h2>
    <input type="password" v-model="v$.password.$model" name="login-password" title="" autocomplete="current-password"
      :placeholder="$t('login.pwd.placeholder')" class="w100p h60" style="margin-bottom: 10px" @keyup.enter="onSubmit" />

    <h2 class="input-errors" v-for="error of v$.password.$errors" :key="error.$uid">
      <i class="uil uil-check"></i>{{ error.$message }}
    </h2>
  </form>
  <p class="w100p" @click="onSubmit">
    <a class="btn-default-big text-white">{{ $t('login') }}</a>
  </p>
  <div class="social-login">
    <img src="/images/login/google_logo_only.png" />
    <img src="/images/login/fb_logo_only.png" />
    <img src="/images/login/apple_logo_only.png" />
  </div>
</template>
<script setup lang="ts">
import { required, helpers } from '@vuelidate/validators'
import { emailRegex, passwordRegex } from '~/scripts/utils'
import useVuelidate from '@vuelidate/core'

const { t, locale } = useI18n()

const emailValidator = helpers.regex(emailRegex)

const form = reactive({
  email: '',
  password: '',
})

const rules = computed(() => {
  const formRule = {
    email: {
      required: helpers.withMessage(t('login.empty.email'), required),
      emailValidator: helpers.withMessage(
        t('login.email.format.err'),
        emailValidator
      ),
    },
    password: {
      required: helpers.withMessage(t('login.empty.pwd'), required),
    },
  }

  return formRule
})
const v$ = useVuelidate(rules, form)

async function onSubmit() {
  // const isValid = await v$.value.$validate()

  // if (isFlutter.value) {

  //   try {
  //     const result = await FlutterBridge().signInEmail({ email: form.email, password: form.password })
  //     currUser.value = result
  //     router.push($localePath('/'))
  //     await useUser().setUserInfo()
  //     await setFirebaseToken()
  //   }
  //   catch (err) {
  //     firebaseLoginErr(err)
  //   }


  // } else {
  //   if (!isValid) return
  //   setPersistence($firebaseAuth, browserLocalPersistence)
  //     .then((res) => {
  //       signInWithEmailAndPassword($firebaseAuth, form.email, form.password)
  //         .then(async (result) => {
  //           const { user } = result
  //           if (user) {
  //             router.push($localePath('/'))
  //             // await useUser().setUserInfo()
  //           }
  //         })
  //         .catch((err: any) => {
  //           firebaseLoginErr(err)
  //         })
  //     })
  //     .catch((err: any) => {
  //       ElMessage.error(err.message)
  //     })
  // }
}
</script>
<style scoped lang="scss"></style>
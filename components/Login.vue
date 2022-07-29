<template>
  <form @submit.prevent="onSubmit">
    <p><input type="email" v-model="email" placeholder="email" /></p>
    <p><input type="password" v-model="password" placeholder="password" /></p>
    <button type="submit"> login</button>
  </form>
</template>
<script setup lang="ts">
import { useUserStore } from '~/stores/user'
const email = ref('')
const password = ref('')
const userStore = useUserStore()
const $router = useRouter()

async function onSubmit() {

  const payload = {
    email: email.value,
    password: password.value
  }

  try {
    const result = await useFetchData('post', '/auth/login', payload, false)
    if (result) {

      //pinia
      userStore.$state.isLogin = true;
      await userStore.setUserInfo()

      //useState
      const { data } = await useFetchData('get', '/user')
      const { setUser } = useUser();
      setUser(data)

      $router.push('/user-info')

    }
  } catch (err: any) {
    console.error(err)
  }

}
</script>

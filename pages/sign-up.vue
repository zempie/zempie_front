<template>
  <div>
    <form @submit.prevent="onSubmit">
      <p><input type="email" v-model="email" placeholder="email" /></p>
      <p><input type="password" v-model="password" placeholder="password" /></p>
      <p><input type="text" v-model="nickname" placeholder="nickname" /></p>
      <button type="submit"> Sign up</button>
    </form>
  </div>
</template>
<script setup lang="ts">
import { useUserStore } from '~/stores/user'

const email = ref('')
const password = ref('')
const nickname = ref('')

const userStore = useUserStore()
const $router = useRouter()


async function onSubmit() {

  const payload = {
    email: email.value,
    password: password.value,
    nickname: nickname.value
  }

  try {
    const result = await useFetchData('post', '/sign-up', payload)
    const { data } = result

    // pinia
    userStore.$state.user = data;
    userStore.$state.isLogin = true;

    // useState
    const { setUser } = useUser()
    setUser(data)

    $router.push('/user-info')


  } catch (error: any) {
    console.error(error)
  }



}
</script>

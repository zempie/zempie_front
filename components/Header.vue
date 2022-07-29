<template>
    <div style="width:100vw; height:50px; background-color:#ededed;">
        <button @click="$router.push('/')">Main</button>
        <button @click="$router.push('/about')">About page</button>

        <template v-if="!userStore.$state.isLogin">
            <button @click="$router.push('/login')">Go to login page</button>
            <button @click="$router.push('/sign-up')">Sign up</button>
        </template>
        <button v-else @click="logout">logout</button>
    </div>

</template>
<script setup lang="ts">

import { useUserStore } from '~/stores/user'

const userStore = useUserStore()
const $router = useRouter();


function logout() {

    $router.push('/')
    userStore.$state.user = null;
    userStore.$state.isLogin = false;

    const { initUser } = useUser()
    initUser();

    sessionStorage.removeItem('access_token')

}

</script>
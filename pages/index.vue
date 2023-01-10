<template>
  <div v-if="useUser().user.value.isLoading" class="content"></div>
  <div v-else>
    <MyTimeline
      v-if="userCookie"
    />
    <MainGuest  v-else/>
  </div>
</template>

<script setup lang="ts" >import { IUser } from '~~/types';

const config = useRuntimeConfig()

const userCookie = useCookie(config.COOKIE_NAME)
definePageMeta({
  title: 'main',
  name: 'main',
})

onBeforeMount(async()=>{
  // if(userCookie.value && !useUser().user.value.isLogin){
  //   colorLog("index page", 'yellow')

  //   await useUser().setUserInfo()

  //   }
})
</script>

<style scoped lang="scss"></style>

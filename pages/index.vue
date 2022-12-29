<template>
  <div v-if="loading" class="content"></div>
  <div >

    <MyTimeline
      v-if="!isEmpty(userCookie)"
    />
    <MainGuest v-else/>
  </div>
</template>

<script setup lang="ts">
import {isEmpty} from '~~/scripts/utils'
const config = useRuntimeConfig()
const userCookie = computed( () =>  useCookie(config.COOKIE_NAME).value )
const nuxtApp = useNuxtApp();
const loading = ref(false);

nuxtApp.hook("page:start", () => {
  if(isEmpty( useCookie(config.COOKIE_NAME).value ) && useCookie(config.REFRESH_TOKEN).value){
    getRefreshToken()
  }
  loading.value = true;
});
nuxtApp.hook("page:finish", () => {
  loading.value = false;
});

</script>

<style scoped lang="scss"></style>

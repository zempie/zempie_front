<template>
  <div v-if="loading" class="content"></div>
  <div :key="String(useUser().user.value.isLogin)">
      <MyTimeline
      v-if="!isEmpty(useCookie(config.COOKIE_NAME).value)"
    />
    <MainGuest v-else/>
  </div>
</template>

<script setup lang="ts">
import {isEmpty} from '~~/scripts/utils'
const config = useRuntimeConfig()
const nuxtApp = useNuxtApp();
const loading = ref(false);

nuxtApp.hook("page:start", () => {
  if( isEmpty( useCookie(config.COOKIE_NAME).value ) && useCookie(config.REFRESH_TOKEN).value){
    console.log('?')
    getRefreshToken()
  }
  loading.value = true;
});
nuxtApp.hook("page:finish", () => {
  loading.value = false;
});

</script>

<style scoped lang="scss"></style>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup lang="ts">
import { ID_INJECTION_KEY } from 'element-plus'
import { useI18n } from 'vue-i18n';
const { locale } = useI18n();
//TODO: auto login 처리



provide(ID_INJECTION_KEY, {
  prefix: 100,
  current: 0,
})
onMounted(() => {

  const lang = navigator.language.split('-')[0]
  if (lang === 'ko' || lang === 'en') {
    locale.value = lang
  } else {
    locale.value = 'en'
  }


})
</script>

<style lang="scss">
@import "https://unicons.iconscout.com/release/v3.0.3/css/line.css";

body {
  margin: 0px !important;

  .content {
    min-height: calc(100vh - 200px) !important;
  }
}
</style>
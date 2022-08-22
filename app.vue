<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup lang="ts">
import { ID_INJECTION_KEY } from 'element-plus'
import { useI18n } from 'vue-i18n';
import { useSwitchLocalePath } from 'vue-i18n-routing';

const { locale } = useI18n();
const switchLocalePath = useSwitchLocalePath();

provide(ID_INJECTION_KEY, {
  prefix: 100,
  current: 0,
})

onMounted(() => {
  console.log('?')
  const lang = navigator.language.split('-')[0]
  if (lang === 'ko') {
    locale.value = 'ko'
    switchLocalePath('ko')

  } else {
    locale.value = 'en'
    switchLocalePath('en')

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
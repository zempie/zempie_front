<template>
  <div class="error-section">
    <div class="login-logo">
      <NuxtLink :to="localePath('/')"
        ><img src="/images/zempie_logo.png" alt="zempie" title="zempie"
      /></NuxtLink>
    </div>
    <img class="img404" src="/images/404.png"  alt="404" title="404"/>
    <button class="btn-default" @click="$router.go(-1)">
      {{ $t('goBack') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useLocalePath } from 'vue-i18n-routing'

const localePath = useLocalePath()

const props = defineProps({
  error: Object,
})

definePageMeta({
  layout: 'default',
})
</script>

<style scoped>
.error-section {
  height: 100vh;
  display: flex;
  align-content: center;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}

.img404 {
  display: flex;
  margin: 0 auto;
}
</style>

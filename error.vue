<template>
  <ClientOnly>
    <div class="error-section">
      <div class="login-logo">
        <NuxtLink :to="$localePath('/')"
          ><NuxtImg src="/images/zempie_logo.png" alt="zempie" title="zempie"
        /></NuxtLink>
      </div>
      <NuxtImg class="img404" src="/images/404.png" alt="404" title="404" />
      <button class="btn-default" @click="$router.back()">
        {{ $t('goBack') }}
      </button>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
const { $localePath } = useNuxtApp()

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

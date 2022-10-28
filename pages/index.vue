<template>
  <MyTimeline v-if="useCookie(config.COOKIE_NAME).value" />
  <template v-else>
    <NuxtLoadingIndicator v-if="useUser().user.value.isLoading" />
    <MainGuest v-else />
  </template>
</template>

<script lang="ts" setup>
const config = useRuntimeConfig()

const showTimeline = computed(() => {
  return useCookie(config.COOKIE_NAME).value && useUser().user.value.isLogin
})

definePageMeta({
  title: 'main',
  name: 'main',
})
</script>

<style scoped lang="scss"></style>

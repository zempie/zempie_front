<template>
  <MyTimeline v-if="useCookie(config.COOKIE_NAME).value" />
  <MainGuest v-else />
</template>

<script lang="ts" setup>
const config = useRuntimeConfig()

// definePageMeta({
//   title: 'main',
//   name: 'main',
// })
</script>

<style scoped lang="scss"></style>

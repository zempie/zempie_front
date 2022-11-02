<template>
  <div>
    <MyTimeline
      v-if="useCookie(config.COOKIE_NAME).value && useUser().user.value.isLogin"
    />
    <MainGuest v-else />
  </div>
</template>

<script lang="ts" setup>
const config = useRuntimeConfig()

definePageMeta({
  title: 'main',
  name: 'main',
})
</script>

<style scoped lang="scss"></style>

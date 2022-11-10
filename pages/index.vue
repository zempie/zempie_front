<template>
  <div v-if="useUser().user.value.isLoading" class="content"></div>
  <div v-else>
    <MyTimeline
      v-if="useCookie(config.COOKIE_NAME).value && useUser().user.value.isLogin"
    />
    <MainGuest  v-else/>
  </div>
</template>

<script setup lang="ts" >
const config = useRuntimeConfig()

definePageMeta({
  title: 'main',
  name: 'main',
})
</script>

<style scoped lang="scss"></style>

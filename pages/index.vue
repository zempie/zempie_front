<template>
  <div>
      <ClientOnly>
      <div v-if="useUser().user.value.isLoading" class="content"></div>
      <div v-if="useCookie(config.COOKIE_NAME).value || useCookie(config.REFRESH_TOKEN).value ">
        <MyTimeline/>
      </div>
      <div v-else>
        <MainGuest/>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts" >
import { IUser } from '~~/types';

const config = useRuntimeConfig()

const userCookie = useCookie(config.COOKIE_NAME)
definePageMeta({
  title: 'main',
  name: 'main',
})
</script>

<style scoped lang="scss"></style>

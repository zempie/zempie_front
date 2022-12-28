<template>
  <div v-if="(useUser().user.value.isLoading || !useRender().state.value.isDone)" class="content"></div>
  <div v-else>
    <MyTimeline
      v-if="userCookie && useUser().user.value.isLogin"
    />
    <MainGuest v-else/>
  </div>
</template>

<script setup lang="ts" >

const config = useRuntimeConfig()

const userCookie = useCookie(config.COOKIE_NAME)


</script>

<style scoped lang="scss"></style>

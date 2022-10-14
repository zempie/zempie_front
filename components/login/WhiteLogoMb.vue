<template>
  <NuxtLink :to="$localePath(path)"
    ><img src="/images/logo.svg" alt="zempie-logo" title="zempie-logo" />
  </NuxtLink>
</template>
<script lang="ts" setup>
const { $localePath } = useNuxtApp()

const props = defineProps({
  path: {
    default: '/',
    type: String,
  },
})
</script>

<style scoped lang="scss"></style>

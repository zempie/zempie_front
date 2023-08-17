<template>
  <div>
    <Header />
    <slot />
    <Footer v-if="!String(route.name).includes('zemtown')" />
  </div>
</template>
<script setup lang="ts">
const route = useRoute()
</script>
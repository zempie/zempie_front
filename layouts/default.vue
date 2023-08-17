<template>
  <div>
    <Header />
    <slot />
    <Footer />
  </div>
</template>
<script setup lang="ts">
const route = useRoute()
</script>

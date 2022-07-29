<template>
  <h4>This is custom layout</h4>
  <Login />
</template>
<script setup lang="ts">
definePageMeta({
  layout: 'custom',
  middleware: ["auth"]
});
</script>

<template>
  <div class="content" style="height: auto">
    <DmList />
  </div>
</template>
<script setup lang="ts">


definePageMeta({
  title: 'dm',
  name: 'dm',
  middleware: 'auth',
  layout: 'header-only',
})

</script>
<style scoped lang="scss"></style>

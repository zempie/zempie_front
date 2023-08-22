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
<style scoped lang="scss">
@media all and (min-width: 480px) and (max-width: 767px) {
  .content {
    padding: 70px 0 30px 0;
  }
}
</style>

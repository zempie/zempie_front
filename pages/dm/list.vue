<template>
  <div :class="['content dm-page', isMobile && 'mobile']">
    <DmList />
  </div>
</template>
<script setup lang="ts">
import { onBeforeRouteLeave } from 'vue-router';

definePageMeta({
  title: 'dm',
  name: 'dm',
  middleware: 'auth',
})

onMounted(() => {
  useRouterLeave()
})

</script>
<style scoped lang="scss">
.content {
  height: auto;
}

@media all and (max-width: 767px) {
  .content {
    padding: 0px;
    height: 100vh;

  }
}
</style>

<template>
  <NuxtLayout :name="layout">

    <div :class="['content', isMobile && 'mobile']">
      <DmList />
    </div>
  </NuxtLayout>
</template>
<script setup lang="ts">
const isMobile = computed(() => useCommon().common.value.isMobile)

const layout = computed(() => {
  return isMobile.value ? 'layout-none' : 'header-only'
})

definePageMeta({
  title: 'dm',
  name: 'dm',
  middleware: 'auth',
  layout: false
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

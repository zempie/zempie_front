<template>
  <NuxtLayout :name="layout">
    <div :class="['content', isMobile && 'mobile']">
      <DmList />
    </div>
  </NuxtLayout>
</template>
<script setup lang="ts">
const isFullScreen = ref(false)

const isMobile = computed(() =>
  window.matchMedia('screen and (max-width: 767px)')
)
const layout = computed(() => {
  return isFullScreen.value ? 'layout-none' : 'header-only'
}
)

definePageMeta({
  title: 'dm',
  name: 'dm',
  middleware: 'auth',
  layout: false
})

onMounted(async () => {
  nextTick(() => {
    onResize()
  })
  window.addEventListener('resize', onResize)
})


onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
})

function onResize() {
  isFullScreen.value = isMobile.value.matches ? true : false
}
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

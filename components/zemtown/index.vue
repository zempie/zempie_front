<template>
  <iframe ref="zemtownRef" :src="zemtownUrl" style="width: 100%;" id="zemtownId" />
</template>
<script setup lang="ts">
const config = useRuntimeConfig()

const zemtownUrl = computed(() => useZemtown().zemtown.value.url)
const fUser = computed(() => useUser().user.value.fUser)
const zemtownRef = ref()

colorLog('zemtown component', 'pink')


watch(() => useUser().user.value.fUser,
  (user) => {
    if (user) {
      useZemtown().setUrl(`${config.ZEMTOWN_URL}?token=${user?.accessToken}`)
    } else {
      useZemtown().setUrl(`${config.ZEMTOWN_URL}`)
    }
  })




</script>
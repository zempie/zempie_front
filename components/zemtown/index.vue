<template>
  <iframe ref="zemtownRef" :src="zemtownUrl" style="width: 100%;" />
</template>
<script setup lang="ts">
const config = useRuntimeConfig()

const zemtownUrl = computed(() => useZemtown().zemtown.value.url)

</script>
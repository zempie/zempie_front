<template>
  <span> <span class="zem-color"> {{ coin }}</span>
    <img src="/images/coins/zem_icon.png" width="18" class="ml5" />
  </span>
</template>
<script setup lang="ts">

defineProps({
  coin: Number
})
</script>
<style scoped lang="scss"></style>
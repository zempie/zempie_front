<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="check" width="24" height="24">
    <path :fill="color"
      d="M18.71,7.21a1,1,0,0,0-1.42,0L9.84,14.67,6.71,11.53A1,1,0,1,0,5.29,13l3.84,3.84a1,1,0,0,0,1.42,0l8.16-8.16A1,1,0,0,0,18.71,7.21Z">
    </path>
  </svg>
</template>
<script setup lang="ts">
defineProps({
  color: {
    type: String,
    default: '#888'
  }
})
</script>
<style scoped lang="scss"></style>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="ellipsis-h" width="24" height="24">
    <path :fill="color"
      d="M12,10a2,2,0,1,0,2,2A2,2,0,0,0,12,10ZM5,10a2,2,0,1,0,2,2A2,2,0,0,0,5,10Zm14,0a2,2,0,1,0,2,2A2,2,0,0,0,19,10Z">
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

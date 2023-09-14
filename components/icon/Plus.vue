<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="plus" width="24" height="24">
    <path :fill="color" d="M19,11H13V5a1,1,0,0,0-2,0v6H5a1,1,0,0,0,0,2h6v6a1,1,0,0,0,2,0V13h6a1,1,0,0,0,0-2Z"></path>
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

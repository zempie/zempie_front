<template>
  <div class="content">
    <ClientOnly>
      <CommunityHeaderSK />
    </ClientOnly>
    <slot />
  </div>
</template>

<script setup lang="ts">


</script>

<style lang="scss" scoped>
.darker-text {
  min-height: 18px;
  background-color: #333;
  border-radius: 10px;
}


.numbers {
  min-height: 18px
}
</style>

<template>
  <div class="zemtown-modal">
    <DmList v-if="isOpen" />
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  isOpen: {
    type: Boolean,
    dafault: false
  }
})
</script>
<style scoped lang="scss">
.zemtown-modal {
  // max-height: calc(100vh - 70px);
  padding-bottom: 0px;
  min-width: 350px;


  :deep(.new-msg-modal) {
    border-radius: 0px !important;
  }
}


@media all and (max-width: 479px) {
  .zemtown-modal {
    width: 100vw;

    :deep(.dlc-send-message) {
      bottom: 0px;
    }
  }
}

@media all and (min-width: 480px) and (max-width: 767px) {
  .zemtown-modal {

    :deep(.dlc-send-message) {
      bottom: 0px;
    }
  }
}
</style>

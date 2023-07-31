<template>
  <div class="zemtown-modal">
    <DmList v-if="isOpen"  />
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
  max-height: calc(100vh - 70px);
  padding-bottom: 0px;
  min-width: 350px;

  :deep(.dm-list) {
    border-radius: 10px;
    margin: 0 auto;

    &.on {
      height: calc(100vh - 50px);
      border-radius: 0px;
      width: 100vw;


      .dl-content {
        .active-room-container{
          height:10%;
        }
        // height: calc(100vh - 100px);
        .dlc-chat-content{
          height:80%;
        }
        .dlc-send-message{
          height:10%;
        }
      }

    }

  }

  :deep(.new-msg-modal) {
    border-radius: 0px !important;
  }
}
</style>

<template>
  <div v-if="tag === 'div'" class='user-avatar'> </div>
  <p v-else-if="tag === 'p'" class='user-avatar'> </p>
</template>

<script setup lang="ts">

defineProps({
  tag: {
    type: String,
    default: 'div'
  }
})

</script>

<style scoped lang="scss">
.user-avatar {
  background: url('/images/300_300_default_profile.png') center center / cover no-repeat;
  background-size: cover;
}
</style>

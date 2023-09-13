<template>
  <div v-if="tag === 'div'" class='user-avatar-sk'> </div>
  <p v-else-if="tag === 'p'" class='user-avatar-sk'> </p>
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
.user-avatar-sk {
  background: url('/images/300_300_default_profile.png') center center / cover no-repeat;
  background-size: cover;
}
</style>

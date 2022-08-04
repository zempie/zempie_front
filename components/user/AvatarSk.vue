<template>
  <div v-if="tag === 'div'" class='user-avatar'
    style="background: url('/images/300_300_default_profile.png') center center  / cover no-repeat; background-size: cover;">
  </div>
  <p v-else-if="tag === 'p'" class='user-avatar'
    style="background: url('/images/300_300_default_profile.png') center center  / cover no-repeat; background-size: cover;">
  </p>
  <!-- 
    <div
        v-else-if="tag === 'div'"
        :style="`background: url('${picture}') center center  / cover no-repeat; background-size: cover;`"></div>
    <p
        :class="user && user.uid ? 'user-avatar' : ''"
        @click="moveUserPage"
        v-else-if="tag === 'p'"
        :style="`background: url('${picture}') center center  / cover no-repeat; background-size: cover;`"></p> -->
</template>

<script setup lang="ts">

const props = defineProps({
  tag: {
    type: String,
    default: 'div'
  }
})

</script>

<style scoped lang="scss">
</style>

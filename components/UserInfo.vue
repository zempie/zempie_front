<template>
  <ul>
    <li>Email: {{ user.email }} </li>
    <li>Nickname: {{ user.nickname }} </li>
    <li>Point: {{ user.point }}
      <slot name="addPoint"></slot>
    </li>

    <li v-if="user.profile_img">
      <img :src="user.profile_img" :alt="`${user.nickname}'s profile image'`" />

    </li>
  </ul>

</template>

<script setup lang="ts">
const props = defineProps({
  user: Object
})


</script>
<style scoped lang="scss">
</style>
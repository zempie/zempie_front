<template>
  <div
    v-if="tag === 'div'"
    :class="user?.uid ? 'user-avatar' : ''"
    :style="`background: url('${
      user?.picture
        ? user.picture + `?_=${Date.now()}`
        : `/images/300_300_default_profile.png`
    }') center center  / cover no-repeat; background-size: cover;`"
  ></div>

  <span
    v-else-if="tag === 'span'"
    :style="`background: url('${
      user?.picture
        ? user.picture + `?_=${Date.now()}`
        : `/images/300_300_default_profile.png`
    }') center center  / cover no-repeat; background-size: cover;`"
  ></span>

  <p
    v-else-if="tag === 'p'"
    :style="`background: url('${
      user?.picture
        ? user.picture + `?_=${Date.now()}`
        : `/images/300_300_default_profile.png`
    }') center center  / cover no-repeat; background-size: cover;`"
  ></p>
</template>

<script setup lang="ts">
const props = defineProps({
  user: Object,
  tag: {
    default: 'div',
    type: String,
  },
})
const profile_url = ref(props.user?.picture)
</script>

<style scoped lang="scss">
.user-avatar {
  cursor: pointer;
  border-radius: 100%;
}
</style>

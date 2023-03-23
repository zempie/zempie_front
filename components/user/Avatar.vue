<template>
  <div v-if="tag === 'div'" :class="[hasRouter && 'pointer', user?.uid && 'user-avatar']" :style="profileStyle"
    @click.stop="moveUserPage"></div>
  <span v-else-if="tag === 'span'" :class="hasRouter && 'pointer'" :style="profileStyle"
    @click.stop="moveUserPage"></span>
  <p v-else-if="tag === 'p'" :class="hasRouter && 'pointer'" :style="profileStyle" @click.stop="moveUserPage"></p>
</template>

<script setup lang="ts">
const { $localePath } = useNuxtApp()
const $router = useRouter()

const props = defineProps({
  user: Object,
  tag: {
    default: 'div',
    type: String,
  },
  hasRouter: {
    default: false,
    type: Boolean
  }
})

const profileStyle = computed(() => {
  const url = props.user?.picture ? props.user?.picture + `?_=${Date.now()}` : '/images/300_300_default_profile.png'
  return `background: url('${url}') center center  / cover no-repeat; background-size: cover;`
})

function moveUserPage() {
  if (props.hasRouter) {
    $router.push($localePath(`/channel/${props.user.channel_id}`))
  }
}
</script>

<style scoped lang="scss">
.user-avatar {
  cursor: pointer;
  border-radius: 100%;
}
</style>

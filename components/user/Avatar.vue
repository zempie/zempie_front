<template>
  <div
    v-if="tag === 'div'"
    :class="user?.uid ? 'user-avatar' : ''"
    :style="`background: url('${
      user?.picture ? user.picture : `/images/300_300_default_profile.png`
    }') center center  / cover no-repeat; background-size: cover;`"
  ></div>

  <span
    v-else-if="tag === 'span'"
    :style="`background: url('${
      user?.picture ? user.picture : `/images/300_300_default_profile.png`
    }') center center  / cover no-repeat; background-size: cover;`"
  ></span>

  <p
    v-else-if="tag === 'p'"
    :style="`background: url('${
      user?.picture ? user.picture : `/images/300_300_default_profile.png`
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

onMounted(() => {
  //   profile_url.value = props.user?.picture
  //     ? props.user.picture + `?t=${Date.now()}`
  //     : `/images/300_300_default_profile.png`
})
// picture = ''

// async mounted() {
//     await this.$store.dispatch("loginState");
//     if (this.user) {

//         this.picture = this.user.picture ? this.user.picture + `?t=${Date.now()}` : '/img/300_300_default_profile.png'
//     }else{
//         this.picture = '/img/300_300_default_profile.png'
//     }
// }

// moveUserPage() {
//     if(this.user.channel_id)
//     this.$router.push(`/${this.$i18n.locale}/channel/${this.user.channel_id}/timeline`)
// }
</script>

<style scoped lang="scss">
.user-avatar {
  cursor: pointer;
  border-radius: 100%;
}
</style>

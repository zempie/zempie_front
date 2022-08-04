<template >
  <p class="btn-default" @click="follow" v-if="!user?.is_following">Follow</p>
  <p class="btn-default" @click="unfollow" v-else> Followed</p>
</template>

<script setup lang="ts" >

const props = defineProps({
  user: Object
})



function follow() {

  if (!user.value.isLogin) { useModal().openLoginModal(); return; }
  // this.$api.follow(this.member.id)
  //     .then((res: AxiosResponse) => {
  //         this.$emit('reFetch')
  //     })
  //     .catch((err: AxiosError) => {

  //     })

}

function unfollow() {
  // this.$api.unfollow(this.member.id)
  //     .then((res: AxiosResponse) => {
  //         this.$emit('reFetch')
  //     })
  //     .catch((err: AxiosError) => {

  //     })

}


</script>

<style scoped lang="scss">
.btn-default {
  width: 100%;
  cursor: pointer;

  &.my-channel {
    background-color: #28a745;
  }

  &.my-channel:hover {
    color: #28a745;
    background-color: rgba(40, 167, 69, 0.3);
  }
}

.cm-info {
  min-height: 171px;
}
</style>

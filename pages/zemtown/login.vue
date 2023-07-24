<template>
  <div class="login-container">
    <div class="logo">
      <img src="/images/zemtown/zemtown_logo.png" class="mb30" />
      <img src="/images/zemtown/zemtown_char.png" />
    </div>
    <div class="mt30">
      <LoginForm />
      <button class="btn-default-big text-white" @click="guestMode">Guest</button>
    </div>
  </div>
</template>
<script setup lang="ts">
const router = useRouter()


function guestMode() {

  router.push('/zemtown/guest')


}
</script>
<style scoped lang="scss">
.login-container {
  position: absolute;
  z-index: 999;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;

  .logo {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    img {
      width: 70%;
    }
  }
}
</style>
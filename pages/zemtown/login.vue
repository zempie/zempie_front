<template>
  <div class="login-container">
    <div class="logo">
      <img src="/images/zemtown/zemtown_logo.png" class="mb30" />
      <img src="/images/zemtown/zemtown_char.png" />
    </div>
    <div class="mt30">
      <LoginForm :isSimple="true">
        <template #actions>
          <button class="btn-default-big text-white w100p bg-gray mt10 mb10" @click="guestMode">Guest</button>
        </template>
      </LoginForm>
    </div>
  </div>
</template>
<script setup lang="ts">
const router = useRouter()


function guestMode() {

  router.push('/zemtown')


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

.btn-default-big {
  border-radius: 50px
}

:deep(.login-area) {
  background: transparent;
  padding-top: 0px;

  .la-content {
    border: none;
    margin-top: 0px;
    padding-top: 0px;

  }
}
</style>
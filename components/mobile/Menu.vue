<template>
  <div class="mobile-menu">
    <button class="mr10" @click="openMyProfile"><span class="material-icons">
        account_circle
      </span></button>

    <button class="mr10" :class="$route.name.toString().includes('game-list') && 'active'"
      @click="$router.push($localePath('/game/list'))"><span class="material-icons">
        sports_esports
      </span></button>

    <button @click="$router.push($localePath('/zemtown'))">
      <img src="/images/zempie_logo_154_155.png" alt="zempie-logo" loading="lazy" height="25" />
    </button>

    <button :class="[$route.name?.toString().includes('community-list') && 'active', 'mr10']"
      @click="$router.push($localePath('/community/list'))">
      <span class="material-icons">
        groups
      </span>
    </button>
    <button class="mr10" @click="openDm">
      <span class="material-icons">
        sms
      </span>
    </button>
  </div>
</template>
<script setup lang="ts">
const { $localePath } = useNuxtApp()

const route = useRoute()
const router = useRouter()

const isOpenDm = ref(false)

const isZemtown = computed(() => String(route.name).includes('zemtown'))

function openMyProfile() {
  if (!isZemtown.value) {
    router.push($localePath('/zemtown'))
    useZemtown().openMyProfile()
  } else {
    if (useZemtown().zemtown.value.isOpenMyProfile) {
      useZemtown().closeMyProfile()

    } else {
      useZemtown().openMyProfile()

    }
  }
}

function openDm() {

  if (!isZemtown.value) {
    router.push($localePath('/zemtown'))
    useZemtown().openDm()
  } else {
    isOpenDm.value = !isOpenDm.value
    if (isOpenDm.value) {
      useZemtown().openDm()

    } else {
      useZemtown().closeDm()

    }
  }

}
</script>
<style scoped lang="scss">
.mobile-menu {
  display: none;
  height: 50px;
  background-color: #fff;
  width: 100%;
  flex-direction: row;
  justify-content: center;
  position: fixed;
  bottom: 0px;
  z-index: 999;


  button {
    width: 25%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: transparent;
    border: none;
    cursor: pointer;

    &:hover,
    &.active {
      color: #e99415;
    }
  }
}


@media all and (max-width: 479px) {
  .mobile-menu {
    display: flex;
  }
}

@media all and (min-width: 480px) and (max-width: 767px) {
  .mobile-menu {
    display: flex;
  }

}
</style>
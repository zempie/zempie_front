<template>
  <div class="mobile-menu">
    <button :class="[route.meta.name === 'main' && 'active']" @click="openTimeline"><span class="material-icons">
        home
      </span></button>
    <button class=" mr10" @click="openMyProfile" :class="isOpenProfile && 'active'">
      <span class="material-icons">
        account_circle
      </span></button>
    <button class="mr10" :class="$route.name.toString().includes('game-list') && 'active'"
      @click="$router.push($localePath('/game/list'))"><span class="material-icons">
        sports_esports
      </span></button>
    <button :class="[$route.name?.toString().includes('community-list') && 'active', 'mr10']"
      @click="$router.push($localePath('/community/list'))">
      <span class="material-icons">
        groups
      </span>
    </button>
    <button class="mr10" @click="openZemtown" :class="[$route.name?.toString().includes('zemtown') && 'active', 'mr10']">
      <span class="material-icons">
        attractions
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
const isLogin = computed(() => useUser().user.value.isLogin)
const isOpenProfile = computed(() => useZemtown().zemtown.value.isOpenMyProfile)


function openTimeline() {
  router.push($localePath('/'))

  useZemtown().closeDm()
  useZemtown().closeMyProfile
}

function openZemtown() {
  router.push($localePath('/zemtown'))

  useZemtown().closeDm()
  useZemtown().closeMyProfile
}

function openMyProfile() {
  useZemtown().closeDm()
  if (!loginCheck()) return

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
  useZemtown().closeMyProfile()
  if (!loginCheck()) return
  if (!isZemtown.value) {
    router.push($localePath('/zemtown'))
    useZemtown().openDm()
  } else {
    if (useZemtown().zemtown.value.isOpenDm) {
      useZemtown().closeDm()

    } else {
      useZemtown().openDm()

    }
  }
}

function loginCheck() {
  if (isLogin.value) {
    return true
  } else {
    router.push($localePath('/zemtown/login'))
    return false
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
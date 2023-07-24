<template>
  <div>
    <Header />
    <div :class="['zemtown-frame', String(route.name).includes('zemtown') ? 'on' : 'off']" v-if="!isLoading">
      <ClientOnly>
        <iframe ref="zemtownRef" :src="zemtownUrl" style="width: 100%; height: 99%;" />
      </ClientOnly>
    </div>
    <slot />
    <Footer v-if="!String(route.name).includes('zemtown')" />
  </div>
</template>
<script setup lang="ts">
const config = useRuntimeConfig()
const route = useRoute()

const fUser = computed(() => useUser().user.value.fUser)
const zemtownUrl = computed(() => fUser.value ? `${config.ZEMTOWN_URL}?token=${fUser.value.accessToken}` : `${config.ZEMTOWN_URL}`)
const isLoading = computed(() => useUser().user.value.isLoading)

</script>

<style scoped lang="scss">
.zemtown-frame {
  position: relative;
  width: 100%;
  min-height: calc(100vh - 215px - 74px) !important;
  top: 74px;
  background-color: #000;
  margin-bottom: 74px;

  &.on {
    display: flex;
    height: calc(100vh - 74px);
  }

  &.off {
    display: none;
  }
}


@media all and (max-width: 479px) {

  .zemtown-frame {
    top: 0px;

    &.on {
      height: 100vh;
    }
  }
}

@media all and (min-width: 480px) and (max-width: 767px) {
  .zemtown-frame {
    top: 0px;

    &.on {
      height: 100vh;
    }
  }
}
</style>
<template>
  <div>
    <Header v-if="!(isMobile && $route.meta.name === 'dm')" />
    <slot />
    <div :class="['zemtown-frame', String($route.name).includes('zemtown') ? 'on' : 'off']">
      <Zemtown />
    </div>
    <Footer v-if="$route.meta.name === 'community-list'" />
  </div>
</template>
<script setup lang="ts">
const isMobile = computed(() => useCommon().common.value.isMobile)

colorLog('default layout', 'yellow')
</script>

<style scoped lang="scss">
$header-height: 70px;
$mobile-nabigation-height: 50px;

.zemtown-frame {
  position: relative;
  width: 100%;
  top: 70px;
  background-color: #000;
  margin-bottom: 74px;

  &.on {
    display: flex;
    height: calc(100vh - #{$header-height});
  }

  &.off {
    // visibility: hidden;
    display: none;
  }
}


@media all and (max-width: 479px) {

  .zemtown-frame {
    top: #{$header-height};

    &.on {
      height: calc(100vh - #{$header-height} - #{$mobile-nabigation-height});
    }
  }
}

@media all and (min-width: 480px) and (max-width: 767px) {
  .zemtown-frame {
    top: #{$header-height};

    &.on {
      height: calc(100vh - #{$header-height} - #{$mobile-nabigation-height});
    }
  }
}
</style>

<template>
  <div class="content">
    <GameHeaderSk v-if="isPending" />
    <GameHeader v-else />
    <slot />
  </div>
</template>

<script setup lang="ts">
import { IGame } from '~~/types'

const { $localePath } = useNuxtApp()
const route = useRoute()

const gameInfo = ref<IGame>()
const isPending = ref(true)

const gamePath = computed(() => route.params.id as string)
const routeQuery = computed(() => route.query.media)

watch(
  () => gameInfo.value,
  (game) => {
    if (game) {
      gameInfo.value = game
      useGame().setGame(game)
      isPending.value = false
    }
  },
  {
    deep: true,
    immediate: true,
  }
)

useCustomAsyncFetch<any>(
  `/launch/game/${gamePath.value}`,
  getZempieFetchOptions('get', true)
)
  .then((res) => {
    const { data, pending, refresh, error } = res
    if (data.value) {
      const { result } = data.value
      gameInfo.value = result.game
      useGame().setGame(gameInfo.value)
      isPending.value = false
    }
  })
  .catch((err) => {
    console.error(err)
  })
</script>

<style lang="scss" scoped>
.tab-menu-swiper {
  .swiper-slide {
    width: 25%;
    display: inline-block;
  }
}

@media all and (max-width: 479px) {
  .tab-menu-swiper {
    .swiper-slide {
      h2 {
        display: none;
      }

      &.active {
        p {
          color: #fff !important;
        }
      }

      &:hover {
        p {
          color: #888;
        }
      }
    }
  }
}

@media all and (min-width: 480px) and (max-width: 767px) {
  .tab-menu-swiper {
    width: 100%;

    .swiper-slide {
      h2 {
        display: none;
      }

      &.active {
        p {
          color: #fff !important;
        }
      }

      &:hover {
        p {
          color: #888;
        }
      }
    }
  }
}

@media all and (min-width: 768px) and (max-width: 991px) {}

@media all and (min-width: 992px) and (max-width: 1199px) {}

@media all and (min-width: 1200px) {}
</style>

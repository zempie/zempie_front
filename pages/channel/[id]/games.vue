<template>
  <NuxtLayout name="user-channel-header">
    <div>

      <dl class="area-title">

        <dt>Games <span>{{ games?.length }}</span></dt>
      </dl>
      <transition name="component-fade" mode="out-in">
        <ul class="card-game">
          <GameCardSk v-if="!isLoadDone" v-for="game in 4" :key="game" />
          <GameCard v-else v-for="game in games" :gameInfo="game" :key="game.id" />
        </ul>
      </transition>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">


const games = computed(() => useChannel().userChannel.value.info?.games)
const isLoadDone = computed(() => useRender().state.value.isDone)


</script>

<style lang="scss" scoped>
.no-result {
  display: flex;
  align-content: center;
  justify-content: center;
  flex-direction: column;
  flex-wrap: wrap;

  h1 {
    color: #333;
    font-size: 18px;
    margin-bottom: 10px;
  }

  img {
    margin: 0 auto
  }

}

.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.3s ease;
}

.component-fade-enter-from,
.component-fade-leave-to {
  opacity: 0;
}
</style>

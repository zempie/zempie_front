<template>
  <NuxtLayout name="user-channel-header">
    <div v-if="games">

      <dl class="area-title">

        <dt>Games <span>{{ games.length }}</span></dt>
        <dd>
          <NuxtLink :to="localePath(`/project/upload`)" v-if="isMine" class="btn-default-samll">
            Add Game <i class="uil uil-plus"></i></NuxtLink>
        </dd>
      </dl>
      <transition name="component-fade" mode="out-in" v-if="games.length">
        <ul class="card-game">
          <GameCardSk v-if="!isLoadDone" v-for="game in 4" :key="game" />
          <GameCard v-else v-for="game in games" :gameInfo="game" :key="game.id" />
        </ul>
      </transition>
      <div class="no-result" v-else>
        <h1>{{ $t('no.game') }}</h1>
        <img src="/images/not-found.png" width="100px" height="100px" />
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useLocalePath } from 'vue-i18n-routing';
const localePath = useLocalePath();

const { t, locale } = useI18n()
const route = useRoute()

const games = computed(() => useChannel().userChannel.value.info?.games)
const isLoadDone = computed(() => useRender().state.value.isDone)


const isMine = computed(() => {
  return route.params.id === useUser().user.value.info?.channel_id
})


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

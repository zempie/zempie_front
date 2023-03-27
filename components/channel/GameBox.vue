<template>
  <div class="ta-game-list">
    <dl>
      <dt>Games</dt>
    </dl>
    <template v-if="games?.length">
      <ul>
        <li v-for="game in games?.slice(0, 5)" @click="$router.push($localePath(`/game/${game.pathname}`))">
          <p :style="`background:url(${game.url_thumb_webp || '/images/default.png'
            }) center; background-size:cover;`"></p>
          <h2 style="text-overflow: ellipsis; overflow: hidden">
            {{ game.title }}
          </h2>
        </li>
      </ul>

      <div v-if="games?.length > 5">
        <NuxtLink :to="$localePath(`/channel/${channelId}/games`)" class="btn-default-samll w100p">{{
          $t('moreView')
        }}
        </NuxtLink>
      </div>
    </template>
    <ul v-else class="no-game">
      <li>{{ $t('no.game') }}</li>
    </ul>
  </div>
</template>
<script setup lang='ts'>
const { $localePath } = useNuxtApp()
const route = useRoute()

const channelId = computed(() => route.params.id as string)
const channelInfo = computed(() => useChannel().userChannel.value.info)
const games = computed(() => channelInfo.value.games)

</script>
<style scoped lang='scss'>
.no-game {
  padding-bottom: 20px;
}
</style>

<template>
  <template v-if="isLoading">
    <!-- <div class="ta-game-sk-list">
      <dl>
        <dt>{{ $t('games') }}</dt>
      </dl>
      <ul>
        <li class="pb20">
          <p style="width:100%" class="grey-text  skeleton-animation"></p>
          <h2 style="width:100%" class="grey-text mt10 skeleton-animation "></h2>
        </li>
      </ul>
    </div> -->
  </template>
  <ClientOnly v-else>
    <div class="ta-game-list">
      <dl>
        <dt>{{ $t('games') }}</dt>
      </dl>
      <template v-if="games && games.length">
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
          <NuxtLink :to="$localePath(`/${userId}/games`)" class="btn-default-samll w100p">{{
            $t('moreView')
          }}
          </NuxtLink>
        </div>
      </template>
      <ul v-else class="no-game pb20">
        <li>{{ $t('no.game') }}</li>
      </ul>
    </div>
  </ClientOnly>
</template>
<script setup lang="ts">
const { $localePath } = useNuxtApp()
const route = useRoute()

const userId = computed(() => route.params.id as string)
const channelInfo = computed(() => useChannel().userChannel.value.info)
const games = computed(() => channelInfo.value.games)

defineProps({
  isLoading: {
    type: Boolean,
    default: false
  }
})

</script>
<style scoped lang="scss">
.ta-game-sk-list {
  width: 100%;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0px 10px 50px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;

  dl {
    padding: 15px 20px;
    border-bottom: #e9e9e9 1px solid;

    dt {
      font-weight: 600;
      font-size: 18px;
      line-height: 18px;
      color: #333;
    }


  }

  p {
    height: 80px;

  }

  ul {
    padding: 5px 20px 0 20px;

    li {
      margin-top: 10px;
    }
  }

}
</style>

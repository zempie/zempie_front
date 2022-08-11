<template>
  <div class="content">
    <ClientOnly>
      <!-- <GameHeaderSk v-if="isPending" /> -->
      <GameHeader :gameInfo="gameInfo" />
      <!-- <GameHeader v-else :gameInfo="gameInfo" /> -->
      <div class="tab-menu-swiper">
        <div class="swiper-area">
          <NuxtLink :class="['swiper-slide', !routeQuery ? 'active' : '']
          " :to="localePath(`/game/${gamePath}`)">
            <p><i class="uil uil-clock-three"></i></p>
            <h2>{{ $t('timeline') }}(ALL)</h2>
          </NuxtLink>
          <NuxtLink :class="[routeQuery === 'sns' ? 'active' : '', 'swiper-slide']"
            :to="localePath(`/game/${gamePath}`) + '?media=sns'">
            <p><i class="uil uil-comment-dots"></i></p>
            <h2>SNS</h2>
          </NuxtLink>
          <NuxtLink :class="[routeQuery === 'blog' ? 'active' : '', 'swiper-slide']"
            :to="localePath(`/game/${gamePath}`) + '?media=blog'">
            <p><i class="uil uil-edit"></i></p>
            <h2>{{ $t('blog') }}</h2>
          </NuxtLink>

          <NuxtLink :class="[routeQuery === 'img' ? 'active' : '', 'swiper-slide']"
            :to="localePath(`/game/${gamePath}`) + '?media=img'">
            <p><i class="uil uil-image-edit"></i></p>
            <h2>{{ $t('image') }}</h2>
          </NuxtLink>

          <NuxtLink :class="[routeQuery === 'video' ? 'active' : '', 'swiper-slide']"
            :to="localePath(`/game/${gamePath}`) + '?media=video'">
            <p><i class="uil uil-play-circle"></i></p>
            <h2>{{ $t('video') }}</h2>
          </NuxtLink>

          <NuxtLink :class="[routeQuery === 'audio' ? 'active' : '', 'swiper-slide']"
            :to="localePath(`/game/${gamePath}`) + '?media=audio'">
            <p><i class="uil uil-music"></i></p>
            <h2>{{ $t('audio') }}</h2>
          </NuxtLink>
        </div>
      </div>
    </ClientOnly>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { IGame } from '~~/types'
import { useLocalePath } from 'vue-i18n-routing';

const localePath = useLocalePath();
const route = useRoute();

const gameInfo = ref({} as IGame)

const gamePath = computed(() => route.params.id as string)
const routeQuery = computed(() => route.query.media)
const isPending = ref(true)


const { data, pending } = await game.getInfo(gamePath.value)

onMounted(async () => {
  if (data.value) {
    const { result } = data.value;
    gameInfo.value = result.game
    useGame().setGame(gameInfo.value);
    isPending.value = pending.value
    await getUserInfo()
  }
})

async function getUserInfo() {
  const { data, pending } = await user.getUserInfo(gameInfo.value.user.channel_id)
  const { result } = data.value;
  useChannel().setUserChannel(result.target)
}


</script>

<style lang="scss" scoped>
.swiper-slide {
  display: inline-block
}
</style>

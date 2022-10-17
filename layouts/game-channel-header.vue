<template>
  <div class="content">
    <GameHeaderSk v-if="isPending" />
    <GameHeader v-else :gameInfo="gameInfo" />
    <div class="tab-menu-swiper">
      <div class="swiper-area">
        <NuxtLink
          :class="['swiper-slide', !routeQuery ? 'active' : '']"
          :to="$localePath(`/game/${gamePath}`)"
        >
          <p><i class="uil uil-clock-three"></i></p>
          <h2>{{ $t('timeline') }}(ALL)</h2>
        </NuxtLink>
        <NuxtLink
          :class="['swiper-slide', routeQuery === 'sns' ? 'active' : '']"
          :to="$localePath(`/game/${gamePath}`) + '?media=sns'"
        >
          <p><i class="uil uil-comment-dots"></i></p>
          <h2>SNS</h2>
        </NuxtLink>
        <NuxtLink
          :class="['swiper-slide', routeQuery === 'blog' ? 'active' : '']"
          :to="$localePath(`/game/${gamePath}`) + '?media=blog'"
        >
          <p><i class="uil uil-edit"></i></p>
          <h2>{{ $t('blog') }}</h2>
        </NuxtLink>

        <NuxtLink
          :class="['swiper-slide', routeQuery === 'image' ? 'active' : '']"
          :to="$localePath(`/game/${gamePath}`) + '?media=image'"
        >
          <p><i class="uil uil-image-edit"></i></p>
          <h2>{{ $t('image') }}</h2>
        </NuxtLink>

        <NuxtLink
          :class="['swiper-slide', routeQuery === 'video' ? 'active' : '']"
          :to="$localePath(`/game/${gamePath}`) + '?media=video'"
        >
          <p><i class="uil uil-play-circle"></i></p>
          <h2>{{ $t('video') }}</h2>
        </NuxtLink>

        <NuxtLink
          :class="['swiper-slide', routeQuery === 'sound' ? 'active' : '']"
          :to="$localePath(`/game/${gamePath}`) + '?media=sound'"
        >
          <p><i class="uil uil-music"></i></p>
          <h2>{{ $t('audio') }}</h2>
        </NuxtLink>
      </div>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { IGame } from '~~/types'
const { $localePath } = useNuxtApp()
const route = useRoute()

const gameInfo = ref<IGame>()

const gamePath = computed(() => route.params.id as string)
const routeQuery = computed(() => route.query.media)
const isPending = ref(true)

const { data, pending } = await useCustomFetch<any>(
  `/launch/game/${gamePath.value}`,
  getZempieFetchOptions('get', false)
)

onMounted(async () => {
  if (data.value) {
    const { result } = data.value
    gameInfo.value = result.game
    useGame().setGame(gameInfo.value)
    // await getUserInfo()
    isPending.value = false
  }
})

async function getUserInfo() {
  if (gameInfo.value.user) {
    const { data, pending } = await user.getUserInfo(
      gameInfo.value.user.channel_id
    )
    const { result } = data.value
    useChannel().setUserChannel(result.target)
  } else {
    gameInfo.value['user'] = {
      name: '탈퇴한 회원입니다.',
      id: -1,
      channel_id: '',
      email: '',
      uid: '',
    }
  }
}
</script>

<style lang="scss" scoped>
.tab-menu-swiper {
  .swiper-slide {
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

@media all and (min-width: 768px) and (max-width: 991px) {
}

@media all and (min-width: 992px) and (max-width: 1199px) {
}

@media all and (min-width: 1200px) {
}
</style>

<template>
  <NuxtLayout name="my-channel-header">
    <div v-if="games">
      <dl class="area-title" style="margin-top: 12.5px">
        <dt>
          Games <span>{{ games.length }}</span>
        </dt>
        <dd>
          <NuxtLink
            :to="localePath(`/project/upload`)"
            v-if="isMine"
            class="btn-default-samll"
          >
            Add Game <i class="uil uil-plus"></i
          ></NuxtLink>
        </dd>
      </dl>
      <transition name="component-fade" mode="out-in" v-if="games.length">
        <ul class="card-game">
          <GameCardSk v-if="!isLoadDone" v-for="game in 4" :key="game" />
          <GameCard
            v-else
            v-for="game in games"
            :gameInfo="game"
            :key="game.id"
          />
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
import { useI18n } from 'vue-i18n'
import { useLocalePath } from 'vue-i18n-routing'

const localePath = useLocalePath()
const config = useRuntimeConfig()

const { t, locale } = useI18n()
const route = useRoute()

const userInfo = computed(() => useChannel().userChannel.value.info)

definePageMeta({
  title: 'user-game',
  name: 'userGame',
})

watch(userInfo.value, async () => {
  useHead({
    title: `${userInfo.value.name}${t('seo.channel.games.title')} | Zempie`,
    link: [
      {
        rel: 'alternate',
        href: `${config.ZEMPIE_URL}${route.fullPath}`,
        hreflang: locale,
      },
      {
        rel: 'canonical',
        href: `${config.ZEMPIE_URL}${route.fullPath}`,
      },
    ],
    meta: [
      {
        property: 'og:url',
        content: `${config.ZEMPIE_URL}${route.fullPath}`,
      },
      {
        property: 'og:site_name',
        content: 'Zempie',
      },
      {
        name: 'og:type',
        content: 'website',
      },
      {
        name: 'robots',
        content: 'index, follow',
      },
      {
        name: 'description',
        content: `${userInfo.value.name}${t('seo.channel.games.desc')}`,
      },
      {
        property: 'og:title',
        content: `${userInfo.value.name}${t('seo.channel.games.title')}`,
      },
      {
        property: 'og:description',
        content: `${userInfo.value.name}${t('seo.channel.games.description')}`,
      },
      {
        property: 'og:url',
        content: `${config.ZEMPIE_URL}${route.path}`,
      },
    ],
  })
})

const games = computed(() => useChannel().userChannel.value.info?.games)

const isLoadDone = computed(() => useRender().state.value.isDone)

const channelId = computed(() => route.params.id as string)

const isMine = computed(() => {
  return route.params.id === useUser().user.value.info?.channel_id
})

await useChannel().getChannelInfo(channelId.value)
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
    margin: 0 auto;
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

@media all and (max-width: 479px) {
  .area-title {
    width: 100%;
    padding: 15px 0;
  }
}

@media all and (min-width: 480px) and (max-width: 767px) {
  .area-title,
  .card-game {
    width: 100%;
  }
}

@media all and (min-width: 768px) and (max-width: 991px) {
}

@media all and (min-width: 992px) and (max-width: 1199px) {
}

@media all and (min-width: 1200px) {
}
</style>

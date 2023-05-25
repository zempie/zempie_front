<template>
  <NuxtLayout name="channel-header">
    <div>
      <dl class="area-title" style="margin-top: 12.5px">
        <dt>
          Games <span>{{ games?.length }}</span>
        </dt>
        <dd>
          <NuxtLink :to="$localePath(`/project/upload`)" v-if="isMine" class="btn-default-samll">
            Add Game <i class="uil uil-plus"></i></NuxtLink>
        </dd>
      </dl>
      <transition name="component-fade" mode="out-in">
        <ul class="card-game">
          <!-- <GameCardSk v-if="!isLoadDone" v-for="game in 4" :key="game" /> -->
          <ClientOnly>
            <GameCard v-for="game in games" :gameInfo="game" :key="game.id" />
          </ClientOnly>
        </ul>
      </transition>
      <div class="no-result" v-if="isLoadDone && !games?.length">
        <h1>{{ $t('no.game') }}</h1>
        <img src="/images/not-found.png" width="100px" height="100px" alt="no result" />
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import shared from '~~/scripts/shared';
import { IUserChannel } from '~~/types';

const { t } = useI18n()
const route = useRoute()
const { $localePath } = useNuxtApp()

definePageMeta({
  title: 'user-game',
  name: 'userGame',
})

const games = computed(() => useChannel().userChannel.value.info?.games)
const isLoadDone = computed(() => useRender().state.value.isDone)
const userId = computed(() => route.params.id as string)
const isMine = computed(() => {
  return route.params.id === useUser().user.value.info?.channel_id
})


/**
 * seo 반영은 함수안에서 되지 않으므로 최상단에서 진행함
 */
const { data } = await useAsyncData<{ result: { target: IUserChannel } }>('channelInfo', () =>
  $fetch(`/user/${userId.value}`, getZempieFetchOptions('get', true)),
  {
    initialCache: false
  }
)
const { target: channelInfo } = data.value?.result;
const [firstGame] = channelInfo.games

shared.createHeadMeta(`${channelInfo.name}${t('seo.channel.games.title')}`, `${channelInfo.name}${t('seo.channel.games.desc')}`, channelInfo.picture ?? firstGame?.url_thumb)

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

@media all and (min-width: 768px) and (max-width: 991px) {}

@media all and (min-width: 992px) and (max-width: 1199px) {}

@media all and (min-width: 1200px) {}
</style>

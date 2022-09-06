<template>
  <NuxtLayout name="my-channel-header">
    <ClientOnly>
      <dl class="three-area">
        <dt v-if="isPending">
          <div class="ta-game-list">
            <dl>
              <dt>Games</dt>
            </dl>
            <ul v-for="game in 4">
              <li>
                <p style="background-color: #d5d5d5"></p>
                <h2
                  class="grey-text"
                  style="
                    text-overflow: ellipsis;
                    overflow: hidden;
                    margin: 15px 0 10px 0;
                  "
                ></h2>
              </li>
            </ul>
            <div></div>
          </div>
        </dt>
        <dt v-else-if="channelInfo">
          <div class="ta-myinfo" style="margin-bottom: 20px">
            <UserAvatar :user="channelInfo" :tag="'p'"></UserAvatar>
            <h2>{{ channelInfo.name }}</h2>
            <ul>
              <li>
                <NuxtLink :to="localePath(`/channel/${channelId}`)">
                  <p style="background: #feb100; cursor: pointer">
                    <i class="uil uil-comment-chart-line"></i>
                  </p>
                  <h2>{{ channelInfo.post_cnt }}</h2>
                  <h3>Posts</h3>
                </NuxtLink>
              </li>
              <li>
                <NuxtLink :to="localePath(`/channel/${channelId}/followers`)">
                  <p style="background: #33e4ce; cursor: pointer">
                    <i class="uil uil-users-alt"></i>
                  </p>
                  <h2>{{ channelInfo.follower_cnt }}</h2>
                  <h3>Followers</h3>
                </NuxtLink>
              </li>
              <li>
                <NuxtLink :to="localePath(`/channel/${channelId}/following`)">
                  <p style="background: #5d5ffe; cursor: pointer">
                    <i class="uil uil-user-plus"></i>
                  </p>
                  <h2>{{ channelInfo.following_cnt }}</h2>
                  <h3>following</h3>
                </NuxtLink>
              </li>
            </ul>
          </div>
          <div class="ta-game-list">
            <dl>
              <dt>Games</dt>
            </dl>
            <template v-if="games?.length">
              <ul>
                <li
                  v-for="game in games?.slice(0, 5)"
                  @click="$router.push(localePath(`/game/${game.pathname}`))"
                >
                  <p
                    :style="`background:url(${
                      game.url_thumb_webp || '/images/default.png'
                    }) center; background-size:cover;`"
                  ></p>
                  <h2 style="text-overflow: ellipsis; overflow: hidden">
                    {{ game.title }}
                  </h2>
                </li>
              </ul>

              <div v-if="games?.length > 5">
                <NuxtLink
                  :to="localePath(`/channel/${channelId}/games`)"
                  class="btn-default-samll w100p"
                  >{{ $t('moreView') }}
                </NuxtLink>
              </div>
            </template>
            <ul v-else class="no-game">
              <li>{{ $t('no.game') }}</li>
            </ul>
          </div>
        </dt>

        <dd>
          <TimelineSk v-if="isPending" />
          <ClientOnly v-else>
            <PostTimeline type="user" :isMine="isMine" :key="channelId" />
          </ClientOnly>
        </dd>
        <dt>
          <div class="ta-groups" style="margin-top: 0px">
            <h2>Community</h2>
            <div v-if="isPending">
              <dl v-for="group in 4">
                <CommunityListItemSk />
              </dl>
            </div>
            <CommunityList v-else :communities="channelInfo?.communities" />
          </div>
        </dt>
      </dl>
    </ClientOnly>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useLocalePath } from 'vue-i18n-routing'
import { useI18n } from 'vue-i18n'

const config = useRuntimeConfig()
const nuxt = useNuxtApp()

const { t, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const isPending = ref(true)
const channelInfo = computed(() => useChannel().userChannel.value.info)
const games = computed(() => channelInfo.value.games)
const channelId = computed(() => route.params.id as string)
const isMine = computed(() => {
  return channelId.value === useUser().user.value.info?.channel_id
})

nuxt.hook('page:finish', () => {
  isPending.value = false
})
watch(
  () => channelInfo.value,
  (info) => {
    useHead({
      title: `${info.name}${t('seo.channel.title')} | Zempie`,
      meta: [
        {
          name: 'description',
          content: `${info.name}${t('seo.channel.desc')}`,
        },
        {
          name: 'og:title',
          content: `${info.name}${t('seo.channel.title')}`,
        },
        {
          name: 'og:description',
          content: `${info.name}${t('seo.channel.desc')}`,
        },
        {
          name: 'og:url',
          content: `${config.ZEMPIE_URL}${route.path}`,
        },
        {
          name: 'og:image',
          content: `${info.picture}`,
        },
      ],
    })
  }
)

definePageMeta({
  title: 'user-channel',
  name: 'userChannel',
})
</script>

<style lang="scss" scoped>
.swiper-slide {
  display: inline-block;
}

.no-game {
  height: 60px;
  padding: 20px 20px 0 20px;

  li {
    margin-top: 0px;
  }
}

.ta-game-list {
  display: block;
  width: 100%;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0px 10px 50px rgba(0, 0, 0, 0.1);
}

@media all and (max-width: 479px) {
  .ta-game-list {
    display: none;
  }
}

@media all and (min-width: 480px) and (max-width: 767px) {
  .ta-game-list {
    display: none;
  }

  .area-title,
  .card-game {
    width: 100%;
  }
}

@media all and (min-width: 768px) and (max-width: 991px) {
  .ta-game-list {
    display: none;
  }
}

@media all and (min-width: 992px) and (max-width: 1199px) {
}

@media all and (min-width: 1200px) {
}
</style>

<template>
  <NuxtLayout name="my-timeline">
    <dl class="three-area">
      <dt v-if="isChannelLoading">
        <UserInfoCard />
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
          <TimelineSk v-if="isPending" />
          <div></div>
        </div>
      </dt>

      <dt v-else>
        <div class="ta-myinfo" :key="userInfo?.id">
          <UserAvatar :user="userInfo" :tag="'p'"></UserAvatar>
          <h1>{{ useUser().user.value.info?.name }}</h1>
          <ul>
            <li>
              <NuxtLink
                :to="
                  $localePath(
                    `/channel/${useUser().user.value.info?.channel_id}`
                  )
                "
              >
                <p style="background: #feb100; cursor: pointer">
                  <i class="uil uil-comment-chart-line"></i>
                </p>
                <h2>{{ channelInfo?.post_cnt }}</h2>
                <h3>Posts</h3>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :to="
                  $localePath(`/channel/${channelInfo?.channel_id}/followers`)
                "
              >
                <p style="background: #33e4ce; cursor: pointer">
                  <i class="uil uil-users-alt"></i>
                </p>
                <h2>{{ userInfo?.follower_cnt }}</h2>
                <h3>Followers</h3>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :to="
                  $localePath(`/channel/${channelInfo?.channel_id}/following`)
                "
              >
                <p style="background: #5d5ffe; cursor: pointer">
                  <i class="uil uil-user-plus"></i>
                </p>
                <h2>{{ userInfo?.following_cnt }}</h2>
                <h3>following</h3>
              </NuxtLink>
            </li>
          </ul>
        </div>
        <div class="ta-game-list" :key="userInfo?.id">
          <dl>
            <dt>Games</dt>
          </dl>

          <ul v-if="channelInfo?.games?.length">
            <li
              v-for="game in channelInfo?.games?.slice(0, 5)"
              @click="$router.push($localePath(`/game/${game.pathname}`))"
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
          <ul v-else class="no-game">
            <li>{{ $t('no.game') }}</li>
          </ul>
          <div v-if="channelInfo?.games?.length > 5">
            <NuxtLink
              :to="$localePath(`/channel/${userInfo?.channel_id}/games`)"
              class="btn-default-samll w100p"
              >{{ $t('moreView') }}
            </NuxtLink>
          </div>
        </div>
      </dt>

      <dd>
        <PostTimeline type="userAll" :isMine="true" />
      </dd>
      <dt>
        <div class="ta-groups" style="margin-top: 0px">
          <h2>Community</h2>
          <div v-if="isChannelLoading">
            <dl v-for="group in 4">
              <CommunityListItemSk />
            </dl>
          </div>
          <CommunityList v-else :communities="channelInfo?.communities" />
        </div>
      </dt>
    </dl>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { $localePath } = useNuxtApp()
const config = useRuntimeConfig()

const { t, locale } = useI18n()
const route = useRoute()
const isPending = ref(true)

const games = ref()

const userInfo = computed(() => useUser().user.value.info as any)
const channelInfo = computed(() => useChannel().userChannel.value.info)
const isChannelLoading = computed(
  () => useChannel().userChannel.value.isLoading
)

watch(
  () => userInfo.value,
  async (info) => {
    if (info?.id) {
      await useChannel().getChannelInfo(info.channel_id)
      games.value = info.games
      createHead(info)
    }
  }
)

function createHead(info) {
  useHead({
    title: `${info.name}${t('seo.channel.title')} | Zempie`,

    link: [
      {
        rel: 'alternate',
        href: `${config.ZEMPIE_URL}${route.fullPath}`,
        hreflang: locale,
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
        content: `${info.name}${t('seo.channel.desc')}`,
      },
      {
        property: 'og:title',
        content: `${info.name}${t('seo.channel.title')}`,
      },
      {
        property: 'og:description',
        content: `${info.name}${t('seo.channel.desc')}`,
      },
      {
        property: 'og:url',
        content: `${config.ZEMPIE_URL}${route.path}`,
      },
      {
        name: 'og:image',
        content: `${info.picture}`,
      },
    ],
  })
}

onMounted(() => {
  games.value = channelInfo.value?.games
  isPending.value = false
  if (userInfo.value) createHead(userInfo.value)
})
</script>

<style lang="scss" scoped>
.ta-myinfo {
  margin-bottom: 20px;
}
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
  .ta-myinfo {
    margin-bottom: 0px;
  }
  .ta-game-list {
    display: none;
  }
}

@media all and (min-width: 480px) and (max-width: 767px) {
  .ta-myinfo {
    margin-bottom: 0px;
  }
  .ta-game-list {
    display: none;
  }

  .area-title,
  .card-game {
    width: 100%;
  }
}

@media all and (min-width: 768px) and (max-width: 991px) {
  .ta-myinfo {
    margin-bottom: 0px;
  }
  .ta-game-list {
    display: none;
  }
}

@media all and (min-width: 992px) and (max-width: 1199px) {
}

@media all and (min-width: 1200px) {
}
</style>

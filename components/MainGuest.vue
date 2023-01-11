<template>
  <div class="main-bg">
    <div class="main-copy">
      <h1>
        <img
          src="/images/main_copy.svg"
          width="500"
          alt="zempie"
          title="zempie"
        />
      </h1>
    </div>

    <!-- GJ plus event -->
    <!-- <div class="main-visual game-jam-plus" >
      <h2>
        <span style="font: 36px/46px 'Jalnan'">Event</span>
      </h2>

      <div class="info" style="text-align:center; color:#fff;margin-top:30px">
        <img src="/images/gj_whit_text_logo.png" width="300" style="display: block; margin: 0 auto 30px auto"/>
        <span class="year" style="font-size:30px; margin-top:30px; font-weight: bold;">
          2022/2023</span><span style="font-size:30px; margin-top:30px; font-weight: bold;"> {{$t('game.jam.plus.title')}}</span>
        <div style="font-size:20px; margin-top:16px;"><strong>{{$t('game.jam.plus.plan')}} : </strong> <span>{{$t('game.jam.plus.date')}}</span></div>
        <p style="font-size:20px; margin-top:16px;margin-bottom: 30px;">{{$t('game.jam.plus.info')}}</p>
        <NuxtLink :to="$localePath('/game-jam-plus')" class="detail-button"> {{$t('details')}} </NuxtLink>
      </div>
    </div> -->
    <!-- GJ plus event -->
    <div class="main-visual">
      <h2>
        <span style="font: 36px/46px 'Jalnan'">Recent games</span>
      </h2>

      <ul style="margin: 40px 0px">
        <span class="card-game">
          <GameCardSk v-if="pending" v-for="game in GAME_COUNT" />
          <GameCard
            v-else
            v-for="game in data?.result.games"
            :gameInfo="game"
            :key="game.id"
          />
        </span>
      </ul>
    </div>
    <div class="main-visual">
      <h2><span style="font: 36px/46px 'Jalnan'">Communities</span></h2>

      <div class="card-timeline">
        <CommunityCardSk v-if="cPending" v-for="commi in COMMUNITY_COUNT" />
        <CommunityCard
          v-else
          v-for="community in communities"
          :community="community"
          :key="community.id"
        />
      </div>
    </div>

    <div v-if="pPending">
      <ul style="margin-top: 40px" class="post-container">
        <li class="thumbmail skeleton" v-for="post in POST_COUNT"></li>
      </ul>
    </div>
    <div v-else class="main-visual">
      <h2><span style="font: 36px/46px 'Jalnan'">Recent posts</span></h2>

      <ul style="margin-top: 40px" class="post-container">
        <li
          class="thumbmail"
          v-for="post in posts?.result"
          :key="post.id"
          @click="$router.push($localePath(`/feed/${post?.id}`))"
        >
          <img :src="post.attatchment_files[0]?.url" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

const { $localePath } = useNuxtApp()

const nuxt = useNuxtApp()
const { t, locale } = useI18n()
const config = useRuntimeConfig()
const route = useRoute()
const router = useRouter()

useHead({
  title: `${t('seo.landing.title')} | Zempie`,
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
      property: 'og:image',
      content: `${config.OG_IMG}`,
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      hid: 'twitter:title',
      name: 'twitter:title',
      content: `${t('seo.landing.title')}`,
    },
    {
      hid: 'twitter:url',
      name: 'twitter:url',
      content: `${config.ZEMPIE_URL}${route.path}`,
    },
    {
      hid: 'twitter:description',
      name: 'twitter:description',
      content: `${t('seo.landing.description')}`,
    },
    {
      hid: 'twitter:image',
      name: 'twitter:image',
      content: '/images/sns-thumbnail.png',
    },
  ],
})

const GAME_COUNT = 8
const COMMUNITY_COUNT = 4
const POST_COUNT = 12


const { data, pending, error } = await useCustomAsyncFetch<any>(
    createQueryUrl('/games', { limit: GAME_COUNT }),
    getZempieFetchOptions('get', false)
)

const {
  data: communities,
  pending: cPending,
  error: cError,
} = await useCustomAsyncFetch<any>(
    createQueryUrl('/community/list', { limit: COMMUNITY_COUNT }),
    getComFetchOptions('get', false)
)

const {
  data: posts,
  pending: pPending,
  error: pError,
} = await useCustomAsyncFetch<any>(
    createQueryUrl('/timeline/posts/img', { limit: POST_COUNT }),
    getComFetchOptions('get', false)
)

</script>

<style scoped lang="scss">
.detail-button{

      display: inline-block;
      padding: 20px 30px;
      font-size: 20px;
      line-height: 16px;
      color: #fff;
      border: #fff 1px solid;
      border-radius: 10px;
      width: 300px;
      text-align: center;
      margin-bottom:30px;

      &:hover {
        color: #fff;
        border: #d64dd8 1px solid;
        background: #d64dd8;
      }

}
.mv-animal02 {
  z-index: 998 !important;
}

.mv-play {
  top: 0px;
}

.main-bg {
  background: url('/images/main_bg01_fixed.png') center 70px no-repeat;
  background-size: cover;
  padding-bottom: 100px;
}

.main-visual  {
  h3{
    background: none !important;
    height: auto !important;
  }
  .game-jam-plus{

  }

}

</style>

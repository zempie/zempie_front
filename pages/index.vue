<template>
  <div class="main-bg">
    <div class="main-copy">
      <p>
        <img src="/images/main_copy.svg" width="500" alt="" title="" />
      </p>
    </div>

    <div class="main-visual">
      <h2>
        <span style="font: 36px/46px 'Jalnan'">Recent games</span>
      </h2>

      <ul style="margin: 40px 0px">
        <span class="card-game">
          <!-- <GameCardSk v-if="pending" v-for="game in GAME_COUNT" :key="game" /> -->
          <GameCard
            v-for="game in data.result?.games"
            :gameInfo="game"
            :key="game.id"
          />
        </span>
      </ul>
    </div>
    <!-- <div class="main-upload">
        <p></p>
      </div> -->

    <div class="main-visual">
      <h2><span style="font: 36px/46px 'Jalnan'">Communities</span></h2>

      <div class="card-timeline" v-if="communities.length">
        <!-- <CommunityCardSk v-show="cPending" v-for="commi in COMMUNITY_COUNT" /> -->
        <CommunityCard
          v-for="community in communities"
          :community="community"
          :key="community.id"
        />
      </div>
    </div>

    <div class="main-visual" v-if="postData">
      <h2><span style="font: 36px/46px 'Jalnan'">Recent posts</span></h2>

      <!-- <ul v-if="postPending" style="margin-top: 40px" class="post-container">
        <li class="thumbmail skeleton" v-for="post in POST_COUNT"></li>
      </ul> -->

      <ul
        style="margin-top: 40px"
        class="post-container"
        v-if="postData.result?.length"
      >
        <li
          class="thumbmail"
          v-for="post in postData.result"
          @click="$router.push(localePath(`/feed/${post.id}`))"
        >
          <img :src="post.attatchment_files[0]?.url" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { useLocalePath } from 'vue-i18n-routing'

const { t, locale } = useI18n()
const config = useRuntimeConfig()
const route = useRoute()
const localePath = useLocalePath()

definePageMeta({
  layout: 'default',
})

useHead({
  title: `${t('seo.landing.title')} | Zempie`,
  meta: [
    {
      name: 'description',
      content: `${t('seo.landing.desc')}`,
    },
    {
      name: 'og:title',
      content: `${t('seo.landing.title')}`,
    },
    {
      name: 'og:description',
      content: `${t('seo.landing.description')}`,
    },
    {
      name: 'og:url',
      content: `${config.ZEMPIE_URL}${route.path}`,
    },
    {
      name: 'og:image',
      content: '/images/sns-thumbnail.png',
    },
    {
      name: 'og:type',
      content: 'website',
    },
  ],
})
const GAME_COUNT = 8
const COMMUNITY_COUNT = 4
const POST_COUNT = 8

const { data, pending, error } = await game.list({
  limit: GAME_COUNT,
  offset: 0,
})

if (!data.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
}
const {
  data: communities,
  pending: cPending,
  error: cError,
} = await community.list({ limit: COMMUNITY_COUNT })

const {
  data: postData,
  pending: postPending,
  error: postError,
} = await useFetch<any>(
  createQueryUrl('/timeline/posts/img', { limit: 12 }),
  getComFetchOptions('get', false)
)
</script>

<style scoped lang="scss">
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

.main-visual > h3 {
  background: none !important;
  height: auto !important;
}

.post-container {
  display: flex;
  flex-wrap: wrap;
  width: 1225px;
  margin: auto;
  justify-content: center;

  .thumbmail {
    box-shadow: 0px 10px 50px rgb(0 0 0 / 10%);
    padding: 20px;
    border-radius: 10px;

    &.skeleton {
      background-color: #ededed;
    }

    height: 240px;
    margin: 3px;
    width: 24%;
    transition: all 0.4s ease-in-out;

    img {
      width: 100%;
      height: 100%;
      cursor: pointer;
      border-radius: 10px;
    }
  }
}

.card-timeline {
  margin: 40px 0px;
}

@media all and (max-width: 479px) {
  .main-visual {
    width: 100%;

    .card-timeline {
      width: 40px auto;
      width: 100%;
    }

    .card-game {
      margin: 0 auto;
    }
  }

  .post-container {
    width: 100%;
    margin: 0 auto;

    .thumbmail {
      width: 48%;
      margin: 1%;
    }
  }
}

@media all and (min-width: 480px) and (max-width: 767px) {
  .post-container {
    width: 470px;

    .thumbmail {
      width: 48%;
      margin: 1%;
    }
  }
}

@media all and (min-width: 768px) and (max-width: 991px) {
  .post-container {
    width: 770px;

    .thumbmail {
      width: 31.333%;
      margin: 1%;
    }
  }
}

@media all and (min-width: 992px) and (max-width: 1199px) {
  .post-container {
    width: 993px;

    .thumbmail {
      width: 31.333%;
      margin: 1%;
    }
  }
}
</style>

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

    <div class="main-visual">
      <h2>
        <span style="font: 36px/46px 'Jalnan'">Recent games</span>
      </h2>

      <ul style="margin: 40px 0px">
        <span class="card-game">
          <GameCardSk v-if="isPending" v-for="game in GAME_COUNT" />
          <GameCard
            v-for="game in data.result.games"
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

      <div class="card-timeline">
        <CommunityCardSk v-if="isPending" v-for="commi in COMMUNITY_COUNT" />
        <CommunityCard
          v-else
          v-for="community in communities"
          :community="community"
          :key="community.id"
        />
      </div>
    </div>

    <div v-if="isPending">
      <ul style="margin-top: 40px" class="post-container">
        <li class="thumbmail skeleton" v-for="post in POST_COUNT"></li>
      </ul>
    </div>
    <div v-else class="main-visual">
      <h2><span style="font: 36px/46px 'Jalnan'">Recent posts</span></h2>

      <ul style="margin-top: 40px" class="post-container">
        <li
          class="thumbmail"
          v-for="post in posts.result"
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

const isPending = ref(true)

nuxt.hook('page:finish', () => {
  isPending.value = false
})

// definePageMeta({
//   layout: 'default',
// })

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
      hid: 'og:url',
      property: 'og:url',
      content: `${config.ZEMPIE_URL}${route.path}`,
    },
    {
      hid: 'og:image',
      property: 'og:image',
      content: '/images/sns-thumbnail.png',
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

const { data, pending, error } = await useAsyncData<any>('games', () =>
  $fetch(
    createQueryUrl('/games', { limit: GAME_COUNT }),
    getZempieFetchOptions('get', false)
  )
)

const {
  data: communities,
  pending: cPending,
  error: cError,
} = await useAsyncData<any>('community', () =>
  $fetch(
    createQueryUrl('/community/list', { limit: COMMUNITY_COUNT }),
    getComFetchOptions('get', false)
  )
)

const {
  data: posts,
  pending: pPending,
  error: pError,
} = await useAsyncData<any>('posts', () =>
  $fetch(
    createQueryUrl('/timeline/posts/img', { limit: POST_COUNT }),
    getComFetchOptions('get', false)
  )
)

// onBeforeMount(() => {
//   if (useCookie(config.COOKIE_NAME).value) {
//     router.push($localePath('/timeline'))
//   }
// })
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
      object-fit: cover;
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

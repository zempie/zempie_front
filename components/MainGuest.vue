<template>
  <!-- <div style="width:100vw; height:70vh;">
    <div style="min-height: 300px; background-color: blue;"></div>
    <input v-model="test1" style="position: absolute; bottom: 100px; background-color: red; height: 100px;" type="number">
    <input v-model="test" style="position: absolute; bottom: 300px; background-color: red; height: 100px;" type="number">

  </div> -->
  <div class="main-bg">
    <div class="main-copy">
      <h1>
        <img src="/images/main_copy.png" width="500" alt="zempie" title="zempie" />
      </h1>
    </div>
    <div class="main-visual">
      <h2>
        <span>Recent games </span>
      </h2>
      <ul style="margin: 40px 0px">
        <span class="card-game">
          <GameCardSk v-if="pending" v-for="game in GAME_COUNT" />
          <GameCard v-else v-for="game in data?.result.games" :gameInfo="game" :key="game.id" />
        </span>
      </ul>
    </div>
    <div class="main-visual">
      <h2><span>Communities</span></h2>

      <div class="card-timeline">
        <CommunityCardSk v-if="cPending" v-for="commi in COMMUNITY_COUNT" />
        <CommunityCard v-else v-for="community in communities" :community="community" :key="community.id" />
      </div>
    </div>

    <div v-if="pPending">
      <ul style="margin-top: 40px" class="post-container">
        <li class="thumbmail skeleton" v-for="post in POST_COUNT"></li>
      </ul>
    </div>
    <div v-else class="main-visual">
      <h2><span>Recent posts</span></h2>

      <ul style="margin-top: 40px" class="post-container">
        <li class="thumbmail" v-for="post in posts?.result" :key="post.id"
          @click="$router.push($localePath(`/feed/${post?.id}`))">
          <img :src="post.attatchment_files[0]?.url" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { $localePath } = useNuxtApp()

const GAME_COUNT = 8
const COMMUNITY_COUNT = 4
const POST_COUNT = 12
const test1 = ref()
const test = ref()

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
.detail-button {

  display: inline-block;
  padding: 20px 30px;
  font-size: 20px;
  line-height: 16px;
  color: #fff;
  border: #fff 1px solid;
  border-radius: 10px;
  width: 300px;
  text-align: center;
  margin-bottom: 30px;

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


.main-visual {
  h3 {
    background: none !important;
    height: auto !important;
  }

  h2 {
    font-weight: bold;
    font-size: 40px;
  }

}
</style>

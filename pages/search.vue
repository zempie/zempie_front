<template>
  <div class="content">
    <div class="visual-title">
      <h1>
        '{{ keyword }}'
        <span>{{ $t('search.result') }}</span>
      </h1>
    </div>
    <template v-if="results">
      <dl class="area-title" v-if="results.users?.length" style="margin-top: 12.5px">
        <dt>
          Users <span>{{ results.users?.length }}</span>
        </dt>
      </dl>
      <ul class="user-list" v-if="results.users.length">
        <ul class="card-follow">
          <TransitionGroup name="list-complete">
            <UserCard v-for="user in results.users" :key="user.id" :user="user" />
            <!-- <li class="more-card" v-if="userList?.length > 2">
            <h3><i class="uil uil-plus"></i></h3>
            <h4>{{ $t('search.viewAll') }}</h4>
          </li> -->
          </TransitionGroup>
        </ul>
      </ul>

      <dl class="area-title" v-if="results.games?.length">
        <dt>
          Games <span>{{ results.games?.length }}</span>
        </dt>
      </dl>

      <ul v-if="results.games.length" class="card-game">
        <TransitionGroup name="list-complete">
          <GameCard v-for="game in results.games" :key="game.id" :gameInfo="game" />
        </TransitionGroup>
      </ul>

      <dl class="area-title" v-if="results.posts?.length">
        <dt>
          Posts <span>{{ results.posts?.length }}</span>
        </dt>
      </dl>
      <div class="ta-search-post" v-if="results.posts.length" :style="results.posts.length ? 'padding:0px ;' : ''">
        <ul class="ta-post">
          <div v-for="feed in results.posts" :key="feed.id">
            <PostFeed :feed="feed">
              <!-- <template #followBtn>
                <UserFollowBtn
                  :user="feed.user"
                  :key="`${feed.user.is_following}`"
                  class="follow-btn-feed"
                  @refresh="refreshFollow"
                />
              </template> -->
            </PostFeed>
          </div>
        </ul>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import shared from '~/scripts/shared'

const { t, locale } = useI18n()
const route = useRoute()
const config = useRuntimeConfig()
const $route = useRoute()

const keyword = ref($route.query.q)
const userList = ref([])
const gameList = ref([])
const communityList = ref([])
const postList = ref([])

const {
  data: results,
  error,
  pending,
  refresh,
} = await useCustomAsyncFetch<any>(
  `/search?q=${keyword.value}`,
  getComFetchOptions('get', true)
)


shared.createHeadMeta(`${keyword.value}${t('seo.search.title')}`, `${t('seo.search.desc1')}${keyword.value}${t('seo.search.desc2')}`)

watch(
  () => $route.query.q,
  (newKeyword: string) => {
    keyword.value = newKeyword
    refresh()
  }
)
</script>

<style scoped lang="scss">
.visual-title {
  h1 {
    font-weight: 600;
    font-size: 30px;
    line-height: 30px;
    color: #fff;

    span {
      font-size: 30px;
      font-weight: 700;
    }
  }
}

.toasted,
.toast-success {
  color: #f97316 !important;
  border-color: #f97316 !important;
}

.section-banner {
  padding: 0;
  display: flex;
  align-content: space-around;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.stats-decoration-title {
  padding: 2px 6px;
  font-size: 16px;
  text-overflow: ellipsis;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  color: #fff;
  border-radius: 6px;
  background-color: #1d2333;
}

/*transition*/

.list-complete-item {
  transition: all 1s;
  display: inline-block;
  margin-right: 10px;
}

.list-complete-enter,
.list-complete-leave-to

/* .list-complete-leave-active below version 2.1.8 */
  {
  opacity: 0;
  transform: translateY(30px);
}

.list-complete-leave-active {
  position: absolute;
}

@media all and (max-width: 479px) {
  .visual-title {
    h1 {
      font-size: 30px;
      line-height: 30px;

      span {
        font-size: 30px;
        line-height: 30px;
      }
    }
  }

  .card-follow,
  .ta-search-post {
    width: 100%;
  }
}

@media all and (min-width: 480px) and (max-width: 767px) {
  .visual-title {
    h1 {
      font-size: 30px;
      line-height: 30px;

      span {
        font-size: 30px;
        line-height: 30px;
      }
    }
  }

  .visual-title,
  .area-title,
  .card-game,
  .ta-search-post,
  .card-follow {
    width: 100%;
  }
}

@media all and (min-width: 768px) and (max-width: 991px) {}

@media all and (min-width: 992px) and (max-width: 1199px) {}
</style>

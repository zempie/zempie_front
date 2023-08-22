<template>
  <div class="content" style="height: 100vh;">
    <div class="visual-title">
      <h1>
        '{{ keyword }}'
        <span>{{ $t('search.result') }}</span>
      </h1>
    </div>
    <dl class="area-title" v-if="userList?.length" style="margin-top: 12.5px">
      <dt>
        {{ $t('users') }} <span>{{ userList.length }}</span>
      </dt>
    </dl>
    <ul class="user-list" v-if="userList">
      <ul class="card-follow">
        <TransitionGroup name="list-complete">
          <UserCard v-for="user in userList" :key="user.id" :user="user">
            <template #followBtn>
              <div class="flex w100p justify-between">
                <UserFollowBtn :user="user" class="mt20" style="width: 48%;" />
                <DmSendBtn :user="user" class="mt20" style="width: 48%;" />
              </div>
            </template>
          </UserCard>
        </TransitionGroup>
      </ul>
    </ul>

    <dl class="area-title" v-if="gameList?.length">
      <dt>
        {{ $t('games') }} <span>{{ gameList?.length }}</span>
      </dt>
    </dl>

    <ul v-if="gameList?.length" class="card-game">
      <TransitionGroup name="list-complete">
        <GameCard v-for="game in gameList" :key="game.id" :gameInfo="game" />
      </TransitionGroup>
    </ul>

    <dl class="area-title" v-if="postList?.length">
      <dt>
        {{ $t('posts') }} <span>{{ postList?.length }}</span>
      </dt>
    </dl>
    <div class="ta-search-post" v-if="postList?.length" :style="postList?.length ? 'padding:0px ;' : ''">
      <ul class="ta-post">
        <div v-for="feed in postList" :key="feed.id">
          <PostTimelineFeed :feed="feed" @update-blind="(img) => updateBlind(feed, img)"></PostTimelineFeed>
        </div>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import shared from '~/scripts/shared'

const { t, locale } = useI18n()
const $route = useRoute()

const keyword = computed(() => $route.query.q as string)
const userList = computed(() => useSearch().search.value.results?.users)
const gameList = computed(() => useSearch().search.value.results?.games)
const communityList = computed(() => useSearch().search.value.results?.community)
const postList = computed(() => useSearch().search.value.results?.posts)

definePageMeta({
  name: 'search',
  layout: 'header-only',
})


console.log(useSearch().search.value.results)



if (!useSearch().search.value.results) {

  nextTick(async () => {
    await useSearch().getSearch(keyword.value)
  })
}


shared.createHeadMeta(`${keyword.value}${t('seo.search.title')}`, `${t('seo.search.desc1')}${keyword.value}${t('seo.search.desc2')}`)


function updateBlind(feed, img) {
  useSearch().updateResultPost(feed, img)
}
</script>

<style scoped lang="scss">
.visual-title {
  background: url('/images/1200_150_game.jpeg');

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
</style>

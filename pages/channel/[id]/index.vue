<template>
  <NuxtLayout name="channel-header">
    <dl class="three-area">
      <dt v-if="isLoading">
        <div class="ta-myinfo">
          <UserAvatarSk tag="p" style="width: 100px; height: 100px" />
          <h1 class="grey-text skeleton-animation"></h1>
          <ul>
            <li>
              <p style="background: #feb100; cursor: pointer">
                <i class="uil uil-comment-chart-line"></i>
              </p>
              <h2 class="grey-text mt10 skeleton-animation"></h2>
            </li>
            <li>
              <p style="background: #33e4ce; cursor: pointer">
                <i class="uil uil-users-alt"></i>
              </p>
              <h2 class="grey-text mt10 skeleton-animation"></h2>
            </li>
            <li>
              <p style="background: #33e4ce; cursor: pointer">
                <i class="uil uil-users-alt"></i>
              </p>
              <h2 class="grey-text mt10 skeleton-animation"></h2>
            </li>
          </ul>
        </div>
        <div class="ta-game-list">
          <dl>
            <dt>Games</dt>
          </dl>
          <ul v-for="game in 4">
            <li>
              <p style="background-color: #d5d5d5"></p>
              <h2 class="grey-text" style="
                  text-overflow: ellipsis;
                  overflow: hidden;
                  margin: 15px 0 10px 0;
                "></h2>
            </li>
          </ul>
          <div></div>
        </div>
      </dt>
      <dt v-else-if="channelInfo" :key="channelInfo.id">
        <div class="ta-myinfo">
          <UserAvatar :user="channelInfo" tag="p"></UserAvatar>
          <h1>{{ channelInfo.name }}</h1>
          <ul>
            <li>
              <NuxtLink :to="$localePath(`/channel/${channelId}`)">
                <p style="background: #feb100; cursor: pointer">
                  <i class="uil uil-comment-chart-line"></i>
                </p>
                <h2>{{ channelInfo.post_cnt }}</h2>
                <h3>Posts</h3>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :to="$localePath(`/channel/${channelId}/followers`)">
                <p style="background: #33e4ce; cursor: pointer">
                  <i class="uil uil-users-alt"></i>
                </p>
                <h2>{{ channelInfo.follower_cnt }}</h2>
                <h3>Followers</h3>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :to="$localePath(`/channel/${channelId}/following`)">
                <p style="background: #33e4ce; cursor: pointer">
                  <i class="uil uil-users-alt"></i>
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
              <li v-for="game in games?.slice(0, 5)" @click="$router.push($localePath(`/game/${game.pathname}`))">
                <p :style="`background:url(${game.url_thumb_webp || '/images/default.png'
                }) center; background-size:cover;`"></p>
                <h2 style="text-overflow: ellipsis; overflow: hidden">
                  {{ game.title }}
                </h2>
              </li>
            </ul>

            <div v-if="games?.length > 5">
              <NuxtLink :to="$localePath(`/channel/${channelId}/games`)" class="btn-default-samll w100p">{{
                $t('moreView')
              }}
              </NuxtLink>
            </div>
          </template>
          <ul v-else class="no-game">
            <li>{{ $t('no.game') }}</li>
          </ul>
        </div>
      </dt>

      <dd>
        <TimelineSk v-if="isLoading" />
        <PostTimeline v-else type="user" :isMine="isMine" :key="channelId" />
      </dd>
      <dt>
        <div class="ta-groups" style="margin-top: 0px">
          <h2>Community</h2>
          <div v-if="isLoading">
            <dl v-for="group in 4">
              <CommunityListItemSk />
            </dl>
          </div>
          <CommunityList v-else :communities="communityList" />

        </div>
      </dt>
    </dl>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import shared from '~~/scripts/shared';
import { IUserChannel } from '~~/types';

const { $localePath } = useNuxtApp()
const { t } = useI18n()
const route = useRoute()

const isLoading = computed(() => useChannel().userChannel.value.isLoading)
const games = computed(() => channelInfo.games)
const channelId = computed(() => route.params.id as string)
const communityList = computed(() => useChannel().userChannel.value.info.communities)

const isMine = computed(() => {
  return channelId.value === useUser().user.value.info?.channel_id
})


definePageMeta({
  title: 'user-channel',
  name: 'userChannel',
})


/**
 * seo 반영은 함수안에서 되지 않으므로 최상단에서 진행함
 */
const { data } = await useAsyncData<{ result: { target: IUserChannel } }>('channelInfo', () =>
  $fetch(`/channel/${channelId.value}`, getZempieFetchOptions('get', true)),
  {
    initialCache: false
  }
)

const { target: channelInfo } = data.value?.result;
shared.createHeadMeta(`${channelInfo.name}${t('seo.channel.title')}`, `${channelInfo.name}${t('seo.channel.desc')}`, channelInfo.picture)

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

@media all and (min-width: 992px) and (max-width: 1199px) {}

@media all and (min-width: 1200px) {}
</style>

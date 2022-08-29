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
                <p style="background-color: #d5d5d5;">
                </p>
                <h2 class="grey-text" style="text-overflow: ellipsis; overflow: hidden; margin: 15px 0 10px 0;"> </h2>
              </li>
            </ul>
            <div>
            </div>
          </div>
        </dt>
        <dt v-else>
          <div class="ta-myinfo" style="margin-bottom:20px">
            <UserAvatar :user="channelInfo" :tag="'p'"></UserAvatar>
            <h2>{{ channelInfo.name }}</h2>
            <ul>
              <li>
                <NuxtLink :to="localePath(`/channel/${channelId}`)">
                  <p style="background:#FEB100; cursor: pointer"><i class="uil uil-comment-chart-line"></i>
                  </p>
                  <h2>{{ channelInfo.post_cnt }}</h2>
                  <h3>Posts</h3>
                </NuxtLink>
              </li>
              <li>
                <NuxtLink :to="localePath(`/channel/${channelId}/followers`)">

                  <p style="background:#33E4CE;cursor: pointer"><i class="uil uil-users-alt"></i></p>
                  <h2>{{ channelInfo.follower_cnt }}</h2>
                  <h3>Followers</h3>
                </NuxtLink>

              </li>
              <li>
                <NuxtLink :to="localePath(`/channel/${channelId}/following`)">
                  <p style="background:#5D5FFE;cursor: pointer"><i class="uil uil-user-plus"></i></p>
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
                <li v-for="game in games?.slice(0, 5)">
                  <p :style="`background:url(${game.url_thumb_webp ||
                  '/images/default.png'
                  }) center; background-size:cover;`"></p>
                  <h2 style="text-overflow: ellipsis; overflow: hidden">{{ game.title }}</h2>
                </li>

              </ul>

              <div v-if="games?.length > 5">
                <NuxtLink :to="localePath(`/channel/${channelId}/games`)" class="btn-default-samll w100p">{{
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
          <TimelineSk v-if="isPending" />
          <PostTimeline v-else type="user" :isMine="isMine" :key="channelId" />
        </dd>
        <dt>
          <div class="ta-groups" style="margin-top:0px">
            <h2>Community</h2>
            <div v-if="isPending">
              <dl v-for="group in 4">
                <CommunityListItemSk />
              </dl>
            </div>
            <CommunityList v-else :communities="channelInfo.communities" />
          </div>
        </dt>

      </dl>
    </ClientOnly>
  </NuxtLayout>
</template>

 <script setup lang="ts">
import { useLocalePath } from 'vue-i18n-routing';

const localePath = useLocalePath();
const route = useRoute();
const isPending = ref(true)
const channelInfo = computed(() => useChannel().userChannel.value.info)
const games = computed(() => channelInfo.value.games)
const channelId = computed(() => route.params.id as string)

useHead({
  title: 'Zempie | Project version ',
  meta: [{
    name: 'description',
    content: 'project list'
  }]
})

definePageMeta({
  title: 'user-channel',
  name: 'userChannel'
})

const isMine = computed(() => {
  return channelId.value === useUser().user.value.info?.channel_id
})


onMounted(() => {
  isPending.value = false
})


//  channel_id = this.$route.params.channel_id;
//     games: any[] = [];
//     totalGameCnt = 0;
//     user!: any;
//     communityList: {
//         id: number;
//         name: string;
//         profile_img: string;
//         state: string;
//         member_cnt: number;
//     }[] = [];
//     userId = 0;

//     async mounted() {
//         await this.$store.dispatch("loginState");
//         this.gameListFetch();

//     }

//     gameListFetch() {
//         this.$api.userChannel(this.channel_id)
//             .then((res: any) => {
//                 const {target} = res;
//                 const {games} = target;
//                 this.userId = target.id
//                 this.$store.commit('gameList', games)
//                 if (games.length > 0) {
//                     this.totalGameCnt = games.length;
//                 }

//                 this.games = games.slice(0, 5)
//                 this.communityFetch();
//             })
//             .catch((err: AxiosError) => {
//                 // this.$router.push(`/${this.$i18n.locale}`)
//                 // console.log('err', err)
//             })


//     }
//     communityFetch() {
//         this.$api.joinedCommunityList(this.userId)
//             .then((res: any) => {
//                 this.communityList = res;
//             })
//             .catch((err: AxiosError) => {
//                 this.$router.push(`/${this.$i18n.locale}`)
//             })


//     }

//     moveGameChannel(gamePath: string) {
//         this.$router.push(`/${this.$i18n.locale}/timeline/game/${gamePath}`);
//     }

//     moveGroupPage(id: any) {
//         this.$router.push(`/${this.$i18n.locale}/community/${id}/timeline`);
//     }

//     playGame(pathname: string) {
//         window.open(
//             `/play/${pathname}`, "_blank");
//     }


</script>


<style lang="scss" scoped>
.swiper-slide {
  display: inline-block
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

@media all and (min-width: 992px) and (max-width: 1199px) {}

@media all and (min-width: 1200px) {}
</style>

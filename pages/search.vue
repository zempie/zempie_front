<template>
  <div class="content">
    <div class="visual-title">
      <h2>'{{ keyword }}' <span>{{ $t('search.result') }}</span></h2>
    </div>

    <dl class="area-title" v-if="userList?.length">
      <dt>Users <span>{{ userList?.length }}</span></dt>
    </dl>
    <ul v-if="userList">
      <transition-group name="list-complete" class="card-follow">
        <li v-for="user in userList" :key="user.id">
          <div class="cf-img"></div>
          <UserAvatar :user="user" :tag="'p'"></UserAvatar>

          <!--                <p :style="{'background' : 'url(' + member.picture || '../../assets/images/300_300_default_profile.png' + ') center center no-repeat', 'background-size' : 'cover'}"></p>-->
          <div class="cf-info">
            <h3>{{ user.name }}</h3>
            <p></p>
            <dl>
              <dd>
                <h4>{{ user.followers_cnt }}</h4>
                <p>Followers</p>
              </dd>
              <dt>
                <p></p>
              </dt>
              <dd>
                <h4>{{ user.followings_cnt }}</h4>
                <p>Followings</p>
              </dd>
            </dl>
          </div>
        </li>
      </transition-group>
      <li class="more-card" v-if="userList?.length > 3">
        <h3><i class="uil uil-plus"></i></h3>
        <h4>{{ $t('search.viewAll') }}</h4>
      </li>
    </ul>


    <dl class="area-title" v-if="gameList?.length > 0">
      <dt>Games <span>{{ gameList?.length }}</span></dt>
    </dl>

    <ul v-if="gameList">
      <transition-group name="list-complete" class="card-game">
        <li v-for="game in gameList" :key="game.id">
          <div
            :style="`background: url( ${game && game.url_thumb_webp || game.url_thumb} ) center center no-repeat; background-size: cover;`">
          </div>
          <dl>
            <dt>

              <P
                :style="`background: url(${game.user && game.user.picture || '/img/300_300_default_profile.png'}) center center no-repeat; background-size: cover;`">
              </P>
            </dt>
            <dd>
              <h2>{{ game && game.title }}</h2>
              <p>{{ game.user && game.user.name }}</p>
              <ul>
                <!--                            <li><img src="../../assets/images/charge_game_icon.svg" alt=""></li>-->
                <!--                            <li><img src="../../assets/images/hot_game_icon.svg" alt=""></li>-->
                <li><img src="/images/zempie_game_icon.svg" alt=""></li>
              </ul>
            </dd>
          </dl>
        </li>
      </transition-group>

    </ul>

    <dl class="area-title" v-if="postList?.length">
      <dt>Posts <span>{{ postList?.length }}</span></dt>
    </dl>
    <div class="ta-search-post" v-if="postList" :style="postList ? 'padding:0px ;' : ''">
      <ul class="ta-post">
        <div v-for="feed in postList" :key="feed.id">
          <!--                    {{feed}}-->
          <Feed :feed="feed"></Feed>
        </div>
      </ul>
    </div>


  </div>
</template>

<script setup lang="ts">

const $route = useRoute();

const keyword = computed(() => $route.query.q)

const userList = ref([])
const gameList = ref([])
const communityList = ref([])
const postList = ref([])

const { data, error, pending } = await community.search({ q: keyword.value })

onMounted(() => {
  const { posts, games, community: comList, users } = data.value
  userList.value = users;
  gameList.value = games
  communityList.value = comList
  postList.value = posts

})


// import Feed from "@/components/timeline/_feed.vue";
// import MemberCard from "@/components/community/_memberCard.vue";
// import {Swiper, SwiperSlide} from 'vue-awesome-swiper'
// import {execCommandCopy} from "@/script/util";
// import Toast from "@/script/message";
// import {scrollDone} from "@/script/scrollManager";
// import {AxiosError} from "axios";

// import Comment from "@/components/timeline/Comment.vue";
// import CommentInput from "@/components/comment/_commentInput.vue";
// import UserAvatar from "@/components/user/_userAvatar.vue";
// import CommunityCard from "@/components/community/_communityCard.vue";
// import SubscribeBtn from "@/components/community/_subscribeBtn.vue";

//     toast = new Toast();
//     type: string = Object.keys(this.$route.query)[0];
//     query: any = this.$route.query[Object.keys(this.$route.query)[0]];
//     posts: any = [];
//     games: any = [];
//     memberList: any = [];
//     communityList: any = [];
//     keyword: string | (string | null)[] = '';

//     limit: number = 5;
//     offset: number = 0;
//     sort: string = '';

//     isAddData: boolean = false;
//     comments: any = [];
//     isOpenedComments: boolean = false;

//     TSSswiperOption = {
//         slidesPerView: 8,
//         spaceBetween: 0,
//         breakpoints: {
//             300: {
//                 slidesPerView: 2.5
//             },
//             480: {
//                 slidesPerView: 3.5
//             },
//             768: {
//                 slidesPerView: 4.5
//             },
//             992: {
//                 slidesPerView: 6
//             },
//             1200: {
//                 //slidesPerView: 7
//             }
//         }
//     }

//     async mounted() {
//         if (this.$store.getters.userData.length > 0) {
//             this.keyword = this.$route.query.username
//             this.memberList = this.$store.getters.userData;
//         }
//         else {
//             this.keyword = this.$route.query.q
//         }

//         this.memberList = this.$store.getters.researchData.users;
//         this.posts = this.$store.getters.researchData.posts;
//         this.communityList = this.$store.getters.researchData.community;
//         // const result = await this.$api.search(this.query, this.type);
//         // this.posts = result.posts;
//         this.games = this.$store.getters.researchData.games;
//         this.fetch()
//     }

//     beforeDestroy() {
//         this.$store.dispatch('resetResearchData')
//     }

//     fetch() {
//         const obj = {
//             q: this.$route.query.q,
//             limit: 5
//         };

//         this.$api.search(obj)
//             .then((res: any) => {
//                 this.memberList = res.users;
//                 this.communityList = res.community;
//                 this.games = res.games;
//                 this.posts = res.posts;

//             })
//             .catch((err: any) => {

//             })
//     }


//     toGamePage(gamePath: string, gameId: number) {
//         this.$router.push(`/${this.$i18n.locale}/timeline/game/${gamePath}?game_id=${gameId}`)


//     }

//     @Watch('$route.query.q')
//     watchQuery() {
//         this.keyword = this.$route.query.q
//         this.fetch();
//     }

//     userPage(channel_id: string) {
//         this.$router.push(`/${this.$i18n.locale}/channel/${channel_id}/timeline`)
//     }

//     playGame(pathname: string) {
//         window.open(
//             `/play/${pathname}`, "_blank");

//     }


</script>

<style scoped>
.toasted,
.toast-success {
  color: #F97316 !important;
  border-color: #F97316 !important;
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

.cf-info {
  height: 100%;
}

.cf-img {
  background-color: #f39800;
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
</style>

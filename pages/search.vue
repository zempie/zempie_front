<template>
  <div class="content">
    <ClientOnly>
      <div class="visual-title">
        <h2>'{{  keyword  }}' <span>{{  $t('search.result')  }}</span></h2>
      </div>
      <dl class="area-title" v-if="results.users?.length" style="margin-top:12.5px">
        <dt>Users <span>{{  results.users?.length  }}</span></dt>
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
        <dt>Games <span>{{  results.games?.length  }}</span></dt>
      </dl>

      <ul v-if="results.games.length" class="card-game">
        <TransitionGroup name="list-complete">
          <GameCard v-for="game in results.games" :key="game.id" :gameInfo="game" />
        </TransitionGroup>

      </ul>

      <dl class="area-title" v-if="results.posts?.length">
        <dt>Posts <span>{{  results.posts?.length  }}</span></dt>
      </dl>
      <div class="ta-search-post" v-if="results.posts.length" :style="results.posts.length ? 'padding:0px ;' : ''">
        <ul class="ta-post">
          <div v-for="feed in results.posts" :key="feed.id">
            <PostFeed :feed="feed" />

          </div>
        </ul>
      </div>
    </ClientOnly>

  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n()
const route = useRoute();
const config = useRuntimeConfig()
const $route = useRoute();

const keyword = ref($route.query.q)
const userList = ref([])
const gameList = ref([])
const communityList = ref([])
const postList = ref([])




const { data: results, error, pending, refresh } = await useFetch<any>(() => `/search?q=${keyword.value}`, getComFetchOptions('get', true));


watch(
  () => $route.query.q,
  (newKeyword: string) => {
    keyword.value = newKeyword;

    useHead({
      title: `${t('seo.search.title')} | Zempie`,
      meta: [
        {
          name: 'description',
          content: `${t('seo.search.desc1')}${keyword.value}${t('seo.search.desc2')}`
        },
        {
          name: 'og:title',
          content: `${t('seo.search.title')}`
        },
        {
          name: 'og:description',
          content: `${t('seo.search.desc1')}${keyword.value}${t('seo.search.desc2')}`
        },
        {
          name: 'og:url',
          content: `${config.ZEMPIE_URL}${route.path}`
        },
      ]
    })

    refresh()
  }
)




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

<style scoped lang="scss">
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

  .card-follow,
  .ta-search-post {
    width: 100%;
  }
}

@media all and (min-width: 480px) and (max-width: 767px) {

  .visual-title,
  .area-title,
  .card-game,
  .ta-search-post,
  .card-follow {
    width: 100%
  }
}

@media all and (min-width: 768px) and (max-width: 991px) {}

@media all and (min-width: 992px) and (max-width: 1199px) {}
</style>


<template>
  <NuxtLayout name="game-channel-header">

    <dl class="three-area">
      <dt>
        <div class="ta-game-list">
          <dl>
            <dt>Games</dt>
          </dl>
          <template v-if="games?.length > 0">
            <ul>
              <li v-for="game in games.slice(0, 5)" @click="$router.push(localePath(`/game/${game.pathname}`))">
                <p :style="`background:url(${game?.url_thumb_webp ||
                game?.url_thumb ||
                '/images/default.png'
                }) center; background-size:cover;`"></p>
                <h2 style="text-overflow: ellipsis; overflow: hidden">{{  game?.title  }}</h2>
              </li>
            </ul>

            <div v-if="games.length > 5">
              <NuxtLink :to="localePath(`/channel/${game.user.channel_id}/games`)" class="btn-default-samll w100p">
                {{  $t('moreView')  }}
              </NuxtLink>
            </div>
          </template>
          <ul v-else class="no-game">
            <li>{{  $t('no.game')  }}</li>
          </ul>
        </div>
      </dt>
      <dd>
        <PostTimeline type="game" :isMine="isMine" />
      </dd>


      <dt>
        <div class="ta-about">
          <h2>About Us</h2>
          <div class="desc">
            {{  game?.description  }}
          </div>
          <dl>
            <dt>Version</dt>
            <dd> {{  game?.version  }}</dd>
          </dl>
        </div>
        <div class="ta-copy-link">
          <a @click="copyUrl"><em>Copy Game Link</em> <span><i class="uil uil-link"></i></span></a>
        </div>
      </dt>


    </dl>
  </NuxtLayout>

</template>

<script setup lang="ts">
import { IUserChannel } from '~~/types';
import { execCommandCopy } from '~/scripts/utils'
import { useLocalePath } from 'vue-i18n-routing';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';


const localePath = useLocalePath();
const config = useRuntimeConfig();
const route = useRoute();
const { t, locale } = useI18n()

const userInfo = ref({} as IUserChannel)

const games = computed(() => useChannel().userChannel.value.info?.games)

const game = computed(() => useGame().game.value.info)

const isMine = computed(() => useGame().game.value.info?.user.id === useUser().user.value.info?.id)



watch(
  () => game.value,
  (info) => {
    useHead({
      title: `${info.title} | Zempie game`,
      meta: [
        {
          name: 'description',
          content: `${info.description}`
        },
        {
          name: 'og:title',
          content: `${info.title}`
        },
        {
          name: 'og:description',
          content: `${info.description}`
        },
        {
          name: 'og:url',
          content: `${config.ZEMPIE_URL}${route.path}`
        },
      ]
    })
  }
)



onMounted(async () => {

  // const { data, pending } = await user.getUserInfo(game.value.user.id)
  // const { result } = data.value;
  // userInfo.value = result.target
})

// toast = new Toast();
// games: any[] = [];
// totalGameCnt = 0;

// TASswiperOption = {
//     slidesPerView: 1,
//     spaceBetween: 20,
//     navigation: {
//         nextEl: '.ta-screenshot .swiper-button-next',
//         prevEl: '.ta-screenshot .swiper-button-prev'
//     },
// }
// gamePath = this.$route.params.gamePath;
// user: any = '';
// game: any = this.$store.getters.gameInfo;
// imgSrc = '';
// hashtags = [];


// async mounted() {
//     await this.$store.dispatch("loginState");
//     this.fetch();

// }

// fetch() {

//     this.$api.gameInfo(this.gamePath)
//         .then((res: any) => {
//             const {result} = res;
//             const {game} = result;
//             this.$store.commit('gameInfo', game)
//             this.game = game;
//             this.user = game.user
//             this.hashtags = (game.hashtags.length > 0) ? game.hashtags.split(",") : undefined;

//             this.$store.commit('currPage', {
//                 game_id: game.id
//             })

//             this.$gtag.event('visit_game_page', {
//                 'gameId': game.id,
//             });
//             this.gameListFetch();


//         })
//         .catch((err: any) => {


//         })
// }


// gameListFetch() {
//     this.$api.userChannel(this.user.channel_id)
//         .then((res: any) => {
//             const {target} = res;
//             const {games} = target;
//             this.$store.commit('gameList', games)
//             if (games.length > 0) {
//                 this.totalGameCnt = games.length;
//             }
//             this.games = games.slice(0, 5)
//         })
//         .catch((err: AxiosError) => {
//             // this.$router.push(`/${this.$i18n.locale}`)
//             // console.log('err', err)
//         })


// }

// beforeDestroy() {
//     this.$store.commit('currPage', null)
// }

// openImgModal(imgSrc: string) {
//     this.imgSrc = imgSrc;
//     (this.$refs.originScreenShootImgModal as any).show();
// }

// closeImgModal() {
//     (this.$refs.originScreenShootImgModal as any).hide();
// }

function copyUrl() {

  const url = `${config.BASE_API}/game/${game.value.pathname}`;
  execCommandCopy(url)
  ElMessage.closeAll()
  ElMessage({
    message: t('copied.clipboard'),
    type: 'success'
  })

}


    // @Watch('$route.params.gamePath')
    // watchParams() {
    //     this.gamePath = this.$route.params.gamePath
    //     this.fetch();
    // }

</script>

<style scoped lang="scss">
.ta-game-list {
  width: 100%;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0px 10px 50px rgba(0, 0, 0, 0.1);
}

.ta-screenshot .swiper-button-next {
  --swiper-navigation-color: #fff;
  --swiper-navigation-size: 10px;

  display: block;
  position: absolute;
  width: 20px;
  height: 20px;
  margin: 15px 15px 0 0;
  text-align: center;
  line-height: 17px;
  border: #fff 1px solid;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  overflow: hidden;
  z-index: 99999999;

  &:hover {
    --swiper-navigation-color: #fff;
    background: #FF6216;
  }
}

.ta-screenshot .swiper-button-prev {
  --swiper-navigation-color: #fff;
  --swiper-navigation-size: 10px;

  display: block;
  position: absolute;
  width: 20px;
  height: 20px;
  margin: 15px 0 0 15px;
  text-align: center;
  line-height: 17px;
  border: #fff 1px solid;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  overflow: hidden;

  &:hover {
    --swiper-navigation-color: #fff;
    background: #FF6216;
  }
}

.ta-copy-link a {
  cursor: pointer;
}


.no-game {
  padding: 20px 20px 0 20px;

  li {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    cursor: pointer;
    height: 40px;
    margin-top: 0px;
    padding-bottom: 20px
  }
}

.ta-about {
  .desc {
    color: #000;
    line-break: auto;
  }
}
</style>

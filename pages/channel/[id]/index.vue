<template>
  <NuxtLayout name="user-channel-header">
    <ClientOnly>
      <dl class="three-area">
        <dt>
          <div class="ta-game-list">
            <dl>
              <dt>Game</dt>
            </dl>
            <template v-if="isPending">
              <ul v-for="game in 4">
                <li>
                  <p style="background-color: #d5d5d5;">
                  </p>
                  <h2 class="grey-text" style="text-overflow: ellipsis; overflow: hidden;margin: 15px 0 10px 0;"> </h2>
                </li>
              </ul>
            </template>
            <template>
              {{ useUser() }}
            </template>
            <div>
            </div>
          </div>
        </dt>
        <dd>
          <TimelineSk v-if="isPending" />
        </dd>
        <dt>
          <div class="ta-groups" style="margin-top:0px">
            <h2>Group</h2>
            <div>
              <template v-if="isPending">
                <dl v-for="group in 4">
                  <dt><span
                      style="background: url('/images/default.png') center center no-repeat; background-size: cover;"></span>
                  </dt>
                  <dd style="width:100%">
                    <h2 class="grey-text"></h2>
                    <h3 class="grey-text"></h3>
                  </dd>
                </dl>
              </template>
            </div>
          </div>
        </dt>
      </dl>
    </ClientOnly>
  </NuxtLayout>
</template>

 <script setup lang="ts">

const route = useRoute();
const isPending = ref(true)

const channelId = computed(() => route.params.id as string)




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
</style>

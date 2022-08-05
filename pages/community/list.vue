<template>
  <div class="content">
    <!-- 비주얼영역 -->

    <div class="visual-img"
      style="background:url('/images/visual_top_img.png') center no-repeat; background-size: cover ">

      <div class="title">
        Groups
        <!-- TODO: 커뮤니티 전체 개수 -->
        <!-- <span v-if="communityList && communityList.length > 0">({{ communityList.length }})</span> -->
      </div>
      <p>
        Browse all the groups of the community!
      </p>
    </div>
    <!-- 비주얼영역 끝 -->


    <!-- 검색/구분 -->
    <dl class="area-search-sort">
      <dt>
        <!--              커뮤니티 검색용 -->
        <!--                -->
        <!-- <div class="input-search-default">-->
        <!--                    <p><i class="uil uil-search"></i>-->
        <!--                    </p>-->
        <!--                    <div>-->
        <!--                        <input-->
        <!--                            v-model="searchInput"-->
        <!--                            @keyup.enter="searchCommunity" type="text" name="" title="keywords"-->
        <!--                            placeholder="검색어를 입력하세요."/>-->
        <!--                    </div>-->
        <!--                </div> -->
      </dt>
      <dd>
        <div class="sort-default">
          <a @click="sortGroups(0)" :class="filter === 0 ? 'active' : ''"><i class="uis uis-check"></i>
            <!-- {{ i18n.t('filter.recent') }}  -->
          </a>
          <span>·</span>
          <a @click="sortGroups(1)" :class="filter === 1 ? 'active' : ''"><i class="uis uis-check"></i>
            <!-- {{ i18n.t('filter.subscribe') }} -->
          </a>
          <span>·</span>
          <a @click="sortGroups(2)" :class="filter === 2 ? 'active' : ''"><i class="uis uis-check"></i>
            <!-- {{ i18n.t('filter.alphabet') }} -->
          </a>
        </div>
      </dd>
    </dl>
    <!-- 검색/구분 끝 -->
    <div class="result-container">

      <!-- <transition-group name="list-complete" > -->


      <div class="card-timeline">
        <TransitionGroup name="fade">
          <CommunityCardSk v-show="isPending" v-for="com in 4" :key="com" />
          <CommunityCard v-show="!isPending" v-for="community in communities" :community="community"
            :key="community.id">
            <!-- TODO: ux 개선 사항 정리후 적용 -->
            <template v-slot:subBtn>
              <!-- <SubscribeBtn :community="community" /> -->
            </template>
          </CommunityCard>
        </TransitionGroup>
      </div>





      <!--                <h1>검색 결과가 없습니다.</h1>-->
      <!--                <img src="../../assets/images/not-found.png" width="100px" height="100px"/>-->
      <!--            </div>-->
      <!-- 
                <template v-if="isFirstLoading">
                    <li :key="Date.now()" style="list-style-type: none; opacity: 0.5;">
                        <div>
                        </div>
                    </li>
                </template>
                <template v-else>
                    <community-card @reFetch="reFetch" v-for="community in communityList" :key="community.id"
                        :community="community">
                        <template v-slot:subBtn>
                            <SubscribeBtn @reFetch="reFetch" class="sub-btn" :community="community"
                                @unsubscribe="unsubscribe" />
                        </template>
                    </community-card>
                </template>-->
    </div>

    <!-- <modal :clickToClose="false" class="modal-area-type" name="deleteConfirm" width="90%" height="auto"
            :maxWidth="380" :scrollable="true" :adaptive="true">
            <div class="modal-alert">
                <dl class="ma-header">
                    <dt>{{ i18n.t('information') }}</dt>
                    <dd>
                        <button><i class="uil uil-times"></i></button>
                    </dd>
                </dl>
                <div class="ma-content">
                    <h2>{{ i18n.t('leave.community.text1') }} <br />※ {{ i18n.t('leave.community.text2') }}</h2>
                    <div>
                        <button class="btn-default w48p">{{ i18n.t('yes') }}</button>
                        <button class="btn-gray w48p">{{ i18n.t('no') }}</button>
                    </div>
                </div>
            </div>
        </modal> -->
  </div>
</template>

<script lang="ts" setup>
import { ICommunityPayload } from '~~/types';
import SubscribeBtn from '~~/components/community/subscribeBtn.vue';
// import * as Api from '~/api'
// import firebase from '~/scripts/firebase'
// import { useUserStore } from '~/store/user'



// const { i18n, $toast } = useContext()

// metaSetting !: MetaSetting;
// clickManager: ClickManager = new ClickManager();
const communities: any = ref([]);
const filter = ref(0);
// private isSearched: boolean = false;

//fetch data object
const limit = ref(20);
const offset = ref(0);
// const community = ref('');
const sort = ref('');
const show = ref('')
const searchInput = ref('');
// isAddData: boolean = false;
// unCommunityId: string = ''
// user !: any;
const isPending = ref(true)

const obj: ICommunityPayload = {
  limit: 20,
  offset: 0,
  community: '',
  sort: '',
  show: ''
}

const { data, error, pending } = await community.list()

// isFirstLoading: boolean = true;

onMounted(async () => {
  if (data.value) {
    console.log(data.value)
    communities.value = data.value
  }
  isPending.value = pending.value
})


// beforeDestroy() {
//     window.removeEventListener("scroll", this.scrollCheck);
// }

async function fetch() {
  console.log('fetch')






  // Api.community.getList(obj)
  //     .then((res: any) => {
  //         communityList.value = res;
  //         // if (this.isAddData) {
  //         //     if (res.length > 0) {
  //         //         this.communityList = [...this.communityList, ...res]
  //         //     }
  //         //     else {
  //         //         window.removeEventListener("scroll", this.scrollCheck);
  //         //     }
  //         // }
  //         // else {
  //         //     this.communityList = res;
  //         //     this.isAddData = true
  //         // }
  //     })
  //     .catch((err: AxiosError) => {
  //         console.log(err)
  //     })
  //     .finally(() => {
  //         // this.isFirstLoading = false;
  //         // this.createMetaSetting();
  //     })
}

// scrollCheck() {
//     if (scrollDone(document.documentElement)) {
//         this.offset += this.limit;
//         this.fetch();
//     }
// }

// createMetaSetting() {
//     this.metaSetting = new MetaSetting({
//         title: `${this.i18n.t('communityList')} | Zempie.com`, //커뮤니티 리스트
//         meta: [
//             { name: 'description', content: `${this.i18n.t('communityList.desc')}` },
//             { property: 'og:url', content: `${this.$store.getters.homeUrl}/${this.$i18n.locale}/communityList` },
//             { property: 'og:title', content: `${this.i18n.t('communityList')} | Zempie.com` },
//             { property: 'og:description', content: `${this.i18n.t('communityList.desc')}` },
//         ]
//     });
// }

// unsubscribe(communityId: string) {
//     this.$modal.show('deleteConfirm')
//     this.unCommunityId = communityId;
// }

// yesUnsubscribe() {
//     this.initData()
//     this.$api.unsubscribe({ user_id: this.user.id, community_id: this.unCommunityId })
//         .then((res: any) => {
//             this.fetch();
//         })
//         .catch((err: any) => {
//             if (err.message) {
//                 alert(err.message)
//             }
//         })
//         .finally(() => {
//             this.$modal.hide('deleteConfirm')
//         })
// }

function sortGroups(sorted: number) {
  // this.isAddData = false;

  filter.value = sorted;
  // if (this.clickManager.doubleClickCheck() === false) {
  //     if (filter === 0) {
  //         this.sort = '';
  //         this.fetch()
  //     }
  //     else if (filter === 1) {
  //         this.sort = 'SUBSCRIBE'
  //         this.fetch()
  //     }
  //     else if (filter === 2) {
  //         this.sort = 'ALPAHBETIC'
  //         this.fetch()
  //     }

}

    // searchCommunity(e: Event) {
    //     e.preventDefault();
    //     this.isSearched = true;
    //     this.isAddData = false;
    //     this.fetch()
    // }

    // searchReset(e: Event) {
    //     e.preventDefault();
    //     this.initData();
    //     this.fetch()

    // }

    // initData() {
    //     this.isSearched = false;
    //     this.isAddData = false
    //     this.limit = 20;
    //     this.offset = 0;
    //     this.community = '';
    //     this.sort = '';
    //     this.show = '';
    //     this.searchInput = '';
    // }

    // reFetch() {
    //     this.initData();
    //     this.fetch();
    // }

</script>

<style scoped lang="scss">
svg {
  overflow: hidden;
  vertical-align: middle;
}

.search.button {
  width: 64px !important;
  position: absolute;
  top: 0;
  right: 0;
}

/* transition */


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

.visual-img {
  width: 1200px;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .title {
    font-size: 2.25rem;
    font-weight: 700;
  }

  p {
    margin-top: 10px;
    font-size: 1rem;
    font-weight: 500;
  }
}

.uil-times {
  display: inline-block;
  margin-right: 10px;
  font-size: 26px;
}

.no-result {
  display: flex;
  flex-direction: column;
  align-items: center;

  h1 {
    color: #333;
    font-size: 18px;
    margin-bottom: 10px;
  }
}


//transition
.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.3s ease;
}

.component-fade-enter,
.component-fade-leave-to

/* .component-fade-leave-active below version 2.1.8 */
  {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

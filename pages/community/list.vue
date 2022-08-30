<template>
  <div class="content">
    <!-- 비주얼영역 -->

    <div class="visual-img"
      style="background:url('/images/visual_top_img.png') center no-repeat; background-size: cover ">

      <div class="title">
        Communities
        <!-- TODO: 커뮤니티 전체 개수 -->
        <!-- <span v-if="communityList && communityList.length > 0">({{ communityList.length }})</span> -->
      </div>
      <p>
        Browse all the groups of the community!
      </p>
    </div>
    <!-- 비주얼영역 끝 -->


    <dl class="area-search-sort">
      <dt>
      </dt>
      <dd>
        <div class="sort-default">
          <a @click="sortGroups(0)" :class="filter === 0 ? 'active' : ''"><i class="uis uis-check"></i>
            {{  t('filter.recent')  }}
          </a>
          <span>·</span>
          <a @click="sortGroups(1)" :class="filter === 1 ? 'active' : ''"><i class="uis uis-check"></i>
            {{  t('filter.subscribe')  }}
          </a>
          <span>·</span>
          <a @click="sortGroups(2)" :class="filter === 2 ? 'active' : ''"><i class="uis uis-check"></i>
            {{  t('filter.alphabet')  }}
          </a>
        </div>
      </dd>
    </dl>
    <div class="result-container">
      <div class="card-timeline">
        <TransitionGroup name="fade">
          <CommunityCardSk v-show="isPending" v-for="com in 4" :key="com" />
          <CommunityCard v-show="!isPending" v-for="community in communities" :community="community"
            :key="community.id">
            <template v-slot:subBtn>
              <CommunitySubscribeBtn :community="community" @refresh="fetch" />
            </template>
          </CommunityCard>
        </TransitionGroup>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts" >
import _ from 'lodash'
import { ICommunityPayload } from '~~/types';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n()
const route = useRoute();

const config = useRuntimeConfig()

const accessToken = useCookie(config.COOKIE_NAME).value


useHead({
  title: `${t('communityList')} | Zempie`,
  meta: [
    {
      name: 'description',
      content: `${t('communityList.desc')}`
    },
    {
      name: 'og:title',
      content: `${t('communityList')}`
    },
    {
      name: 'og:description',
      content: `${t('communityList.desc')}`
    },
    {
      name: 'og:url',
      content: `${config.ZEMPIE_URL}${route.path}`
    },
    {
      name: 'og:image',
      content: 'image/sns-thumbnail.png'
    },
  ]
})

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
// TODO: 무한 스크롤 적용

// isFirstLoading: boolean = true;



// beforeDestroy() {
//     window.removeEventListener("scroll", this.scrollCheck);
// }

await fetch()


async function fetch() {

  const { data, pending } = await useFetch<any>(() => `/community/list?limit=${obj.limit}&offset=${obj.offset}&sort=${obj.sort}`, { method: 'get', initialCache: false, baseURL: config.COMMUNITY_API, headers: accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {} })

  if (data.value) {
    communities.value = data.value
  }
  isPending.value = pending.value





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

const sortGroups = _.debounce(async (sorted: number) => {
  filter.value = sorted;

  if (filter.value === 0) {
    obj.sort = '';
    await fetch()
  }
  else if (filter.value === 1) {
    obj.sort = 'SUBSCRIBE'
    await fetch()
  }
  else if (filter.value === 2) {
    obj.sort = 'ALPAHBETIC'
    await fetch()
  }

}, 300)

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
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 150px;

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




@media all and (max-width: 479px) {
  .visual-img {
    width: 100% !important;
    border-radius: 0 !important;
  }
}


@media all and (max-width: 479px) {
  .area-search-sort {
    width: 100%;

  }

  .area-search-sort dt {
    width: 100%;
  }

  .area-search-sort dd {
    width: 100%;
    margin-top: 10px;
  }
}


@media all and (max-width: 479px) {
  .card-timeline {
    width: 100%;

  }

  .card-timeline>li {
    width: 100%;
    margin: 2% 0 2% 0;
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

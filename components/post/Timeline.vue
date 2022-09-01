<template>
  <ul class="ta-post">
    <dd>
      <div class="ta-message-send" v-if="isMine">
        <p>
          <UserAvatar :user="user" :tag="'span'"></UserAvatar>
        </p>
        <dl>
          <dt>
            <input v-if="isSubscribed" type="text" :placeholder="t('postModalInput')" readonly
              @click="isLogin ? isTextEditorOpen = true : useModal().openLoginModal()" />
            <slot v-else name="inputBox" />
          </dt>
          <dd><a><i class="uil uil-message"></i></a></dd>
        </dl>
      </div>

      <div v-if="$route.meta.name === 'userChannel'" class="tab-search-swiper mobile"
        style="width:100%; margin:0px 0px 20px 0px;">
        <div class="swiper-area uppercase">
          <div class="swiper-slide" style="width:50%; cursor:pointer;">
            <a @click="timelineFilter();" :class="media ?? 'active'">
              <p><i class=" uil uil-clock-three"></i>TIMELINE</p>
            </a>
          </div>
          <div class="swiper-slide" style="width:50%; cursor:pointer;">

            <NuxtLink :to="localePath(`/channel/${channelId}/games`)" @click.native="timelineFilter('game');"
              :class="media === 'game' ? 'active' : ''">
              <p><i class="uil uil-map-pin-alt"></i>GAME</p>
            </NuxtLink>

          </div>
        </div>
      </div>

      <!-- <div class="ta-message-block" v-else-if="ableToPost() === 'block'">
                <i class="uil uil-exclamation-triangle"></i>
                {{ t('post.modal.block.text') }}
            </div> -->
      <ul class="ta-post">

        <div v-if="isPending" class="ta-post-none bg-grey-1">
          <p></p>
        </div>
        <TransitionGroup name="fade" v-else-if="!isPending && feeds?.length">
          <PostFeed v-for="feed in feeds" :feed="feed" :key="feed.id" @refresh="refresh" />
        </TransitionGroup>
        <div v-else class="ta-post-none">

          <p><span><i class="uil uil-layers-slash"></i></span></p>
          <h2> {{  t('timeline.noPost')  }}</h2>
        </div>

      </ul>
      <div ref="triggerDiv"></div>
      <!-- <div v-else-if="this.$store.getters.LoadingStatus || isFirstLoading"
                 style="opacity: 0.5;"
                 class="ta-post-none">
            </div>

            <div v-else
                 class="ta-post-none"
                 :style="ableToPost() === false ? 'margin-top: 0px' : ''">
                <p><span><i class="uil uil-layers-slash"></i></span></p>
                <h2> {{ t('timeline.noPost') }}</h2>
            </div> -->
    </dd>


    <ClientOnly>
      <el-dialog v-model="isTextEditorOpen" append-to-body custom-class="modal-area-type" :show-close="false"
        :close-on-click-modal="false" :close-on-press-escape="false" @close="closeEditor" width="700px">
        <TextEditor @closeModal="isTextEditorOpen = false" :type="type" @refresh="refresh" :key="editorKey"
          :channelInfo="channelInfo" />
      </el-dialog>
    </ClientOnly>
    <!-- <modal name="writingModal" classes="post-modal" :clickToClose="false" :scrollable="true" height="auto">
            <Post @closePostModal="closePostModal" @reFetch="reFetch" @reMount="reMount" >
            </Post>
        </modal>


        <modal :clickToClose="false" class="modal-area-type" name="deleteModal" width="90%" height="auto"
               :maxWidth="380"
               :adaptive="true"
               :scrollable="true">
            <div class="modal-alert">
                <dl class="ma-header">
                    <dt> {{ t('information') }}</dt>
                    <dd>
                        <button @click="$modal.hide('deleteModal')"><i class="uil uil-times"></i></button>
                    </dd>
                </dl>
                <div class="ma-content">
                    <h2>{{ t('post.delete.modal.text1') }} <br/>{{ t('post.delete.modal.text2') }}
                    </h2>
                    <div>
                        <button class="btn-default w48p" @click="yesDeletePost">{{ t('yes') }}</button>
                        <button class="btn-gray w48p" @click="closeModal">{{ t('no') }}</button>
                    </div>
                </div>
            </div>
        </modal>

        <modal :clickToClose="false" class="modal-area-type" name="modalPost" width="90%" height="auto" :maxWidth="550"
               :adaptive="true"
               :scrollable="true">
            <Post @reFetch="reFetch" :game="game"></Post>
        </modal>

        <modal class="modal-area-type" name="modalReport" width="90%" height="auto" :maxWidth="375" :adaptive="true"
               :scrollable="true">
            <div class="modal-report">
                <dl class="mr-header">
                    <dt>{{ t('post.report.text') }}</dt>
                    <dd>
                        <button @click="$modal.hide('modalReport')"><i class="uil uil-times"></i></button>
                    </dd>
                </dl>
                <div class="mr-content">
                    <ul>
                        <li>
                            <input type="radio" v-model="pickedReason" value="1" id="report1"/> <label
                            for="report1"><i class="uil uil-check"></i></label>&nbsp;
                            <span><label for="report1">{{ t('post.report.reason1') }} </label></span>
                        </li>
                        <li>
                            <input type="radio" v-model="pickedReason" value="2" id="report2"/> <label
                            for="report2"><i class="uil uil-check"></i></label>&nbsp; <span><label
                            for="report2"> {{ t('post.report.reason2') }}</label></span>
                        </li>
                        <li>
                            <input type="radio" v-model="pickedReason" value="3" id="report3"/> <label
                            for="report3"><i class="uil uil-check"></i></label>&nbsp; <span><label
                            for="report3"> {{ t('post.report.reason3') }}</label></span>
                        </li>
                    </ul>
                    <div @click="sendReport">
                        <button class="btn-default" style="width: 100% !important;">{{ t('post.report.btn') }}</button>
                    </div>
                </div>
            </div>
        </modal>
    
        <modal class="modal-area-type" name="modalUserReport" width="90%" height="auto" :maxWidth="375" :adaptive="true"
               :scrollable="true">
            <div class="modal-report">
                <dl class="mr-header">
                    <dt>{{ t('post.report.text') }}</dt>
                    <dd>
                        <button @click="$modal.hide('modalUserReport')"><i class="uil uil-times"></i></button>
                    </dd>
                </dl>
                <div class="mr-content">
                    <ul>
                        <li>
                            <input type="radio" v-model="pickedUserReason" value="1" id="reportUser1"/> <label
                            for="reportUser1"><i class="uil uil-check"></i></label>&nbsp;
                            <span><label for="reportUser1">{{ t('해킹 당한 계정입니다.') }} </label></span>
                        </li>
                        <li>
                            <input type="radio" v-model="pickedUserReason" value="2" id="reportUser2"/> <label
                            for="reportUser2"><i class="uil uil-check"></i></label>&nbsp; <span><label
                            for="reportUser2"> {{ t('사칭하는 계정인 것 같습니다.') }}</label></span>
                        </li>
                        <li style="display: flex;">
                            <div>
                            <input type="radio" v-model="pickedUserReason" value="3" id="reportUser3"/>
                            <label for="reportUser3"><i class="uil uil-check"></i></label>&nbsp;
                            </div>
                            <div> <span>
                            <label for="reportUser3"> {{ t('프로필 정보 또는 이미지가 혐오스러운 내용을 포함하고 있습니다.') }}</label></span>
                            </div>
                        </li>
                        
                    </ul>
                    <div @click="sendUserReport">
                        <button class="btn-default" style="width: 100% !important;">{{ t('post.report.btn') }}</button>
                    </div>
                </div>
            </div>
        </modal>

        <modal name="deleteComment" :clickToClose="false" class="modal-area-type" width="90%" height="auto"
               :maxWidth="380"
               :adaptive="true"
               :scrollable="true"
               @before-open="beforeOpen">
            <div class="modal-alert">
                <dl class="ma-header">
                    <dt>{{ t('information') }}</dt>
                    <dd>
                        <button @click="$modal.hide('deleteComment')"><i class="uil uil-times"></i></button>
                    </dd>
                </dl>
                <div class="ma-content">
                    <h2>{{ t('comment.delete.text') }} </h2>
                    <div>
                        <button class="btn-default w48p" @click="deleteComment">{{ t('yes') }}</button>
                        <button class="btn-gray w48p" @click="$modal.hide('deleteComment')">{{ t('no') }}</button>
                    </div>
                </div>
            </div>
        </modal>

        <modal name="needSubscribe" :clickToClose="false" class="modal-area-type" width="90%" height="auto"
               :maxWidth="380"
               :adaptive="true"
               :scrollable="true">
            <div class="modal-alert">
                <dl class="ma-header">
                    <dt>{{ t('information') }}</dt>
                    <dd>
                        <button @click="$modal.hide('needSubscribe')"><i class="uil uil-times"></i></button>
                    </dd>
                </dl>
                <div class="ma-content">
                    <h2>{{ t('community.subscribe.text1') }} <br/>{{ t('community.subscribe.text2') }} </h2>
                    <div>
                        <button class="btn-default w48p" @click="needSubscribe">{{ t('yes') }}</button>
                        <button class="btn-gray w48p" @click="$modal.hide('needSubscribe')">{{ t('no') }}</button>
                    </div>
                </div>
            </div>
        </modal> -->

  </ul>
</template>

<script setup lang="ts">
import _ from 'lodash'
import { PropType } from 'vue';
import { IComChannel, IFeed } from '~~/types';
import { useI18n } from 'vue-i18n';
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ElSelect, ElOption, ElMessage, ElDialog } from "element-plus";

import { useLocalePath } from 'vue-i18n-routing';
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router';
const { t, locale } = useI18n()


const LIMIT_SIZE = 10

const route = useRoute();
const localePath = useLocalePath();
const config = useRuntimeConfig();


const feeds = ref<IFeed[]>([])
const isPending = ref(true)

const isTextEditorOpen = ref(false)
const isEditorDestroy = ref(false)
const editorKey = ref(0)

const observer = ref<IntersectionObserver>(null)
const triggerDiv = ref()
const limit = ref(LIMIT_SIZE);
const offset = ref(0);
const media = ref(route.query?.media || null)
const isAddData = ref(false);


const user = computed(() => useUser().user.value.info)
const isLogin = computed(() => useUser().user.value.isLogin)
const gameInfo = computed(() => useGame().game.value.info)

const channelId = computed(() => route.params.id as string)
const gameId = computed(() => route.params.id as string)


const props = defineProps({
  type: String,
  ableToPost: {
    type: Boolean,
    default: true,
  },
  isSubscribed: {
    type: Boolean,
    default: true,
  },
  isMine: {
    type: Boolean,
    default: true,
  },
  channelInfo: Object as PropType<IComChannel>
})

let watcher = watch(
  () => route.query,
  (query) => {
    media.value = query.media as string;
    refresh()
  }
)


onMounted(async () => {

  if (channelId.value) {
    observer.value = new IntersectionObserver((entries) => {

      handleIntersection(entries[0])
    }, { root: null, threshold: 1 })

    observer.value.observe(triggerDiv.value)

    await fetch()
  }
})

function handleIntersection(target) {
  if (target.isIntersecting) {
    if (isAddData.value) {
      offset.value += limit.value;
      fetch()
    }
  }
}

onBeforeUnmount(() => {
  initPaging();
})

onBeforeRouteLeave((to, from) => {
  watcher()
})

async function fetch() {
  const query = {
    limit: limit.value,
    offset: offset.value,
    media: media.value
  }

  switch (props.type) {
    case 'community':
      if (props.channelInfo) {
        const { data, error, refresh } = await useFetch<{ result: [], totalCount: number }>(createQueryUrl(`/timeline/${channelId.value}/channel/${props.channelInfo.id}`, query), getComFetchOptions('get', true))
        if (data.value) {
          dataPaging(data.value)
        }
      } else {
        const { data, error, refresh } = await useFetch<{ result: [], totalCount: number }>(createQueryUrl(`/timeline/${channelId.value}/post`, query), getComFetchOptions('get', true))
        if (data.value) {
          dataPaging(data.value)
        }
      }

      break;
    case 'user':
      console.log('user')
      const { data: userPostData } = await useFetch<{ result: IFeed[], totalCount: number }>(createQueryUrl(`/timeline/channel/${channelId.value}`, query), getComFetchOptions('get', true))

      if (userPostData.value) {
        dataPaging(userPostData.value)
      }
      break;
    case 'game':
      const { data: gamePostData, error: gameError, } = await useFetch<{ result: [], totalCount: number }>(createQueryUrl(`/timeline/game/${gameId.value}`, query),
        getComFetchOptions('get', true))
      if (gamePostData.value) {
        dataPaging(gamePostData.value)
      }

      break;


  }

  isPending.value = false;

}

function dataPaging(data: { result: IFeed[], totalCount: number }) {
  const { result, totalCount } = data
  const validFeed = result.filter((feed) => { return feed.id !== null })
  const uniqueResult = _.uniqBy(validFeed, 'id');


  if (isAddData.value) {
    if (result.length > 0) {
      feeds.value = [...feeds.value, ...uniqueResult]
    } else {
      isAddData.value = false
      observer.value.unobserve(triggerDiv.value)
    }

  }
  else {
    feeds.value = uniqueResult;
    isAddData.value = true
  }
}

function initPaging() {
  limit.value = LIMIT_SIZE;
  offset.value = 0;
  isAddData.value = false;
  feeds.value = []

}

async function refresh() {
  console.log('refresh')
  initPaging();
  await fetch();

}

function timelineFilter(selected?: string) {
  media.value = selected;

  // filter.value = media;
}

function closeEditor() {
  isEditorDestroy.value = true
  editorKey.value = Date.now()
}



    // @Prop() currPage!: string;
    // @Prop() id!: any;
    // @Prop() community!: any;
    // @Prop() game!: any;
    // @Prop() mediaType!: any;

    // toast = new Toast();
    // metaSetting !: MetaSetting;

    // timeline: any = [];
    // user!: User;

    // //parameters
    // limit: number = 10;
    // offset: number = 0;
    // sort: string = '';
    // media: string = '';

    // //state
    // isAddData: boolean = false;
    // hasData: boolean = true;

    // activeTab: string = "SNS";

    // feedId = '';
    // pickedReason: any = '';
    // originImg = '';

    // commentId = '';
    // postId = '';

    // isFirstLoading: boolean = true;
    // pickedUserReason: any = '';
    // targetId!:any;


    // mounted() {
    //     this.$store.dispatch("loginState")
    //         .then(() => {
    //             this.fetch()
    //             this.createMetaSetting();
    //         });

    //     window.addEventListener("scroll", this.scrollCheck);
    // }

    // beforeDestroy() {
    //     window.removeEventListener("scroll", this.scrollCheck);
    // }

    // createMetaSetting() {
    //     switch (this.currPage) {
    //         case 'user':

    //             break;
    //         case 'game':
    //             break;
    //         case 'community':
    //             this.metaSetting = new MetaSetting({
    //                 title: `${this.community.name} | Zempie.com`,
    //                 meta: [
    //                     {name: 'description', content: this.community.description},
    //                     {
    //                         property: 'og:url',
    //                         content: `${this.$store.getters.homeUrl}/${this.$i18n.locale}/community/${this.community.id}/timeline`
    //                     },
    //                     {property: 'og:title', content: `${this.community.name} | Zempie.com`},
    //                     {property: 'og:description', content: this.community.description},
    //                 ]
    //             });
    //             break;
    //         case 'channel':
    //             break;
    //     }


    // }

    // reFetch() {
    //     this.$emit('reFetch')
    //     this.initData()
    //     this.fetch()
    // }

    // deleteComment() {
    //     this.$api.deleteComment(this.postId, this.commentId)
    //         .then((res) => {
    //             this.reFetch()
    //         })
    //         .catch((err) => {

    //         })
    //         .finally(() => {
    //             this.$modal.hide('deleteComment')
    //         })
    // }

    // beforeOpen(event) {
    //     this.commentId = event.params.commentId;
    //     this.postId = event.params.postId;

    // }

    // initData() {
    //     this.isAddData = false
    //     this.hasData = false
    //     this.limit = 10;
    //     this.offset = 0;
    //     this.timeline = [];
    //     this.sort = '';
    //     this.media = '';
    //     window.scrollTo(0, 0)
    // }


    // fetch() {
    //     switch (this.currPage) {
    //         case 'user':
    //             const userObj = {
    //                 limit: this.limit,
    //                 offset: this.offset,
    //                 sort: this.sort,
    //                 media: this.$route.query.media || this.mediaType
    //             }

    //             const channel_id: any = this.$route.name === 'MyChannel' ? this.user.channel_id : this.$route.params.channel_id;

    //             this.$api.userTimeline(channel_id, userObj)
    //                 .then((res: any) => {
    //                     if (this.isAddData) {
    //                         if (res.result.length > 0) {
    //                             this.timeline = [...this.timeline, ...res.result]
    //                         }
    //                         else {
    //                             window.removeEventListener("scroll", this.scrollCheck);
    //                         }
    //                     }
    //                     else {
    //                         this.timeline = res.result;
    //                         this.isAddData = true
    //                     }
    //                 })
    //                 .catch((err: AxiosError) => {
    //                     this.$router.push(`/${this.$i18n.locale}/communityList`)

    //                 })
    //                 .finally(() => {
    //                     this.isFirstLoading = false;
    //                     this.timeline = _.orderBy(this.timeline, 'created_at', 'desc')
    //                 })

    //             break;
    //         case 'game':
    //             const gameObj = {
    //                 game_id: this.game.id,
    //                 limit: this.limit,
    //                 offset: this.offset,
    //                 sort: this.sort,
    //                 media: this.$route.query.media
    //             }
    //             this.$api.gameTimeline(gameObj)
    //                 .then((res: any) => {
    //                     if (this.isAddData, res) {
    //                         if (res.result.length > 0) {
    //                             this.timeline = [...this.timeline, ...res.result]
    //                         }
    //                         else {
    //                             this.hasData = false
    //                             window.removeEventListener("scroll", this.scrollCheck);
    //                         }
    //                     }
    //                     else {
    //                         this.timeline = res.result;
    //                         this.isAddData = true
    //                     }
    //                 })
    //                 .catch((err: AxiosError) => {

    //                 })
    //                 .finally(() => {
    //                     this.isFirstLoading = false;
    //                     this.timeline = _.orderBy(this.timeline, 'created_at', 'desc')
    //                 })
    //             break;
    //         case 'community':
    //             const comObj = {
    //                 community_id: this.$route.params.community_id,
    //                 limit: this.limit,
    //                 offset: this.offset,
    //                 sort: this.sort,
    //                 media: this.$route.query.media
    //             }
    //             this.$api.communityTimeline(comObj)
    //                 .then((res: any) => {

    //                     if (this.isAddData) {
    //                         if (res.result.length > 0) {
    //                             this.timeline = [...this.timeline, ...res.result]
    //                         }
    //                         else {
    //                             this.hasData = false
    //                             window.removeEventListener("scroll", this.scrollCheck);

    //                         }
    //                     }
    //                     else {

    //                         this.timeline = res.result;
    //                         this.isAddData = true
    //                     }


    //                 })
    //                 .catch((err: AxiosError) => {


    //                 })
    //                 .finally(() => {
    //                     this.isFirstLoading = false;
    //                     this.timeline = _.orderBy(this.timeline, 'created_at', 'desc')
    //                 })

    //             break;
    //         //커뮤니티 내의 채널
    //         case 'channel':

    //             const chaObj = {
    //                 limit: this.limit,
    //                 offset: this.offset,
    //                 sort: this.sort,
    //                 media: this.media
    //             }

    //             this.$api.channelTimeline(this.$store.getters.currPage.community[0].id, this.$store.getters.currPage.community[0].channel_id, chaObj)
    //                 .then((res: any) => {
    //                     if (this.isAddData) {
    //                         if (res.result.length > 0) {
    //                             this.timeline = [...this.timeline, ...res.result]
    //                         }
    //                         else {
    //                             // console.log('no data')
    //                             this.hasData = false

    //                         }
    //                     }
    //                     else {

    //                         this.timeline = res.result;
    //                         this.isAddData = true
    //                     }


    //                 })
    //                 .catch((err: AxiosError) => {


    //                 })
    //                 .finally(() => {
    //                     this.isFirstLoading = false;
    //                     this.timeline = _.orderBy(this.timeline, 'created_at', 'desc')
    //                 })

    //             break;
    //     }

    // }


    // ableToPost() {
    //     let result: any = false;
    //     //커뮤니티 블락당한 경우
    //     if (this.user) {
    //         switch (this.currPage) {
    //             case 'user':
    //                 if (this.user.uid === this.$route.params.channel_id || this.$route.name === 'MyChannel') {
    //                     result = true;
    //                 }
    //                 else {
    //                     result = false;
    //                 }
    //                 break;
    //             case 'community' :
    //                 if (this.community.user_block) {
    //                     result = 'block'
    //                 }
    //                 else {
    //                     result = true;
    //                 }
    //                 break;
    //             case 'channel' :
    //                 result = true;
    //                 break;
    //             case 'game' :
    //                 if ((this.game.user && this.game.user.uid) === this.user.uid) {
    //                     result = true;
    //                 }

    //                 break;
    //         }
    //     }
    //     return result;

    // }

    // openEdit() {
    //     this.$store.dispatch('resetAttFiles')
    //     if (this.user) {
    //         this.$modal.show('writingModal')
    //     }
    //     else {
    //         this.$modal.show('needLogin')
    //         this.$store.commit('needLogin', true)
    //     }
    // }

    // openPostModal() {

    //     if (!this.user) {
    //         this.$modal.show('needLogin')
    //         this.$store.commit('needLogin', true)
    //     }
    //     else if (this.user) {
    //         switch (this.currPage) {
    //             case 'user' :
    //                 this.$modal.show('modalPost')
    //                 break;
    //             case 'community' :
    //                 if (!this.community.is_subscribed) {
    //                     this.$modal.show('needSubscribe')
    //                 }
    //                 else {
    //                     this.$modal.show('modalPost')
    //                 }
    //                 break;
    //             case 'channel' :
    //                 if (!this.community.is_subscribed) {
    //                     this.$modal.show('needSubscribe')
    //                 }
    //                 else {
    //                     this.$modal.show('modalPost')
    //                 }
    //                 break;
    //             case 'game' :
    //                 // if(this.game.user.uid === this.user.uid){
    //                 this.$modal.show('modalPost')
    //                 // }
    //                 break;
    //         }
    //     }

    // }

    // needSubscribe() {
    //     this.$api.subscribe({user_id: this.user.id, community_id: this.community.id})
    //         .then((res: AxiosResponse) => {
    //             this.$emit('reFetch')
    //         }).catch((err: AxiosError) => {
    //         if (err.message) {
    //             alert(err.message)
    //         }
    //     })
    // }

    // closePostModal() {
    //     this.fetch();
    //     this.isAddData = false;
    //     // (this.$refs.editModal as any).hide();
    // }

    // scrollCheck() {
    //     if (scrollDone(document.documentElement)) {
    //         this.offset += this.limit;
    //         this.fetch();
    //     }
    // }

    // closeModal() {
    //     this.$modal.hide('deleteModal')
    //     this.$store.commit('postContents', '')
    //     this.$store.dispatch('resetAttFiles')
    //     this.$store.dispatch('resetBlogImgArr')
    // }

    // @Watch('$route.query')
    // watchMedia() {
    //     this.initData()
    //     this.media = (this.$route.query.media as string);
    //     this.fetch();
    //     this.createMetaSetting();
    // }

    // deleteFeed(feedId: any) {
    //     this.feedId = feedId;
    //     this.$modal.show('deleteModal')
    // }

    // reportPost(feedId: any) {
    //     this.feedId = feedId;
    // }
    // reportUser(targetId: any){
    //     this.targetId=targetId;
    // }

    // yesDeletePost() {
    //     this.$modal.hide('deleteModal')


    //     this.$api.deletePost(this.feedId)
    //         .then((res: any) => {
    //             if (res.success) {
    //                 this.toasted.clear();
    //                 this.toast.successToast(`${this.t('posting.deleted')}`)
    //             }
    //             this.timeline = []
    //             this.initData();
    //             this.fetch();
    //         })
    //         .catch((err: any) => {

    //         })

    // }
    // sendUserReport(){

    //     const formData = new FormData();
    //     // formData.append('target_type', 0);
    //     formData.append('target_id', this.targetId);
    //     formData.append('reporter_id', (this.user.id).toString());
    //     formData.append('reason', this.pickedUserReason);


    //     this.$api.reportUser(formData)
    //         .then((res: AxiosResponse) => {
    //             console.log('res', res)

    //         })
    //         .catch((err: AxiosError) => {
    //             console.log('err', err)
    //         })

    // }
    // sendReport() {
    //     const obj = {
    //         post_id: this.feedId,
    //         user_id: this.user.id,
    //         targetType: 'POST',
    //         report_reason: this.pickedReason
    //     }

    //     this.$api.reportUser(obj)
    //         .then((res: AxiosResponse) => {

    //         })
    //         .catch((err: AxiosError) => {

    //             this.toast.failToast(err.message)
    //         })
    //         .finally(() => {
    //             this.$modal.hide('modalReport')
    //             this.pickedReason = ''
    //         })
    // }

    // commentInfo(event) {
    //     this.$api.deleteComment(event.params.postId, event.params.commentId)
    //         .then((res: AxiosResponse) => {

    //         })
    //         .catch((err: AxiosError) => {

    //         })
    // }

    // reMount() {
    //     this.initData();
    //     this.fetch()
    // }

</script>

<style scoped lang="scss">
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.fade-leave-active {
  position: absolute;
}



.pw-reset {
  padding-bottom: 44px !important;
  padding-top: 44px !important;
}

.pw-reset .pr-content>p {
  display: flex !important;
  justify-content: space-between !important;
}

.btn-default {
  width: 48% !important;
  border-radius: 20px;
}

.quick-post {
  height: 100px;

  .quick-post-body {
    height: 100%;
    display: flex;
  }

  .form-row {
    height: 100%;
  }
}

.entry-post-container {
  border-radius: 10px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100%;
}

.user-avatar {
  display: flex;
}

textarea {
  height: 57px !important;
  width: 500px !important;
  padding: 14px 18px;
}


.block-alarm {
  background-color: red;
  border-radius: 5px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}


input[type="radio"]+label {
  display: inline-block;
  width: 22px;
  height: 22px;
  text-align: center;
  font-size: 15px;
  color: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  cursor: pointer;
}

input[type="radio"]:checked+label {
  color: #fff;
  background: #FF6E17;
  border-color: #FF6E17;
}

input[type="radio"] {
  display: none;
}


.tab-search-swiper {
  &.mobile {
    display: none;
  }
}

@media all and (max-width: 479px) {
  .ta-message-send {
    margin-top: 20px;
  }

  .tab-search-swiper {
    &.mobile {
      display: block;
    }
  }
}

@media all and (min-width: 480px) and (max-width: 767px) {
  .ta-message-send {
    margin-top: 20px;
  }

  .tab-search-swiper {
    &.mobile {
      display: block;
    }
  }
}

@media all and (min-width: 768px) and (max-width: 991px) {
  .ta-message-send {
    margin-top: 20px;
  }

  .tab-search-swiper {
    &.mobile {
      display: block;
    }
  }
}

@media all and (min-width: 992px) and (max-width: 1199px) {}
</style>
<template>
  <div class="content" v-if="feed">
    <div class="area-view">
      <ul class="ta-post">
        <li class="tap-list">
          <dl class="tapl-title">
            <dt>
              <dl>
                <dt>
                  <UserAvatar :user="feed.user" :tag="'span'" />
                </dt>
                <dd v-if="feed.user">
                  <h2>{{  feed.user.name  }}</h2>
                  <p><i class="uis uis-clock" style="color:#c1c1c1;"></i> {{  dateFormat(feed.created_at)  }}</p>
                </dd>
                <dd v-else>
                  <h2>{{  $t('feed.noUser.post')  }}</h2>
                  <p><i class="uis uis-clock" style="color:#c1c1c1;"></i> {{  dateFormat(feed.created_at)  }}</p>
                </dd>
              </dl>
            </dt>
            <dd>
              <UserFollowBtn :user="feed.user" />

            </dd>

          </dl>

          <div class="tapl-content" v-html="feed.content"></div>
          <template
            v-if="feed.post_type === 'SNS' && feed.attatchment_files?.length === 1 && feed.attatchment_files[0].type === 'image'">
            <img style="height: 88%;
                             margin: 0 auto;
                             display: flex;" :src="feed.attatchment_files[0].url" class="feed-img mt-3" />
          </template>
          <template v-else-if="feed.post_type === 'SNS' && feed.attatchment_files && feed.attatchment_files.length > 0">
            <div class="tapl-movie-img" v-if="feed.attatchment_files[0].type === 'image'">
              <swiper class="swiper" :options="swiperOption" style="height: 350px;">
                <template v-for="file in feed.attatchment_files">
                  <swiper-slide>
                    <img style="height: 88%;
                             margin: 0 auto;
                             display: flex;" v-if="file.type === 'image'" :src="file.url" class="feed-img mt-3" />
                  </swiper-slide>

                </template>
                <div class="swiper-pagination" slot="pagination"></div>
              </swiper>
            </div>
            <div class="tapl-movie-img" v-else>
              <div v-for="file in feed.attatchment_files" :key="file.id">
                <video class="sns-img" v-if="file.type === 'video'" width="320" height="240" controls
                  :src="file.url"></video>
                <audio v-else-if="file.type === 'sound'" controls :src="file.url"></audio>
                <div class="audio" v-else-if="file.type === 'sound'">
                  <audio controls :src="file.url"></audio>
                  <p>{{  file.name  }}</p>
                </div>
              </div>
            </div>
          </template>
          <ul class="tapl-option">
            <li>
              <ul>
                <LikeBtn :feed="feed" />
                <li><i class="uil uil-comment-alt-dots" style="font-size:22px;"></i>&nbsp;
                  {{  feed.comment_cnt  }}
                </li>

                <li @click="copyUrl">
                  <a><i class="uil uil-share-alt" style="font-size:20px;"></i>
                  </a>
                </li>
              </ul>
            </li>
            <!-- <li>
              <dropdown-menu :overlay="false" class="tapl-more-dropdown" :isOpen="isOpenReportModal"
                @closed="isOpenReportModal = false;">
                <a class="btn-circle-none pt6" slot="trigger" @click="isOpenReportModal = !isOpenReportModal"><i
                    class="uil uil-ellipsis-h font25"></i></a>
                <div slot="body" class="more-list fixed">
                  <template v-if="user && (user.id === (feed.user && feed.user.id))">
                    <a @click="openEdit">{{ $t('feed.edit') }}</a>
                    <a @click="deletePost">{{ $t('feed.delete') }}</a>

                  </template>
                  <template v-else>
                    <router-link :to="`/${$i18n.locale}/channel/${feed.user && feed.user.channel_id}/timeline`">
                      {{ $t('visit.userChannel') }}
                    </router-link>
                    <a v-if="user" @click="report">{{ $t('post.report') }}</a>
                  </template>
                </div>
              </dropdown-menu>
            </li> -->
          </ul>
          <div class="tapl-comment">
            <h2>{{  $t('comment')  }} {{  feed.comment_cnt  }}{{  $t('comment.count.unit')  }} </h2>
            <CommentInput :postId="feed.id" @refresh="commentRefresh" />
            <ul>
              <li v-for="comment in comments" :key="comment.id">
                <Comment :comment="comment" />
              </li>
            </ul>

          </div>
        </li>
      </ul>
    </div>

    <!-- <modal name="deleteComment" :clickToClose="false" class="modal-area-type" width="90%" height="auto" :maxWidth="380"
      :adaptive="true" :scrollable="true" @before-open="beforeOpen">
      <div class="modal-alert">
        <dl class="ma-header">
          <dt>{{ $t('information') }}</dt>
          <dd>
            <button @click="$modal.hide('deleteComment')"><i class="uil uil-times"></i></button>
          </dd>
        </dl>
        <div class="ma-content">
          <h2>{{ $t('comment.delete.text') }}</h2>
          <div>
            <button class="btn-default w48p" @click="deleteComment">{{ $t('yes') }}</button>
            <button class="btn-gray w48p" @click="$modal.hide('deleteComment')">{{ $t('no') }}</button>
          </div>
        </div>
      </div>
    </modal>

    <modal :clickToClose="false" class="modal-area-type" name="deleteModal" width="90%" height="auto" :maxWidth="380"
      :adaptive="true" :scrollable="true">
      <div class="modal-alert">
        <dl class="ma-header">
          <dt>{{ $t('information') }}</dt>
          <dd>
            <button @click="$modal.hide('deleteModal')"><i class="uil uil-times"></i></button>
          </dd>
        </dl>
        <div class="ma-content">
          <h2>{{ $t('post.delete.modal.text1') }}<br />{{ $t('post.delete.modal.text2') }}</h2>
          <div>
            <button class="btn-default w48p" @click="yesDeletePost">{{ $t('yes') }}</button>
            <button class="btn-gray w48p" @@click="$modal.hide('deleteModal')">{{ $t('no') }}</button>
          </div>
        </div>
      </div>
    </modal>

    <modal :clickToClose="false" class="modal-area-type" name="modalPost" width="90%" height="auto" :maxWidth="550"
      :adaptive="true" :scrollable="true">
      <Post @reFetch="reFetch"></Post>
    </modal>

    <modal class="modal-area-type" name="modalReport" width="90%" height="auto" :maxWidth="375" :adaptive="true"
      :scrollable="true">
      <div class="modal-report">
        <dl class="mr-header">
          <dt>{{ $t('post.report.text') }}</dt>
          <dd>
            <button @click="$modal.hide('modalReport')"><i class="uil uil-times"></i></button>
          </dd>
        </dl>
        <div class="mr-content">
          <ul>
            <li>
              <input type="radio" v-model="pickedReason" value="1" id="report1" /> <label for="report1"><i
                  class="uil uil-check"></i></label>&nbsp;
              <span><label for="report1">{{ $t('post.report.reason1') }} </label></span>
            </li>
            <li>
              <input type="radio" v-model="pickedReason" value="2" id="report2" /> <label for="report2"><i
                  class="uil uil-check"></i></label>&nbsp; <span><label for="report2"> {{
                      $t('post.report.reason2')
                  }}</label></span>
            </li>
            <li>
              <input type="radio" v-model="pickedReason" value="3" id="report3" /> <label for="report3"><i
                  class="uil uil-check"></i></label>&nbsp; <span><label for="report3"> {{
                      $t('post.report.reason3')
                  }}</label></span>
            </li>
            <li>
              <input type="radio" v-model="pickedReason" value="4" id="report4" />
              <label for="report4"><i class="uil uil-check"></i></label>&nbsp; <span><label for="report4">
                  기타</label></span>
              <transition name="component-fade" mode="out-in">
                <div v-if="pickedReason === '4'"><textarea name=""></textarea></div>
              </transition>
            </li>
          </ul>
          <div @click="sendReport">
            <button class="btn-default" style="width: 100% !important;">{{ $t('post.report.btn') }}</button>
          </div>
        </div>
      </div>
    </modal> -->


  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';

import { Swiper, SwiperSlide } from 'swiper/vue';
import { dateFormat, execCommandCopy } from '~~/scripts/utils';
import { IFeed } from '~~/types';

const COMMENT_LIMIT = 10;
const route = useRoute();
const { t, locale } = useI18n()
const config = useRuntimeConfig()
const feed = ref<IFeed>();
const createdDate = ref('');
//     commentId: string = '';

//     originImg: string = "";
//     needLogin = false;
//     user!: User;
const comments = ref([]);

const limit = ref(COMMENT_LIMIT);
const offset = ref(0);
const sort = ref(null)

//     isAddData: boolean = false;
const swiperOption = ref({
  pagination: {
    el: '.swiper-pagination'
  }
})

const feedId = computed(() => route.params.id as string)



watch(
  () => feed.value,
  (feed) => {

    useHead({
      title: `${feed.user.name}${t('seo.feed.title')} | Zempie`,
      meta: [
        {
          name: 'description',
          content: `${feed.user.name}${t('seo.feed.desc')}`
        },
        {
          name: 'og:title',
          content: `${feed.user.name}${t('seo.feed.title')}`
        },
        {
          name: 'og:description',
          content: `${feed.user.name}${t('seo.feed.desc')}`
        },
        {
          name: 'og:url',
          content: `${config.ZEMPIE_URL}${route.path}`
        },
      ]
    })
  }
)


await fetch()
await commentFetch()


onMounted(async () => {


})

function editDone() {

}


async function fetch() {

  const { data, error, pending } = await useFetch<any>(`/post/${feedId.value}`, getComFetchOptions('get', true))


  if (data.value) {
    feed.value = data.value;

  }
}


async function commentRefresh() {
  comments.value = [];
  await commentFetch();

}

async function commentFetch() {

  const { data, pending, error } = await useFetch<{ result: [] }>(`/post/${feedId.value}/comment/list?limit=${limit.value}&offset=${offset.value}${sort.value ? '&sort=' + sort.value : ''}`, getComFetchOptions('get', true))
  if (!error.value) {
    if (data.value) {
      comments.value = data.value.result
    }
  }

}


function copyUrl() {
  execCommandCopy(window.location.href)
  ElMessage({
    message: t('copied.clipboard'),
    type: 'success'
  })
}

//     scrollCheck() {
//         if (scrollDone(document.documentElement)) {
//             this.offset += this.limit;
//             this.commentFetch();
//         }

//     }


//     openEdit() {
//         this.$modal.show('modalPost')
//         this.$store.commit('feed', this.feed)
//     }

//     commentInit() {
//         this.comments = [];
//         this.limit = 10;
//         this.offset = 0;
//         this.sort = '';
//         window.addEventListener("scroll", this.scrollCheck);
//     }



//     commentFetch() {
//         const obj = {
//             limit: this.limit,
//             offset: this.offset,
//             sort: this.sort
//         }
//         this.$api.comments(this.feedId, obj)
//             .then((res: any) => {
//                 if (this.isAddData) {
//                     if (res.result.length > 0) {
//                         this.comments = [...this.comments, ...res.result]
//                     }
//                     else {
//                         window.removeEventListener("scroll", this.scrollCheck);
//                     }
//                 }
//                 else {
//                     this.comments = res.result;
//                     this.isAddData = true
//                 }
//             })
//             .catch((err: AxiosError) => {

//             })
//             .finally(() => {

//             })
//     }

//     beforeOpen(event) {
//         this.commentId = event.params.commentId;

//     }

//     deleteComment() {
//         this.commentInit();
//         this.$api.deleteComment(this.feedId, this.commentId)
//             .then((res: AxiosResponse) => {
//                 this.$modal.hide('deleteComment')
//                 this.commentFetch()
//                 this.fetch();

//             })
//             .catch((err: AxiosError) => {

//             })
//     }

//     editDone() {
//         this.fetch();
//         this.commentInit();
//         this.commentFetch()
//     }

//     contentClicked(e: any) {
//         if (e.target.matches("img")) {
//             this.originImg = e.target.src;
//             (this.$refs.originImgModal as any).show();
//         }
//         else if (e.target.matches(".hashtag")) {
//             this.$router.push(`/${this.$i18n.locale}/search?hashtag=${e.target.attributes["data-id"].nodeValue}`);
//         }
//         else if (e.target.matches(".mention")) {
//             this.$router.push(`/${this.$i18n.locale}/channel/${e.target.attributes["channel-id"].nodeValue}/timeline`);
//         }
//     }

//     closeImgModal() {
//         (this.$refs.originImgModal as any).hide();
//     }

//     generateKey() {
//         return Date.now();
//     }

//     deletePost() {
//         this.$emit('deleteFeed', this.feed.id)
//         this.$modal.show('deleteModal')
//     }

//     yesDeletePost() {
//         this.$modal.hide('deleteModal')


//         this.$api.deletePost(this.feedId)
//             .then((res: any) => {
//                 if (res.success) {
//                     this.$toasted.clear();
//                     this.toast.successToast(`${this.$t('posting.deleted')}`)
//                 }
//                 this.$router.push(`/${this.$i18n.locale}`)
//             })
//             .catch((err: any) => {

//             })
//     }

//     report() {
//         this.$emit('reportPost', this.feed.id)
//         this.isOpenReportModal = !this.isOpenReportModal
//         this.$modal.show('modalReport')
//     }

// }
</script>

<style lang="scss" scoped>
.tapl-movie-img {
  padding-bottom: 0px !important;
  height: auto !important;

  div {

    audio {
      display: flex;
      align-items: center;
      border-radius: 5px;
      background: #f5f5f5;
      flex-direction: column;
      width: 95%;
      margin: 20px auto;

      p {
        width: 100%;
        height: 30px;
        padding-left: 20px;
      }
    }
  }
}


.feed-img {
  max-width: 100%;
}

.user-avatar {
  z-index: 999;
}

.sns-img {
  width: 100%
}

.post-open-content-body {
  text-align: left;

  div>* {
    margin-top: 0.75em !important;
  }
}

.post-open-content {
  margin-top: 0px !important;
}

.post-open-content-sidebar {
  display: flex;
  flex-direction: column;
  align-items: center;

  .forum-post-user-title {
    margin-top: 16px;
  }
}

.content-actions {
  border-bottom: 1px solid #2f3749;
}

.post-top {
  margin-left: 30px;
  margin-right: 30px;
  display: flex;
  height: 100px;
  align-items: center;

  .forum-post-user-title {
    margin-right: 30%;
    display: flex;
    flex-direction: column;
  }

  .button {
    width: 100px !important;
  }
}

.audio {
  margin: 20px 20px 0 20px;
  display: flex;
  align-items: center;
  border-radius: 5px;
  background: #f5f5f5;
  flex-direction: column;

  audio {
    width: 100%;
  }

  p {
    width: 100%;
    height: 30px;
    padding-left: 20px;
  }
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


//transition
.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity .3s ease;
}

.component-fade-enter,
.component-fade-leave-to

/* .component-fade-leave-active below version 2.1.8 */
  {
  opacity: 0;
}
</style>

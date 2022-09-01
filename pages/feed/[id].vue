<template>
  <div class="content">
    <ClientOnly>

      <div class="area-view">
        <ul class="ta-post" v-if="feed">
          <li class="tap-list">
            <dl class="tapl-title">
              <dt>
                <dl>
                  <dt>
                    <UserAvatar :user="feed?.user" :tag="'span'" />
                  </dt>
                  <dd v-if="feed?.user">
                    <h2>{{  feed?.user?.name  }}</h2>
                    <p><i class="uis uis-clock" style="color:#c1c1c1;"></i> {{  dateFormat(feed?.created_at)  }}</p>
                  </dd>
                  <dd v-else>
                    <h2>{{  $t('feed.noUser.post')  }}</h2>
                    <p><i class="uis uis-clock" style="color:#c1c1c1;"></i> {{  dateFormat(feed?.created_at)  }}</p>
                  </dd>
                </dl>
              </dt>
              <dd>
                <!-- TODO: is_following 백엔드 확인-->
                <!-- <UserFollowBtn :user="feed.user" @refresh="fetch" /> -->
              </dd>

            </dl>

            <div class="tapl-content" v-html="feed?.content"></div>
            <template
              v-if="feed?.post_type === 'SNS' && feed?.attatchment_files?.length === 1 && feed?.attatchment_files[0].type === 'image'">
              <img style="height: 88%;
                             margin: 0 auto;
                             display: flex;" :src="feed?.attatchment_files[0].url" class="feed-img mt-3" />
            </template>
            <template
              v-else-if="feed?.post_type === 'SNS' && feed?.attatchment_files && feed?.attatchment_files.length > 0">
              <div class="tapl-movie-img" v-if="feed?.attatchment_files[0].type === 'image'">
                <swiper class="swiper" :options="swiperOption" style="height: 350px;">
                  <template v-for="file in feed?.attatchment_files">
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
                <div v-for="file in feed?.attatchment_files" :key="file.id">
                  <video class="sns-img" v-if="file.type === 'video'" width="320" height="240" controls
                    :src="file.url"></video>
                  <audio v-else-if="file.type === 'sound'" controls :src="file.url"></audio>
                  <div class="audio" v-else-if="file.type === 'sound'">
                    <audio controls :src="file.url"></audio>
                    <p>{{  file?.name  }}</p>
                  </div>
                </div>
              </div>
            </template>

            <ul class="tapl-option">
              <li>
                <ul>
                  <LikeBtn v-if="feed" :feed="feed" />
                  <li><i class="uil uil-comment-alt-dots" style="font-size:22px;"></i>&nbsp;
                    {{  feed?.comment_cnt  }}
                  </li>

                  <li @click="copyUrl">
                    <a><i class="uil uil-share-alt" style="font-size:20px;"></i>
                    </a>
                  </li>
                </ul>

              </li>

              <li>
                <PostDropdown :feed="feed" @deletePost="$router.back()" @refresh="refresh" />
              </li>

            </ul>
            <div class="tapl-comment" v-if="comments?.result">
              <p>{{  $t('comment')  }} {{  feed?.comment_cnt  }}{{  $t('comment.count.unit')  }} </p>
              <CommentInput :postId="feed?.id" @refresh="commentRefresh" />
              <ul>
                <li v-for="comment in comments.result" :key="comment.id">
                  <Comment :comment="comment" @refresh="commentRefresh" />
                </li>
              </ul>

            </div>
          </li>
        </ul>

      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElDropdown, ElDialog } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { useLocalePath } from 'vue-i18n-routing';

import { Swiper, SwiperSlide } from 'swiper/vue';
import { dateFormat, execCommandCopy } from '~~/scripts/utils';
import { IFeed } from '~~/types';

const localePath = useLocalePath();


const COMMENT_LIMIT = 10;
const route = useRoute();
const router = useRouter();
const { t, locale } = useI18n()
const config = useRuntimeConfig()
// const feed = ref<IFeed>();
const createdDate = ref('');
// const comments = ref([]);

const limit = ref(COMMENT_LIMIT);
const offset = ref(0);
const sort = ref(null)

const swiperOption = ref({
  pagination: {
    el: '.swiper-pagination'
  }
})
const userInfo = ref(computed(() => useUser().user.value.info))
const feedId = computed(() => route.params.id as string)


const { data: feed, error, pending, refresh } = await useFetch<any>(`/post/${feedId.value}`, getComFetchOptions('get', true))
const { data: comments, pending: commentPending, error: commentError, refresh: commentRefresh } = await useFetch<{ result: [] }>(`/post/${feedId.value}/comment/list?limit=${limit.value}&offset=${offset.value}${sort.value ? '&sort=' + sort.value : ''}`, getComFetchOptions('get', true))


useHead({
  title: `${feed.value?.user.name}${t('seo.feed.title')} | Zempie`,
  meta: [
    {
      name: 'description',
      content: `${feed.value?.content.slice(0, 20)}${t('seo.feed.desc')}`
    },
    {
      name: 'og:title',
      content: `${feed.value?.user.name}${t('seo.feed.title')}`
    },
    {
      name: 'og:description',
      content: `${feed.value?.content.slice(0, 20)}${t('seo.feed.desc')}`
    },
    {
      name: 'og:url',
      content: `${config.ZEMPIE_URL}${route.path}`
    },
  ]
})

// watch(
//   () => feed.value,
//   async (feed) => {
//     console.log(feed)
//     useHead({
//       title: `${feed.user.name}${t('seo.feed.title')} | Zempie`,
//       meta: [
//         {
//           name: 'description',
//           content: `${feed.content.slice(0, 20)}${t('seo.feed.desc')}`
//         },
//         {
//           name: 'og:title',
//           content: `${feed.user.name}${t('seo.feed.title')}`
//         },
//         {
//           name: 'og:description',
//           content: `${feed.content.slice(0, 20)}${t('seo.feed.desc')}`
//         },
//         {
//           name: 'og:url',
//           content: `${config.ZEMPIE_URL}${route.path}`
//         },
//       ]
//     })
//   }
// )





// async function fetch() {

//   const { data, error, pending } = await useFetch<any>(`/post/${feedId.value}`, getComFetchOptions('get', true))

//   console.log(data.value)
//   if (data.value) {
//     feed.value = data.value;
//     console.log(data.value)

//   }
// }


// async function commentRefresh() {
//   comments.value = [];
//   await commentFetch();

// }

// async function commentFetch() {

//   const { data, pending, error } = await useFetch<{ result: [] }>(`/post/${feedId.value}/comment/list?limit=${limit.value}&offset=${offset.value}${sort.value ? '&sort=' + sort.value : ''}`, getComFetchOptions('get', true))
//   if (!error.value) {
//     if (data.value) {
//       comments.value = data.value.result
//     }
//   }

// }


function copyUrl() {
  execCommandCopy(window.location.href)
  ElMessage({
    message: t('copied.clipboard'),
    type: 'success'
  })
}
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

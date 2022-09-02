<template>
  <div class="content">
    <!-- 비주얼영역 -->

    <div
      class="visual-img"
      style="
        background: url('/images/visual_top_img.png') center no-repeat;
        background-size: cover;
      "
    >
      <div class="title">
        Communities
        <!-- TODO: 커뮤니티 전체 개수 -->
        <!-- <span v-if="communityList && communityList.length > 0">({{ communityList.length }})</span> -->
      </div>
      <p>Browse all the groups of the community!</p>
    </div>

    <dl class="area-search-sort">
      <dt></dt>
      <dd>
        <div class="sort-default">
          <a @click="sortGroups(0)" :class="filter === 0 ? 'active' : ''"
            ><i class="uis uis-check"></i>
            {{ t('filter.recent') }}
          </a>
          <span>·</span>
          <a @click="sortGroups(1)" :class="filter === 1 ? 'active' : ''"
            ><i class="uis uis-check"></i>
            {{ t('filter.subscribe') }}
          </a>
          <span>·</span>
          <a @click="sortGroups(2)" :class="filter === 2 ? 'active' : ''"
            ><i class="uis uis-check"></i>
            {{ t('filter.alphabet') }}
          </a>
        </div>
      </dd>
    </dl>
    <ClientOnly>
      <div class="result-container">
        <div class="card-timeline">
          <TransitionGroup name="fade">
            <!-- <CommunityCardSk v-show="pending" v-for="com in 4" :key="com" /> -->
            <CommunityCard
              v-for="community in communities"
              :community="community"
              :key="community.id"
            >
              <template v-slot:subBtn>
                <CommunitySubscribeBtn
                  :community="community"
                  @refresh="refresh"
                />
              </template>
            </CommunityCard>
          </TransitionGroup>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const route = useRoute()
const config = useRuntimeConfig()

// const communities: any = ref([]);
const filter = ref(0)
const isPending = ref(true)

const query = ref({
  limit: 20,
  offset: 0,
  community: '',
  sort: '',
  show: '',
})
// await fetch()

const {
  data: communities,
  pending,
  refresh,
} = await useFetch<any>(
  () => createQueryUrl('/community/list', query.value),
  getComFetchOptions('get', true)
)

useHead({
  title: `${t('communityList')} | Zempie`,
  meta: [
    {
      name: 'description',
      content: `${t('communityList.desc')}`,
    },
    {
      name: 'og:title',
      content: `${t('communityList')}`,
    },
    {
      name: 'og:description',
      content: `${t('communityList.desc')}`,
    },
    {
      name: 'og:url',
      content: `${config.ZEMPIE_URL}${route.path}`,
    },
    {
      name: 'og:image',
      content: '/images/sns-thumbnail.png',
    },
  ],
})

onMounted(() => {
  isPending.value = pending.value
})

// TODO: 많아지면,, 무한 스크롤 적용

// async function fetch() {
//   const query = {
//     limit: obj.limit,
//     offset: obj.offset,
//     sort: obj.sort
//   }
//   const { data, pending } = await useFetch(() => createQueryUrl('/community/list', query), getComFetchOptions('get', true))
//   if (data.value) {
//     communities.value = data.value
//     console.log(communities.value)
//   }
//   isPending.value = false;
// }

const sortGroups = _.debounce(async (sorted: number) => {
  filter.value = sorted

  if (filter.value === 0) {
    query.value.sort = ''
    await refresh()
  } else if (filter.value === 1) {
    query.value.sort = 'SUBSCRIBE'
    await refresh()
  } else if (filter.value === 2) {
    query.value.sort = 'ALPAHBETIC'
    await refresh()
  }
}, 300)
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

/* .list-complete-leave-active below version 2.1.8 */ {
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

  .card-timeline > li {
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

/* .component-fade-leave-active below version 2.1.8 */ {
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

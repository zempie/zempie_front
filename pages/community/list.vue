<template>
  <div class="content">
    <div class="visual-img" style="
            background: url('/images/com_list_banner.jpeg') center no-repeat;
            background-size: cover;
          ">
      <div class="title">
        <h1> {{ $t('communities') }}</h1>
        <!-- TODO: 커뮤니티 전체 개수 -->
        <!-- <span v-if="communityList && communityList.length > 0">({{ communityList.length }})</span> -->
      </div>
      <h2>Browse all the groups of the community!</h2>
    </div>

    <dl class="area-search-sort">
      <dt></dt>
      <dd>
        <div class="sort-default">
          <a @click="sortGroups(0)" :class="[filter === 0 && 'active', 'pointer']"><i class="uis uis-check"></i>
            {{ t('filter.recent') }}
          </a>
          <span>·</span>
          <a @click="sortGroups(1)" :class="[filter === 1 && 'active', 'pointer']"><i class="uis uis-check"></i>
            {{ t('filter.subscribe') }}
          </a>
          <span>·</span>
          <a @click="sortGroups(2)" :class="[filter === 2 && 'active', 'pointer']"><i class="uis uis-check"></i>
            {{ t('filter.alphabet') }}
          </a>
        </div>
      </dd>
    </dl>
    <div class="card-timeline" style="margin: 0 auto;">
      <CommunityCardSk v-if="isPending" v-for="com in 4" />
      <TransitionGroup v-else name="fade">
        <CommunityCard v-for="community in communities" :community="community" :key="community.id"
          :isSubModal="isSubModal" @is-sub-modal="(e) => subModalState(e)">
          <template v-slot:subBtn>
            <CommunitySubscribeBtn ref="subBtnRef" :community="community" @refresh="fetch"
              @is-sub-modal="(e) => subModalState(e)" />
          </template>
        </CommunityCard>
      </TransitionGroup>
    </div>
    <div ref="triggerDiv"></div>
  </div>
</template>

<script setup lang="ts">
import shared from '~~/scripts/shared';
import _ from 'lodash'
import { useI18n } from 'vue-i18n'
import { onBeforeRouteLeave } from 'vue-router';

const MAX_LIMIT = 20

const { t, locale } = useI18n()
const route = useRoute()
const config = useRuntimeConfig()

const communities: any = ref([])
const filter = ref(0)
const isPending = ref(true)

const limit = ref(MAX_LIMIT)
const offset = ref(0)
const sort = ref('')
const observer = ref<IntersectionObserver>(null)
const isAddData = ref(false)

const isSubModal = ref()

const triggerDiv = ref<Element>()

const subBtnRef = ref()
const isMobile = computed(() => useCommon().common.value.isMobile)


shared.createHeadMeta(t('communityList'), t('communityList.desc'))


definePageMeta({
  name: 'community-list'
})


onBeforeRouteLeave((to, from, next) => {

  if (useCommon().common.value.isPopState) {
    subBtnRef.value.forEach(element => {
      element.closeModal()
    });
    next(false)
    useCommon().setPopState(false)
  } else {
    next()
  }
})


onMounted(async () => {
  createObserver()
  nextTick(async () => {
    await fetch()
    isPending.value = false
  })
})



function createObserver() {
  observer.value = new IntersectionObserver(
    (entries) => {
      handleIntersection(entries[0])
    },
    { root: null, threshold: 1, rootMargin: '10px' }
  )
  observer.value.observe(triggerDiv.value)
}


async function handleIntersection(target) {
  if (target.isIntersecting) {
    if (isAddData.value) {
      offset.value += limit.value
    }
    await fetch()
  }
}

async function fetch() {
  const query = {
    limit: limit.value,
    offset: offset.value,
    sort: sort.value,
  }
  const { data, pending } = await useCustomAsyncFetch(
    createQueryUrl('/community/list', query),
    getComFetchOptions('get', true)
  )
  if (data.value) {
    isPending.value = false
    communities.value = data.value

  }
}

const sortGroups = _.debounce(async (sorted: number) => {
  filter.value = sorted

  if (filter.value === 0) {
    sort.value = ''
    await fetch()
  } else if (filter.value === 1) {
    sort.value = 'SUBSCRIBE'
    await fetch()
  } else if (filter.value === 2) {
    sort.value = 'ALPAHBETIC'
    await fetch()
  }
}, 300)


function subModalState(e) {
  isSubModal.value = e;
  if (e) {
    // useCommon().setPopState(true)
  }
}
</script>

<style scoped lang="scss">
.visual-img {
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 150px;

  .title {
    h1 {
      font-size: 2.25rem;
      font-weight: 700;
    }
  }

  h2 {
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
</style>

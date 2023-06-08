<template>
  <div class="content">
    <div class="visual-img" style="
            background: url('/images/com_list_banner.jpeg') center no-repeat;
            background-size: cover;
          ">
      <div class="title">
        <h1>Communities</h1>
        <!-- TODO: 커뮤니티 전체 개수 -->
        <!-- <span v-if="communityList && communityList.length > 0">({{ communityList.length }})</span> -->
      </div>
      <h2>Browse all the groups of the community!</h2>
    </div>

    <dl class="area-search-sort">
      <dt></dt>
      <dd>
        <div class="sort-default">
          <a @click="sortGroups(0)" :class="filter === 0 && 'active'"><i class="uis uis-check"></i>
            {{ t('filter.recent') }}
          </a>
          <span>·</span>
          <a @click="sortGroups(1)" :class="filter === 1 && 'active'"><i class="uis uis-check"></i>
            {{ t('filter.subscribe') }}
          </a>
          <span>·</span>
          <a @click="sortGroups(2)" :class="filter === 2 && 'active'"><i class="uis uis-check"></i>
            {{ t('filter.alphabet') }}
          </a>
        </div>
      </dd>
    </dl>
    <div class="result-container">
      <div class="card-timeline" style="margin: 0 auto;">
        <CommunityCardSk v-if="isPending" v-for="com in 4" />
        <TransitionGroup v-else name="fade">
          <CommunityCard v-for="community in communities" :community="community" :key="community.id"
            :isSubModal="isSubModal" @is-sub-modal="(e) => isSubModal = e">
            <template v-slot:subBtn>
              {{ isSubModal }}
              <CommunitySubscribeBtn :community="community" @refresh="fetch" @is-sub-modal="(e) => isSubModal = e" />
            </template>
          </CommunityCard>
        </TransitionGroup>
        <div ref="triggerDiv"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import shared from '~~/scripts/shared';
import _ from 'lodash'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const route = useRoute()
const config = useRuntimeConfig()

const communities: any = ref([])
const filter = ref(0)
const isPending = ref(true)

const limit = ref(20)
const offset = ref(0)
const community = ref('')
const sort = ref('')
const observer = ref<IntersectionObserver>(null)
const isAddData = ref(false)

const isSubModal = ref()

const triggerDiv = ref<Element>()
definePageMeta({
  layout: 'default',
})

shared.createHeadMeta(t('communityList'), t('communityList.desc'))


onMounted(async () => {
  observer.value = new IntersectionObserver(
    (entries) => {
      handleIntersection(entries[0])
    },
    { root: null, threshold: 1 }
  )
  observer.value.observe(triggerDiv.value)
  await fetch()
})

async function handleIntersection(target) {
  if (target.isIntersecting) {
    if (isAddData.value) {
      offset.value += limit.value
      await fetch()
    } else {
      await fetch()
    }
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
    communities.value = data.value
  }
  isPending.value = false
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

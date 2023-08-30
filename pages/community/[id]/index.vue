<template>
  <NuxtLayout name="community">
    <ClientOnly>
      <div>
        <dl class="three-area">
          <CommunityChannelList :community="communityInfo" />
          <dd>
            <PostTimeline type="community" :isSubscribed="communityInfo?.is_subscribed" :key="communityInfo?.id"
              ref="timelineRef">
              <template #communityInput>
                <input type="text" :placeholder="t('postModalInput')" readonly @click="
                  isLogin
                    ? !communityInfo?.is_subscribed && openSubModal()
                    : useModal().openLoginModal()
                  " />
              </template>
            </PostTimeline>
          </dd>
          <dt>
            <div class="ta-about">
              <h2>{{ $t('about.us') }}</h2>
              <div>
                {{ communityInfo?.description }}
              </div>
              <dl>
                <dt>{{ $t('created') }}</dt>
                <dd>{{ createdDate }}</dd>
              </dl>
            </div>
            <div class="ta-groups">
              <h2>{{ $t('other.communities') }}</h2>
              <CommunityList :communities="communities" :isLoading="pending" />
            </div>
          </dt>
        </dl>
      </div>

      <el-dialog v-model="needSubscribe" append-to-body class="modal-area-type" width="380px">
        <div class="modal-alert">
          <dl class="ma-header">
            <dt>{{ t('information') }}</dt>
            <dd>
              <button @click="closeSubModal">
                <i class="uil uil-times"></i>
              </button>
            </dd>
          </dl>
          <div class="ma-content">
            <h2>
              {{ t('community.subscribe.text1') }} <br />{{
                t('community.subscribe.text2')
              }}
            </h2>
            <div>
              <button class="btn-default w48p" @click="subscribe">
                {{ t('yes') }}
              </button>
              <button class="btn-gray w48p" @click="closeSubModal">
                {{ t('no') }}
              </button>
            </div>
          </div>
        </div>
      </el-dialog>
    </ClientOnly>
  </NuxtLayout>
</template>
<script setup lang="ts">
import dayjs from 'dayjs'
import { useWindowScroll } from '@vueuse/core'
import { ElDialog } from 'element-plus'
import { ICommunity } from '~~/types'
import { useI18n } from 'vue-i18n'
import shared from '~~/scripts/shared'
import { onBeforeRouteLeave } from 'vue-router';

const MAX_LIST_SIZE = 5

const { t } = useI18n()

const route = useRoute()

const limit = ref(MAX_LIST_SIZE)
const needSubscribe = ref(false)
const timelineRef = ref()

const isLogin = computed(() => useUser().user.value.isLogin)
const communityId = computed(() => route.params.id as string)
const communityInfo = computed(() => useCommunity().community.value.info)
const createdDate = computed(() =>
  dayjs(communityInfo.value?.created_at).format(
    'YYYY / MM / DD'
  )
)
const isMobile = computed(() => useCommon().common.value.isMobile)

onBeforeRouteLeave((to, from, next) => {
  if (useCommon().common.value.isPopState) {
    closeSubModal()
    timelineRef.value.closeTextEditor()
    console.log(timelineRef.value)
    // next(false)
  } else {
    next()
  }
})

definePageMeta({
  title: 'community-channel',
  name: 'communityChannel',
})



/**
 * seo 반영은 함수안에서 되지 않으므로 최상단에서 진행함
 */
// await useCommunity().setCommunity(communityId.value)
const { data } = await useAsyncData<ICommunity>('communityInfo', () =>
  $fetch(`/community/${communityId.value}`, getComFetchOptions('get', true)),
  {
    initialCache: false
  }
)

useCommunity().community.value.info = data.value
shared.createHeadMeta(`${data.value.name}`, `${data.value.description}`, `${data.value.profile_img}`)


onBeforeUnmount(() => {
  useCommunity().resetCommunity()
})


const { data: comList, pending } = await useFetch<any>(
  createQueryUrl(`/community/list`, { limit: limit.value, }), getComFetchOptions('get', true)
)

const communities = computed(() => {
  return comList.value.filter((elem) => {
    return elem.id !== communityId.value
  })
})



async function subscribe() {
  const { data, error } = await useCustomAsyncFetch(`/community/${communityId.value}/subscribe`, getComFetchOptions('post', true))

  if (!error.value) {
    useCommunity().setSubscribe()
    needSubscribe.value = false
  }
}

function openSubModal() {
  needSubscribe.value = true
  if (isMobile.value) {
    useCommon().setPopState(true)
  }
}

function closeSubModal() {
  needSubscribe.value = false
  if (isMobile.value) {
    useCommon().setPopState(false)
  }
}
</script>

<style scoped lang="scss"></style>

<template>
  <NuxtLayout name="community">
    <ClientOnly>
      <div>
        <dl class="three-area" v-if="isPending">
          <CommunityChannelListSk />
          <dd>
            <TimelineSk />
          </dd>
          <CommunityAboutSk />
        </dl>
        <dl class="three-area" v-else>
          <CommunityChannelList :community="communityInfo" />
          <dd>
            <PostTimeline type="community" :isSubscribed="communityInfo?.is_subscribed" :key="communityInfo?.id">
              <template #communityInput>
                <input type="text" :placeholder="t('postModalInput')" readonly @click="
                  isLogin
                    ? !communityInfo?.is_subscribed && (needSubscribe = true)
                    : useModal().openLoginModal()
                " />
              </template>
            </PostTimeline>
          </dd>
          <dt>
            <div class="ta-about">
              <h2>About us</h2>
              <div>
                {{ communityInfo?.description }}
              </div>
              <dl>
                <dt>Created</dt>
                <dd>{{ createdDate }}</dd>
              </dl>
            </div>
            <div class="ta-groups">
              <h2>Other communities</h2>
              <CommunityList :communities="communities" :isLoading="isPending" />
            </div>
          </dt>
        </dl>
      </div>

      <el-dialog v-model="needSubscribe" append-to-body class="modal-area-type" width="380px">
        <div class="modal-alert">
          <dl class="ma-header">
            <dt>{{ t('information') }}</dt>
            <dd>
              <button @click="needSubscribe = false">
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
              <button class="btn-gray w48p" @click="needSubscribe = false">
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

import { ElDialog } from 'element-plus'
import { ICommunity } from '~~/types'
import { useI18n } from 'vue-i18n'
import shared from '~~/scripts/shared'
const { t } = useI18n()

const MAX_LIST_SIZE = 5
const route = useRoute()
const config = useRuntimeConfig()
const accessToken = useCookie(config.COOKIE_NAME).value

const limit = ref(MAX_LIST_SIZE)
const offset = ref(0)
const communities = ref([])
const isPending = ref(true)
const needSubscribe = ref(false)

const isLogin = computed(() => useUser().user.value.isLogin)
const communityId = computed(() => route.params.id as string)
const communityInfo = computed(() => useCommunity().community.value.info)
const createdDate = computed(() =>
  dayjs(communityInfo.value?.created_at).format(
    'YYYY / MM / DD'
  )
)

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


onMounted(async () => {
  await fetch()
})

onBeforeUnmount(() => {
  useCommunity().resetCommunity()
})

async function fetch() {
  const query = {
    limit: limit.value,
    offset: offset.value,
  }

  const { data } = await useFetch<any>(
    createQueryUrl(`/community/list`, query), getComFetchOptions('get', true)
  )

  if (data.value.length) {
    communities.value = data.value?.filter((elem) => {
      return elem.id !== communityId.value
    })
  }
  isPending.value = false
}

async function subscribe() {
  const { data, error } = await useCustomAsyncFetch(`/community/${communityId.value}/subscribe`, getComFetchOptions('post', true))

  if (!error.value) {
    useCommunity().setSubscribe()
    needSubscribe.value = false
  } else {
    // ElMessage({
    //   message: error.value,
    //   type: 'error'
    // })
  }
}
</script>

<style scoped lang="scss"></style>

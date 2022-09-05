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
          <CommunityChannelList
            :community="communityInfo"
            @channelInfo="getChannelInfo"
          />
          <dd>
            <PostTimeline
              type="community"
              :isSubscribed="communityInfo?.is_subscribed"
              :channelInfo="channelInfo"
              :key="channelInfo?.id"
            >
              <template #inputBox>
                <input
                  type="text"
                  :placeholder="t('postModalInput')"
                  readonly
                  @click="
                    isLogin
                      ? communityInfo?.is_subscribed
                        ? ''
                        : (needSubscribe = true)
                      : useModal().openLoginModal()
                  "
                />
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
              <CommunityList :communities="communities" />
            </div>
          </dt>
        </dl>
      </div>

      <el-dialog
        v-model="needSubscribe"
        append-to-body
        custom-class="modal-area-type"
        width="380px"
      >
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
import {
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElSelect,
  ElOption,
  ElMessage,
  ElDialog,
} from 'element-plus'
import { dateFormat } from '~/scripts/utils'
import { IComChannel } from '~~/types'
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()

const MAX_LIST_SIZE = 5
const route = useRoute()
const router = useRouter()
const $nuxt = useNuxtApp()
const config = useRuntimeConfig()
const accessToken = useCookie(config.COOKIE_NAME).value

const communityInfo = computed(() => useCommunity().community.value.info)
const createdDate = computed(() =>
  dateFormat(useCommunity().community.value.info?.created_at)
)

const communities = ref([])
const isPending = ref(true)
const needSubscribe = ref(false)
const isLogin = computed(() => useUser().user.value.isLogin)

const communityId = computed(() => route.params.id as string)

const channelInfo = ref()

const limit = ref(MAX_LIST_SIZE)
const offset = ref(0)

watch(
  () => communityInfo.value,
  (info) => {
    useHead({
      title: `${info.name} | Zempie community`,
      meta: [
        {
          name: 'description',
          content: `${info.description}`,
        },
        {
          name: 'og:title',
          content: `${info.name}`,
        },
        {
          name: 'og:description',
          content: `${info.description}`,
        },
        {
          name: 'og:url',
          content: `${config.ZEMPIE_URL}${route.path}`,
        },
      ],
    })
  }
)

onMounted(async () => {
  await fetch()
})

async function fetch() {
  const query = {
    limit: limit.value,
    offset: offset.value,
  }

  const { data, pending } = await useFetch<any>(
    () => createQueryUrl(`/community/list`, query),
    {
      method: 'get',
      baseURL: config.COMMUNITY_API,
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    }
  )

  if (data.value.length) {
    communities.value = data.value?.filter((elem) => {
      return elem.id !== communityId.value
    })
  }
  isPending.value = false
}

async function subscribe() {
  const { data, error } = await community.subscribe(communityId.value)

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

function getChannelInfo(info: IComChannel) {
  channelInfo.value = info
}
</script>

<style scoped lang="scss"></style>

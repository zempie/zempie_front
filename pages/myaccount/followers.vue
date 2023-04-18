<template>
  <NuxtLayout name="user-setting">
    <div>
      <dl class="area-title">
        <dt>
          Followers <span>{{ totalCount }}</span>
        </dt>
      </dl>
      <UserList :users="users" :isPending="isPending" />
      <div v-if="!isPending && !users.length" class="no-result">
        <h1>{{ $t('no.followers') }}</h1>
        <img src="/images/not-found.png" style="width: 100px; height: 100px" />
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { IUser } from '~~/types'
import { useI18n } from 'vue-i18n'
import shared from '~/scripts/shared'

const { t, locale } = useI18n()
const route = useRoute()
const config = useRuntimeConfig()

definePageMeta({
  title: 'my-follower',
  name: 'myFollowers',
  middleware: 'auth',
})

shared.createHeadMeta(t('seo.profile.followers.title'), t('seo.profile.followers.desc'))

const MAX_PAGE_SIZE = 20

const payload = reactive({
  limit: MAX_PAGE_SIZE,
  offset: 0,
  search: '',
})

const totalCount = ref(0)
const isPending = ref(true)
const users = ref<IUser[]>([])

const userInfo = computed(() => useUser().user.value.info)

watch(
  () => userInfo.value,
  (user) => {
    if (user) {
      fetch()
    }
  }
)

onMounted(async () => {
  if (userInfo.value?.id) {
    await fetch()
  }
})

async function fetch() {
  // const { data, pending, refresh, error } = await user.followerList(
  //   payload,
  //   Number(userInfo.value.id)
  // )

  const { data, pending, refresh, error } = await useCustomAsyncFetch<{ totalCount: number, result: any }>(`/user/${Number(userInfo.value.id)}/list/follower`, getComFetchOptions('get', true, payload))


  if (!error.value) {
    totalCount.value = data.value.totalCount
    users.value = data.value.result.map((user) => {
      return {
        name: user.name,
        banner_img: user.banner_img,
        nickname: user.nickname,
        id: user.id,
        channel_id: user.channel_id,
        email: user.email,
        uid: user.uid,
        followers_cnt: user.followers_cnt,
        followings_cnt: user.followings_cnt,
        is_following: user.is_following,
        picture: user.profile_img,
      }
    })
  }

  isPending.value = false
}
</script>

<style lang="scss" scoped>
.no-result {
  display: flex;
  align-content: center;
  justify-content: center;
  flex-direction: column;
  flex-wrap: wrap;

  h1 {
    color: #333;
    font-size: 18px;
    margin-bottom: 10px;
  }

  img {
    margin: 0 auto;
  }
}
</style>

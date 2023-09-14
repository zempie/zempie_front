<template>
  <NuxtLayout name="user-setting">
    <div>
      <dl class="area-title">
        <dt>
          {{ t('block.user') }}
          <span>{{ totalCount }}</span>
        </dt>
      </dl>
      <UserList :users="users" :isPending="isPending" @update-list="updateList" />
      <div v-if="!isPending && !users.length" class="no-result">
        <h1>{{ $t('no.blocks') }}</h1>
        <img src="/images/not-found.png" style="width: 100px; height: 100px" />
      </div>
    </div>
  </NuxtLayout>
</template>
<script setup lang="ts">
import shared from '~/scripts/shared'
import { IUser } from '~~/types'
import { onBeforeRouteLeave } from 'vue-router';

const { t, locale } = useI18n()

definePageMeta({
  title: 'blockList',
  name: 'blockList',
  middleware: 'auth',
})

shared.createHeadMeta(t('seo.profile.block.title'), t('seo.profile.block.desc'))

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


onMounted(async () => {
  useRouterLeave()
  await fetch()
})


async function fetch() {

  const { data, pending, refresh, error } = await useCustomAsyncFetch<[]>(`/user/block-list`, getComFetchOptions('get', true, payload))

  if (!error.value) {
    totalCount.value = data.value.length
    users.value = data.value.map((block: any) => {
      return {
        nickname: block.user.nickname,
        banner_img: block.user.banner_img,
        name: block.user.name,
        id: block.user.id,
        channel_id: block.user.channel_id,
        picture: block.user.profile_img || block.user.picture,
        email: block.user.email,
        uid: block.user.uid,
        followers_cnt: block.followers_cnt,
        followings_cnt: block.followings_cnt,
        is_following: block.is_following,
        follow_you: block.follow_you,
        is_blocked: block.is_blocked,
      }
    })
  }

  isPending.value = false
}

function updateList(user) {
  users.value = users.value.filter((user1) => {
    return user.id !== user1.id
  })
}
</script>
<style scoped lang="scss">
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
    width: 100px;
    height: 100px;
  }
}
</style>

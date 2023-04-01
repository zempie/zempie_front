<template>
  <NuxtLayout name="channel-header">
    <div>
      <dl class="area-title">
        <dt>
          following <span>{{ totalCount }}</span>
        </dt>
      </dl>
      <UserList :users="users" :isPending="isPending" />
      <div v-if="!isPending && !users.length" class="no-result">
        <h1>{{ $t('no.following') }}</h1>
        <img src="/images/not-found.png" />
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import shared from '~~/scripts/shared';
import { IFollowUser, IUserChannel } from '~~/types'

const { t } = useI18n()
const route = useRoute()

const isPending = ref(true)
const totalCount = ref()
const users = ref([])

const channelId = computed(() => route.params.id as string)

definePageMeta({
  title: 'user-following',
  name: 'userFollwoing',
})

/**
 * seo 반영은 함수안에서 되지 않으므로 최상단에서 진행함
 */
const { data } = await useAsyncData<{ result: { target: IUserChannel } }>('channelInfo', () =>
  $fetch(`/channel/${channelId.value}`, getZempieFetchOptions('get', true)),
  {
    initialCache: false
  }
)
const { target: channelInfo } = data.value?.result;

shared.createHeadMeta(`${channelInfo.name}${t('seo.channel.following.title')}`, `${channelInfo.name}${t('seo.channel.following.desc')}`, channelInfo.picture)

onMounted(async () => {
  if (channelInfo.id) await fetch()

})

async function fetch() {
  const { data, error, pending } = await useCustomAsyncFetch<{
    totalCount: number
    result: []
    pageInfo: {}
  }>(
    `/user/${channelInfo.id}/list/following`,
    getComFetchOptions('get', true)
  )
  if (data.value) {
    totalCount.value = data.value.totalCount
    users.value = data.value.result.map((user: IFollowUser) => {
      return {
        picture: user.profile_img,
        name: user.name,
        nickname: user.nickname,
        id: user.id,
        channel_id: user.channel_id,
        email: user.email,
        uid: user.uid,
        followings_cnt: user.followings_cnt,
        followers_cnt: user.followers_cnt,
        is_following: user.is_following,
        follow_you: user.follow_you,
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

.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.3s ease;
}

.component-fade-enter-from,
.component-fade-leave-to {
  opacity: 0;
}

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

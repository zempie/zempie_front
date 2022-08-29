<template>
  <NuxtLayout name="user-setting">
    <div>
      <dl class="area-title">
        <dt>following <span>{{  totalCount  }}</span></dt>
      </dl>
      <UserList :users="users" :isPending="isPending" />
      <div v-if="!isPending && !users.length" class="no-result">
        <h1>{{  $t('no.following')  }}</h1>
        <img src="/images/not-found.png" />
      </div>

    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { IUser } from '~~/types';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n()
const route = useRoute();
const config = useRuntimeConfig()

useHead({
  title: `${t('seo.profile.following.title')} | Zempie`,
  meta: [
    {
      name: 'description',
      content: `${t('seo.profile.following.desc')}`
    },
    {
      name: 'og:title',
      content: `${t('seo.profile.following.title')}`
    },
    {
      name: 'og:description',
      content: `${t('seo.profile.following.description')}`
    },
    {
      name: 'og:url',
      content: `${config.ZEMPIE_URL}${route.path}`
    },
  ]
})

const MAX_PAGE_SIZE = 20

const userId = computed(() => route.params.id as number | string)

const payload = reactive({
  limit: MAX_PAGE_SIZE,
  offset: 0,
  search: ''
})

const totalCount = ref(0)
const isPending = ref(true)
const users = ref<IUser[]>([])

onMounted(async () => {
  await fetch();
})

async function fetch() {
  const { data, pending, refresh, error } = await user.followingList(payload, userId.value as number)
  if (!error.value) {
    totalCount.value = data.value.totalCount
    users.value = data.value.result.map((user: any) => {
      return {
        name: user.name,
        id: user.id,
        channel_id: user.channel_id,
        email: user.email,
        uid: user.uid,
        followers_cnt: user.followers_cnt,
        followings_cnt: user.followings_cnt,
        is_following: user.is_following,
        picture: user.profile_img
      }
    })
  }

  isPending.value = false;
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
    width: 100px;
    height: 100px;
  }

}
</style>

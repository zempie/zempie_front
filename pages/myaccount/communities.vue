<template>
  <NuxtLayout name="user-setting">
    <dl class="area-title">
      <dt>Manage Group</dt>
    </dl>

    <Transition name="component-fade" mode="out-in">
      <ul class="card-timeline">
        <CommunityCardSk
          v-if="isPending"
          v-for="community in 4"
          :key="community"
        />
        <template v-else>
          <CommunityCard
            v-if="communities.length"
            v-for="community in communities"
            :key="community?.id"
            :community="community"
          >
            <template v-slot:subBtn>
              <CommunitySubscribeBtn :community="community" @refresh="fetch" />
            </template>
          </CommunityCard>
          <div class="no-result" v-else>
            <h1>{{ t('noJoined.community') }}</h1>
            <img src="/images/not-found.png" width="100px" height="100px" />
          </div>
        </template>
      </ul>
    </Transition>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ICommunity } from '~~/types'

import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const route = useRoute()
const config = useRuntimeConfig()

definePageMeta({
  title: 'my-communities',
  name: 'myCommunities',
  middleware: 'auth',
})

useHead({
  title: `${t('seo.profile.communities.title')} | Zempie`,
  link: [
    {
      rel: 'alternate',
      href: `${config.ZEMPIE_URL}${route.fullPath}`,
      hreflang: locale,
    },
    {
      rel: 'canonical',
      href: `${config.ZEMPIE_URL}${route.fullPath}`,
    },
  ],
  meta: [
    {
      property: 'og:url',
      content: `${config.ZEMPIE_URL}${route.fullPath}`,
    },
    {
      property: 'og:site_name',
      content: 'Zempie',
    },
    {
      name: 'og:type',
      content: 'website',
    },
    {
      name: 'robots',
      content: 'noindex, nofollow',
    },
    {
      name: 'description',
      content: `${t('seo.profile.communities.desc')}`,
    },
    {
      property: 'og:title',
      content: `${t('seo.profile.communities.title')}`,
    },
    {
      property: 'og:description',
      content: `${t('seo.profile.communities.description')}`,
    },
    {
      property: 'og:url',
      content: `${config.ZEMPIE_URL}${route.path}`,
    },
  ],
})

const communities = ref<ICommunity[]>([])
const isPending = ref(true)

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
  const { data } = await user.joinedCommunity(Number(userInfo.value.id))

  communities.value = data.value.map((community: ICommunity) => {
    return (community = { ...community, is_subscribed: true })
  })

  isPending.value = false
}
</script>

<style lang="scss" scoped>
.no-result {
  margin-left: 12.5px;
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
</style>

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
            <!-- <TimelineSk /> -->
            <PostTimeline />
          </dd>
          <dt>
            <div class="ta-about">
              <h2>About Us</h2>
              <div>
                {{ communityInfo?.description }}
              </div>
              <dl>
                <dt>Created</dt>
                <dd> {{ createdDate }}</dd>
              </dl>
            </div>
            <div class="ta-groups">
              <h2>Group</h2>
              <CommunityList :communities="communities" />
            </div>
          </dt>
        </dl>
      </div>
    </ClientOnly>
  </NuxtLayout>

</template>
<script setup lang="ts">
import { dateFormat } from '~/scripts/utils'

const config = useRuntimeConfig()

const communityInfo = computed(() => useCommunity().community.value.info)
const createdDate = computed(() => dateFormat(useCommunity().community.value.info?.createdAt));

const communities = ref([])
const isPending = ref(true)
// FIXME: 컴포저블 왜 안되는지 확인 
// const { data, pending } = await useFetch<any>('/community/list', {
//   method: 'get',
//   baseURL: config.COMMUNITY_API,
// })

onMounted(async () => {
  const { data, pending } = await community.list();
  isPending.value = pending.value
  if (data.value) {
    communities.value = data.value?.filter((elem) => {
      return elem.id !== communityInfo.value?.id
    })
  }
})

</script>    


<style scoped lang="scss">
</style>

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
const route = useRoute()

const communityInfo = computed(() => useCommunity().community.value.info)
const createdDate = computed(() => dateFormat(useCommunity().community.value.info?.createdAt));

const communities = ref([])
const isPending = ref(true)
const communityId = computed(() => route.params.id)


onMounted(async () => {
  await fetch()
})

async function fetch() {

  const { data, pending } = await community.list({ limit: 6, offset: 0 });
  isPending.value = pending.value
  if (data.value) {
    communities.value = data.value?.filter((elem) => {
      return elem.id !== communityId.value
    })
  }
}

</script>    


<style scoped lang="scss">
</style>

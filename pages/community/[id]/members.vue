<template>
  <NuxtLayout name="community">
    <div>
      <dl class="area-title">
        <dt>
          {{ $t('members') }} <span> {{ totalCount }}</span>
        </dt>
      </dl>
      <ul class="card-member" v-if="isPending">
        <UserCardSk v-for="user in 4" />
      </ul>
      <ul class="card-follow" v-else>
        <UserCard v-for="member in members" :key="member.id" :user="member">
          <template #followBtn>
            <UserFollowBtn :user="member" class="mt20" />
          </template>
        </UserCard>
        <div ref="triggerDiv"></div>
      </ul>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ICommunity, IUser } from '~~/types'
import { useI18n } from 'vue-i18n'
import shared from '~~/scripts/shared';

const LIMIT = 10

const { t } = useI18n()
const route = useRoute()
const nuxt = useNuxtApp()


const observer = ref<IntersectionObserver>(null)
const triggerDiv = ref<HTMLElement | null>(null)

const communityId = computed(() => route.params.id as string)

const limit = ref(LIMIT)
const offset = ref(0)
const isAddData = ref(false)
const members = ref()
const totalCount = ref(0)


/**
 * seo 반영은 함수안에서 되지 않으므로 최상단에서 진행함
 */
const { data: communityInfo, pending: isPending } = await useAsyncData<ICommunity>('communityInfo', () =>
  $fetch(`/community/${communityId.value}`, getComFetchOptions('get', true)),
  {
    initialCache: false
  }
)
shared.createHeadMeta(`${communityInfo.value.name} ${t('members')} `, `${communityInfo.value.description}`, `${communityInfo.value.profile_img}`)



onMounted(async () => {

  observer.value = new IntersectionObserver(
    async (entries) => {
      await handleIntersection(entries[0])
    },
    { root: null, threshold: 1 }
  )
  observer.value.observe(triggerDiv.value)

  await fetch()

})

async function handleIntersection(target: any) {
  if (target.isIntersecting && isAddData.value) {
    offset.value += limit.value
    await fetch()
  }
}


async function fetch() {

  const {
    data
  } = await useCustomAsyncFetch<{
    result: IUser[]
    totalCount: number
  }>(createQueryUrl(`/community/${communityId.value}/members`, { offset: offset.value, limit: limit.value }), getComFetchOptions('get', true))


  if (data.value) {
    const { result, totalCount: total } = data.value
    totalCount.value = total
    if (isAddData.value) {
      if (result.length > 0) {
        members.value = [...members.value, ...result]
      } else {
        isAddData.value = false
        observer.value.unobserve(triggerDiv.value)
      }
    } else {
      members.value = result
      isAddData.value = true
    }
  }

}
</script>

<style lang="scss" scoped></style>

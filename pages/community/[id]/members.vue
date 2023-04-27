<template>
  <NuxtLayout name="community">
    <div>
      <dl class="area-title">
        <dt>
          {{ $t('members') }} <span> {{ communities?.totalCount }}</span>
        </dt>
      </dl>
      <ul class="card-member" v-if="isPending">
        <UserCardSk v-for="user in 4" />
      </ul>
      <ul class="card-follow" v-else>
        <UserCard v-for="member in communities?.result" :key="member.id" :user="member">
          <template #followBtn>
            <UserFollowBtn :user="member" class="mt20" @refresh="refresh" />
          </template>
        </UserCard>
      </ul>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ICommunity, IUser } from '~~/types'
import { useI18n } from 'vue-i18n'
import shared from '~~/scripts/shared';
const { t } = useI18n()

const route = useRoute()
const isPending = ref(true)
const nuxt = useNuxtApp()

const communityId = computed(() => route.params.id as string)

nuxt.hook('page:finish', () => {
  isPending.value = false
})

/**
 * seo 반영은 함수안에서 되지 않으므로 최상단에서 진행함
 */
const { data: communityInfo } = await useAsyncData<ICommunity>('communityInfo', () =>
  $fetch(`/community/${communityId.value}`, getComFetchOptions('get', true)),
  {
    initialCache: false
  }
)
shared.createHeadMeta(`${communityInfo.value.name} ${t('members')} `, `${communityInfo.value.description}`, `${communityInfo.value.profile_img}`)


//TODO:커뮤니티 많아지면 수정해야됨 : 페이징
const {
  data: communities,
  refresh,
} = await useCustomAsyncFetch<{
  result: IUser[]
  totalCount: number
}>(`/community/${communityId.value}/members`, getComFetchOptions('get', true))

</script>

<style lang="scss" scoped></style>

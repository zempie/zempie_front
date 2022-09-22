<template>
  <NuxtLayout name="community">
    <div>
      <dl class="area-title">
        <dt>
          Members <span> {{ communities?.totalCount }}</span>
        </dt>
      </dl>

      <ul class="card-member" v-if="isPending">
        <UserCardSk v-for="user in 4" />
      </ul>
      <ul class="card-follow" v-else>
        <UserCard
          v-for="member in communities?.result"
          :key="member.id"
          :user="member"
        >
          <template #followBtn>
            <UserFollowBtn :user="member" class="mt20" @refresh="refresh" />
          </template>
        </UserCard>
      </ul>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { IUser } from '~~/types'
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()

const config = useRuntimeConfig()
const route = useRoute()
const isPending = ref(true)
const nuxt = useNuxtApp()

const communityId = computed(() => route.params.id as string)
const communityInfo = computed(() => useCommunity().community.value.info)

nuxt.hook('page:finish', () => {
  isPending.value = false
})
watch(
  () => communityInfo.value,
  (info) => {
    useHead({
      title: `Members of ${info.name} | Zempie community`,
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
          name: 'description',
          content: `${info.description}`,
        },
        {
          property: 'og:title',
          content: `Members of ${info.name}`,
        },
        {
          property: 'og:description',
          content: `${info.description}`,
        },
        {
          property: 'og:url',
          content: `${config.ZEMPIE_URL}${route.path}`,
        },
      ],
    })
  }
)
//TODO:커뮤니티 많아지면 수정해야됨 : 페이징
const {
  data: communities,
  pending,
  refresh,
} = await useFetch<{
  result: IUser[]
  totalCount: number
}>(`/community/${communityId.value}/members`, getComFetchOptions('get', true))

//     metaSetting !: MetaSetting;
//     communityId = this.$route.params.community_id;
//     totalMembers: number = 0;
//     memberList: User[] = [];
//     user!: User;
//     limit: number = 10;
//     offset: number = 0;

//     mounted() {
//         this.fetch();
//     }

//     fetch() {
//         const obj = {
//             limit: this.limit,
//             offset: this.offset
//         }
//         this.$api.communityMembers(this.communityId, obj)
//             .then((res: any) => {
//                 this.totalMembers = res.totalCount;
//                 this.memberList = res.result;
//             })
//             .catch((err: AxiosError) => {

//             })

//     }

//     reFetch(){
//         this.limit = 10;
//         this.offset = 0;
//         this.memberList = [];
//         this.$store.dispatch('reloadUserInfo');
//         this.fetch();

//     }
</script>

<style lang="scss" scoped></style>

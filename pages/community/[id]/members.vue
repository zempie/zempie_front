<template>
  <NuxtLayout name="community">
    <div>
      <dl class="area-title">
        <dt>Members <span> {{ data.totalCount }}</span></dt>
      </dl>

      <ul class="card-member" v-if="pending">
        <UserCardSk v-for="user in 4" />
      </ul>
      <ul class="card-follow" v-else>
        <UserCard v-for="member in data.result" :key="member.id" :user="member">
          <template #followBtn>
            <UserFollowBtn :user="member" class="mt20" @fetch="refresh" />
          </template>
        </UserCard>
      </ul>
    </div>
  </NuxtLayout>
</template>

 <script setup lang="ts">
import { IUser } from '~~/types';

const route = useRoute()
const isPending = ref(true)

const communityId = computed(() => route.params.id as string)


//TODO:커뮤니티 많아지면 수정해야됨 : 페이징
const { data, pending, refresh } = await useFetch<{ result: IUser[], totalCount: number }>(`/community/${communityId.value}/members`, getComFetchOptions('get', true))



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


<style lang="scss" scoped>
</style>

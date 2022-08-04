<template>
  <NuxtLayout name="community-header">
    <div>
      <dl class="area-title">
        <dt>Members <span> totalMembers</span></dt>
      </dl>
      <ul class="card-member">
        <UserCardSK v-for="user in 4" v-if="isPending" />
        <!-- <MemberCard
                v-for="member in memberList"
                :key="member.id"
                :member="member"
                @reFetch="reFetch"
            >
            </MemberCard> -->
      </ul>
    </div>
  </NuxtLayout>
</template>

 <script setup lang="ts">

const isPending = ref(true)

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
svg {
  vertical-align: middle;
}

.button-container {
  display: flex;
}
</style>

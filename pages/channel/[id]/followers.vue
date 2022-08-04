<template>
  <NuxtLayout name="user-channel-header">
    <div>
      <dl class="area-title">
        <dt>Followers <span>followerList.length</span></dt>
      </dl>
      <transition name="component-fade" mode="out-in">
        <ul class="card-member">

          <UserCardSK v-for="user in 4" />

          <!-- <MemberCard
                    v-for="member in followerList"
                    :key="member.id"
                    :member="member"
                    @reFetch="reFetch"
                ></MemberCard> -->
        </ul>


      </transition>
    </div>
  </NuxtLayout>
</template>

<script lang="ts">
  // @Prop() userId!: any;
  // private followerList: any = [];
  // private totalCnt: number = 0;
  // private limit: number = 10;
  // private offset: number = 0;
  // private search: string = '';
  // private user !: any;

  // channel_id: string = '';

  // mounted() {
  //   if (this.$route.params.channel_id) {
  //     this.channel_id = this.$route.params.channel_id;
  //   }
  //   else {
  //     this.channel_id = this.userId;
  //   }
  //   this.fetch();
  // }

  // fetch() {
  //   const obj = {
  //     limit: this.limit,
  //     offset: this.offset,
  //     search: this.search
  //   }
  //   //userId로 넘기는 부분인데 params 이름이 channel_id임
  //   this.$api.followerList(obj, this.channel_id)
  //     .then((res: any) => {
  //       this.followerList = res.result;
  //       this.totalCnt = res.totalCount;

  //     })
  //     .catch((err: any) => {

  //     })
  // }
  // reFetch() {
  //   this.fetch();
  //   this.$store.dispatch('reloadUserInfo');
  // }
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
    margin: 0 auto
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

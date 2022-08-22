<template>
  <NuxtLayout name="user-channel-header">
    <div>
      <dl class="area-title">
        <dt>Followings <span>{{ totalCount }}</span></dt>
      </dl>
      <UserList :users="users" :isPending="isPending" />
      <div v-if="!isPending && !users.length" class="no-result">
        <h1>{{ $t('no.followers') }}</h1>
        <img src="/images/not-found.png" />
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">

const userId = computed(() => useChannel().userChannel.value.info.id)

const isPending = ref(true)
const totalCount = ref(0)
const users = ref([])

watch(userId, async () => {
  await fetch()
})


onMounted(async () => {
  if (userId.value) {
    await fetch()
  }
})

async function fetch() {

  const { data, error, pending } = await useFetch<{ totalCount: number, result: [], pageInfo: {} }>
    (`/user/${userId.value}/list/follower`, getComFetchOptions('get', true))

  if (!error.value) {
    totalCount.value = data.value.totalCount;
    users.value = data.value.result
    console.log(users.value)

  }
  isPending.value = false;

}


// const route = useRoute();

// const userId = computed(() => route.params.id as number | string)

// const payload = reactive({
//   limit: MAX_PAGE_SIZE,
//   offset: 0,
//   search: ''
// })

// const totalCount = ref(0)
// const isPending = ref(true)
// const users = ref<IUser[]>([])


// async function fetch() {
//   const { data, pending, refresh, error } = await user.followerList(payload, userId.value as number)
//   if (!error.value) {
//     totalCount.value = data.value.totalCount
//     users.value = data.value.result.map((user: any) => {
//       return {
//         name: user.name,
//         id: user.id,
//         channel_id: user.channel_id,
//         email: user.email,
//         uid: user.uid,
//         followers_cnt: user.followers_cnt,
//         followings_cnt: user.followings_cnt,
//         is_following: user.is_following,
//         picture: user.profile_img
//       }
//     })
//   }

//   isPending.value = false;
// }
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

<template>
  <NuxtLayout name="my-channel-header">

    <div>
      <dl class="area-title">
        <dt>following <span>{{ totalCount }}</span></dt>
      </dl>
      <UserList :users="users" :isPending="isPending" />
      <div v-if="!isPending && !users.length" class="no-result">
        <h1>{{ $t('no.following') }}</h1>
        <img src="/images/not-found.png" />
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const userId = computed(() => useChannel().userChannel.value.info.id)

const route = useRoute()
const isPending = ref(true)
const totalCount = ref()
const users = ref([])


definePageMeta({
  title: 'user-following',
  name: 'userFollwoing'
})

const isMine = computed(() => {
  return route.params.id === useUser().user.value.info?.channel_id
})

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
    (`/user/${userId.value}/list/following`, getComFetchOptions('get', true))
  console.log(data)
  if (!error.value) {
    totalCount.value = data.value.totalCount;
    users.value = data.value.result
  }
  isPending.value = false;

}


// console.log(useChannel().userChannel.value.info)
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

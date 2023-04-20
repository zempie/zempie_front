<template>
  <div class="ta-myinfo" v-if="isLoading">
    <UserAvatarSk tag="p" style="width: 100px; height: 100px" />
    <div class="grey-text skeleton-animation"></div>
    <div class="grey-text mt10 skeleton-animation"></div>
    <ul>
      <div style="width:32%">
        <h2 class="grey-text mt10 skeleton-animation"></h2>
      </div>
      <div style="width:32%">
        <h2 class="grey-text mt10 skeleton-animation"></h2>
      </div>
      <div style="width:32%">
        <h2 class="grey-text mt10 skeleton-animation"></h2>
      </div>
    </ul>
  </div>
  <div v-else class="ta-myinfo">

    <UserAvatar :user="channelInfo" tag="p" />
    <h1>{{ channelInfo.nickname }}</h1>
    <h2>{{ channelInfo.name }}</h2>
    <ul>
      <li>
        <NuxtLink :to="$localePath(`/${userId}`)">
          <ChannelPostIcon />
          <h2>{{ channelInfo.post_cnt }}</h2>
          <h3>{{ $t('posts') }}</h3>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink :to="$localePath(`/${userId}/followers`)">
          <ChannelFollowIcon />
          <h2>{{ channelInfo.follower_cnt }}</h2>
          <h3>{{ $t('follower') }}</h3>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink :to="$localePath(`/${userId}/following`)">
          <ChannelFollowIcon />
          <h2>{{ channelInfo.following_cnt }}</h2>
          <h3>{{ $t('following') }}</h3>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
<script setup lang='ts'>
const { $localePath } = useNuxtApp()
const route = useRoute()

const channelInfo = computed(() => useChannel().userChannel.value.info)
const isLoading = computed(() => useChannel().userChannel.value.isLoading)
const userId = computed(() => route.params.id as string || channelInfo.value.nickname)


</script>
<style scoped lang='scss'></style>

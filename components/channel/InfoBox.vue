<template>
  <div class="ta-myinfo" v-if="isLoading">
    <UserAvatarSk tag="p" style="width: 100px; height: 100px" />
    <h1 class="grey-text skeleton-animation"></h1>
    <ul>
      <li>
        <ChannelPostIcon />
        <h2 class="grey-text mt10 skeleton-animation"></h2>
      </li>
      <li>
        <ChannelFollowIcon />
        <h2 class="grey-text mt10 skeleton-animation"></h2>
      </li>
      <li>
        <ChannelFollowIcon />
        <h2 class="grey-text mt10 skeleton-animation"></h2>
      </li>
    </ul>
  </div>
  <div v-else class="ta-myinfo">
    <UserAvatar :user="channelInfo" tag="p" />
    <h1>{{ channelInfo.nickname }}</h1>
    <h2>{{ channelInfo.name }}</h2>
    <ul>
      <li>
        <NuxtLink :to="$localePath(`/channel/${channelId}`)">
          <ChannelPostIcon />
          <h2>{{ channelInfo.post_cnt }}</h2>
          <h3>Posts</h3>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink :to="$localePath(`/channel/${channelId}/followers`)">
          <ChannelFollowIcon />
          <h2>{{ channelInfo.follower_cnt }}</h2>
          <h3>Followers</h3>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink :to="$localePath(`/channel/${channelId}/following`)">
          <ChannelFollowIcon />
          <h2>{{ channelInfo.following_cnt }}</h2>
          <h3>Following</h3>
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
const channelId = computed(() => route.params.id as string || channelInfo.value.uid)


</script>
<style scoped lang='scss'></style>

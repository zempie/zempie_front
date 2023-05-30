<template>
  <div v-if="channelInfo" class="ta-myinfo mb20">
    <UserAvatar :user="channelInfo" tag="p" />
    <h1>{{ channelInfo.nickname }}</h1>
    <h2>{{ channelInfo.name }}</h2>
    <div class="mt10" v-if="user?.uid !== channelInfo.channel_id">
      <UserFollowBtn :user="channelInfo" />
    </div>
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
<script setup lang="ts">
const { $localePath } = useNuxtApp()
const route = useRoute()

const channelInfo = computed(() => useChannel().userChannel.value.info)
const isLoading = computed(() => useChannel().userChannel.value.isLoading)
const userId = computed(() => route.params.id as string || channelInfo.value.nickname)
const user = computed(() => useUser().user.value.info)



</script>
<style scoped lang="scss"></style>

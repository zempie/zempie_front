<template>
  <div class="ta-myinfo mb20" v-if="isLoading">
    <UserAvatarSk style="width: 100px; height: 100px; margin:0 auto" />
    <div class="grey-text skeleton-animation"></div>
    <div class="grey-text mt10 skeleton-animation"></div>
    <ul>
      <div style="width:32%">
        <p class="grey-text mt10 skeleton-animation"></p>
      </div>
      <div style="width:32%">
        <p class="grey-text mt10 skeleton-animation"></p>
      </div>
      <div style="width:32%">
        <p class="grey-text mt10 skeleton-animation"></p>
      </div>
    </ul>
  </div>
  <ClientOnly v-else>
    <div class="ta-myinfo mb20">
      <div class="avatar">
        <UserAvatar :user="channelInfo" tag="p" />
        <UserSetting :user="channelInfo" v-if="!isMine" />
        <!-- <span class="user-setting"><i class="uil uil-ellipsis-h"></i></span> -->
      </div>
      <h1>{{ channelInfo?.nickname }}</h1>
      <h2>{{ channelInfo?.name }}</h2>
      <div class="mt10 flex justify-between" v-if="user?.uid !== channelInfo?.channel_id">
        <UserFollowBtn :user="channelInfo" style="width: 48%;" />
        <DmSendBtn :user="channelInfo" style="width: 48%;" />
      </div>
      <ul>
        <li>
          <NuxtLink :to="$localePath(`/${userId}`)">
            <ChannelPostIcon />
            <h2>{{ channelInfo?.post_cnt }}</h2>
            <h3>{{ $t('posts') }}</h3>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink :to="$localePath(`/${userId}/followers`)">
            <ChannelFollowIcon />
            <h2>{{ channelInfo?.follower_cnt }}</h2>
            <h3>{{ $t('follower') }}</h3>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink :to="$localePath(`/${userId}/following`)">
            <ChannelFollowIcon />
            <h2>{{ channelInfo?.following_cnt }}</h2>
            <h3>{{ $t('following') }}</h3>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </ClientOnly>
</template>
<script setup lang="ts">
import UserSetting from '~~/components/user/Setting.vue'

const { $localePath } = useNuxtApp()
const route = useRoute()

const channelInfo = computed(() => useChannel().userChannel.value.info)
const isLoading = computed(() => useChannel().userChannel.value.isLoading)
const userId = computed(() => route.params.id as string || channelInfo.value.nickname)
const user = computed(() => useUser().user.value.info)


const isMine = computed(() => {
  return channelInfo.value.id === user.value.id
})

</script>
<style scoped lang="scss">
.ta-myinfo {

  .avatar {
    position: relative;

    :deep(p) {
      position: relative;
      width: 100px;
      height: 100px;
      margin: 0 auto;
      border: #fff 3px solid;
      border-radius: 50%;
    }

    .custom-dropdown {
      cursor: pointer;
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 35px;
      height: 35px;
      text-align: center;
      font-size: 18px;
      line-height: 18px;
      color: #fff;
      border: #fff 2px solid;
      border-radius: 50%;
      background: #999;
      right: 65px;
      bottom: -12px;
    }
  }
}
</style>

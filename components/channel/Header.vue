<template>
  <div v-if="userInfo" class="visual-info-center"
    style="background : url('/images/banner_white.png') center no-repeat;background-size : cover">
    <dl>
      <dt>
        <ul>
          <li>
            <NuxtLink :to="localePath(`/channel/${userInfo.channel_id}`)">
              <h2>{{ userInfo.post_cnt }}</h2>
              <h3>Posts</h3>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink :to="localePath(`/channel/${userInfo.channel_id}/followers`)">
              <h2>{{ userInfo.follower_cnt }}</h2>
              <h3>Followers</h3>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink :to="localePath(`/channel/${userInfo.channel_id}/following`)">
              <h2>{{ userInfo.following_cnt }}</h2>
              <h3>Followings</h3>
            </NuxtLink>

          </li>
        </ul>
      </dt>
      <dd>
        <UserAvatar :user="userInfo" tag="div" />
        <h2>{{ userInfo.name }}</h2>

      </dd>
      <dt>
        <UserFollowBtn :user="userInfo" v-if="!isMine" />
      </dt>
    </dl>
  </div>

</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { IUserChannel } from '~~/types'
import { useLocalePath } from "vue-i18n-routing";

const localePath = useLocalePath();

const props = defineProps({
  userInfo: Object as PropType<IUserChannel>
})

const isMine = computed(() => {
  return props.userInfo?.uid === useUser().user.value.info?.uid
})

onMounted(() => {

})




</script>

<style lang="scss" scoped>
</style>

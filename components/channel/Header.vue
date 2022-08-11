<template>
  <div class="visual-info-center"
    style="background : url('/images/banner_white.png') center no-repeat;background-size : cover">
    <dl>
      <dt>
        <ul>
          <li>
            <h2>0</h2>
            <h3>Posts</h3>
          </li>
          <li>
            <h2>{{ userInfo.follower_cnt }}</h2>
            <h3>Followers</h3>
          </li>
          <li>
            <h2>{{ userInfo.following_cnt }}</h2>
            <h3>Followings</h3>
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

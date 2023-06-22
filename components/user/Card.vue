<template>
  <li @click="$router.push($localePath(`/${user.nickname}`))">
    <div class="cf-img" :style="bannerImg
      ? `background: url(${bannerImg}) center center / cover no-repeat; background-size: cover;`
      : `background-color:orange; background-size:cover`
      "></div>
    <UserAvatar :user="userObj" :tag="'p'" :hasRouter="true"></UserAvatar>
    <div class="cf-info">
      <h3>{{ user.nickname }}</h3>
      <h4>{{ user.name }}</h4>
      <span v-if="user.follows_you" class="badge">{{ $t('is.following') }}</span>
      <dl>
        <dd>
          <h4>{{ user.followers_cnt }}</h4>
          <p>{{ $t('follower') }}</p>
        </dd>
        <dt>
          <p></p>
        </dt>
        <dd>
          <h4>{{ user.followings_cnt }}</h4>
          <p>{{ $t('following') }}</p>
        </dd>
      </dl>
      <slot name="followBtn"></slot>
    </div>
  </li>
</template>

<script setup lang="ts">
const { $localePath } = useNuxtApp()

const props = defineProps({
  user: Object,
})

const bannerImg = computed(() =>
  props.user.banner_img ? props.user.banner_img + `?_=${Date.now()}` : null
)

const userObj = computed(() => {
  return {
    name: props.user.name,
    picture: props.user.profile_img
      ? props.user.profile_img
      : props.user.picture,
    id: props.user.id,
    channel_id: props.user.channel_id,
    email: props.user.email,
    uid: props.user.uid,
    banner_img: props.user.banner_img,
    nickname: props.user.nickname,
    follower_cnt: props.user.followers_cnt,
    following_cnt: props.user.followings_cnt,
  }
})
</script>

<style scoped lang="scss">
.badge {
  background-color: #e8e8e8;
  padding: 5px 10px;
  border-radius: 10px;
  font-size: 10px;
}
</style>

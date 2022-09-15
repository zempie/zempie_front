<template>
  <li @click="$router.push(localePath(`/channel/${user.channel_id}`))">
    <div
      class="cf-img"
      :style="
        bannerImg
          ? `background: url(${bannerImg}) center center / cover no-repeat; background-size: cover;`
          : `background-color:orange; background-size:cover`
      "
    ></div>
    <UserAvatar :user="userObj" :tag="'p'"></UserAvatar>
    <div class="cf-info">
      <h3>{{ user.name }}</h3>
      <dl>
        <dd>
          <h4>{{ user.followers_cnt }}</h4>
          <p>Followers</p>
        </dd>
        <dt>
          <p></p>
        </dt>
        <dd>
          <h4>{{ user.followings_cnt }}</h4>
          <p>following</p>
        </dd>
      </dl>
      <slot name="followBtn"></slot>
    </div>
  </li>
</template>

<script setup lang="ts">
import { IUser } from '~~/types'
import { PropType } from 'vue'
import { useLocalePath } from 'vue-i18n-routing'
const localePath = useLocalePath()

const props = defineProps({
  user: Object as PropType<IUser>,
})

const bannerImg = computed(() => props.user.url_banner ?? null)
const userObj = computed(() => {
  return {
    name: props.user.name,
    picture: props.user.profile_img,
    id: props.user.id,
    channel_id: props.user.channel_id,
    email: props.user.email,
    uid: props.user.uid,
    url_banner: props.user.url_banner,
  }
})
</script>

<style scoped lang="scss"></style>

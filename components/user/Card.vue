<template>
  <li @click="$router.push(localePath(`/channel/${user.channel_id}`))">
    <div class="cf-img" style="background-color: #f39800"></div>
    <UserAvatar :user="user" :tag="'p'"></UserAvatar>
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
          <p>Followings</p>
        </dd>

      </dl>
      <slot name="followBtn"></slot>


    </div>
  </li>
</template>

<script setup lang="ts">
import { IUser } from '~~/types';
import { PropType } from 'vue';
import { useLocalePath } from "vue-i18n-routing";
const localePath = useLocalePath();

const props = defineProps({
  user: Object as PropType<IUser>
})

const profileImg = computed(() => props.user.picture ?? '/images/300_300_default_profile.png')
// const bannerImg = computed(()=> props.user.banner ?? '/images/channel_banner.png')

</script>

<style scoped lang="scss">
</style>

<template>
  <div class="content">
    <ClientOnly>
      <div class="visual-menu"
        :style="{ 'background': 'url(/images/1200_240_setting.png) center no-repeat', 'background-size': 'cover' }">
        <p class="title"> Settings</p>

        <div class="swiper-area uppercase">
          <NuxtLink class="swiper-slide" :to="localePath(`/myaccount`)">
            <a :class="$route.meta.name === 'myAccount' ? 'active' : ''">{{  $t('account')  }}</a>
          </NuxtLink>
          <NuxtLink class="swiper-slide" :to="localePath(`/myaccount/followers`)">
            <a :class="$route.meta.name === 'myFollowers' ? 'active' : ''">{{  $t('follower')  }}</a>
          </NuxtLink>

          <NuxtLink :to="localePath(`/myaccount/following`)" class="swiper-slide">
            <a :class="$route.meta.name === 'myFollowing' ? 'active' : ''">{{  $t('following')  }}</a>
          </NuxtLink>

          <NuxtLink :to="localePath(`/myaccount/communities`)" class="swiper-slide">
            <a :class="$route.meta.name === 'myCommunities' ? 'active' : ''"> {{
               $t('community') 
              }}</a>
          </NuxtLink>
        </div>
      </div>
      <slot />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { useLocalePath } from "vue-i18n-routing";

const localePath = useLocalePath();
const userInfo = computed(() => useUser().user.value.info)


</script>

<style scoped lang="scss">
.title {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 80%;
  align-items: center;
  color: #fff;
  font-size: 2.25rem;
  font-weight: 700;
}
</style>

<template>
  <div class="content">
    <ClientOnly>
      <div class="visual-menu"
        :style="{ 'background': 'url(/images/1200_240_setting.png) center no-repeat', 'background-size': 'cover' }">
        <p class="title"> Settings</p>
        <div class="swiper-area uppercase">
          <NuxtLink class="swiper-slide" :to="{ path: `/profile/${userInfo?.id}` }">
            <a :class="$route.name.toString().includes('profile-id___') ? 'active' : ''">{{ $t('account') }}</a>
          </NuxtLink>
          <NuxtLink class="swiper-slide" :to="{ path: `/profile/${userInfo?.id}/followers` }">
            <a :class="$route.name.toString().includes('follower') ? 'active' : ''">{{ $t('follower') }}</a>
          </NuxtLink>

          <NuxtLink :to="{ path: `/profile/${userInfo?.id}/followings` }" class="swiper-slide">
            <a :class="$route.name.toString().includes('following') ? 'active' : ''">{{ $t('following') }}</a>
          </NuxtLink>

          <NuxtLink :to="localePath(`/profile/${userInfo?.id}/communities`)" class="swiper-slide">
            <a :class="$route.name.toString().includes('communities') ? 'active' : ''"> {{
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

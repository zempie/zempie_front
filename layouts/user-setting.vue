<template>
  <div class="content">
    <ClientOnly>
      <div class="visual-menu" :style="{
        background: 'url(/images/1200_240_setting.png) center no-repeat',
        'background-size': 'cover',
      }">
        <p class="title">{{ $t('setting') }}</p>

        <div class="swiper-area uppercase">
          <NuxtLink class="swiper-slide" :to="$localePath(`/myaccount`)">
            <a :class="$route.meta.name === 'myAccount' && 'active'">
              <span> {{ $t('account') }}</span>
            </a>
          </NuxtLink>
          <NuxtLink class="swiper-slide" :to="$localePath(`/myaccount/followers`)">
            <a :class="$route.meta.name === 'myFollowers' && 'active'">

              <span>{{ $t('follower') }} </span></a>
          </NuxtLink>

          <NuxtLink :to="$localePath(`/myaccount/following`)" class="swiper-slide">
            <a :class="$route.meta.name === 'myFollowing' && 'active'">
              <span> {{ $t('following') }}</span>
            </a>
          </NuxtLink>
          <NuxtLink :to="$localePath(`/myaccount/blocks`)" class="swiper-slide">
            <a :class="$route.meta.name === 'blockList' && 'active'">
              <span>
                {{ $t('block.list') }}
              </span></a>
          </NuxtLink>
          <NuxtLink :to="$localePath(`/myaccount/communities`)" class="swiper-slide">
            <a :class="$route.meta.name === 'myCommunities' && 'active'">
              <span>
                {{ $t('community') }}
              </span></a>
          </NuxtLink>
        </div>
      </div>
      <slot />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
const { $localePath } = useNuxtApp()
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

.swiper-area {
  justify-content: center;

  a {
    i {
      font-size: 20px;
      margin-right: 10px;
    }
  }
}

@media all and (max-width: 479px) {}

@media all and (min-width: 480px) and (max-width: 767px) {}

@media all and (min-width: 768px) and (max-width: 991px) {}

@media all and (min-width: 992px) and (max-width: 1199px) {}

@media all and (min-width: 1200px) {}
</style>

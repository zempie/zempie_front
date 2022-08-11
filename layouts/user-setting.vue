<template>
  <div class="content ">
    <div class="visual-menu"
      :style="{ 'background': 'url(/images/1200_240_setting.png) center no-repeat', 'background-size': 'cover' }">
      <p class="title"> Settings</p>
      <div class="swiper-area uppercase">

        <NuxtLink :class="
          ['swiper-slide']
        " :to="`/${$i18n.locale}/user/${userInfo?.channel_id}/settings`">
          {{ $t('account') }}
        </NuxtLink>

        <!--                <swiper-slide>-->
        <!--                    <router-link to="#">비밀번호변경</router-link>-->
        <!--                </swiper-slide>-->
        <NuxtLink :class="[$route.name === 'FollowerList' ? 'active' : '', 'swiper-slide']"
          :to="{ path: `/user/${userInfo?.id}/followers` }">{{ $t('follower') }}
        </NuxtLink>

        <NuxtLink :to="{ path: `/user/${userInfo?.id}/followings` }"
          :class="[$route.name === 'FollowerList' ? 'active' : '', 'swiper-slide']">{{ $t('following') }}
        </NuxtLink>

        <NuxtLink :to="localePath(`/user/${userInfo?.channel_id}/communities`)"
          :class="[$route.name === 'FollowerList' ? 'active' : '', 'swiper-slide']">{{ $t('community') }}
        </NuxtLink>
        <!--                <swiper-slide>-->
        <!--                    <router-link :class="$route.name === 'NotificationList' ? 'active' : ''"
                                :to="`/user/${user.uid}/notificationList`">알림</router-link>-->
        <!--                </swiper-slide>-->
        <!--                <swiper-slide>-->
        <!--                    <router-link :class="$route.name === 'MessageList' ? 'active' : ''"
                                :to="`/user/${user.uid}/messageList`">메세지</router-link>-->
        <!--                </swiper-slide>-->
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useLocalePath } from "vue-i18n-routing";

const localePath = useLocalePath();
const userInfo = computed(() => useUser().user.value.info)

</script>

<style scoped lang="scss">
.swiper-area {
  height: 60px;
}

.simple-tab-items {
  margin-top: 32px;
}

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

<template>
  <div class="content">
    <ClientOnly>
      <CommunityHeaderSK />

    </ClientOnly>
    <div class="tab-menu-swiper">
      <div class="swiper-area">
        <div class='swiper-slide active'>
          <p><i class="uil uil-clock-three"></i></p>
          <h2>TIMELINE(ALL)</h2>
        </div>
        <div class='swiper-slide'>
          <p><i class="uil uil-comment-dots"></i></p>
          <h2>SNS</h2>
        </div>
        <div class='swiper-slide'>
          <p><i class="uil uil-edit"></i></p>
          <h2>BLOG</h2>
        </div>
        <div class='swiper-slide'>
          <p><i class="uil uil-image-edit"></i></p>
          <h2>IMAGE</h2>
        </div>
        <div class='swiper-slide'>
          <p><i class="uil uil-play-circle"></i></p>
          <h2>VIDEO</h2>
        </div>
        <div class='swiper-slide'>
          <p><i class="uil uil-music"></i></p>
          <h2>AUDIO</h2>
        </div>
        <!-- <swiper-slide :class="
                        $route.name === 'CommunityTimeline' &&
                        Object.keys($route.query).length === 0
                            ? 'active'
                            : ''
                    ">
                    <router-link :to="`/${$i18n.locale}/community/${community.id}/timeline`">
                        <p><i class="uil uil-clock-three"></i></p>
                        <h2>{{ $t('timeline')}}(ALL)</h2>
                    </router-link>
                </swiper-slide>
                <swiper-slide :class="$route.query.media === 'sns' ? 'active' : ''">
                    <router-link :to="`/${$i18n.locale}/community/${community.id}/timeline?media=sns`">
                        <p><i class="uil uil-comment-dots"></i></p>
                        <h2>SNS</h2>
                    </router-link>
                </swiper-slide>
                <swiper-slide :class="$route.query.media === 'blog' ? 'active' : ''">
                    <router-link :to="`/${$i18n.locale}/community/${community.id}/timeline?media=blog`">
                        <p><i class="uil uil-edit"></i></p>
                        <h2>{{ $t('blog')}}</h2>
                    </router-link>
                </swiper-slide>
                <swiper-slide :class="$route.query.media === 'image' ? 'active' : ''">
                    <router-link
                        :to="`/${$i18n.locale}/community/${community.id}/timeline?media=image`"

                    >
                        <p><i class="uil uil-image-edit"></i></p>
                        <h2>{{ $t('image')}}</h2>
                    </router-link>
                </swiper-slide>

                <swiper-slide :class="$route.query.media === 'video' ? 'active' : ''">
                    <router-link :to="`/${$i18n.locale}/community/${community.id}/timeline?media=video`">
                        <p><i class="uil uil-play-circle"></i></p>
                        <h2>{{ $t('video')}}</h2>
                    </router-link>
                </swiper-slide>
                <swiper-slide :class="$route.query.media === 'sound' ? 'active' : ''">
                    <router-link :to="`/${$i18n.locale}/community/${community.id}/timeline?media=sound`">
                        <p><i class="uil uil-music"></i></p>
                        <h2>{{ $t('audio')}}</h2>
                    </router-link>
                </swiper-slide>
                <div class="swiper-button-prev" slot="button-prev"></div>
                <div class="swiper-button-next" slot="button-next"></div> -->
      </div>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useLocalePath } from 'vue-i18n-routing';

const localePath = useLocalePath();


onMounted(async () => {
  await getChannelHeaderInfo()
})


async function getChannelHeaderInfo() {
  const { data, pending } = await user.getUserInfo(channelId.value)
  isPending.value = pending.value
  const { result } = data.value;
  userInfo.value = result.target

}


</script>

<style lang="scss" scoped>
.darker-text {
  min-height: 18px;
  background-color: #333;
  border-radius: 10px;
}


.numbers {
  min-height: 18px
}



.swiper-slide {
  display: inline-block
}
</style>

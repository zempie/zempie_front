<template>
  <div class="content">
    <ul class="ta-post">
      <dd>
        <div v-if="route.meta?.name !== 'userChannel'" class="tab-search-swiper">
          <div class="swiper-area uppercase">
            <div class="swiper-slide">
              <NuxtLink :to="$localePath(`/${userId}`)" :class="route.meta?.name === 'userChannel' && 'active'">
                <p class="mobile">
                  <i class="uil uil-clock-three"></i>
                  <span style="border: 0">{{ $t('timeline') }}</span>
                </p>
              </NuxtLink>
            </div>
            <div class="swiper-slide">
              <NuxtLink :to="$localePath(`/${userId}/followers`)"
                :class="route.meta?.name === 'userFollowers' && 'active'">
                <p class="mobile">
                  <i class="uil uil-users-alt"></i>
                  <span style="border: 0">{{ $t('follower') }}</span>
                </p>
              </NuxtLink>
            </div>
            <div class="swiper-slide">
              <NuxtLink :to="$localePath(`/${userId}/following`)"
                :class="route.meta?.name === 'userFollwoing' && 'active'">
                <p class="mobile">
                  <i class="uil uil-user-plus"></i>
                  <span style="border: 0">{{ $t('following') }}</span>
                </p>
              </NuxtLink>
            </div>
            <div class="swiper-slide">
              <NuxtLink :to="$localePath(`/${userId}/games`)" :class="route.meta?.name === 'userGame' && 'active'">
                <p class="mobile">
                  <i class="uil uil-map-pin-alt"></i>
                  <span style="border: 0">{{ $t('game') }}</span>
                </p>
              </NuxtLink>
            </div>
          </div>
        </div>
        <slot />
      </dd>
    </ul>
  </div>
</template>

<script setup lang="ts">
import shared from '~~/scripts/shared';

const { $localePath } = useNuxtApp()
const route = useRoute()
const { t } = useI18n()
const userId = computed(() => route.params.id as string)
const channelInfo = computed(() => useChannel().userChannel.value.info)

try {
  await useChannel().getChannelInfo(userId.value)
  shared.createHeadMeta(`${channelInfo.value.name}${t('seo.channel.title')}`, `${channelInfo.value.name}${t('seo.channel.desc')}`, channelInfo.value.picture)
} catch (error) {
  console.log(error)
}
</script>

<style lang="scss" scoped>
.swiper-slide {
  display: inline-block;
  width: 25% !important;
  cursor: pointer;
}

.content {
  padding-top: 70px;

  .tab-search-swiper {
    margin: 20px auto auto auto;

    .swiper-slide {
      .mobile {
        i {
          font-size: 20px;
        }

        span {
          display: inline-block;
        }
      }
    }
  }
}

@media all and (max-width: 479px) {
  .tab-search-swiper {
    .swiper-slide {
      .mobile {
        span {
          display: none !important;
        }
      }
    }
  }
}

@media all and (min-width: 480px) and (max-width: 767px) {
  .content {
    padding-top: 30px;

    .tab-search-swiper {
      width: 100%;

      .swiper-slide {
        .mobile {
          span {
            display: none !important;
          }
        }
      }
    }
  }
}

@media all and (min-width: 768px) and (max-width: 991px) {}

@media all and (min-width: 992px) and (max-width: 1199px) {}
</style>

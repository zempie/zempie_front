<template>
  <div class="content">
    <ul class="ta-post">
      <dd>
        <div v-if="route.meta.name !== 'userChannel'" class="tab-search-swiper">
          <div class="swiper-area uppercase">
            <div class="swiper-slide" style="width: 25%; cursor: pointer">
              <NuxtLink
                :to="
                  isMine
                    ? $localePath(`/timeline`)
                    : $localePath(`/channel/${channelId}`)
                "
                :class="route.meta.name === 'userChannel' ? 'active' : ''"
              >
                <p class="mobile">
                  <i class="uil uil-clock-three"></i>
                  <span style="border: 0">TIMELINE</span>
                </p>
              </NuxtLink>
            </div>
            <div class="swiper-slide" style="width: 25%; cursor: pointer">
              <NuxtLink
                :to="$localePath(`/channel/${channelId}/followers`)"
                :class="route.meta.name === 'userFollowers' ? 'active' : ''"
              >
                <p class="mobile">
                  <i class="uil uil-users-alt"></i>
                  <span style="border: 0">FOLLOWERS</span>
                </p>
              </NuxtLink>
            </div>
            <div class="swiper-slide" style="width: 25%; cursor: pointer">
              <NuxtLink
                :to="$localePath(`/channel/${channelId}/following`)"
                :class="route.meta.name === 'userFollwoing' ? 'active' : ''"
              >
                <p class="mobile">
                  <i class="uil uil-user-plus"></i>
                  <span style="border: 0">FOLLOWING</span>
                </p>
              </NuxtLink>
            </div>

            <div class="swiper-slide" style="width: 25%; cursor: pointer">
              <NuxtLink
                :to="$localePath(`/channel/${channelId}/games`)"
                :class="route.meta.name === 'userGame' ? 'active' : ''"
              >
                <p class="mobile">
                  <i class="uil uil-map-pin-alt"></i>
                  <span style="border: 0">GAME</span>
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
import { IUserChannel } from '~~/types'

const { $localePath } = useNuxtApp()
const route = useRoute()

const userInfo = ref<IUserChannel>()

const channelId = computed(() => route.params.id as string)
const routeQuery = computed(() => route.query.media)

const isMine = computed(() => {
  return channelId.value === useUser().user.value.info?.channel_id
})

// watch(
//   () => useUser().user.value.info,
//   async (userInfo) => {
//     await useChannel().getChannelInfo(channelId.value)
//   }
// )
await useChannel().getChannelInfo(channelId.value)

// onMounted(async () => {
//   if (channelId.value) {
//     await useChannel().getChannelInfo(channelId.value)
//   }
// })
</script>

<style lang="scss" scoped>
.swiper-slide {
  display: inline-block;
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
    padding-top: 60px;

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

@media all and (min-width: 768px) and (max-width: 991px) {
}

@media all and (min-width: 992px) and (max-width: 1199px) {
}
</style>

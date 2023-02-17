<template>
  <div class="content" style="padding-top: 65px">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { IUserChannel } from '~~/types'

const route = useRoute()

const userInfo = ref<IUserChannel>()

const isPending = ref(true)
const channelId = computed(() => route.params.id as string)

// watch(
//   () => useUser().user.value.info,
//   async (userInfo) => {
//     await getChannelHeaderInfo()
//   }
// )

onMounted(async () => {
  await getChannelHeaderInfo()
})

async function getChannelHeaderInfo() {
  if (useUser().user.value.info?.channel_id) {
    const { data, pending } = await user.getUserInfo(
      useUser().user.value.info.channel_id
    )

    if (data.value) {
      const { result } = data.value
      userInfo.value = result.target
      useChannel().setUserChannel(userInfo.value)
    }
  }
  isPending.value = false
}
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

@media all and (min-width: 768px) and (max-width: 991px) {}

@media all and (min-width: 992px) and (max-width: 1199px) {}
</style>

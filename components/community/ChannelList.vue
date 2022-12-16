<template>
  <dt>
    <div class="ta-channel-list">
      <div>
        <h2 style="padding: 20px; font-weight: 600; font-size: 18px; line-height: 18px;color: #333;">Channel</h2>
        <i
          style="font-size: 20px; padding: 20px;"
          @click="showChannelList = !showChannelList"
          :class="showChannelList ? 'uil uil-angle-up' : 'uil uil-angle-down'"
        ></i>
      </div>

      <TransitionGroup name="list">
        <ul v-if="showChannelList">
          <li
            :class="['channel', { active: !channelName }]"
            :style="`background: url('/images/1500_300_com_banner_default.png') center center / cover no-repeat;`"
            @click="$router.push($localePath(`/community/${community.id}`))"
          >
            <span>All Posts</span>
          </li>
          <li
            v-for="(channel, index) in community?.channels"
            :style="`background: url(${
              channel.profile_img || '/images/1500_300_com_channel_default.png'
            }) center center / cover no-repeat;`"
            :class="[{ active: channelName === channel.title }, 'channel']"
            @click="
              $router.push(
                $localePath(`/community/${community.id}/${channel.title}`)
              )
            "
          >
            <span>{{ channel.title }}</span>
          </li>
        </ul>
      </TransitionGroup>
    </div>
  </dt>
</template>
<script setup lang="ts">
import { PropType } from 'vue'
import { ICommunity } from '~~/types'

const route = useRoute()
const { $localePath } = useNuxtApp()

const showChannelList = ref(true)
const channelName = computed(() => route.params.channel_name)

const props = defineProps({
  community: {
    type: Object as PropType<ICommunity>,
    default: [],
  },
})

const isMobile = computed(() =>
  window.matchMedia('screen and (max-width: 991px)')
)

onMounted(() => {
  nextTick(() => {
    onResize()
  })
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
})

function onResize() {
  if (isMobile.value.matches) {
    showChannelList.value = false
  } else {
    showChannelList.value = true
  }
}
</script>

<style scoped lang="scss">
.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.ta-channel-list {
  div {
    display: flex;
    border-bottom: #e9e9e9 1px solid;
    align-items: center;

    justify-content: space-between;
    h2 {
      padding: 20px !important;
      font-weight: 600 !important;
      font-size: 18px !important;
      line-height: 18px !important;
      color: #333 !important;
    }
    i {
      font-size: 20px;
      padding: 20px;
      // display: none;
    }
  }
}
.channel {
  opacity: 0.5;

  &.active,
  &:hover {
    opacity: 1;
  }
}

@media all and (max-width: 479px) {
  .ta-channel-list {
    div {
      i {
        // display: block;
      }
    }
  }
}
@media all and (min-width: 480px) and (max-width: 767px) {
  .ta-channel-list {
    div {
      i {
        // display: block;
      }
    }
  }
}

@media all and (min-width: 768px) and (max-width: 991px) {
  .ta-channel-list {
    div {
      i {
        // display: block;
      }
    }
  }
}
</style>

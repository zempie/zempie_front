<template>
  <dt>
    <div class="ta-channel-list">
      <h2>Channel</h2>
      <ul>
        <li :class="['channel', { active: currentIndex === ALLPOSTINDEX }]"
          :style="`background: url('/images/1500_300_com_banner_default.png') center center / cover no-repeat;`"
          @click="isActive(ALLPOSTINDEX), emit('channelInfo', undefined)">
          <span>All Posts</span>
        </li>
        <li v-for="(channel, index) in community?.channels"
          :style="`background: url(${channel.profile_img || '/images/1500_300_com_channel_default.png'}) center center / cover no-repeat;`"
          :class="[{ active: currentIndex === index }, 'channel']"
          @click="[isActive(index), emit('channelInfo', channel)]">
          <span>{{ channel.title }}</span>
        </li>

      </ul>
    </div>
  </dt>
</template>
<script setup lang="ts">
import { PropType } from 'vue';
import { ICommunity } from '~~/types';

const ALLPOSTINDEX = -1
const currentIndex = ref(ALLPOSTINDEX)

const props = defineProps({
  community: {
    type: Object as PropType<ICommunity>,
    default: []
  }
})

const emit = defineEmits(['channelInfo'])


function isActive(id: number) {
  currentIndex.value = id;

}
</script>

<style scoped lang="scss">
.channel {
  opacity: 0.5;

  &.active,
  &:hover {
    opacity: 1;
  }


}
</style>
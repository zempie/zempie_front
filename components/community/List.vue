<template>
  <div v-if="isLoading">
    <dl v-for="group in 4">
      <CommunityListItemSk />
    </dl>
  </div>
  <ClientOnly v-else>
    <div v-if="communities?.length">
      <dl v-for="community in communities" :key="community.id"
        @click="$router.push($localePath(`/community/${community.id}`))">
        <dt>
          <span
            :style="`background: url(${community.profile_img}) center center no-repeat; background-size: cover;`"></span>
        </dt>
        <dd>
          <h2 class="pt10">{{ community.name }}</h2>
          <h3>
            <i class="uil uil-chat-bubble-user"></i>{{ community.member_cnt }}
          </h3>
        </dd>
      </dl>
    </div>
    <div v-else>
      <dl>
        {{ $t('noJoined.community') }}
      </dl>
    </div>
  </ClientOnly>
</template>
<script setup lang="ts">
import { PropType } from 'vue'
import { ICommunity } from '~~/types'
const { $localePath } = useNuxtApp()

defineProps({
  communities: {
    type: Array as PropType<ICommunity[]>,
    default: [],
  },
  isLoading: {
    type: Boolean,
    default: true
  }
})
</script>
<style lang="scss" scoped>
dd {
  width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>

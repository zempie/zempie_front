<template>
  <div v-if="communities.length">
    <dl v-for="community in communities" :key="community.id"
      @click="$router.push(localePath(`/community/${community.id}`))">
      <dt><span
          :style="`background: url(${community.profile_img}) center center no-repeat; background-size: cover;`"></span>
      </dt>
      <dd style="width:100%">
        <h2>{{ community.name }}</h2>
        <h3><i class="uil uil-chat-bubble-user"></i>{{ community.member_cnt }}</h3>
      </dd>
    </dl>
  </div>
  <div v-else>
    <dl>
      {{ $t('noJoined.community') }}
    </dl>
  </div>
</template>
<script setup lang="ts">
import { PropType } from 'vue';
import { ICommunity } from '~~/types';

import { useLocalePath } from 'vue-i18n-routing';

const localePath = useLocalePath();

const props = defineProps({
  communities: {
    type: Array as PropType<ICommunity[]>,
    default: []
  }
})
</script>
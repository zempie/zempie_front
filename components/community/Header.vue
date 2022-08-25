<template>
  <div class="visual-info-center"
    :style="{ 'background': 'url(' + communityInfo?.banner_img + ') center center no-repeat', 'background-size': 'cover' }">
    <dl>
      <dt>
        <ul>
          <li>
            <h2 @click="$router.push(localePath(`/community/${communityId}/members`))" class="numbers"> {{
                communityInfo?.member_cnt
            }} </h2>
            <h3>Member</h3>
          </li>
          <li>
            <h2 class="">{{ communityInfo?.posts_cnt }}</h2>
            <h3>Posts</h3>
          </li>
          <li>
            <h2 class="">{{ communityInfo?.visit_cnt }} </h2>
            <h3>Visits</h3>
          </li>
        </ul>
      </dt>
      <dd>
        <div :style="`background:url(${communityInfo?.profile_img}); background-size:cover;`">
        </div>
        <h2>
          <span><i class="uil uil-unlock-alt"></i></span>
          <!-- <em><i class="uil uil-unlock-alt"></i></em> -->
          {{ communityInfo?.name }}
          <p style="width:50px;">
          </p>
        </h2>
        <h3>{{ communityInfo?.description }} </h3>
      </dd>
      <dt>
        <CommunitySubscribeBtn :community="communityInfo" @refresh="fetch" />
      </dt>
    </dl>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { useLocalePath } from 'vue-i18n-routing';
import { ICommunity } from '~~/types'

const localePath = useLocalePath();

const route = useRoute();
const communityId = computed(() => route.params.id as string)


const props = defineProps({
  communityInfo: Object as PropType<ICommunity>
})

async function fetch() {

  await useCommunity().setCommunity(communityId.value)
}
</script>

<style lang="scss" scoped>
.numbers {
  cursor: pointer;

  &:hover {
    color: #f97316;
  }
}
</style>

<template>
  <div
    v-if="communityInfo"
    class="visual-info-center"
    :style="{
      background:
        'url(' + communityInfo?.banner_img + ') center center no-repeat',
      'background-size': 'cover',
    }"
  >
    <dl>
      <dt>
        <ul>
          <li>
            <h2
              @click="
                $router.push($localePath(`/community/${communityId}/members`))
              "
              class="numbers"
            >
              {{ communityInfo?.member_cnt }}
            </h2>
            <h3>Member</h3>
          </li>
          <li>
            <h2 class="">{{ communityInfo?.posts_cnt }}</h2>
            <h3>Posts</h3>
          </li>
          <li>
            <h2 class="">{{ communityInfo?.visit_cnt }}</h2>
            <h3>Visits</h3>
          </li>
        </ul>
      </dt>
      <dd>
        <div
          :style="`background:url(${communityInfo?.profile_img}); background-size:cover;`"
        ></div>
        <h1>
          <span><i class="uil uil-unlock-alt"></i></span>
          <!-- <em><i class="uil uil-unlock-alt"></i></em> -->
         {{ communityInfo?.name }}
          <p style="width: 50px"></p>
        </h1>
        <h3>{{ communityInfo?.description }}</h3>
      </dd>
      <dt>
        <CommunitySubscribeBtn :community="communityInfo" @refresh="fetch" />
      </dt>
    </dl>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { ICommunity } from '~~/types'
const { $localePath } = useNuxtApp()

const route = useRoute()
const communityId = computed(() => route.params.id as string)

const props = defineProps({
  communityInfo: Object as PropType<ICommunity>,
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
@media all and (max-width: 479px) {
}
@media all and (min-width: 480px) and (max-width: 767px) {
}

@media all and (min-width: 768px) and (max-width: 991px) {
}

@media all and (min-width: 992px) and (max-width: 1199px) {
}
</style>

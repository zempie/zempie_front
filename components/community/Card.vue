<template>
  <li @click.stop="$router.push($localePath(`/community/${community.id}`))">
    <div :style="{
      background: 'url(' + bannerImg + ') center center / cover no-repeat',
      'background-size': 'cover',
      height: '120px',
    }"></div>
    <p :style="{
      background: 'url(' + profileImg + ') center center / cover no-repeat',
      'background-size': 'cover',
    }"></p>
    <div class="ct-info">
      <h3 class="title">{{ community.name }}</h3>
      <p class="desc">{{ community.description }}</p>
      <dl>
        <dd @click.stop="
          $router.push(
            $localePath(`/community/${props.community.id}/members`)
          )
          ">
          <h4>{{ community.member_cnt }}</h4>
          <p>{{ $t('members') }}</p>
        </dd>
        <dt>
          <p></p>
        </dt>
        <dd>
          <h4>{{ community.posts_cnt }}</h4>
          <p>{{ $t('posts') }}</p>
        </dd>
        <dt>
          <p></p>
        </dt>
        <dd>
          <h4>{{ visitCount }}</h4>
          <p>{{ $t('visits') }}</p>
        </dd>
      </dl>

      <slot name="subBtn"></slot>
    </div>
  </li>
</template>

<script setup lang="ts">
import { numToKMB } from '~/scripts/utils'

const { $localePath } = useNuxtApp()

const props = defineProps({
  community: Object,
})

const bannerImg = computed(
  () => props.community.banner_img ?? '/images/1500_300_com_channel_default.png'
)
const profileImg = computed(
  () => props.community.profile_img ?? '/images/100_100_com_profile_default.png'
)
const visitCount = computed(() => numToKMB(props.community.visit_cnt))
</script>

<style lang="scss" scoped>
li {
  list-style-type: none;
}

.sub-btn {
  width: 100% !important;
}

.title {
  height: 16px;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.desc {
  height: 40px;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>

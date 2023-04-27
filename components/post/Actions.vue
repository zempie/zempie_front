<template>
  <li>
    <ul>
      <LikeBtn v-if="feed" :feed="feed" />
      <li @click="openComments">
        <i :class="[isCommentClosed && 'pointer', 'uil uil-comment-alt-dots']" style="font-size: 22px"></i>&nbsp;
        {{ feed?.comment_cnt }}
      </li>
      <li>
        <ShareMenu :feed="feed" :url="url" />
      </li>
    </ul>
  </li>
</template>
<script setup lang='ts'>
import { PropType } from 'vue';
import { IFeed } from '~~/types';

const config = useRuntimeConfig()

const isOpenComment = ref(false)
const url = ref('')

const props = defineProps({
  feed: Object as PropType<IFeed>,
  isCommentClosed: {
    default: false,
    type: Boolean
  }
})

const emit = defineEmits([
  'openComment'
])

onMounted(() => {
  url.value = `${config.ZEMPIE_URL}/feed/${props.feed.id}`
})


function openComments() {
  if (props.isCommentClosed) {
    isOpenComment.value = !isOpenComment.value
    emit('openComment', isOpenComment.value)
  }
}
</script>
<style scoped lang='scss'></style>

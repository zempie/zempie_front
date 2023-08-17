<template>
  <li>
    <ul>
      <LikeBtn v-if="feed" :feed="feed" />
      <li @click="openComments">
        <i :class="[isCommentClosed && 'pointer', 'uil uil-comment-alt-dots']" style="font-size: 22px"></i>&nbsp;
        {{ commentCnt }}
      </li>
      <li>
        <ShareMenu :shareInfo="shareInfo" />
      </li>
    </ul>
  </li>
</template>
<script setup lang="ts">
import { PropType } from 'vue';
import shared from '~~/scripts/shared';
import { IFeed } from '~~/types';

const config = useRuntimeConfig()

const isOpenComment = ref(false)

const props = defineProps({
  feed: Object as PropType<IFeed>,
  isCommentClosed: {
    default: false,
    type: Boolean
  },
  commentCnt: Number
})

const shareInfo = computed(() => {
  return {
    img_url: getImgObj()?.url,
    title: shared.getFeedInfo(props.feed)?.title,
    desc: shared.getFeedInfo(props.feed)?.desc,
    user: props.feed?.user,
    url: `${config.ZEMPIE_URL}/feed/${props.feed?.id}`
  }
})


const emit = defineEmits([
  'openComment'
])



function openComments() {
  if (props.isCommentClosed) {
    isOpenComment.value = !isOpenComment.value
    emit('openComment', isOpenComment.value)
  }
}

function getImgObj(): { url: string, name: string, size: number, type: string, priority: number } | null {

  let attatchment_files = props.feed.attatchment_files
    && (Array.isArray(props.feed.attatchment_files)
      ? props.feed.attatchment_files
      : JSON.parse(props.feed.attatchment_files))

  if (attatchment_files && attatchment_files.length) {
    return attatchment_files.find((file: any) => file.type === 'image');
  } else {
    return null
  }
}
</script>
<style scoped lang="scss"></style>

<template>
  <li>
    <i
      v-if="!isLiked"
      @click="setLike"
      class="xi-heart-o like-icon"
      style="font-size: 22px; color: #ff6e17; cursor: pointer"
    ></i>
    <i
      v-else
      class="xi-heart like-icon"
      style="font-size: 22px; color: #ff6e17; cursor: pointer"
    ></i>
    <span @click="showLikeHistory"> {{ likeCnt }}</span>
  </li>
</template>

<script setup lang="ts">
import _ from 'lodash'

const props = defineProps({
  feed: Object,
})
const emit = defineEmits(['refresh'])

const isLiked = ref(props.feed.liked)
const likeCnt = ref(props.feed.like_cnt)

const isLogin = computed(() => useUser().user.value.isLogin)

let likeAcceessableCount = 2
let unlikeAcceessableCount = 2

async function setLike() {
  if (!isLogin.value) {
    useModal().openLoginModal()
    return
  }
  likeAcceessableCount = likeAcceessableCount - 1
  if (likeAcceessableCount > 0) {
    const { data, error } = await post.like(props.feed.id)
    if (!error.value) {
      isLiked.value = true
      likeCnt.value++
    }
  }
  likeAcceessableCount = likeAcceessableCount + 1
}

async function unsetLike() {
  if (!isLogin.value) {
    useModal().openLoginModal()
    return
  }
  unlikeAcceessableCount = unlikeAcceessableCount - 1
  if (unlikeAcceessableCount > 0) {
    const { data, error } = await post.unlike(props.feed.id)
    if (!error.value) {
      isLiked.value = false
      likeCnt.value--
    }
  }
  unlikeAcceessableCount = unlikeAcceessableCount + 1
}

function showLikeHistory() {}
</script>

<style scoped lang="scss">
span {
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
}
</style>

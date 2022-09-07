<template>
  <li v-if="!isLiked" @click="setLike">
    <i
      class="xi-heart-o like-icon"
      style="font-size: 22px; color: #ff6e17; cursor: pointer"
    ></i>
    {{ likeCnt }}
  </li>
  <li v-else @click="unsetLike">
    <i
      class="xi-heart like-icon"
      style="font-size: 22px; color: #ff6e17; cursor: pointer"
    ></i>
    {{ likeCnt }}
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
</script>

<style scoped lang="scss"></style>

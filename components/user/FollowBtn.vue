<template>
  <div v-if="user.id !== loginUser?.id">
    <p
      class="btn-default unfollow uppercase"
      @click.stop="unfollow"
      v-if="isFollowing"
    >
      Followed
    </p>
    <p class="btn-default uppercase" @click.stop="follow" v-else>Follow</p>
  </div>
  <div v-else>
    <p
      class="btn-default uppercase my-channel"
      @click.stop="$router.push(localePath(`/channel/${loginUser.channel_id}`))"
    >
      {{ $t('myChannel') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { PropType } from 'vue'
import { IUser } from '~~/types'
import { useLocalePath } from 'vue-i18n-routing'
import { useI18n } from 'vue-i18n'

const localePath = useLocalePath()
const { t, locale } = useI18n()

const isLogin = computed(() => useUser().user.value.isLogin)
const loginUser = computed(() => useUser().user.value.info)

const emit = defineEmits(['refresh'])
const props = defineProps({
  user: Object as PropType<IUser | any>,
})

const isFollowing = ref(props.user?.is_following)

async function follow() {
  if (!isLogin.value) {
    useModal().openLoginModal()
    return
  }

  const { data, error } = await user.follow(props.user.id)

  if (!error.value) {
    isFollowing.value = !isFollowing.value
    emit('refresh')
    useChannel().setFollowing()
  } else {
    ElMessage.error(t('try.later'))
  }
}

async function unfollow() {
  const { data, error } = await user.unfollow(props.user.id)
  if (!error.value) {
    isFollowing.value = !isFollowing.value
    emit('refresh')
    useChannel().setUnfollowing()
  } else {
    ElMessage.error(t('try.later'))
  }
}
</script>

<style scoped lang="scss">
.btn-default {
  width: 100%;
  cursor: pointer;
  color: #fff;
  height: 40px;
  display: flex;
  align-items: center;

  // margin-top: 20px;
  &.unfollow {
    background: #feb100;
  }

  &.my-channel {
    background-color: #28a745;
  }

  &.my-channel:hover {
    color: #28a745;
    background-color: rgba(40, 167, 69, 0.3);
  }
}
</style>

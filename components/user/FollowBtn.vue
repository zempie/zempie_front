<template>
  <div v-if="user && user.id !== loginUser?.id">
    <p
      :class="[customClass, 'btn-default unfollow uppercase']"
      @click.stop="unfollow"
      v-if="isFollowing"
    >
      Followed
    </p>
    <p
      :class="[customClass, 'btn-default uppercase']"
      @click.stop="follow"
      v-else
    >
      Follow
    </p>
  </div>
  <div v-else>
    <p
      :class="[customClass, 'btn-default uppercase my-channel']"
      @click.stop="
        $router.push($localePath(`/channel/${loginUser.channel_id}`))
      "
    >
      {{ $t('myChannel') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { PropType } from 'vue'
import { IUser } from '~~/types'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const { $localePath } = useNuxtApp()
const isLogin = computed(() => useUser().user.value.isLogin)
const loginUser = computed(() => useUser().user.value.info)

const emit = defineEmits(['refresh'])

const props = defineProps({
  user: Object as PropType<IUser | any>,
  customClass: String,
})

const isFollowing = ref(props.user?.is_following)

async function follow() {
  if (!isLogin.value) {
    useModal().openLoginModal()
    return
  }

  const { data, error } = await useCustomAsyncFetch(
    `/user/${props.user.id}/follow`,
    getComFetchOptions('post', true)
  )

  if (!error.value) {
    isFollowing.value = !isFollowing.value
    emit('refresh', props.user.id)
    // useChannel().setFollowing()
  } else {
    ElMessage.error(t('try.later'))
  }
}

async function unfollow() {
  const { data, error } = await useCustomAsyncFetch(
    `/user/${props.user.id}/unfollow`,
    getComFetchOptions('post', true)
  )
  if (!error.value) {
    isFollowing.value = !isFollowing.value
    emit('refresh', props.user.id)

    // useChannel().setUnfollowing()
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

  justify-content: center;
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

@media all and (max-width: 479px) {
  .small-btn {
    font-size: 16px;
    padding: 0px;
  }
}

@media all and (min-width: 480px) and (max-width: 767px) {
  .small-btn {
    font-size: 16px;
    padding: 0px;
  }
}

@media all and (min-width: 768px) and (max-width: 991px) {
  .small-btn {
    font-size: 16px;
    padding: 0px;
  }
}

@media all and (min-width: 992px) and (max-width: 1199px) {
}

@media all and (min-width: 1200px) {
}
</style>

<template >
  <template v-if="user.id !== loginUser?.id">
    <p class="btn-default uppercase" @click.stop="unfollow" v-if="user?.is_following">Followed</p>
    <p class="btn-default uppercase" @click.stop="follow" v-else> Follow</p>
  </template>
  <template v-else>
    <p class="btn-default uppercase my-channel"
      @click.stop="$router.push(localePath(`/channel/${loginUser.channel_id}`))"> {{
          $t('myChannel')
      }}</p>
  </template>
</template>

<script setup lang="ts" >
import { PropType } from 'vue';
import { IUser } from '~~/types';
import { useLocalePath } from 'vue-i18n-routing';

const localePath = useLocalePath();

const isLogin = computed(() => useUser().user.value.isLogin)
const loginUser = computed(() => useUser().user.value.info)


const emit = defineEmits(['fetch'])
const props = defineProps({
  user: Object as PropType<IUser>
})



async function follow() {

  if (!isLogin.value) { useModal().openLoginModal(); return; }

  const { data, error } = await user.follow(props.user.id)

  if (!error.value) {
    emit('fetch')
  }
  // this.$api.follow(this.member.id)
  //     .then((res: AxiosResponse) => {
  //         this.$emit('reFetch')
  //     })
  //     .catch((err: AxiosError) => {

  //     })

}

async function unfollow() {
  const { data, error } = await user.unfollow(props.user.id)
  if (!error.value) {
    emit('fetch')
  }
  // this.$api.unfollow(this.member.id)
  //     .then((res: AxiosResponse) => {
  //         this.$emit('reFetch')
  //     })
  //     .catch((err: AxiosError) => {

  //     })

}


</script>

<style scoped lang="scss">
.btn-default {
  width: 100%;
  cursor: pointer;
  color: #fff !important;
  margin-top: 20px !important;

  &.my-channel {
    background-color: #28a745;
  }

  &.my-channel:hover {
    color: #28a745;
    background-color: rgba(40, 167, 69, 0.3);
  }
}
</style>

<template>
  <div
    v-if="tag === 'div'"
    :class="user?.uid ? 'user-avatar' : ''"
    :style="`background: url('${
      user?.picture
        ? user.picture + `?_=${Date.now()}`
        : `/images/300_300_default_profile.png`
    }') center center  / cover no-repeat; background-size: cover;`"
    @click.stop="moveUserPage"
  ></div>

  <span
    v-else-if="tag === 'span'"
    :style="`background: url('${
      user?.picture
        ? user.picture + `?_=${Date.now()}`
        : `/images/300_300_default_profile.png`
    }') center center  / cover no-repeat; background-size: cover;`"
    @click.stop="moveUserPage"
  ></span>
  <p
    v-else-if="tag === 'p'"
    :style="`background: url('${
      user?.picture
        ? user.picture + `?_=${Date.now()}`
        : `/images/300_300_default_profile.png`
    }') center center  / cover no-repeat; background-size: cover;`"
    @click.stop="moveUserPage"
  ></p>
</template>

<script setup lang="ts">import { PropType } from 'vue';
import { IUser } from '~~/types';

const { $localePath } = useNuxtApp()
const { t, locale } = useI18n()
const $router = useRouter()

const props = defineProps({
  user: Object as PropType<IUser>,
  tag: {
    default: 'div',
    type: String,
  },
  hasRouter:{
    default:false,
    type:Boolean
  }
})
function moveUserPage(){
  if( props.hasRouter ){
    $router.push($localePath(`/channel/${props.user.channel_id}`))
  }
}
</script>

<style scoped lang="scss">
.user-avatar {
  cursor: pointer;
  border-radius: 100%;
}
</style>

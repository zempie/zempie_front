<template>
  <p v-if="!isMine" class="btn-default uppercase" @click.stop="sendMsg">
    {{ $t('send.msg.btn') }}
  </p>
</template>
<script setup lang="ts">
import { PropType } from 'vue'
import { IUser } from '~~/types'

const router = useRouter()
const { $localePath } = useNuxtApp()

const props = defineProps({
  user: Object as PropType<IUser | any>,
})

const isMine = computed(() => {
  return props.user?.id === useUser().user.value.info?.id
})

function sendMsg() {
  router.push($localePath({ path: `/dm/list`, query: { user: props.user.id } }))
}
</script>
<style scoped lang="scss">
.btn-default {
  padding: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
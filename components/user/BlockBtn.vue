<template>
  <button v-if="user.is_blocked" class="btn-red w100p" @click.stop="onClickUnblock">
    {{ $t('cancel.block') }}
  </button>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { PropType } from 'vue'
import { IUser } from '~~/types'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const { $localePath } = useNuxtApp()

const emit = defineEmits(['updateList'])

const props = defineProps({
  user: Object as PropType<IUser | any>,
})

async function onClickUnblock() {

  const { data } = await useCustomAsyncFetch(`/member/${props.user.id}/unblock`, getComFetchOptions('post', true))
  if (data.value) {
    emit('updateList', props.user)
  }
}

</script>

<style scoped lang="scss"></style>

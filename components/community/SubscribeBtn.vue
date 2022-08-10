<template>
  <a v-if="!community.is_subscribed" class="btn-default  mr10" :community="community" @click.stop="subscribe">{{
      $t('subscribe.btn')
  }}</a>
  <a v-else class="btn-sub  mr10" @click.stop="unsubscribe">{{ $t('isSubscribing') }}</a>
</template>

<script setup lang="ts">
const props = defineProps({
  community: Object
})
const emit = defineEmits(['fetch'])

const isLogin = computed(() => useUser().user.value.isLogin)

async function subscribe() {
  if (isLogin) {
    const { data, error } = await community.subscribe(props.community.id)
    if (!error.value) {
      emit('fetch')
    }

  } else {
    useModal().openLoginModal()
  }
}

async function unsubscribe() {
  const { data, error } = await community.unsubscribe(props.community.id)

  if (!error.value) {
    emit('fetch')
  }
}

</script>

<style scoped lang="scss">
</style>
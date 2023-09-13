<template>
  <CommonDropdown color="#888">
    <template #options>
      <li @click="onDeleteMsg">{{ $t('delete.msg') }}</li>
    </template>
  </CommonDropdown>
</template>
<script setup lang="ts">
const props = defineProps({
  msg: Object
})

const msgMenu = ref()
const opDeleteMsgModal = ref(false)
const userInfo = computed(() => useUser().user.value.info)

const emit = defineEmits(['deleteMsg'])

const isShow = ref(true)

onMounted(() => {
  isShow.value = true
})

async function onDeleteMsg() {
  emit('deleteMsg', props.msg)
  isShow.value = false
}

</script>
<style scoped lang="scss">
li {
  padding: 10px;
  cursor: pointer;

}
</style>
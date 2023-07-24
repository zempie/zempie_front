<template>
  <div>
    <!-- <ZemtownUserModal :user="targetUser" :isOpen="isOpenProfile" /> -->
    <ZemtownGameModal :isOpen="isOpenGame" />
    <ZemtownDmModal :isOpen="isOpenDm" />
  </div>
</template>
<script setup lang="ts">

const targetUser = ref()
const isOpenProfile = ref(false)
const isOpenDm = ref(false)
const isOpenGame = ref(false)

const zemtown = computed(() => useZemtown().zemtown.value)

watch(() =>
  (zemtown.value.isOpenMyProfile), (state) => {
    if (state) {
      openMyProfile()
    } else {
      closeMyProfile()
    }
  })



watch(() =>
  (zemtown.value.isOpenDm), (state) => {
    if (state) {
      isOpenDm.value = true
    } else {
      isOpenDm.value = false
    }
  })


onMounted(() => {
  if (zemtown.value.isOpenMyProfile) {
    openMyProfile()
  }
  if (zemtown.value.isOpenDm) {
    isOpenDm.value = true
  }
  window.addEventListener('message', onMessage)
})

function openMyProfile() {
  isOpenProfile.value = true
  targetUser.value = useUser().user.value.info
}

function closeMyProfile() {
  isOpenProfile.value = false
  targetUser.value = null
  useZemtown().closeMyProfile()
}
async function onMessage(msg: MessageEvent) {
  const { type, target_type, data } = JSON.parse(msg.data)
  const userId = data && data.user_id

  switch (target_type) {
    case 'player':

      isOpenGame.value = true
      break;
    case 'player':

      const { data } = await useCustomAsyncFetch<{ result: { target: IUserChannel } }>(`/user/info/${userId}`, getZempieFetchOptions('get', true))

      if (data) {
        const { result } = data.value
        targetUser.value = result.target
        isOpenProfile.value = true
      }

      break;

    default:
      closeMyProfile()
      isOpenDm.value = false
      isOpenGame.value = false

      break;

  }


}


</script>
<style scoped lang="scss"></style>
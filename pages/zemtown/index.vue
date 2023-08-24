<template>
  <div>
    <ZemtownUserModal :isOpen="isOpenProfile" :user="targetUser" />
    <ZemtownGameModal :isOpen="isOpenGame" :game="targetGame" />
    <ZemtownDmModal :isOpen="isOpenDm" />
  </div>
</template>
<script setup lang="ts">

const router = useRouter()
const { $localePath } = useNuxtApp()


const targetUser = ref()
const isOpenProfile = ref(false)
const isOpenDm = ref(false)
const isOpenGame = ref(false)
const targetGame = ref()

const zemtown = computed(() => useZemtown().zemtown.value)
const isLogin = computed(() => useUser().user.value.isLogin)


definePageMeta({
  name: 'zemtown'
})

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
      openDm()
    } else {
      closeDm()
    }
  })


onMounted(() => {
  if (zemtown.value.isOpenMyProfile) {
    openMyProfile()
  }
  if (zemtown.value.isOpenDm) {
    openDm()
  }
  window.addEventListener('message', onMessage)
})


function openMyProfile() {
  isOpenProfile.value = true
  targetUser.value = useUser().user.value.info
  isOpenGame.value = false
  closeDm()
}

function openDm() {
  closeMyProfile()
  isOpenDm.value = true
  isOpenGame.value = false
  targetUser.value = null

}

function closeMyProfile() {
  isOpenProfile.value = false
  targetUser.value = null
  useZemtown().closeMyProfile()
}

function closeDm() {
  isOpenDm.value = false
  targetGame.value = null
  useZemtown().closeDm()
}

async function onMessage(msg: MessageEvent) {

  try {
    const { type, target_type, data: parsedData } = JSON.parse(msg.data)

    console.log('msg', msg)

    switch (target_type) {
      case 'thumbnail':
        const gameId = parsedData && parsedData.game_id

        closeMyProfile()

        isOpenGame.value = true
        const { data: gameData, error, pending } = await useAsyncData<any>('game', () =>
          $fetch(`/launch/game/${gameId}`, {
            baseURL: 'https://api.zempie.com/api/v1',
            method: 'get'
          }),
          {
            initialCache: false
          }
        )

        if (gameData.value) {
          const { game, my_emotions, my_heart } = gameData.value.result
          targetGame.value = game

        }
        break;
      case 'player':
        const userId = parsedData && parsedData.user_id
        isOpenGame.value = false

        const { data } = await useCustomAsyncFetch<{ result: { target: IUserChannel } }>(`/user/info/${userId}`, getZempieFetchOptions('get', true))

        if (data) {
          const { result } = data.value
          targetUser.value = result.target
          isOpenProfile.value = true
        }

        break;

      default:
        isOpenProfile.value = false
        isOpenDm.value = false
        isOpenGame.value = false

        break;

    }
  } catch (err) {

  }
}


</script>
<style scoped lang="scss"></style>

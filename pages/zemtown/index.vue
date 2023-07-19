<template>
  <div class="zemtown-frame" style="width: 100vw; height: 100vh;">
    <ClientOnly>
      <iframe ref="zemtownRef" :src="`${config.ZEMTOWN_URL}?token=${token}`" style="width: 100%; height: 99%;" />
    </ClientOnly>
  </div>
</template>
<script setup lang="ts">

const config = useRuntimeConfig()
const route = useRoute()


const zemtownRef = ref(null)

const token = computed(() => route.query.token)
definePageMeta({
  layout: 'header-only',
})

onMounted(() => {
  console.log('message')
  window.addEventListener('message', onMessage)
})

async function onMessage(msg: MessageEvent) {
  const { type, target_type, data } = JSON.parse(msg.data)


  switch (target_type) {
    case 'thumbnail':
      break;
    case 'player':

      break;


  }

  console.log(type, msg.data)


}

</script>
<style scoped lang="scss"></style>
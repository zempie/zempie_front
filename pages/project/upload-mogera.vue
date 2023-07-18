<template>
  <NuxtLayout name="studio">
    <div class="content-studio">
      <div class="studio-banner mogera">
        <h2>Mogera 게임 업로드</h2>
        <p>당신의 게임을 여기에 업로드하고, 수많은 플레이어들과 공유해보세요!</p>
      </div>
      <dl class="studio-upload-area">
        <ProjectGameInfo />
      </dl>
    </div>
  </NuxtLayout>
</template>
<script setup lang="ts">
import { onBeforeRouteLeave } from 'vue-router';

definePageMeta({
  middleware: 'auth',
})

onMounted(async () => {
  window.addEventListener('beforeunload', leavePage)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', leavePage)
})

function leavePage(event) {
  console.log('lenave')
  event.returnValue = '';
}


onBeforeRouteLeave((to, from, next) => {
  window.open(to.path, '_blank')
})
</script>
<style scoped lang="scss">
.studio-banner {
  padding: 0px 0px 0px 50px !important;
  background: url('/images/mogera/upload-banner.jpeg');
  display: flex;
  flex-direction: column;
  justify-content: center;

  h2 {
    color: #fff;
  }

  p {
    color: #888;
  }

}
</style>
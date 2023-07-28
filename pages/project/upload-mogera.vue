<template>
  <NuxtLayout name="studio">
    <div class="content-studio">
      <div class="studio-banner mogera">
        <h2>Mogera 게임 업로드</h2>
        <p>당신의 게임을 여기에 업로드하고, 수많은 플레이어들과 공유해보세요!</p>
      </div>
      <dl class="studio-upload-area">
        <div v-if="showSavedInfo" class="save-notice">
      <p><i class="uil uil-info-circle"></i> {{ dayjs(savedFile?.created_at).format('YYYY-MM-DD HH:MM:ss') }}에 자동 저장된 파일이 있습니다.</p>
      <p class="ml15">저장된 파일을 불러와 이어서 작성할 수 있습니다. <span @click="loadAutoSave">이어서 작성하기 ></span></p>
    </div>
    <ProjectAddGameInfo :savedFile="savedFile" :isMogera="true"/>
        <!-- <ProjectGameInfo :savedFileId="savedFile?.id"/> -->
      </dl>
    </div>
  </NuxtLayout>
</template>
<script setup lang="ts">
import dayjs from 'dayjs'
import { onBeforeRouteLeave } from 'vue-router';
import { isObjEmpty } from '~~/scripts/utils';

const route = useRoute()

const savedFile = ref()
const fromMogera = computed(()=> Boolean(route.query.direct))
const showSavedInfo = ref(false)

definePageMeta({
  middleware: 'auth',
})

onMounted(async () => {
 
  await getMogeraFile()
  window.addEventListener('beforeunload', leavePage)
  if(fromMogera.value){
    showSavedInfo.value = false
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', leavePage)
})

onBeforeRouteLeave((to, from, next) => {
  window.open(to.path, '_blank')
})

function leavePage(event) {
  console.log('lenave')
  event.returnValue = '';
}

async function getMogeraFile() {
  const { data } = await useCustomAsyncFetch<{reulst:any}>('/mogera/game-file',getStudioFetchOptions('get', true) )
  
  if(data.value){
    const { result } = data.value
    if(result.length){
      const [firstSaved] = result
      savedFile.value = firstSaved
      showSavedInfo.value = true
    }
  }
}

function loadAutoSave(){
  showSavedInfo.value = false
}


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

.save-notice {
  width:100%;
  background-color: #fff;
  border-radius: 10px;
  padding: 20px 30px;
  margin-bottom: 20px;

  span {
    color: #ff6e17;
    cursor: pointer;
    text-decoration: underline;
  }

}

:deep(.studio-upload-area){
  dd{
    width:100%
  }
}
</style>
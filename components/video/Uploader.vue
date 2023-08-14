<template>
  <div @click="uploaVideoFile">
    <button><i class="uil uil-play-circle font25"></i></button>
    <div style="height: 0px; overflow: hidden">
      <input type="file" @change="onSelectVideoFile" accept=video/* ref="video" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { eChatType } from '~~/types'

const MAX_LIMIT = 10

const { t } = useI18n()


const video = ref<HTMLElement>()
const imageFiles = ref([])
const isImgUploading = ref(false)


const emit = defineEmits(['uploadVideo'])


function uploaVideoFile() {
  video.value.click()
}

async function onSelectVideoFile(event: any) {

  console.log(event.target)

  const [file] = event.target.files;

  const formData = new FormData();

  formData.append(
    file.name,
    file
  )


  const { data, error, pending } = await useCustomAsyncFetch<{
    result: {
      priority: number
      url: string
      type: string
      name: string
      size: number
    }[]
  }>('/community/att', getZempieFetchOptions('post', true, formData))

  if (data.value) {


    emit('uploadVideo', data.value.result)


  }

  (event.target as HTMLInputElement).value = ''
}



function isValidImgCount(images: File[]) {
  //첨부하는 이미지의 갯수는 max를 넘길 수 없음
  if ((images && images.length) > MAX_LIMIT) {
    return false
  }

  if (imageFiles.value.length > MAX_LIMIT) {
    return false
  }
  if (images.length + imageFiles.value.length > MAX_LIMIT) {
    console.log(MAX_LIMIT - imageFiles.value.length)
    images.slice(0, MAX_LIMIT - imageFiles.value.length - 1)
    return false
  }


  return true

}
</script>
<style scoped lang="scss"></style>
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
import { fileUpload } from '~~/scripts/fileManager'

const MAX_LIMIT = 10

const { t } = useI18n()


const video = ref<HTMLElement>()
const videoFiles = ref([])
const rawFiles = ref()
const isImgUploading = ref(false)


const emit = defineEmits(['uploadVideo'])

defineExpose({ fetchVideo, deleteVideo })


function uploaVideoFile() {
  video.value.click()
}

async function onSelectVideoFile(event: any) {


  const files = event.target.files;
  const newFiles = Array.from(files)
  rawFiles.value = newFiles

  for (const file of newFiles) {
    const reader = new FileReader()

    reader.onload = async (e) => {

      const url = e.target!.result as string

      emit('uploadVideo', [{ file, name: file.name, type: eChatType.VIDEO, url }])

    }

    reader.readAsDataURL(file);
  }


  (event.target as HTMLInputElement).value = ''
}



async function fetchVideo() {
  let result: any = []

  try {
    for (const file of rawFiles.value) {
      const { result: response } = await fileUpload(file)
      result = response
    }

  } catch (err) {
    console.error(err)
  } finally {
    initFiles()

  }
  return result
}
function initFiles() {
  rawFiles.value = undefined
  videoFiles.value = []
}



function deleteVideo(idx: number) {
  rawFiles.value.splice(idx, 1)
}



</script>
<style scoped lang="scss"></style>
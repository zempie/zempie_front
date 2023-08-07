<template>
  <div @click="uploadImageFile">
    <button><i class="uil uil-scenery font25"></i></button>
    <div style="height: 0px; overflow: hidden">
      <input type="file" @change="onSelectImageFile" multiple accept="image/*" ref="image" />
    </div>
  </div>
</template>
<script setup lang="ts">
/**
 * 1. PreviewImage에서 deleteImage 한 것 같이 지워줘야함
 * 2. MAX_LIMIT로 한 번에 올릴 수 있는 이미지 갯수 고정
 * 3. 디엠, 댓글 첨부파일에서 사용중
 */
import { ElMessage } from 'element-plus'
import { eChatType } from '~~/types'

const MAX_LIMIT = 10

const { t } = useI18n()


const image = ref<HTMLElement>()
const imageFiles = ref([])
const rawFiles = ref()
const isImgUploading = ref(false)


const emit = defineEmits(['uploadImage'])
defineExpose({ fetchImage, deleteImage })


function uploadImageFile() {
  image.value.click()
}



function onSelectImageFile(event: Event) {


  const files = (event.target as HTMLInputElement).files

  const newFiles = Array.from(files)


  if (!isValidImgCount(newFiles)) {
    ElMessage({
      message: `${t('maxFile.count.text1')} ${MAX_LIMIT}${t('maxFile.count.text2')}`,
      type: 'warning',
    })
    return
  }

  if (rawFiles.value) {
    rawFiles.value = [...rawFiles.value, ...newFiles]
  } else {
    rawFiles.value = newFiles
  }


  for (const file of newFiles) {
    if (file.type === 'image/svg+xml') {
      alert('svg는 지원하지 않는 확장자 형식입니다')
      continue
    }
    const reader = new FileReader()

    reader.onload = async (e) => {

      const url = e.target!.result as string

      imageFiles.value = [...imageFiles.value,
      { file, name: file.name, url, is_blind: false, type: eChatType.IMAGE }
      ]

      console.log(imageFiles.value)
      emit('uploadImage', imageFiles.value)

    }

    reader.readAsDataURL(file)
  }

  (event.target as HTMLInputElement).value = ''
}



function isValidImgCount(images: File[]) {
  console.log(images.length)
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


async function fetchImage() {
  isImgUploading.value = true

  const formData = new FormData()
  let result = []

  for (const file of rawFiles.value) {
    console.log(file)

    formData.append(
      file.name,
      file
    )

    try {
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

        result = data.value.result

      }
    } finally {
      isImgUploading.value = false
      initFiles()
    }

  }

  return result
}

async function deleteImage(idx: number) {
  rawFiles.value.splice(idx, 1)
}

function initFiles() {
  rawFiles.value = undefined
  imageFiles.value = []
  isImgUploading.value = false
}
</script>
<style scoped lang="scss"></style>
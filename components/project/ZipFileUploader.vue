<template>
  <dd>
    <p class="upload-file-container">
      <label for="game-file"
        ><i class="uil uil-file-plus" style="font-size: 18px"></i> &nbsp;
        {{ $t('fileUpload') }}</label
      >
      <input
        @change="onFileChange"
        type="file"
        ref="gameFile"
        id="game-file"
        accept=".zip"
      />

      <ClipLoader v-if="isLoadingFile" :color="'#ff6e17'" :size="'20px'">
      </ClipLoader>
      <button class="btn-circle-icon" @click="deleteFile" v-if="fileName">
        <i class="uil uil-trash-alt"></i>
      </button>
    </p>
    <Transition name="component-fade" mode="out-in">
      <div v-if="fileName">
        <p class="file-size">
          {{ $t('file.size') }} :
          {{ totalSize < 1 ? `${totalSize * 1000} KB` : `${totalSize} MB` }}
        </p>
        <p class="file-name">{{ $t('file.name') }} : {{ fileName }}</p>
      </div>
    </Transition>
    <Transition name="component-fade" mode="out-in">
      <h2 :class="isFileEmpty ? 'file-err on' : 'file-err off'">
        {{ $t('addGameFile.selectFile.text1') }}
      </h2>
    </Transition>
    <h2>
      {{ $t('addGameFile.selectFile.text2') }} <br />
      {{ $t('addGameFile.selectFile.text3') }}
    </h2>
  </dd>
</template>
<script setup lang="ts">
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'

import ZipUtil from '~~/scripts/zipUtil'
import { ElMessage, ElLoading } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const MAX_FILE_SIZE = 500

const zipFile = ref(null as File)

const totalSize = ref(0)
const isLoadingFile = ref(false)
const limitSize = 1024 * 1000 * MAX_FILE_SIZE

const uploadGameFiles = ref([])
const startFileOptions = ref([])
const startFile = ref('')
const fileName = ref('')
const isFileEmpty = ref(false)

const emit = defineEmits(['sendZipFile'])

async function onFileChange(e: any) {
  zipFile.value = e.target.files[0]

  isLoadingFile.value = true
  const zip = await ZipUtil.zipFileToZip(zipFile.value)
  const files = await ZipUtil.zipToFiles(zip)

  let size: number = 0

  for (let f in files) {
    size += files[f].size
  }

  if (size > limitSize) {
    ElMessage.error(t('file.upload.overSize.500'))
    isLoadingFile.value = false

    return
  }
  totalSize.value = Number((size / (1024 * 1000)).toFixed(2))
  uploadGameFiles.value = files

  const htmls = uploadGameFiles.value.filter((file: File) => {
    isLoadingFile.value = false

    return file.name.indexOf('.html') > -1
  })
  startFileOptions.value = htmls.map((file) => file.name)
  startFileOptions.value.sort((a, b) => a.length - b.length)

  const indexFiles = startFileOptions.value.filter((name) =>
    name.includes('index')
  )

  if (indexFiles.length) {
    indexFiles.sort((a, b) => a.length - b.length)
    startFile.value = indexFiles[0]
  } else {
    startFile.value = startFileOptions[0]
  }

  if (startFileOptions.value.length) {
    // this.uploadGameFileError = '';
    fileName.value = e.target.files[0].name
  } else {
    ElMessage.error(t('notFoundHtml'))

    fileName.value = ''
    // this.uploadGameFileError = this.$t('projectAddVersion.error.notFoundHtml').toString();
  }

  // if (
  //     uploadGameFiles.value.length > 0 &&        startFileOptions.value.length > 0
  // ) {
  //     this.$store.commit("sendGameFileDone", true);

  //     this.$store.commit("uploadGameFiles", this.uploadGameFiles);
  //     this.isFileEmpty = false;
  // }
  // else {
  //     this.$store.commit("sendGameFileDone", false);
  // }
  const gameFileInfo = {
    startFileList: startFileOptions.value,
    startFile: startFile.value,
    size: totalSize.value,
    gameFiles: uploadGameFiles.value,
  }
  emit('sendZipFile', gameFileInfo)

  isLoadingFile.value = false
  e.target.value = ''
}

function deleteFile() {
  fileName.value = ''
  //     this.$store.commit("uploadGameFiles", []);
  //     this.zipFile = null;
  //     this.uploadGameFiles = [];
  //     this.startFile = '';
  //     this.startFileOptions = [];
  //     this.totalSize = 0;
  //     (this.$refs.gameFile as any).value = '';
}
</script>

<style scoped lang="scss">
.btn-circle-icon {
  margin-left: 10px;
}

.file-size {
  margin: 10px 0px 10px;
}

.v-spinner {
  margin-left: 10px;
  display: inline-flex;
  align-items: center;
}
</style>

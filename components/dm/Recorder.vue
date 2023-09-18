<template>
  <div class="record-container">
    <div class="dm-uploader-btn">
      <button v-if="!isRecording" @click="startRecording"><i class=" font25"></i></button>
      <button v-else @click="stopRecording"><i class=" font25 text-red"></i></button>
    </div>

    <!-- <audio :src="src" controls ref="audioPlayerRef" @timeupdate="updatePlaybackTime"></audio> -->
    <!-- {{ formattedRecordingTime }} -->
  </div>
</template>
<script setup lang="ts">
import { blobToFile } from '~~/scripts/utils';


const isRecording = ref(false)
const src = ref()
const file = ref()

let mediaRecorder = null;
let recordedChunks = [];
const constraints = { audio: true };
const mediaStream = ref(null);
const recordingDuration = ref(0);
const durationInterval = ref()
const audioPlayerRef = ref(null);

const formattedRecordingTime = computed(() => {
  const minutes = Math.floor(recordingDuration.value / 60);
  const seconds = recordingDuration.value % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});


const emit = defineEmits(['uploadRecord'])

defineExpose({ formattedRecordingTime, isRecording, recordingDuration, fetchRecord })


const startRecording = async () => {
  try {
    const startTime = Date.now();
    durationInterval.value = setInterval(() => {
      recordingDuration.value = Math.floor((Date.now() - startTime) / 1000);
    }, 1000);

    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    mediaStream.value = stream;
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start();
    isRecording.value = true;
  } catch (err) {
    console.error('Error accessing the microphone:', err);
  }
};

const stopRecording = () => {
  if (mediaRecorder && isRecording.value) {
    mediaRecorder.stop();
    mediaStream.value.getTracks().forEach(track => track.stop());
    isRecording.value = false;
    clearInterval(durationInterval.value);
    // recordingDuration.value = 0;
    // emit('uploadRecord',  blob)
    console.log('recordedChunks', recordedChunks)


  }


};


const handleDataAvailable = (event) => {
  if (event.data.size > 0) {
    recordedChunks.push(event.data);
    const blob = new Blob(recordedChunks, { type: 'audio/mpeg' })
    file.value = blobToFile(blob)
    emit('uploadRecord', file.value)
    const blobURL = window.URL.createObjectURL(blob);
    src.value = blobURL

  }
};



async function fetchRecord() {

  const formData = new FormData()
  let result = []


  formData.append(
    file.value.name,
    file.value
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

    result = data.value.result

  }


  return result
}
</script>
<style scoped lang="scss"></style>
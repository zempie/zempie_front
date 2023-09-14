<template>
  <div class="chip-container horizontal ">
    <div ref="chipList" class="chip-list mt0" @mousewheel="scrollX" @mousedown="onMouseDown" @mousemove="onMouseMove"
      @mouseup="onMouseUp">
      <div class="chip" v-for="(chip, i) of chipsArr" :key="chip?.id">
        {{ chip.name }}
        <IconClose @click="deleteChip(i)" color="#fff" class="pointer" />
      </div>
    </div>
    <slot name="input"></slot>
  </div>
</template>
<script setup lang="ts">

const props = defineProps({
  placeholder: String
})

const emit = defineEmits(['currChip'])
interface IChip {
  id: Number | String,
  name: String,
}

const chipList = ref()
const isDragging = ref(false)
const startX = ref()
const scrollLeft = ref()

function scrollX(e) {
  chipList.value.scrollLeft += e.deltaY;
}
function onMouseDown(event) {
  isDragging.value = true;
  startX.value = event.pageX - chipList.value.offsetLeft;
  scrollLeft.value = chipList.value.scrollLeft;
}
function onMouseMove(event) {
  if (!isDragging.value) return;
  event.preventDefault();
  const x = event.pageX - chipList.value.offsetLeft;
  const distance = (x - startX.value) * 2;
  chipList.value.scrollLeft = scrollLeft.value - distance;
}

function onMouseUp() {
  isDragging.value = false;
}

onMounted(() => {
  nextTick(() => {
    onMouseUp()
  })
  window.addEventListener("mouseup", onMouseUp)
})

onBeforeUnmount(() => {
  window.removeEventListener('mouseup', onMouseUp)
})

const chipsArr = ref<IChip[]>([])
defineExpose({ saveChip, backspaceDelete, chipsArr, clearArr })


function deleteChip(index: number) {
  chipsArr.value.splice(index, 1)
  emit('currChip', chipsArr.value)

}

function clearArr() {
  chipsArr.value = []
}


function saveChip(chipInfo?: IChip) {
  if (chipInfo) {
    const duplicated = chipsArr.value.find((elem) => {
      return elem.id === chipInfo.id
    })
    if (!duplicated) {
      chipsArr.value = [...chipsArr.value, chipInfo]
      emit('currChip', chipsArr.value)
    }
  }

}

function backspaceDelete() {
  chipsArr.value.splice(chipsArr.value.length - 1)
  emit('currChip', chipsArr.value)

}
</script>
<style scoped lang="scss"></style>

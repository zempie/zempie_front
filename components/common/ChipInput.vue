<template>
  <div class="chip-container">
    <div class="chip" v-for="(chip, i) of chipsArr" :key="chip?.id">
      {{ chip.name }}
      <i class="uil uil-times" @click="deleteChip(i)"></i>
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


const chipsArr = ref<IChip[]>([])
defineExpose({ saveChip, backspaceDelete, backspaceDelete, chipsArr, clearArr })


function deleteChip(index: number) {
  chipsArr.value.splice(index, 1)
  emit('currChip', chipsArr.value)

}

function clearArr() {
  chipsArr.value = []
}


function saveChip(chipInfo?: IChip) {
  if (chipInfo) {
    chipsArr.value = [...chipsArr.value, chipInfo]
    emit('currChip', chipsArr.value)
  }

}

function backspaceDelete() {
  chipsArr.value.splice(chipsArr.value.length - 1)
  emit('currChip', chipsArr.value)

}
</script>
<style scoped lang="scss">
.chip-container {
  min-height: 48px;
  padding: 5px 15px;
  border-radius: 5px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 0px !important;
  justify-content: flex-start !important;

  .chip {
    height: 30px;
    color: #fff;
    margin: 4px;
    background: #ff6e17;
    padding: 0px 10px;
    border-radius: 20px;
    display: flex;
    align-items: center;

    i {
      cursor: pointer;
      opacity: 0.56;
      margin-left: 8px;
    }
  }

  :deep(.chip-input) {
    flex: 1 1 auto;
    // width: 30px;
    border: none;
    outline: none;
    padding: 4px;
  }
}
</style>
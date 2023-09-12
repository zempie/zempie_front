<template>
  <div class="chip-container">
    <div class="chip" v-for="(chip, i) of chipsArr" :key="chip?.id">
      {{ chip.name }}
      <IconClose @click="deleteChip(i)" color="#fff" class="pointer" />
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
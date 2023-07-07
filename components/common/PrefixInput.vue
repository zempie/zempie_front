<template>
  <div class="input-box">
    <span class="prefix">{{ prefix }}</span>
    <input  type="text" class="w100p custom-input" v-model="inputData" @input="onInputDebounce()" :placeholder=placeholder />
  </div>
</template>
<script setup lang="ts">
import { debounce } from '~/scripts/utils'

const props = defineProps({
  prefix: String,
  inputValue: String,
  placeholder:String
})

const inputData = ref(props.inputValue)

watch(() =>
  (props.inputValue), (newValue) => {
    inputData.value = newValue
  })

const emit = defineEmits(['changeInput'])

const onInputDebounce = debounce(() => {
  emit('changeInput', inputData.value)
}, 300)


</script>
<style scoped lang="scss">
.input-box {
  display: flex;
  align-items: center;
  background: #fff;
  overflow: hidden;
  height: 48px;
  padding: 0 15px;
  border: #e9e9e9 1px solid;
  border-radius: 5px;

  &:focus-within {
    border: #f97316 1px solid;
    box-shadow: 0px 4px 10px 3px rgb(0 0 0 / 7%);
    transition: all 0.4s ease-in-out;
  }

  .prefix {
    font-weight: 300;
    font-size: 14px;
    color: #999;
  }

  input {
    border: none;
    outline: none;
    padding: 0.5rem;

    &:focus {
      box-shadow: none;
    }
  }
}
</style>

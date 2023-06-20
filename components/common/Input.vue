<template>
  <dl class="input-container row w100p items-center ">
    <slot name="userAvatar"></slot>
    <dt>
      <input type="text" v-model="inputText" @keyup.enter="$emit('sendInput', inputText)" :placeholder="placeholder" />
    </dt>
    <dd>
      <a class="pointer" @click="$emit('sendInput', inputText)">
        <i class=" uil uil-message"></i></a>
    </dd>
  </dl>
</template>
<script setup lang="ts">
const inputText = ref('')

defineEmits(['sendInput'])
defineExpose({ initInput })
defineProps({
  placeholder: String
})

function initInput() {
  inputText.value = ''
}


</script>
<style scoped lang="scss">
.input-container {
  border: #e5e5e5 1px solid;
  border-radius: 10px;

  dt {
    width: 90%;

    input {
      border: none;
      width: 100%;
    }

    input:focus {
      box-shadow: none;
    }
  }

  dd {
    a {
      font-size: 16px;
    }
  }


}
</style>
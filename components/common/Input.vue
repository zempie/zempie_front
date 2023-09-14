<template>
  <dl class="input-container row w100p items-center ">
    <slot name="userAvatar"></slot>
    <dt>
      <input type="text" v-model="inputText" @keyup.enter="$emit('sendInput', inputText)" :placeholder="placeholder"
        @focus="onFocus" ref="inputRef" />
    </dt>
    <dd>
      <button class="pointer send-btn" @click="$emit('sendInput', inputText)">게시 </button>
    </dd>
  </dl>
</template>
<script setup lang="ts">

const inputText = ref('')
const inputRef = ref(null)

defineEmits(['sendInput'])
defineExpose({ initInput })
const props = defineProps({
  placeholder: String,
  text: String
})

onMounted(() => {
  if (props.text) {
    inputText.value = props.text
    console.log('?props', props.text)
  }
})

function initInput() {
  inputText.value = ''
}


function onFocus() {
  inputRef.value.scrollIntoView({ behavior: 'smooth', block: 'center' });

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
    .send-btn {
      background-color: transparent;
      border: none;

      &:hover {
        color: #f97316
      }
    }
  }


}
</style>
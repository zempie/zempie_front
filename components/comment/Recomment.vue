<template>
  <span class="pointer" @click="onClickRecomment">
    <i class="uil uil-edit-alt"></i> 답글 작성</span>
</template>
<script setup lang="ts">
import { PropType } from 'vue';
import { IComment } from '~~/types';

const props = defineProps({
  parentComment: Object as PropType<IComment>
})
const emit = defineEmits([
  'recomment'
])

function onClickRecomment() {
  emit('recomment')

}

</script>
<style scoped lang="scss"></style>
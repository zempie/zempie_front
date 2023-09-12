
<template>
  <div>
    <div class="input-search-default" @input="onInputMsg">
      <p><i>
          <IconSearch />
        </i>
      </p>
      <div><input v-model="dmKeyword" type="text" name="" title="keywords" placeholder="검색어를 입력하세요." /></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { debounce } from '~~/scripts/utils'
import { IChat, IMessage, IUser } from '~~/types'

const dmKeyword = ref('')

const props = defineProps({
  room_id: {
    type: Number,
    default: 0
  }

})

const emit = defineEmits(['searchMsg'])

const onInputMsg = debounce(async (e) => {

  const query = {
    msg: dmKeyword.value

  }

  const { data, error, pending } = await useCustomAsyncFetch<{ totalCount: number, result: IUser[] }>(createQueryUrl(`/chat/room/${props.room_id}/search`, query), getComFetchOptions('get', false))

  if (data.value) {
    const { result } = data.value
    if (result.length) {
      emit('searchMsg', result)
    }
  }


}, 300)
</script>
<style scoped lang="scss"></style>
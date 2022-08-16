<template>
  <a v-if="!community?.is_subscribed" class="btn-default mr10 w100p" :community="community" @click.stop="subscribe">{{
      $t('subscribe.btn')
  }}</a>
  <a v-else class="btn-sub mr10 w100p" @click.stop="modalIsOpen = true">{{ $t('isSubscribing') }}</a>

  <ClientOnly>
    <el-dialog v-model="modalIsOpen" append-to-body custom-class="modal-area-type" :show-close="false">

      <div class="modal-alert">
        <dl class="ma-header">
          <dt>{{ $t('information') }}</dt>
          <dd>
            <button @click="modalIsOpen = false"><i class="uil uil-times"></i></button>
          </dd>
        </dl>
        <div class="ma-content">
          <h2> {{ $t('leave.community.text1') }}<br />※ {{ $t('leave.community.text2') }}</h2>
          <div>
            <button class="btn-default w48p" @click="unsubscribe">{{ $t('yes') }}</button>
            <button class="btn-gray w48p" @click="modalIsOpen = false">{{ $t('no') }}</button>
          </div>
        </div>


      </div>
    </el-dialog>
  </ClientOnly>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { ICommunity } from '~~/types';
import { ElDialog } from "element-plus";

const modalIsOpen = ref(false)

const props = defineProps({
  community: Object as PropType<ICommunity>
})
const emit = defineEmits(['fetch'])

const isLogin = computed(() => useUser().user.value.isLogin)

async function subscribe() {
  if (isLogin) {
    const { data, error } = await community.subscribe(props.community.id)
    if (!error.value) {
      emit('fetch')
    }

  } else {
    useModal().openLoginModal()
  }
}

async function unsubscribe() {
  const { data, error } = await community.unsubscribe(props.community.id)

  if (!error.value) {
    emit('fetch')
    modalIsOpen.value = false;
  }
}

</script>

<style scoped lang="scss">
</style>
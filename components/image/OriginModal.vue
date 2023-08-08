<template>
  <el-dialog v-model="showModal" class="img-modal-area" :show-close="false">
    <div class="column">
      <button class="close-btn pointer" @click="closeModal">
        <i class="uil uil-times"></i>
      </button>
      <div class="user-info row w100p pb15">
        <button class="mr10 pointer"><span class="material-icons">
            arrow_back
          </span></button>
        <UserAvatar :user="msg?.sender" tag="p" style="width:45px; height: 45px;" class="mr10" :has-router="true"
          ref="ignoreElRef" />
        <div>
          <p class="text-bold font15">{{ msg?.sender?.nickname }}</p>
          <h4 class="mr5">{{ dmDateFormat(msg.created_at) }}</h4>
        </div>
      </div>

      <div class="orgin-img-container mb15 mt15">
        <img :src="msg?.contents" ref="target" />
      </div>
      <!-- <div class="img-options w100p row justify-between">
        <div>
        </div>
        <div ref="ignoreElRef">
          <button class="pointer" @click="onImgDownload">
            <a target="_blank" download="" :href="msg?.contents">
              <span class="material-icons">
                save_alt
              </span>
            </a>
          </button>
        </div>
      </div> -->
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import { ElDialog } from 'element-plus';
import { onClickOutside } from '@vueuse/core'
import { PropType } from 'nuxt/dist/app/compat/capi';
import { dmDateFormat } from '~~/scripts/utils'
import { IMessage } from '~~/types';

const props = defineProps({
  msg: Object as PropType<IMessage>,
  openModal: {
    type: Boolean,
    default: false
  },
})
const emit = defineEmits(['closeModal'])

const target = ref(null)
const ignoreElRef = ref(null)

onClickOutside(target, (event) => { closeModal() },
  { ignore: [ignoreElRef] })

const showModal = computed(() => props.openModal)

function closeModal() {
  emit('closeModal')
}

function onImgDownload() {

}

</script>
<style scoped lang="scss">
.img-modal-area {
  div:first-child {
    width: 95%;
    height: 90vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .close-btn {
    background: transparent;
    color: #fff;
    font-size: 30px;
    border: none;
    top: 0px;
    right: 0px;
    position: absolute;
    border-radius: 5px;
  }

  .user-info {
    display: none;
  }

  .img-options {
    display: none;
  }

  button {
    background: transparent;
    border: none;
  }

  .orgin-img-container {
    display: flex;
    justify-content: center;


    img {
      height: auto;
      border-radius: 20px;
      max-width: 100vw;

    }
  }
}




@media all and (max-width: 768px) {

  .img-modal-area {

    div:first-child {
      display: flex;
      width: 100%;
      height: 100%;
    }

    .close-btn {
      display: none;
    }

    .user-info {
      display: flex;
      border-bottom: 1px solid #ededed;


    }

    .orgin-img-container {
      display: flex;
      justify-content: center;
      width: 100%;
      height: 88%;

      img {
        border-radius: 20px;
        object-fit: contain;

      }
    }

    .img-options {
      display: flex;
      padding: 10px;
      border-top: 1px solid #ededed;

    }
  }



}
</style>
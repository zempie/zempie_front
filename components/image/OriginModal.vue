<template>
  <el-dialog v-model="showModal" class="img-modal-area" :show-close="false" append-to-body>
    <div class="column">
      <button class="close-btn pointer" @click="closeModal">
        <i class="uil uil-times"></i>
      </button>
      <div class="user-info row w100p pb15">
        <button class="mr10 pointer"><span class="material-icons">
            arrow_back
          </span></button>
        <template v-if="imgInfo.user">
          <UserAvatar :user="imgInfo?.user" tag="p" style="width:45px; height: 45px;" class="mr10" :has-router="true"
            ref="ignoreElRef" />
          <div>
            <p class="text-bold font15">{{ imgInfo?.user?.nickname }}</p>
            <h4 class="mr5">{{ dmDateFormat(imgInfo?.created_at) }}</h4>
          </div>
        </template>
      </div>
      <div class="orgin-img-container mb15 mt15">
        <img :src="imgInfo?.url" ref="target" />
      </div>
      <!-- TODO: 업데이트 진핼 -->
      <!-- <div class="img-options w100p row justify-between">
        <div>
        </div>
        <div ref="ignoreElRef">
          <button class="pointer" @click="onImgDownload">
            <a target="_blank" download="" :href="imgInfo?.contents">
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
  imgInfo: Object,
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

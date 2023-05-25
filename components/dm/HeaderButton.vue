<template>
  <client-only>
    <el-dropdown ref="dmDropdown" id="dmList" trigger="click">
      <button class="btn-circle-icon ml10">
        <i class="uil uil-comment-alt"></i>
        <!-- <span></span> -->
      </button>
      <template #dropdown>
        <div slot="body" class="header-message">
          <dl>
            <dt>New Message</dt>
            <dd>
              <a><i class="uil uil-comment-alt"></i><em>{{ t('mark.all') }}</em></a>
            </dd>
          </dl>
          <ul>
            <li class="active">
              <dl>
                <dd>
                  <span
                    style="background: url('https://i.pinimg.com/564x/b5/a1/b3/b5a1b3de46d3e66a241d21f4f5141df7.jpg') center center no-repeat; background-size: cover;"></span>
                  <span
                    style="margin-left:-60px; background: url('https://i.pinimg.com/564x/d8/aa/76/d8aa7628aa5b8671607c8326b36d71b7.jpg') center center no-repeat; background-size: cover;"></span>
                </dd>
                <dt>
                  <h3>쿵쿵딱 게임세상</h3>
                  <p>폼생폼사 창작게임 고수 모임에 가입해주셔서 감사합니다.</p>
                </dt>
                <dd>
                  <h4><i class="uis uis-clock" style="color:#c1c1c1;"></i> 10시간전</h4>
                  <em>1</em>
                </dd>
              </dl>
            </li>
          </ul>
          <!-- <p><router-link to="#">전체보기</router-link></p> -->
          <p class="view-all pointer" @click="goDmList"><a>{{ t('view.all') }}</a></p>

        </div>
      </template>
    </el-dropdown>
  </client-only>
</template>
<script setup lang='ts'>
import { ElDropdown } from 'element-plus'

const { $localePath } = useNuxtApp()
const { t } = useI18n()

const router = useRouter()
const dmDropdown = ref()

function goDmList() {
  router.push($localePath('/dm/list'))

  dmDropdown.value.handleClose()
}

</script>
<style scoped lang='scss'>

</style>

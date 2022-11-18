<template>
  <ProjectStepMenu>
    <template #uploadGameBtn>
      <li :class="'publish-btn'">
        <h4>{{ $t('update') }}</h4>
      </li>
    </template>
  </ProjectStepMenu>
  <dd>
    <ul class="studio-game-step">
      <li
        @click="selectStage(eGameStage.DEV)"
        :class="stage === 1 && 'active' "
      >
        <dl>
          <dt>
            <img src="/images/studio_icon01.png" :alt="$t('devLog')" title="" />
          </dt>
          <dd>
            <h3>{{ $t('devLog') }}</h3>
            <div>{{ $t('devLog.info') }}</div>
          </dd>
        </dl>
      </li>
      <li
        @click="selectStage(eGameStage.EARLY)"
        :class="stage === 2 && 'active' "
      >
        <dl>
          <dt>
            <img
              src="/images/studio_icon02.png"
              :alt="$t('earlyAccess')"
              title=""
            />
          </dt>
          <dd>
            <h3>{{ $t('earlyAccess') }}</h3>
            <div>{{ $t('earlyAccess.info') }}</div>
          </dd>
        </dl>
      </li>
      <li
        @click="selectStage(eGameStage.COMPLETE)"
        :class="stage === 3 && 'active' "
      >
        <dl>
          <dt>
            <img
              src="/images/studio_icon03.png"
              :alt="$t('complete')"
              title=""
            />
          </dt>
          <dd>
            <h3>{{ $t('complete') }}</h3>
            <div>{{ $t('complete.info') }}</div>
          </dd>
        </dl>
      </li>
      <li :class="stage === 4 && 'active' ">
        <p></p>
        <dl>
          <dt><img src="/images/studio_icon04.png" alt="" title="" /></dt>
          <dd>
            <h3>{{ $t('monetization') }}</h3>
            <div>{{ $t('monetize.alert') }}</div>
          </dd>
        </dl>
      </li>

    </ul>

    <ul class="sui-btn">
          <li>
            <a @click="prevPage" class="btn-line w150"
              ><i class="uil uil-angle-left-b"></i>
              {{ $t('previous') }}
            </a>
          </li>         
    </ul>
  </dd>
</template>

<script setup lang="ts">
import { eGameCategory, eGameStage } from '~~/types/index'
import { ElMessage } from 'element-plus'
const stage = computed(() => useProject().editProject.value.info.stage)

const router = useRouter()
const { t, locale } = useI18n()


function selectStage(stage: number) {
  if(!useProject().editProject.value.info.game.url_game  && stage !== eGameStage.DEV){
    ElMessage({
      message: t('game.file.deploy.first'),
      type: 'warning',
    })
    return
  }
  useProject().setStageOnEdit(stage)
  useProject().setStepThreeOnEdit()  
}


function prevPage(){
  useProject().setStepOneOnEdit()
  useProject().setStepOne()
  useProject().setPurpose(eGameCategory.NONE)
}
</script>

<style scoped lang="scss">
.sui-btn{
  li{
    margin-top: 30px;
  }
}

input[type='radio'] {
  display: none;
}

input[type='radio']:checked + label {
  color: #fff;
  background: #ff6e17;
  border-color: #ff6e17;
}

input[type='radio'] + label {
  display: inline-block;
  width: 22px;
  height: 22px;
  text-align: center;
  font-size: 15px;
  color: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  cursor: pointer;
}

.studio-game-step > li:hover {
  box-shadow: 0px 10px 50px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

.studio-game-step .active {
  border: 2px solid #ff6e17;
}

.dimmed {
  width: 100%;
  opacity: 0.2;
  pointer-events: none;
}
</style>

<template>
  <ProjectStepMenu>
    <template #uploadGameBtn>
      <li :class="[uploadStage === eGameStage.DEV && 'active', 'publish-btn']">
        <h4>{{ $t('publishing') }}</h4>
      </li>
    </template>
  </ProjectStepMenu>
  <dd>

    <ul class="studio-game-step">
      <li @click="selectStage(eGameStage.DEV)">
        <dl>
          <dt><img src="/images/studio_icon01.png" :alt="$t('devLog')" title="" /></dt>
          <dd>
            <h3>{{ $t('devLog') }}</h3>
            <div>{{ $t('devLog.info') }}
            </div>
          </dd>
        </dl>
      </li>
      <li @click="selectStage(eGameStage.EARLY)">
        <dl>
          <dt><img src="/images/studio_icon02.png" :alt="$t('earlyAccess')" title="" /></dt>
          <dd>
            <h3>{{ $t('earlyAccess') }}</h3>
            <div>{{ $t('earlyAccess.info') }}</div>
          </dd>
        </dl>
      </li>
      <li @click="selectStage(eGameStage.COMPLETE)">
        <dl>
          <dt><img src="/images/studio_icon03.png" :alt="$t('complete')" title="" /></dt>
          <dd>
            <h3>{{ $t('complete') }}</h3>
            <div>{{ $t('complete.info') }}</div>
          </dd>
        </dl>
      </li>
      <li>
        <p>
        </p>
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
import { eGameCategory, eGameStage } from '~~/types/index';
const { uploadProject } = useProject();

const uploadStage = computed(() => uploadProject.value.form.stage)

const router = useRouter();

function selectStage(stage: number) {
  useProject().setStage(stage)
  useProject().setStepThree()
}

function prevPage(){
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
input[type="radio"] {
  display: none;
}

input[type="radio"]:checked+label {
  color: #fff;
  background: #FF6E17;
  border-color: #FF6E17;
}

input[type="radio"]+label {
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


.studio-game-step{
  li:hover:not(:last-child) {
    box-shadow: 0px 10px 50px rgba(0, 0, 0, 0.2);
    cursor: pointer;
  }
  li:last-child{
    opacity: 0.5;
  }
}

.studio-game-step .active {
  border: 2px solid #FF6E17;
}

.dimmed {
  width: 100%;
  opacity: 0.2;
  pointer-events: none;
}
</style>
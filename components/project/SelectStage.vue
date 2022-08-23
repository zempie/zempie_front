<template>
  <ProjectStepMenu>
    <template #uploadGameBtn>
      <li :class="[uploadStage === eGameStage.DEV ? 'active' : '', 'publish-btn']">
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
            <div>{{ $t('추후 게임 수익화를 위한 Zempie 파트너 서비스를 제공할 예정입니다.') }}</div>
          </dd>
        </dl>
      </li>


      <!-- <modal :clickToClose="false"
               class="modal-area-type"
               name="changedStage"
               width="90%" height="auto" :maxWidth="380"
               :adaptive="true"
               :scrollable="true">
            <div class="modal-alert">
                <dl class="ma-header">
                    <dt>{{ $t('information') }}</dt>
                    <dd>
                        <button @click="$modal.hide('changedStage')"><i class="uil uil-times"></i></button>
                    </dd>
                </dl>
                <div class="ma-content">
                    <h2>{{ $t('selectStage.alert') }}<br/> {{ $t('selectStage.alert.confirm') }}
                        </h2>

                    <div>
                        <button class="btn-default w48p" @click="changedStage()">{{ $t('yes') }}</button>
                        <button class="btn-gray w48p" @click="$modal.hide('changedStage')">{{ $t('no') }}</button>
                    </div>
                </div>
            </div>
        </modal> -->


    </ul>
  </dd>
</template>

<script setup lang="ts">
import { eGameStage } from '~~/types/index';
const { uploadProject } = useProject();

const uploadStage = computed(() => uploadProject.value.form.stage)

const router = useRouter();

function selectStage(stage: number) {
  useProject().setStage(stage)
  useProject().setStepTwo()
}
    // @Prop() projectInfo !: any;
    // uploadStage = eGameStage;

    // selectedStage:number = 0;

    // mounted() {
    //     this.$store.commit("gameStage", null);
    // }

    // selectStage(selectedStage: number) {
    //     if (this.projectInfo) {
    //         const {projectVersions, stage} = this.projectInfo;

    //         if (selectedStage === eGameStage.Dev) {
    //             if (projectVersions.length > 0) {
    //                 this.$modal.show('changedStage')
    //                 this.selectedStage = selectedStage;
    //             }
    //             else {
    //                 this.saveStage(selectedStage);
    //             }
    //         }
    //         else {
    //             this.saveStage(selectedStage);

    //         }
    //     }else{
    //         this.saveStage(selectedStage);
    //     }

    // }

    // changedStage() {
    //     this.saveStage(this.selectedStage);
    //     this.$modal.hide('changedStage')
    // }

    // saveStage(stage:number){
    //     this.$emit('stage', stage)
    //     this.$store.commit("gameStage", stage);
    // }

</script>

<style scoped lang="scss">
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

.studio-game-step>li:hover {
  box-shadow: 0px 10px 50px rgba(0, 0, 0, 0.2);
  cursor: pointer;

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
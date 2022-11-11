<template>
<ProjectStepMenu>
    <template #uploadGameBtn>
      <li>
        <h4>{{ $t('publishing') }}</h4>
      </li>
    </template>
  </ProjectStepMenu>
  <dd>
    <ul class="studio-game-step">
      <li @click="selectPurpose(eGameCategory.Challenge)"
      :class="purpose === eGameCategory.Challenge && 'active' "
       >
        <dl id="basicUpload">
          <dt><img src="/images/zempie_logo_154_155.png" width="70" :alt="$t('devLog')" title="" /></dt>
          <dd>
            <h3>{{ $t('zempie.upload') }}</h3>
            <div>{{ $t('zempie.upload.info') }}
            </div>
          </dd>
        </dl>
      </li>
      <li @click="selectPurpose(eGameCategory.GJ)"
      :class="purpose === eGameCategory.GJ&& 'active' "
      >
        <dl id="GJ">
          <dt><img src="/images/GJ_transparent.png" width="70" :alt="$t('earlyAccess')" title="" /></dt>
          <dd>
            <h3>GJ+</h3>
            <div>{{ $t('global.game.zem.info') }}
            </div>
            <small>2022/11/18 ~ 2022/11/20</small>
            
          </dd>
        </dl>
      </li>
      <li >
        <dl>
          <dt><img src="/images/zemjam_logo_1.png" :alt="$t('seo.zemjam.title')" width="100" title="" /></dt>
          <dd>
            <h3>ZemJam</h3>
            <div>{{ $t('zempie.gamejam.info') }}</div>
            <small>{{ $t('finish') }}</small>
          </dd>
        </dl>
      </li>
    </ul>
  </dd>

</template>
<script setup lang="ts">
import {eGameCategory} from '~/types'

const route = useRoute()
const purpose = computed(() => useProject().editProject.value.info.game?.category)

const isEditProject = computed(()=>{
  return route.params.id ? true : false
})


function selectPurpose(purpose:number){
  if(isEditProject.value){
    useProject().setStepTwoOnEdit()
    useProject().setEditPurpose(purpose)

  }else{
    useProject().setPurpose(purpose)
    useProject().setStepTwo()
  }
}
</script>
<style scoped lang="scss">
.studio-game-step{
  li{
    font-size: 16px;
    dd{
      small{
        font-size: 14px;

      }
    }
    small{
      color: #FF6E17;
    }
  }
  li:not(:last-child){
    cursor: pointer;
    &:hover{
      box-shadow: 0px 10px 50px rgba(0, 0, 0, 0.2);
    }
    .active {
      border: 2px solid #FF6E17;
    }
  }
  li:last-child{
    opacity: 0.5;
    
   
  }
}
</style>
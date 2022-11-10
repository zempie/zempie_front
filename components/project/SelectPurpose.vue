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
          <dt><img src="/images/studio_icon01.png" :alt="$t('devLog')" title="" /></dt>
          <dd>
            <h3>일반 업로드</h3>
            <div>게임을 올려보세요.
            </div>
          </dd>
        </dl>
      </li>
      <li @click="selectPurpose(eGameCategory.GJ)"
      :class="purpose === eGameCategory.GJ&& 'active' "
      >
        <dl id="GJ">
          <dt><img src="/images/studio_icon02.png" :alt="$t('earlyAccess')" title="" /></dt>
          <dd>
            <h3>GJ+</h3>
            <div>글로벌 게임젬에 도전해보세요.
            </div>
            <small>22/11/08 ~ 22/11/10</small>
            
          </dd>
        </dl>
      </li>
      <li >
        <dl>
          <dt><img src="/images/studio_icon03.png" :alt="$t('complete')" title="" /></dt>
          <dd>
            <h3>ZemJam</h3>
            <div>젬파이 게임젬에 도전해보세요.</div>
            <small>종료</small>
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
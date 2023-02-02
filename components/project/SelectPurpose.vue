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
      <li @click="selectPurpose(eGameCategory.Challenge)" :class="purpose === eGameCategory.Challenge && 'active'">
        <dl id="basicUpload">
          <dt><img src="/images/zempie_logo_154_155.png" width="70" :alt="$t('zempie.upload')" :title="$t('zempie.upload')" /></dt>
          <dd>
            <h3>{{ $t('zempie.upload') }}</h3>
            <div>{{ $t('zempie.upload.info') }}
            </div>
          </dd>
        </dl>
      </li>
      <li @click="selectPurpose(eGameCategory.GGJ)" :class="purpose === eGameCategory.GGJ && 'active'">
        <dl id="GGJ">
          <dt><img src="/images/GGJ00_Logo_Dark.png" width="100" alt="Global game jam" title="GGJ" /></dt>
          <dd>
            <h3>GGJ</h3>
            <div>{{ $t('global.game.jam.info') }}</div>
            <small>2023/02/03 ~ 2023/02/05</small>
          </dd>
        </dl>
      </li>
      <li class="inActive">
        <dl id="GJ">
          <dt><img src="/images/GJ_transparent.png" width="70" alt="Game jam Plus" title="GJ+" /></dt>
          <dd>
            <h3>GJ+</h3>
            <div>{{ $t('global.game.zem.info') }}
            </div>
            <small>2022/11/18 ~ 2022/11/20</small>
          </dd>
        </dl>
      </li>
      <li class="inActive">
        <dl>
          <dt><img src="/images/zemjam_logo_1.png" :alt="$t('seo.zemjam.title')" width="100" title="zemjam" /></dt>
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
import { eGameCategory } from '~/types'

const route = useRoute()
const purpose = computed(() => useProject().editProject.value.info.game?.category)
const isInactive = ref(false)

const isEditProject = computed(() => {
  return route.params.id ? true : false
})

onBeforeMount(() => {
  let date = new Date()
  let GJ_END: Date | number = new Date(2022, 10, 20, 23, 59, 59)
  let GJ_START: Date | number = new Date(2022, 10, 18 , 23, 59, 59)

  GJ_END = GJ_END.setTime(GJ_END.getTime())
  GJ_START = GJ_START.setTime(GJ_START.getTime())

  //오늘날짜가 게임젬끝나는 날 보다 큰경우 게임젬 비활성화
  if (date.setTime(date.getTime()) > GJ_END && date.setTime(date.getTime()) < GJ_START) {
    isInactive.value = true
  }
})


function selectPurpose(purpose: number) {
  if(isInactive.value ) return
  if (isEditProject.value) {
    useProject().setStepTwoOnEdit()
    useProject().setEditPurpose(purpose)

  } else {
    useProject().setPurpose(purpose)
    useProject().setStepTwo()
  }
}
</script>
<style scoped lang="scss">
.studio-game-step {
  li {
    font-size: 16px;
    &.inactive{
      opacity: 0.5;
    }
    dd {
      small {
        font-size: 16px;

      }
    }

    small {
      color: #FF6E17;
    }
  }

  li:not(:last-child) {
    cursor: pointer;

    &:hover {
      box-shadow: 0px 10px 50px rgba(0, 0, 0, 0.2);
    }

    .active {
      border: 2px solid #FF6E17;
    }
  }


    .inActive{
         opacity: 0.5;


  }
}
</style>

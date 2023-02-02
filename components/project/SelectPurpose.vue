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
      <li v-for="event in events" @click="selectPurpose(Number(event.category))" :class="purpose === Number(event.category) && 'active'">
        <dl id="GGJ">
          <dt><img :src="event.url_img" width="100" :alt="event?.title" :title="event?.title" /></dt>
          <dd>
            <h3>{{ event?.title }}</h3>
            <div>{{event?.desc}}</div>
            <small>{{dayjs(event?.start_date).format('YYYY/MM/DD')}}~ {{dayjs(event?.end_date).format('YYYY/MM/DD')}}</small>
          </dd>
        </dl>
      </li>
    </ul>
  </dd>

</template>
<script setup lang="ts">
import { eGameCategory, IEvent } from '~/types'
import dayjs from 'dayjs';

const route = useRoute()
const purpose = computed(() => useProject().editProject.value.info.game?.category)
const isInactive = ref(false)
const events = ref<IEvent[]>()

const isEditProject = computed(() => {
  return route.params.id ? true : false
})

const {data, pending, error} = await useCustomAsyncFetch<{result:[]}>(
  `/events`,
    getStudioFetchOptions('get', true)
)


onBeforeMount(() => {
  events.value = data.value.result
  .filter((event:IEvent)=>{
    return new Date(event.end_date) > new Date()
  })
  .sort((a:IEvent, b:IEvent)=>{
    return new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
  })
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

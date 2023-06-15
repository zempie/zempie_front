<template>
  <ProjectStepMenu>
    <template #uploadGameBtn>
      <li>
        <h4>{{ $t('publishing') }}</h4>
      </li>
    </template>
  </ProjectStepMenu>
  <dd>
    <ClientOnly>
      <ul class="studio-game-step">
        <li @click="selectPurpose(eGameCategory.Challenge)" :class="purpose === eGameCategory.Challenge && 'active'">
          <dl id="basicUpload">
            <dt><img src="/images/zempie_logo_154_155.png" width="70" :alt="$t('zempie.upload')"
                :title="$t('zempie.upload')" /></dt>
            <dd>
              <h3>{{ $t('zempie.upload') }}</h3>
              <div>{{ $t('zempie.upload.info') }}
              </div>
            </dd>
          </dl>
        </li>

        <li v-for="event in events" @click="selectPurpose(Number(event.category))"
          :class="[purpose === Number(event.category) && 'active', isPassed(event) && 'inActive']">
          <dl id="GGJ">
            <dt><img :src="event.url_img" width="100" :alt="event?.title" :title="event?.title" /></dt>
            <dd>
              <h3>{{ event?.title }}</h3>
              <div>{{ event?.desc }}</div>
              <small>{{ dayjs(event?.start_date).format('YYYY/MM/DD') }}~
                {{ dayjs(event?.end_date).format('YYYY/MM/DD') }}</small>
            </dd>
          </dl>
          <!-- <dl v-if="isNotOpen(event)" class="not-open-float">
          <dd >
          NOT OPEN
        </dd>
        </dl> -->
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
            </dd>``
          </dl>
        </li>
      </ul>
    </ClientOnly>
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

const { data, pending, error } = await useCustomAsyncFetch<{ result: [] }>(
  `/events`,
  getStudioFetchOptions('get', true)
)


onBeforeMount(() => {
  events.value = data.value.result
    .sort((a: IEvent, b: IEvent) => {
      return new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
    })
})


function selectPurpose(purpose: number) {
  if (isInactive.value) return
  if (isEditProject.value) {
    useProject().setStepTwoOnEdit()
    useProject().setEditPurpose(purpose)

  } else {
    useProject().setPurpose(purpose)
    useProject().setStepTwo()
  }
}
function isPassed(event: IEvent) {
  const end_date = dayjs(event.end_date)
  return dayjs().isAfter(end_date)
}
function isNotOpen(event: IEvent) {
  const start_date = dayjs(event.start_date)
  return dayjs().isBefore(start_date)
}
</script>
<style scoped lang="scss"></style>

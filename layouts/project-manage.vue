<template>
  <div class="content-studio">
    <StudioSideMenu />
    <div class="studio-banner bg02">
      <h2>{{ $route.meta.title }}</h2>
      <p>{{ $route.meta.desc }}</p>
    </div>
    <ClientOnly>
      <div class="tab-search-swiper">
        <div class="swiper-area">
          <div class="swiper-slide">
            <NuxtLink
              :to="$localePath(`/project/${$route.params.id}`)"
              :class="$route.meta.name === 'projectId' ? 'active' : ''"
            >
              {{ $t('projectManager.edit.gameInfo') }}
            </NuxtLink>
          </div>
          <div class="swiper-slide">
            <NuxtLink
              :to="$localePath(`/project/${$route.params.id}/version-manage`)"
              :class="$route.meta.name === 'versionManage' ? 'active' : ''"
            >
              {{ $t('projectManager.manage.version') }}
            </NuxtLink>
          </div>
          <div class="swiper-slide">
            <NuxtLink
              :to="$localePath(`/project/${$route.params.id}/add-version`)"
              :class="$route.meta.name === 'addVersion' ? 'active' : ''"
            >
              {{ $t('projectManager.add.version') }}
            </NuxtLink>
          </div>
          <div class="swiper-slide">
            <NuxtLink
              :to="$localePath(`/project/${$route.params.id}/deploy-manage`)"
              :class="$route.meta.name === 'deployManage' ? 'active' : ''"
            >
              {{ $t('projectManager.manage.deploy') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </ClientOnly>
    <slot />
  </div>
</template>

<script setup lang="ts">
const { $localePath } = useNuxtApp()
const route = useRoute()

const projectId = computed(() => parseInt(route.params.id as string))
const { editProject, getProjectInfo } = useProject()

onMounted(async () => {
  if (!editProject.value.info.id) await getProjectInfo(projectId.value)
})
</script>

<style lang="scss" scoped>
.swiper-slide {
  width: 25% !important;
}

.darker-text {
  min-height: 18px;
  background-color: #333;
  border-radius: 10px;
}

.numbers {
  min-height: 18px;
}
</style>

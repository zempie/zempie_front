<template>
  <div class="content-studio">
    <ClientOnly>
      <div class="studio-banner bg02">
        <h2>{{ $route.meta.title }}</h2>
        <p>{{ $route.meta.desc }}</p>
      </div>
    </ClientOnly>
    <div class="tab-search-swiper">
      <div class="swiper-area">
        <!--                <swiper-slide>-->
        <!--                    <router-link to="#">대시보드</router-link>-->
        <!--                </swiper-slide>-->
        <div class="swiper-slide">
          <NuxtLink :to="localePath(`/project/${$route.params.id}`)"
            :class="$route.name.toString().includes('project-id_') ? 'active' : ''">
            {{ $t('projectManager.edit.gameInfo') }}
          </NuxtLink>
        </div>
        <div class="swiper-slide">
          <NuxtLink :to="localePath(`/project/${$route.params.id}/version-manage`)"
            :class="$route.name === 'VersionManage' ? 'active' : ''">
            {{ $t('projectManager.manage.version') }}
          </NuxtLink>
        </div>
        <div class="swiper-slide">
          <NuxtLink :to="localePath(`/project/${$route.params.id}/add-verison`)"
            :class="$route.name === 'AddVersion' ? 'active' : ''">
            {{ $t('projectManager.add.version') }}
          </NuxtLink>
        </div>
        <div class="swiper-slide">
          <NuxtLink :to="localePath(`/project/${$route.params.id}/deploy-manage`)"
            :class="$route.name === 'DeployManage' ? 'active' : ''">
            {{ $t('projectManager.manage.deploy') }}
          </NuxtLink>
        </div>
      </div>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useLocalePath } from 'vue-i18n-routing';

const localePath = useLocalePath()


</script>

<style lang="scss" scoped>
.darker-text {
  min-height: 18px;
  background-color: #333;
  border-radius: 10px;
}


.numbers {
  min-height: 18px
}
</style>

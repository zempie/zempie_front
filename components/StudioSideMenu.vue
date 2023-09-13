<template>
  <div class="lnb">
    <ul>
      <NuxtLink :to="$localePath('/project/list')">
        <li>
          <i>
            <IconController />
          </i>
          <span>{{ $t('allGames') }}</span>
        </li>
      </NuxtLink>
      <NuxtLink :to="$localePath('/project/upload')">
        <li>
          <i>
            <IconUploadFile />
          </i>
          <span>{{ $t('gameUpload') }}</span>
        </li>
      </NuxtLink>
    </ul>
  </div>
</template>

<script setup lang="ts">
const { $localePath } = useNuxtApp()
</script>

<style scoped lang="scss">
.lnb {
  z-index: 999;
}
</style>

<template>
    <div class="lnb">
        <ul>
            <NuxtLink :to="localePath('/project/dashboard')">
                <li>
                    <i class="uil uil-chart-pie-alt"></i>
                    <span>{{ $t('dashboard') }}</span>
                </li>
            </NuxtLink>
            <NuxtLink :to="localePath('/project/list')">
                <li>

                    <i class="uil uil-robot"></i>
                    <span>{{ $t('allGames') }}</span>
                </li>
            </NuxtLink>
            <NuxtLink :to="localePath('/project/upload')">
                <li>
                    <i class="uil uil-folder-upload"></i>
                    <span>{{ $t('gameUpload') }}</span>
                </li>
            </NuxtLink>
        </ul>

    </div>
</template>

<script setup lang="ts">
import { useLocalePath } from 'vue-i18n-routing';
const localePath = useLocalePath();

</script>

<style scoped lang="scss">
.lnb {
    z-index: 999;
}
</style>
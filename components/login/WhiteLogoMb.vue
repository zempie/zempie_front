<template>
    <div>
        <NuxtLink :to="localePath(path)"><img src="/images/logo.svg" alt="zempie-logo" title="zempie-logo" />
        </NuxtLink>
    </div>

</template>
<script lang='ts' setup>
import { useLocalePath } from 'vue-i18n-routing';

const localePath = useLocalePath();


const props = defineProps({
    path: {
        default: '/',
        type: String
    }
})

</script>

<style scoped lang="scss">
</style>

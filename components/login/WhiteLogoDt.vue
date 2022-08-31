<template>
    <div class="login-logo">
        <NuxtLink :to="localePath(path)"><img src="/images/zempie_logo.png" alt="zempie-logo" title="zempie-logo" />
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

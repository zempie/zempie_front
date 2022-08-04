<template>
    <div class="login-logo">
        <NuxtLink :to="localePath(path)"><img src="/images/zempie_logo.png" alt="zempie-logo" title="zempie-logo" />
        </NuxtLink>
    </div>

</template>
<script lang='ts' setup>

const props = defineProps({
    path: {
        default: '/',
        type: String
    }
})


</script>

<style scoped lang="scss">
</style>

<template>
  <EventGJPlus />
</template>
<script setup lang="ts">
import shared from '~/scripts/shared'
const { t, locale } = useI18n()
const route = useRoute()
const config = useRuntimeConfig()

shared.createHeadMeta('Game Jam Plus', t('global.game.zem.info'))

</script>
<style scoped lang="scss">

</style>

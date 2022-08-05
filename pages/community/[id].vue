<template>
  <NuxtLayout name="community-header">
    <div>
     
      <dl class="three-area" v-if="isPending">
        <ClientOnly>
          <CommunityChannelListSk />
          <dd>
            <TimelineSk />
          </dd>
          <CommunityAboutSk />
        </ClientOnly>
      </dl>
    </div>
  </NuxtLayout>

</template>
<script setup lang="ts">
const isPending = ref(true)


</script>    


<style scoped lang="scss">
</style>
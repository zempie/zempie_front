<template>
  <div :key="$route.name">
    <Header />
    <slot />
    <Footer />
  </div>
</template>
<script setup lang="ts"></script>

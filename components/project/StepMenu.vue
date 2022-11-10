<template>
  <dt>
    <ul class="studio-upload-step">
      <li :class="[uploadProject.step === 1 && 'active', 'step']">
        <p>STEP 01</p>
        <h3>
        목적 선택
        </h3>
      </li>
      <li :class="[uploadProject.step === 2 &&  'active' , 'step']">
        <p>STEP 02</p>
        <h3>{{ $t('uploadGame.selectStage.text') }}</h3>

      </li>
      <li :class="[uploadProject.step === 3 &&  'active' , 'step']">
        <p>STEP 03</p>
        <h3>{{ $t('game.info') }}</h3>

      </li>
      <li :class="[uploadProject.step === 4 &&  'active' , 'step']">
        <p>STEP 04</p>
        <h3>{{ $t('file.upload') }}</h3>

      </li>
      <slot name="uploadGameBtn"></slot>
    </ul>
  </dt>
</template>
<script setup lang="ts">
import { eGameStage } from '~~/types'

const { uploadProject } = useProject()

</script>

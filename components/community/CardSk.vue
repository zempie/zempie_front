<template>
  <li>
    <div style="background-color: #ededed; height: 120px"></div>
    <p class="" style="background-color: #808080"></p>

    <div class="ct-info">
      <h3 class="gray-text bg-gray-1"></h3>
      <p class="gray-text bg-gray-1 skeleton-animation" style="min-height: 50px"></p>
      <dl>
        <dd>
          <h4 class="gray-text bg-gray-1 skeleton-animation"></h4>
          <p class="uppercase">members</p>
        </dd>
        <dt>
          <p></p>
        </dt>
        <dd>
          <h4 class="gray-text bg-gray-1 skeleton-animation"></h4>
          <p class="uppercase">posts</p>
        </dd>
        <dt>
          <p></p>
        </dt>
        <dd>
          <h4 class="gray-text bg-gray-1 skeleton-animation"></h4>
          <p class="uppercase">visit</p>
        </dd>
      </dl>
      <div>
        <button class="btn-default w100p bg-gray-1 skeleton-animation"></button>
      </div>
    </div>
  </li>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
li {
  list-style-type: none;
}

.gray-text {
  min-height: 16px;
  border-radius: 10px;
}
</style>

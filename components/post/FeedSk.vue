<template>
  <li class="tap-list bg-gray-1">
    <dl class="tapl-title" style="justify-content: flex-start">
      <dt>
        <dl>
          <dt>
            <UserAvatarSk style="width: 40px; height: 40px" />
          </dt>
        </dl>
      </dt>
      <dd>
        <h2 class="user-name gray-text skeleton-animation" style="width: 150px; margin-bottom: 10px"></h2>
        <p class="gray-text skeleton-animation" style="width: 80px"></p>
      </dd>
      <dd></dd>
    </dl>
    <div>
      <div class="tapl-content gray-text skeleton-animation" style="margin: 20px; padding: 20px"></div>
    </div>
    <ul class="tapl-option">
      <li style="min-height: 20px">
        <ul></ul>
      </li>
    </ul>
  </li>
</template>
<style scoped lang="scss">
@use 'sass:math';

.tapl-content {
  width: calc(100% - 40px);
}
</style>

<template>
  <li class="tap-list">
    <dl class="tapl-title">
      <dt>
        <dl>
          <dt>
            <UserAvatarSk style="width:40px; height:40px" />
          </dt>

          <dd>
            <h2 class="bg-grey-1 grey-text" style="width:300px"></h2>
            <p class="bg-grey-1 grey-text" style="width:100px"><i class="uis uis-clock" style="color:#c1c1c1;"></i> </p>
          </dd>
        </dl>
      </dt>
      <dd>
      </dd>
    </dl>

    <div>
      <div class="tapl-content"></div>
    </div>



    <ul class="tapl-option">
      <li>
        <ul>

          <li><i class="uil uil-comment-alt-dots comment-icon" style="font-size:22px;"></i>&nbsp;

          </li>

          <li><a><i class="uil uil-share-alt" style="font-size:20px;"></i></a></li>
        </ul>
      </li>
    </ul>

    <div>
      <ul>

        <li>
        </li>
      </ul>
    </div>




  </li>

</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
.grey-text {
  height: 16px;
  border-radius: 10px;
}

.tapl-content {
  overflow: hidden;
  min-height: 100px;
  max-height: 500px;
}
</style>
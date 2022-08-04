<template>
  <ClientOnly>
    <ul class="ta-post">
      <dd>
        <div class="ta-message-send">
          <p>
            <UserAvatarSk style="width:40px; height:40px" />
          </p>
          <div class="bg-grey-1" style="width:100%; height:30px; border-radius: 10px;"></div>
        </div>
        <ul class="ta-post">
          <FeedSk v-for="feed in 4" />
        </ul>
      </dd>
    </ul>
  </ClientOnly>
</template>

<script lang="ts">

</script>

<style scoped lang="scss">
.pw-reset {
  padding-bottom: 44px !important;
  padding-top: 44px !important;
}

.pw-reset .pr-content>p {
  display: flex !important;
  justify-content: space-between !important;
}

.btn-default {
  width: 48% !important;
  border-radius: 20px;
}

.quick-post {
  height: 100px;

  .quick-post-body {
    height: 100%;
    display: flex;
  }

  .form-row {
    height: 100%;
  }
}

.entry-post-container {
  border-radius: 10px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100%;
}

.user-avatar {
  display: flex;
}

textarea {
  height: 57px !important;
  width: 500px !important;
  padding: 14px 18px;
}


.block-alarm {
  background-color: red;
  border-radius: 5px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}


input[type="radio"]+label {
  display: inline-block;
  width: 22px;
  height: 22px;
  text-align: center;
  font-size: 15px;
  color: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  cursor: pointer;
}

input[type="radio"]:checked+label {
  color: #fff;
  background: #FF6E17;
  border-color: #FF6E17;
}

input[type="radio"] {
  display: none;
}
</style>

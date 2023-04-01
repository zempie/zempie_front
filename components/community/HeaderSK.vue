<template>
  <div class="visual-info-center">
    <dl>
      <dt>
        <ul>
          <li>
            <h2 class="numbers"> </h2>
            <h3>Member</h3>
          </li>
          <li>
            <h2 class="numbers"></h2>
            <h3>Posts</h3>
          </li>
          <li>
            <h2 class="numbers"> </h2>
            <h3>Visits</h3>
          </li>
        </ul>
      </dt>
      <dd>
        <div>
        </div>
        <h2>
          <em><i class="uil uil-lock-alt"></i></em>
          <p class="darker-text" style="width:50px;"></p>
        </h2>
        <h3 class="darker-text"> </h3>
      </dd>
      <dt>
        <button class="btn-default w120 mr10" />
      </dt>
    </dl>
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
.darker-text {
  min-height: 18px;
  background-color: #333;
  border-radius: 10px;
}


.numbers {
  min-height: 18px
}
</style>

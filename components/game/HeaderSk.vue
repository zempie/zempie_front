<template>
  <div class="visual-info-left">
    <dl>
      <dt>
        <dl>
          <dt>
            <div class="bg-gray-1"></div>

          </dt>
          <dd>
            <h2 style="min-height: 30px;" class="gray-text">
              <span></span>
            </h2>
            <!-- <h3>by@ </h3> -->
            <p style="min-height: 30px;"></p>
          </dd>
        </dl>
      </dt>
      <dd class="btn-container">
        <button class="btn-default w150" />
      </dd>
    </dl>
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
@media all and (max-width: 479px) {}

@media all and (min-width: 480px) and (max-width: 767px) {
  .visual-info-left>dl>dt {
    dd {
      width: 30%;
      margin-left: 100px;
    }

  }

  .btn-container {
    display: inline;
    margin-left: 100px;
  }
}

@media all and (min-width: 768px) and (max-width: 991px) {

  .btn-container {
    width: 50%;
  }
}
</style>

<template>
  <li>
    <div style="background-color: #ededed; height: 120px"></div>
    <p style="background-color: #808080"></p>
    <!--    <p @click="moveCommunity"
           :style="{'background' : 'url(' + profileImg + ') center center / cover no-repeat', 'background-size' : 'cover'}"></p> -->

    <div class="ct-info">
      <h3 class="title" style="height: 16px; background-color: #ededed">
        <!-- community title -->
      </h3>

      <p class="desc" style="height: 50px; background-color: #ededed">
        <!-- community.description -->
      </p>
      <dl>
        <dd>
          <h4 style="height: 16px; background-color: #ededed"></h4>
          <p class="uppercase">members</p>
        </dd>
        <dt><p></p></dt>
        <dd>
          <h4 style="height: 16px; background-color: #ededed"></h4>
          <p class="uppercase">posts</p>
        </dd>
        <dt><p></p></dt>
        <dd>
          <h4 style="height: 16px; background-color: #ededed"></h4>
          <p class="uppercase">visit</p>
        </dd>
        <!--
        <dd @click="moveMemberList()">
          <h4>{{ community.member_cnt }}</h4>
          <p>멤버수</p>
        </dd>
        <dt><p></p></dt>
        <dd>
          <h4>{{ community.posts_cnt }}</h4>
          <p>포스팅</p>
        </dd>
        <dt><p></p></dt>
        <dd>
          <h4>{{ visitCnt(community.visit_cnt) }}</h4>
          <p>방문</p>
        </dd>
        -->
      </dl>
      <div>
        <slot name="subBtn"></slot>
      </div>
    </div>
  </li>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
li {
  list-style-type: none;
}

.sub-btn {
  width: 100% !important;
}

.title {
  margin-top: 35px;
  font-weight: 500;
  font-size: 16px;
  line-height: 16px;
  color: #181819;
}

.desc {
  height: 40px;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>

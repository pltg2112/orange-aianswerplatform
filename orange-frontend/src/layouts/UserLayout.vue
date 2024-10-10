<script setup lang="ts">

</script>

<template>
  <div class="userLayout">
    <a-layout style="height: 100%">
      <a-layout-header class="header">
        <a-space>
          <img src="../assets/orange.svg" alt="小橙子">
          <h1 >小橙子 AI 应用答题平台</h1>
        </a-space>
      </a-layout-header>
      <a-layout-content class="content">
        <router-view></router-view>
      </a-layout-content>
      <a-layout-footer class="footer">
        <!--  _blank在新标签页打开链接  -->
        <a href="https://www.bilibili.com/" target="_blank">by 破浪踏歌</a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped>
.userLayout{
  height: 100vh;
}

.header{
  display: flex;
  justify-content: center;
}

.content{
  display: flex;
  justify-content: center;
  background: linear-gradient(to right, #fefefe, #fff);
  margin-bottom: 10px;
  padding: 0 20px;
}

.footer {
  padding: 16px;
  text-align: center;
}
</style>

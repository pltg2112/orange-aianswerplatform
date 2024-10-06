<script setup lang="ts">
import GlobalHeader from '@/components/GlobalHeader.vue'
</script>

<template>
  <div id="basicLayout">
    <a-layout style="height: 100%">
      <a-layout-header class="header">
        <global-header></global-header>
      </a-layout-header>
      <a-layout-content class="content">
        <router-view></router-view>
      </a-layout-content>
      <a-layout-footer class="footer">
        <!--  _blank在新标签页打开链接  -->
        <a href="https://www.w3school.com.cn/h.asp#google_vignette" target="_blank"
          >小橙子AI应用答题平台 by 破浪踏歌</a
        >
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped>
#basicLayout {
  height: 100vh;
}

.header{
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
}

.content {
  max-width: 1200px;
  background: linear-gradient(to right, #fefefe, #fff);
  margin: 0 auto;
  padding: 80px 30px 0 30px;
}

.footer {
  padding: 16px;
  text-align: center;
}
</style>

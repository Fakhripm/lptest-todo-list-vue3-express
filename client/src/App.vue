<script setup lang="ts"></script>

<template>
  <router-view />
</template>

<style>
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100%;
  /* 允许纵向滚动，禁止横向溢出 */
  overflow-y: auto;
  overflow-x: hidden;
  /* 预留滚动条位置，防止页面抖动 */
  scrollbar-gutter: stable;
  -webkit-tap-highlight-color: transparent;
}

#app {
  width: 100%;
  min-height: 100%;
}

/* 自定义轻量化滚动条 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.2);
}

::-webkit-scrollbar-track {
  background: transparent;
}
</style>

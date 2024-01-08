<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div :class="$style.page">
    <RouterView></RouterView>
  </div>
</template>

<style module lang="scss">
body,
html {
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.page {
  box-sizing: border-box;
  width: 100vw;
  height: 100vh;
  background-color: $bgc; /* 假设$bgc是你的背景颜色变量 */
}
</style>

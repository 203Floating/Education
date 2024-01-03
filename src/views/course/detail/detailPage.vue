<template>
  <div :class="$style.container">
    <div :class="$style.header">
      <router-link to="/course/DetailSelect/DetailContent" :class="{ [$style.active]: $route.path != '/course/DetailSelect/DetailData' }">选课内容</router-link>

      <router-link to="/course/DetailSelect/DetailData" :class="{ [$style.active]: $route.path === '/course/DetailSelect/DetailData' }">选课设置</router-link>
    </div>
    <div :class="$style.content">
      <RouterView></RouterView>
    </div>
  </div>
</template>
<script setup>
import { RouterView } from 'vue-router'
</script>
<style lang="scss" module>
.container {
  @include bg_style_edit;
  .header {
    display: flex;
    width: 100%;
    line-height: 30px;
    a {
      box-sizing:border-box;
      text-decoration: none;
      margin-left: 20px;
      color: #000;
      &.active {
        // 在链接激活时的样式
        // 例如：font-weight: bold;
        color:$primary;
        border-bottom:2px solid $primary;
      }
    }
  }
}
</style>

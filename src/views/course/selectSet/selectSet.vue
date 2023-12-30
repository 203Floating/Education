<template>
  <div :class="$style.container">
    <div :class="$style.nav">
      <el-menu active-text-color="#3952fd" default-active="1" :class="$style.menu" router="true">
        <el-menu-item index="1" route="/course/select/set/number">
          <span>选择课程</span>
        </el-menu-item>
        <el-sub-menu index="2">
          <template #title>
            <span>选课设置</span>
          </template>
          <el-menu-item index="2-1" route="/course/select/set/mutual">互斥设置</el-menu-item>
          <el-menu-item index="2-2" route="/course/select/set/connect">连选设置</el-menu-item>
          <el-menu-item index="2-3" route="/course/select/set/forbid">禁选组合</el-menu-item>
          <el-menu-item index="2-4" route="/course/select/set/mutual">选课权限</el-menu-item>
          <el-menu-item index="2-5" route="/course/select/set/mutual">限选人数</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </div>
    <div :class="$style.main">
      <RouterView />
    </div>
  </div>
</template>
<script setup>
import  { RouterView } from 'vue-router'
</script>
<style module lang="scss">
$nav_height: 160px;
.container {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  display: flex;
  .nav {
    width: $nav_height;
    height: 100%;
    border-right: 2px solid #ddd;
    .menu {
      font-weight: 700;
      font-size: 18px;
    }
  }
  .main {
    width: calc(100% - #{$nav_height});
    height: 100%;
    padding: 10px;
  }
}
</style>

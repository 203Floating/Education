<template>
  <el-row class="tac">
    <el-col :span="24">
      <el-menu
        active-text-color="#F57D2D"
        background-color="#282E38"
        class="el-menu-vertical-demo"
        router="true"
        default-active="1-2"
        text-color="#fff"
        @open="handleOpen"
        @close="handleClose"
        :style="{ height: '98vh', borderRadius: '10px' }"
      >
        <div :class="$style.header">小学教务系统</div>
        <el-menu-item index="0" route="/basic/index">
          <el-icon><icon-menu /></el-icon>
          <span>首页</span>
        </el-menu-item>
        <el-sub-menu index="1">
          <template #title>
            <el-icon><Memo /></el-icon>
            <span>教务管理</span>
          </template>
          <el-menu-item index="1-1" route="/basic/school">基础信息维护</el-menu-item>
          <el-menu-item index="1-2" route="/basic/teacher">教师管理</el-menu-item>
          <el-menu-item index="1-3" route="/basic/student">学生管理</el-menu-item>
          <el-menu-item index="1-4" route="/basic/class">班级管理</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-col>
  </el-row>
</template>
<script setup>
import { Menu as IconMenu, Memo } from '@element-plus/icons-vue'
const handleOpen = (key, keyPath) => {
  console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
  console.log(key, keyPath)
}
</script>
<style module lang="scss">
.header {
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
}
</style>

<template>
  <el-row class="tac">
    <el-col :span="24">
      <el-menu
        active-text-color="#F57D2D"
        background-color="#282E38"
        class="el-menu-vertical-demo"
        router="true"
        default-active="2-2"
        text-color="#fff"
        @open="handleOpen"
        @close="handleClose"
        :style="{ height: '98vh', borderRadius: '10px' }"
      >
        <div :class="$style.header">小学教务系统</div>
        <el-menu-item index="0" route="/basic/index" >
          <el-icon :class="$style.nav"><icon-menu /></el-icon>
          <span>首页</span>
        </el-menu-item>
        <el-sub-menu index="1" :class="$style.nav">
          <template #title >
            <el-icon :class="$style.nav"><Memo /></el-icon>
            <span >教务管理</span>
          </template>
          <el-menu-item index="1-1" route="/basic/school" :class="$style.nav">基础信息维护</el-menu-item>
          <el-menu-item index="1-2" route="/basic/teacher" :class="$style.nav">教师管理</el-menu-item>
          <el-menu-item index="1-3" route="/basic/student" :class="$style.nav">学生管理</el-menu-item>
          <el-menu-item index="1-4" route="/basic/class"    :class="$style.nav">班级管理</el-menu-item>
          <el-menu-item index="1-5" route="/basic/grade"  :class="$style.nav">年级管理</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="2"  >
          <template #title>
            <el-icon :class="$style.nav"><Reading /></el-icon>
            <span>课程</span>
          </template>
          <el-menu-item index="2-1" route="/course/interest" :class="$style.nav">兴趣课程</el-menu-item>
          <el-menu-item index="2-2" route="/course"  :class="$style.nav">兴趣选课</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-col>
  </el-row>
</template>
<script setup>
import { Menu as IconMenu, Memo,Reading  } from '@element-plus/icons-vue'
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
.nav{
  margin-left: 15px;
}
</style>

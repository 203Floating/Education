<template>
  <el-row class="tac">
    <el-col :span="24">
      <el-menu
        active-text-color="#F57D2D"
        background-color="#282E38"
        class="el-menu-vertical-demo"
        router="true"
        default-active="3-1"
        text-color="#fff"
        @open="handleOpen"
        @close="handleClose"
        :style="{ height: '98vh', borderRadius: '10px' }"
      >
        <div :class="$style.header">小学教务系统</div>
        <el-menu-item index="0" route="/basic/index" v-if="level == '2'">
          <el-icon :class="$style.nav"><icon-menu /></el-icon>
          <span>首页</span>
        </el-menu-item>
        <el-sub-menu index="1" :class="$style.nav" v-if="level == '2'">
          <template #title>
            <el-icon :class="$style.nav"><Memo /></el-icon>
            <span>教务管理</span>
          </template>
          <el-menu-item index="1-1" route="/basic/school" :class="$style.nav"
            >基础信息维护</el-menu-item
          >
          <el-menu-item index="1-2" route="/basic/teacher" :class="$style.nav"
            >教师管理</el-menu-item
          >
          <el-menu-item index="1-3" route="/basic/student" :class="$style.nav"
            >学生管理</el-menu-item
          >
          <el-menu-item index="1-4" route="/basic/class" :class="$style.nav">班级管理</el-menu-item>
          <el-menu-item index="1-5" route="/basic/grade" :class="$style.nav">年级管理</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="2" v-if="level == '2'">
          <template #title>
            <el-icon :class="$style.nav"><Reading /></el-icon>
            <span>课程</span>
          </template>
          <el-menu-item index="2-1" route="/course/interest" :class="$style.nav"
            >兴趣课程</el-menu-item
          >
          <el-menu-item index="2-2" route="/course/page" :class="$style.nav">兴趣选课</el-menu-item>
          <el-menu-item index="2-3" route="/course/DetailSelect" :class="$style.nav"
            >兴趣选课</el-menu-item
          >
        </el-sub-menu>
        <el-sub-menu index="3" v-if="level == '1'">
          <template #title>
            <el-icon :class="$style.nav"><Reading /></el-icon>
            <span>教师管理</span>
          </template>
          <el-menu-item index="3-1" route="/teacherManage" :class="$style.nav"
            >班级管理</el-menu-item
          >
          <el-menu-item index="3-2" route="/course" :class="$style.nav">兴趣选课</el-menu-item>
        </el-sub-menu>
        <el-menu-item index="4" route="/studentEdit" v-if="level == '0'">
          <el-icon :class="$style.nav"><icon-menu /></el-icon>
          <span>个人信息编辑</span>
        </el-menu-item>
        <!-- 学生用户界面 -->
        <el-menu-item index="5" route="/selectCourse" v-if="level == '0'">
          <el-icon :class="$style.nav"><icon-menu /></el-icon>
          <span>兴趣课程选择</span>
        </el-menu-item>
        <el-menu-item index="6" route="/timeTable" v-if="level == '0'">
          <el-icon :class="$style.nav"><icon-menu /></el-icon>
          <span>课程表</span>
        </el-menu-item>
      </el-menu>
    </el-col>
  </el-row>
</template>
<script setup>
import { Menu as IconMenu, Memo, Reading } from '@element-plus/icons-vue'
import { useAuthorization } from '@/stores/Authorization'
const { getAuthority } = useAuthorization()
const { level } = getAuthority()

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
.nav {
  margin-left: 15px;
}
</style>

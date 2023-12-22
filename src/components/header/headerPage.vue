<template>
  <div :class="$style.container">
    <div :class="$style.content">
      <el-icon size="30px"><Fold /></el-icon>
      <div :class="$style.title">学生管理系统</div>
      <div :class="$style.user">
        <el-avatar
          :size="32"
          class="mr-3"
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        />
        <p>Title</p>
      </div>
    </div>
    <div :class="$style.header">
      <BreadcrumbNav :breadcrumb="router.currentRoute"></BreadcrumbNav>
    </div>
  </div>
</template>
<script setup>
import { Fold } from '@element-plus/icons-vue'
import BreadcrumbNav from '../Breadcrumb/BreadcrumbNav.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>
<style lang="scss" module>
.container {
  .header {
    height: 40px;
    line-height: 40px;
    background-color: #f0f2f7;
  }
  .content {
    position: relative;
    display: flex;
    align-items: center;
    height: 70px;
    line-height: 70px;
    .title {
      margin-left: 20px;
    }
    .user {
      display: flex;
      align-items: center;
      position: absolute;
      right: 50px;
      p {
        margin-left: 10px;
      }
      el-avatar {
        transform: translateY(-5px);
      }
    }
  }
}
</style>

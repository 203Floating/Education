<template>
  <div :class="$style.container">
    <div :class="$style.nav">
      <el-menu active-text-color="#3952fd" default-active="1" :class="$style.menu" router="true">
        <el-menu-item index="1" :route="`/course/select/set/${id}/number/${id}`">
          <span>选择课程</span>
        </el-menu-item>
        <el-sub-menu index="2">
          <template #title>
            <span>选课设置</span>
          </template>
          <el-menu-item index="2-1" :route="`/course/select/set/${id}/mutual/${id}`"
            >互斥设置</el-menu-item
          >
          <el-menu-item index="2-2" :route="`/course/select/set/${id}/connect/${id}`"
            >连选设置</el-menu-item
          >
          <el-menu-item index="2-3" :route="`/course/select/set/${id}/forbid/${id}`"
            >禁选组合</el-menu-item
          >
          <!-- <el-menu-item index="2-4" :route="`/course/select/set/${id}/mutual/${id}`"
            >选课权限</el-menu-item
          >
          <el-menu-item index="2-5" :route="`/course/select/set/${id}/mutual/${id}`"
            >限选人数</el-menu-item
          > -->
        </el-sub-menu>
      </el-menu>
    </div>
    <div :class="$style.main">
      <RouterView />
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
//保存当前任务的id
const id = ref()
//保存当前页面的路由的最后路径
const path = ref()
onMounted(() => {
  router.push({
    name: 'number',
    params: {
      id: route.params.id
    }
  })
  id.value = route.params.id
  console.log(id.value, route)
})
watch(
  () => route,
  () => {
    let arr = route.path.split('/')
    path.value = arr[arr.length - 1]
  },
  {
    deep: true
  }
)
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

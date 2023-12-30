<template>
  <div :class="$style.container">
    <div :class="$style.header">
      <div :class="$style.step">
        <div :class="$style.icon" :style="{ borderColor: step.color1, color: step.color1 }">1</div>
        <div :class="$style.title" @click="toStep1">
          <el-button :link="true" class="$style.title-button" :style="{ color: step.color1 }"
            >基本信息</el-button
          >
        </div>
      </div>
      <div :class="$style.step">
        <div :class="$style.icon" :style="{ borderColor: step.color2, color: step.color2 }">2</div>
        <div :class="$style.title" @click="toStep2">
          <el-button :link="true" class="$style.title-button" :style="{ color: step.color2 }"
            >选课学生</el-button
          >
        </div>
      </div>
      <div :class="$style.step">
        <div :class="$style.icon" :style="{ borderColor: step.color3, color: step.color3 }">3</div>
        <div :class="$style.title">
          <el-button :link="true" class="$style.title-button" :style="{ color: step.color3 }"
            >选课设置</el-button
          >
        </div>
      </div>
    </div>
    <div :class="$style.content">
      <keep-alive>
        <RouterView />
      </keep-alive>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
console.log(route.path, 'route')
const step = ref({})
//保存当前页面的路由
const path = ref()
//监听路由改变
watch(
  () => route,
  () => {
    let arr = route.path.split('/')
    path.value = arr[arr.length - 1]
    changeColor()
  },
  {
    deep: true
  }
)

onMounted(() => {
  let arr = route.path.split('/')
  path.value = arr[arr.length - 1]
  changeColor()
})
//第一步
const toStep1 = () => {
  router.push({
    name: 'selectAdd',
  })
}
//第二步
const toStep2 = () => {
  if (path.value === 'set') {
    router.push({
      name: 'selectStudent'
    })
  }
}
//动态改变颜色
const changeColor = () => {
  if (path.value == 'add') {
    step.value = {
      color1: '#3952fd',
      color2: '#000000',
      color3: '#000000'
    }
  }
  else if (path.value == 'student') {
    step.value = {
      color1: '#428675',
      color2: '#3952fd',
      color3: '#000000'
    }
  }
  else {
    step.value = {
      color1: '#428675',
      color2: '#428675',
      color3: '#3952fd'
    }
  }
}
</script>

<style module lang="scss">
.container {
  $nav_height: 50px;
  @include bg_style_edit;
  .header {
    display: flex;
    width: 100%;
    height: $nav_height;
    background-color: $bgc;
    border-radius: 5px;
    .step {
      box-sizing: border-box;
      height: $nav_height;
      width: 20%;
      text-align: center;
      .icon {
        $width: 20px;
        display: inline-block;
        width: $width;
        height: $width;
        margin-top: ($nav_height - $width) / 2; // 去掉空格
        border-radius: 50%;
        border: 1px solid $nav_bgc;
        text-align: center;
        line-height: $width;
        font-size: 12px;
      }
      .title {
        display: inline-block;
        line-height: $nav_height;
        margin-left: 15px;
      }
    }
  }
  .content {
    margin: 20px;
    height: calc(100% - #{$nav_height});
  }
}
</style>

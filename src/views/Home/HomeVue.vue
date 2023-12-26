<script setup>
import asidePage from '@/components/Aside/asidePage.vue'
import headerPage from '@/components/header/headerPage.vue'
import mainPage from '@/components/main/mainPage.vue'
</script>

<template>
  <div>
    <div class="common-layout">
      <el-container>
        <el-aside width="220px" :class="$style.asid">
          <asidePage></asidePage>
        </el-aside>
        <el-container :class="$style.container">
          <el-header height="70px" :class="$style.header">
            <headerPage></headerPage>
          </el-header>
          <el-main :class="$style.main">
            <mainPage></mainPage>
          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>
<style module lang="scss">
.asid {
  position: fixed;
  left: 5px;
  top: 5px;
}
.container {
  margin-left: 220px;
  .header {

    width: 100%;
    height: 70px;;
    background-color: #fff;
  }

  .main {
    background-color: #f0f2f7;
  }
}
</style>

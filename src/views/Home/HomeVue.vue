<script setup>
import asidePage from '@/components/Aside/asidePage.vue'
import headerPage from '@/components/header/headerPage.vue'
import mainPage from '@/components/main/mainPage.vue'
</script>

<template>
  <div>
    <div class="common-layout">
      <el-container>
        <el-aside width="220px">
          <asidePage></asidePage>
        </el-aside>
        <el-container>
          <el-header height="110px">
            <headerPage></headerPage>
          </el-header>
          <el-main style="background-color: #f0f2f7">
            <mainPage></mainPage>
          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

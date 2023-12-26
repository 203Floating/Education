<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div :class="$style.page">
    <RouterView></RouterView>
  </div>
</template>

<style module lang="scss">
.page{
  width: 98vw;
  height: 98vh;
  background-color: $bgc;
  // background-color: red;
}
</style>
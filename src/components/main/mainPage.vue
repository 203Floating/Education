<template>
  <div :class="$style.container">
    <RouterView></RouterView>
  </div>
</template>
<script setup>
import { RouterView } from 'vue-router'
</script>
<style module lang="scss">
// .container {
//   width: 100%;
//   // height: 100%;
//   // height: 75%;
//   // // background-color: #fff;
//   // border-radius: 10px;
// }
</style>

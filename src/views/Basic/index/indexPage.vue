<template>
  <div>{{ header }}</div>
</template>
<script setup>



const header = sessionStorage.getItem('baseHeaders')
</script>
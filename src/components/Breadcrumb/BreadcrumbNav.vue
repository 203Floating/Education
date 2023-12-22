<template>
  <div>{{ breadcrumb.value.meta.breadcrumb }}</div>
</template>
<script setup>
import { defineProps } from 'vue'
const { breadcrumb } = defineProps({
  breadcrumb: {
    type: Object
  }
})
console.log(breadcrumb.value.meta.breadcrumb)
</script>

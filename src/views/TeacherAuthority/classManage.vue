<template>
  <div>
    11
  </div>
</template>
<script setup>
import { ref,onMounted} from 'vue'
import { useCommondata } from '@/stores/common'
const { fetchClass } = useCommondata()
const classes = ref()
onMounted(async() => {
  classes.value = await fetchClass()
  console.log(classes.value);
})

</script>
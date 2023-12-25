<template>
  <div>
    <el-select :class="$style.ipt1" placeholder="年级" v-model="stue.g_id" v-if="!stue.size">
      <el-option v-for="item in grades" :key="item.g_id" :label="item.g_name" :value="item.g_id" />
    </el-select>
    <el-select :class="$style.ipt2" placeholder="年级" v-model="stue.g_id" v-else>
      <el-option v-for="item in grades" :key="item.g_id" :label="item.g_name" :value="item.g_id" />
    </el-select>
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps, onMounted, watch } from 'vue'
import { useCommondata } from '@/stores/common'
const { fetchGrades } = useCommondata()
const { stue } = defineProps({
  stue: {
    type: Object
  }
})
const grades = ref()

const emit = defineEmits()

watch(
  () => stue, // 使用 stu_exra，使用 deep 选项监视对象变化
  (newValue) => {
    emit('update:stue', {...newValue});
  },
  { deep: true } // 添加 deep 选项
);

onMounted(async () => {
  grades.value = await fetchGrades()
});
</script>

<style lang="scss" module>
.ipt1 {
  @include ipt1;
}
.ipt2 {
  @include ipt2;
}
</style>

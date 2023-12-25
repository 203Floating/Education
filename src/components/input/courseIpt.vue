<template>
  <div>
    <el-select :class="$style.ipt1" placeholder="科目" v-model="subject.id" v-if="subject.size">
      <el-option
        v-for="item in courses.data2"
        :key="item.ac_id"
        :label="item.ac_name"
        :value="item.ac_id"
      ></el-option>
      <el-option
        v-for="item in courses.data1"
        :key="item.mc_id"
        :label="item.mc_name"
        :value="item.mc_id"
      ></el-option>
    </el-select>
    <el-select :class="$style.ipt2" placeholder="科目" v-model="subject.id" v-else>
      <el-option
        v-for="item in courses.data2"
        :key="item.ac_id"
        :label="item.ac_name"
        :value="item.ac_id"
      ></el-option>
      <el-option
        v-for="item in courses.data1"
        :key="item.mc_id"
        :label="item.mc_name"
        :value="item.mc_id"
      ></el-option>
    </el-select>
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps, onMounted, watch } from 'vue'



import { useCommondata } from '@/stores/common'
const { fetchCourses } = useCommondata()
const { subject } = defineProps({
  subject: {
    type: String
  }
})
const courses = ref({data1:'',data2:''})

const emit = defineEmits()

watch(
  () => subject, // 使用 stu_exra，使用 deep 选项监视对象变化
  (newValue) => {
    emit('update:subject', { ...newValue })
  },
  { deep: true } // 添加 deep 选项
)

onMounted(async () => {
  const res = await fetchCourses()
  courses.value.data1 = res.data1
  courses.value.data2 = res.data2
})
</script>

<style lang="scss" module>
.ipt1 {
  @include ipt1;
}
.ipt2 {
  @include ipt2;
}
</style>

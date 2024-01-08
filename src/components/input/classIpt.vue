<template>
  <div>
    <el-select :class="$style.ipt1" placeholder="班级" v-model="stue.c_id" v-if="!stue.size">
      <el-option v-for="item in classes" :key="item.c_id" :label="item.c_name" :value="item.c_id" />
    </el-select>
    <el-select :class="$style.ipt2" placeholder="班级" v-model="stue.c_id" v-else>
      <el-option v-for="item in classes" :key="item.c_id" :label="item.c_name" :value="item.c_id" />
    </el-select>
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps, watch, inject } from 'vue'

const usePostData = inject('$usePostData')

const { stue } = defineProps({
  stue: {
    type: Object
  }
})
const classes = ref()

const emit = defineEmits()

watch(
  () => stue,
  async (newValue) => {
    emit('update:stue', { ...newValue })
    try {
      const res = await usePostData('http://localhost:3000/class', {
        g_id: stue.g_id
      })
      if (stue.g_id != '') {
        classes.value = res.data.data
      } else {
        classes.value = []
      }
    } catch (error) {
      console.log(error)
    }
  },
  { deep: true, immediate: true } // 添加 deep 选项
)
</script>

<style lang="scss" module>
.ipt1 {
  @include ipt1;
}
.ipt2 {
  @include ipt2;
}
</style>

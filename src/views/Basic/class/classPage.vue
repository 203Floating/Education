<template>
  <div :class="$style.container">
    <div :class="$style.tools">
      <el-row :class="$style.row">
        <el-col :span="5"
          >班级:&nbsp;&nbsp;<el-select
            v-model="searchipt.c_id"
            placeholder="班级"
            :class="$style.ipt"
          >
            <el-option
              v-for="item in classes"
              :label="item.c_name"
              :value="item.c_id"
              :key="item.c_id"
            /> </el-select
        ></el-col>
        <el-col :span="5"
          >年级:&nbsp;&nbsp;<el-select
            v-model="searchipt.g_id"
            placeholder="年级"
            :class="$style.ipt"
          >
            <el-option
              v-for="item in grades"
              :label="item.g_name"
              :value="item.g_id"
              :key="item.g_id"
            /> </el-select
        ></el-col>
      </el-row>
      <hr />
      <div :class="$style.btn">
        <button :class="$style.btn1" @click="toSearch">查询</button>
        <button :class="$style.btn2" @click="toReset">重置</button>
      </div>
    </div>
    <div :class="$style.main">
      <el-table :data="classes" border :class="$style.table">
        <el-table-column prop="c_name" label="班级名称" />
        <el-table-column prop="g_name" label="年级" />
        <el-table-column prop="c_headmaster" label="班主任" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button link>编辑</el-button>
            <el-button link @click="toDelete(scope.row.c_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { useCommondata } from '@/stores/common'
const { fetchGrades } = useCommondata()
//注入全局函数
const useDeleteData = inject('$useDeleteData')
const usePostData = inject('$usePostData')
const success = inject('$success')
const err = inject('$err')
const warning = inject('$warning')
// 使用 ref 包装成响应式对象
const grades = ref([])
const classes = ref([])
const searchipt = ref({})
//初始化
onMounted(async () => {
  grades.value = await fetchGrades()
  await render()
})
//渲染
const render = async (params = {}) => {
  try {
    const res = await usePostData('http://localhost:3000/class', params)
    classes.value = res.data.data.map((item) => {
      return {
        ...item,
        g_name: grades.value.find((grade) => grade.g_id === item.g_id)?.g_name || 'Unknown'
      }
    })
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}
//查询
const toSearch = () => {
  if (searchipt.value == '') {
    render()
    alert('1')
  }
  const obj = {
    c_id: searchipt.value.c_id,
    g_id: searchipt.value.g_id
  }
  render(obj)
}
//重置
const toReset = () => {
  searchipt.value = {
    g_id: '',
    c_id: ''
  }
  render()
}
//删除
const toDelete = async (id) => {
  try {
    const res = await useDeleteData('http://localhost:3000/class/delete', { c_id: id })
    console.log(res.data.status)
    if (res.data.status === false) {
      warning('班里还有学生')
    } else {
      render()
      success('删除成功')
    }
  } catch (error) {
    console.log(error)
    err('删除失败')
  }
}
</script>

<style module lang="scss">
.container {
  @include table;
}
</style>

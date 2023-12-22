<template>
  <div :class="$style.container">
    <div :class="$style.tools">
      <el-row :class="$style.row">
        <el-col :span="5"
          >姓名:&nbsp;&nbsp;<el-input type="text" :class="$style.ipt" v-model="searchipt.stu_name"
        /></el-col>
        <el-col :span="5"
          >学号:&nbsp;&nbsp;<el-input type="text" :class="$style.ipt" v-model="searchipt.stu_id"
        /></el-col>
        <el-col :span="5"
          >班级:&nbsp;&nbsp;
          <el-select v-model="searchipt.c_id" placeholder="班级" :class="$style.ipt">
            <el-option
              v-for="item in classes"
              :label="item.c_name"
              :value="item.c_id"
              :key="item.c_id"
            />
          </el-select>
        </el-col>
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
      <el-table :data="students" border :class="$style.table">
        <el-table-column prop="stu_name" label="姓名" />
        <el-table-column prop="stu_id" label="学号" />
        <el-table-column prop="stu_sex" label="性别" />
        <el-table-column prop="stu_IDtype" label="证件类型" />
        <el-table-column prop="stu_IDnumber" label="证件号码" width="200" />
        <el-table-column prop="c_name" label="班级" />
        <el-table-column prop="g_name" label="年级" />
        <el-table-column prop="stu_bornDate" label="出生日期" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button link>编辑</el-button>
            <el-button link @click="toDelete(scope.row.stu_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, inject } from 'vue'
import { useCommondata } from '@/stores/common'
const { fetchGrades, fetchClass } = useCommondata()
//注入工具函数
const success = inject('$success')
const err = inject('$err')
const usePostData = inject('$usePostData')
const useDeleteData = inject('$useDeleteData')

const grades = ref()
const classes = ref()
const students = ref()
const searchipt = ref({})
// 初始化
onMounted(async () => {
  grades.value = await fetchGrades()
  classes.value = await fetchClass()
  await render()
})
//渲染
const render = async (params = {}) => {
  await usePostData('http://localhost:3000/student', params)
    .then((res) => {
      students.value = res.data.data.map((item) => {
        return {
          ...item,
          stu_bornDate: item.stu_bornDate.split('T')[0],
          stu_sex: item.stu_sex === '0' ? '男' : '女',
          g_name: grades.value.find((grade) => grade.g_id === item.g_id)?.g_name || 'Unknown',
          c_name: classes.value.find((c) => c.c_id === item.c_id)?.c_name || 'Unknown'
        }
      })
    })
    .catch((err) => {
      console.log(err)
    })
}
//查询
const toSearch = () => {
  if (searchipt.value == '') {
    render()
  }
  const obj = {
    ...searchipt.value
  }
  render(obj)
}
//重置
const toReset = () => {
  searchipt.value = {
    c_id: '',
    g_id: '',
    stu_name: '',
    stu_id: ''
  }
  render()
}
//删除
const toDelete = async (id) => {
  try {
    await useDeleteData('http://localhost:3000/student/delete', { stu_id: id })
    render()
    success('删除成功')
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

<template>
  <div :class="$style.container">
    <div :class="$style.tools">
      <el-row :class="$style.row">
        <el-col :span="2" :class="$style.title">姓名：</el-col>
        <el-col :span="4"
          ><el-input type="text" :class="$style.ipt" v-model="searchipt.stu_name"
        /></el-col>

        <el-col :span="2" :class="$style.title">学号：</el-col>
        <el-col :span="4"
          ><el-input type="text" :class="$style.ipt" v-model="searchipt.stu_id"
        /></el-col>

        <el-col :span="2" :class="$style.title">年级：</el-col>
        <el-col :span="4"> <gradesIpt :stue="stue" /></el-col>

        <el-col :span="2" :class="$style.title">班级：</el-col>
        <el-col :span="4">
          <classIpt :stue="stue" />
        </el-col>
      </el-row>
      <hr />
      <div :class="$style.btn">
        <button :class="$style.btn1" @click="toSearch">查询</button>
        <button :class="$style.btn2" @click="toReset">重置</button>
      </div>
    </div>
    <div :class="$style.main">
      <div :class="$style.header">
        <el-button link @click="toAdd"
          ><el-icon size="15"><FolderAdd /></el-icon>
        </el-button>
      </div>
      <el-table
        :data="students"
        border
        :class="$style.table"
        :cell-style="{ textAlign: 'center', 'line-height': '40px', 'font-weight': '500' }"
        :header-cell-style="{
          'text-align': 'center',
          height: '50px',
          color: '#282e38'
        }"
      >
        <el-table-column prop="stu_name" label="姓名" />
        <el-table-column prop="stu_id" label="学号" />
        <el-table-column prop="stu_sex" label="性别" />
        <el-table-column prop="stu_IDtype" label="证件类型" />
        <el-table-column prop="stu_IDnumber" label="证件号码" width="200" />
        <el-table-column prop="c_name" label="班级" />
        <el-table-column prop="g_name" label="年级" />
        <!-- <el-table-column prop="stu_bornDate" label="出生日期" /> -->
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button link @click="toEdit(scope.row.stu_id)">编辑</el-button>
            <el-button link @click="toDelete(scope.row.stu_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :page-size="10"
        :pager-count="5"
        layout="prev, pager, next"
        :total="page.total"
        :current-page="page.current"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, inject } from 'vue'
import { useCommondata } from '@/stores/common'
import { useRouter } from 'vue-router'
import { FolderAdd } from '@element-plus/icons-vue'
import gradesIpt from '@/components/input/gradeIpt.vue'
import classIpt from '@/components/input/classIpt.vue'
const router = useRouter()

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

const stue = ref({
  g_id: '',
  c_id: '',
  size: true
})
const page = ref({})
// 初始化
onMounted(async () => {
  grades.value = await fetchGrades()
  classes.value = await fetchClass()
  await render()
})
//渲染
const render = async (params = {}) => {
  try {
    const res = await usePostData('http://localhost:3000/student', params)
    students.value = res.data.map((item) => {
      return {
        ...item,
        // stu_bornDate: item.stu_bornDate.split('T')[0],
        stu_sex: item.stu_sex === '0' ? '男' : '女',
        g_name: grades.value.find((grade) => grade.g_id === item.g_id)?.g_name || 'Unknown',
        c_name: classes.value.find((c) => c.c_id === item.c_id)?.c_name || 'Unknown'
      }
    })
    if (res.data.length != 0) {
      page.value.total = res.data[0].total
    } else {
      page.value.total = 0
    }
  } catch (error) {
    console.log(error)
  }
}
//分页切换
const handleCurrentChange = (num) => {
  page.value.current = num
  const obj = {
    offset: num - 1
  }
  render(obj)
}
//查询
const toSearch = () => {
  if (searchipt.value == '' && stue.value.g_id == '') {
    render()
  }
  const obj = {
    c_id: stue.value.c_id,
    g_id: stue.value.g_id,
    ...searchipt.value
  }
  render(obj)
  success('查询成功')
}
//重置
const toReset = () => {
  searchipt.value = {
    stu_name: '',
    stu_id: ''
  }
  stue.value.c_id = ''
  stue.value.g_id = ''
  stue.value.size = true

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
//编辑
const toEdit = (id) => {
  router.push({
    name: 'StudentEdit',
    params: {
      id
    }
  })
}
//添加
const toAdd = () => {
  router.push({
    name: 'StudentEdit',
    params: {
      id: -1
    }
  })
}
</script>
<style module lang="scss">
.container {
  @include table;
}
</style>

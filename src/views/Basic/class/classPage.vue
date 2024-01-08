<template>
  <div :class="$style.container">
    <div :class="$style.tools">
      <el-row :class="$style.row">
        <el-col :span="2" :class="$style.title">年级：</el-col>
        <el-col :span="5"> <gradesIpt :stue="stue" /></el-col>

        <el-col :span="2" :class="$style.title">班级：</el-col>
        <el-col :span="5">
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
        :data="classes"
        border
        :class="$style.table"
        :cell-style="{ textAlign: 'center', 'line-height': '40px', 'font-weight': '500' }"
        :header-cell-style="{
          'text-align': 'center',
          height: '50px',
          color: '#282e38'
        }"
      >
        <el-table-column prop="c_name" label="班级名称" alig />
        <el-table-column prop="g_name" label="年级" />
        <el-table-column prop="c_headmaster_name" label="班主任" />
        <el-table-column prop="c_type_name" label="班级类型" />

        <el-table-column label="操作">
          <template #default="scope">
            <el-button link @click="toEdit(scope.row.c_id)">编辑</el-button>
            <el-button link @click="toDelete(scope.row.c_id)">删除</el-button>
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
import { useRouter } from 'vue-router'
import { useCommondata } from '@/stores/common'
import { FolderAdd } from '@element-plus/icons-vue'
import gradesIpt from '@/components/input/gradeIpt.vue'
import classIpt from '@/components/input/classIpt.vue'
const { fetchGrades } = useCommondata()
//注入全局函数
const useDeleteData = inject('$useDeleteData')
const usePostData = inject('$usePostData')
const success = inject('$success')
const err = inject('$err')
const warning = inject('$warning')
const router = useRouter()
// 使用 ref 包装成响应式对象
const grades = ref([])
const classes = ref([])
const teachers = ref([])
const stue = ref({
  g_id: '',
  c_id: '',
  size: true
})
const page = ref({})
//初始化
onMounted(async () => {
  const res = await usePostData('http://localhost:3000/teacher')
  teachers.value = res.data
  grades.value = await fetchGrades()
  await render()
})
//渲染
const render = async (params = {}) => {
  try {
    const res = await usePostData('http://localhost:3000/class', params)
    classes.value = res.data.data.map((item) => {
      return {
        c_id: item.c_id,
        c_name: item.c_name,
        g_name: grades.value.find((grade) => grade.g_id === item.g_id)?.g_name || 'Unknown',
        c_headmaster_name:
          teachers.value.find((teacher) => teacher.t_id === item.c_headmaster)?.t_name || 'Unknown',
        c_type_name: item.c_type === '0' ? '普通班' : item.c_type === '1' ? '重点班' : '火箭班'
      }
    })
    if (res.data.data.length != 0) {
      page.value.total = res.data.data[0].total
    }
  } catch (error) {
    console.error('Error fetching data:', error)
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
  if (stue.value == '') {
    render()
  }
  const obj = {
    c_id: stue.value.c_id,
    g_id: stue.value.g_id
  }
  render(obj)
  success('查询成功')
}
//重置
const toReset = () => {
  stue.value.c_id = ''
  stue.value.g_id = ''
  stue.value.size = true
  render()
}
//删除
const toDelete = async (id) => {
  try {
    const res = await useDeleteData('http://localhost:3000/class/delete', { c_id: id })
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
const toEdit = (id) => {
  router.push({
    name: 'ClassEdit',
    params: {
      id: id
    }
  })
}
//添加
const toAdd = () => {
  router.push({
    name: 'ClassEdit',
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

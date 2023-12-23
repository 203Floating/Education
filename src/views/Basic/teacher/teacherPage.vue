<template>
  <div :class="$style.container">
    <div :class="$style.tools">
      <el-row :class="$style.row">
        <el-col :span="4"
          >姓名:&nbsp;&nbsp;<el-input type="text" :class="$style.ipt" v-model="searchipt.t_name"
        /></el-col>
        <el-col :span="5"
          >证件号码:&nbsp;&nbsp;<el-input
            type="text"
            :class="$style.ipt"
            v-model="searchipt.t_IDnumber"
        /></el-col>
        <el-col :span="5"
          >任职状态:&nbsp;&nbsp;
          <el-select v-model="searchipt.t_status" placeholder="任职状态" :class="$style.ipt">
            <el-option v-for="item in status" :label="item.name" :value="item.id" :key="item.id" />
          </el-select>
        </el-col>
        <el-col :span="5"
          >教授课程:&nbsp;&nbsp;
          <el-input type="text" :class="$style.ipt" v-model="searchipt.sub_name"
        /></el-col>
      </el-row>
      <hr />
      <div :class="$style.btn">
        <button :class="$style.btn1" @click="toSearch">查询</button>
        <button :class="$style.btn2" @click="toReset">重置</button>
      </div>
    </div>
    <div :class="$style.main">
      <el-table :data="teachers" border :class="$style.table">
        <el-table-column prop="t_name" label="姓名" />
        <el-table-column prop="t_sex" label="性别" />
        <el-table-column prop="sub_name" label="科目" />
        <el-table-column prop="g_name" label="年级" />
        <el-table-column prop="t_IDtype" label="证件类型" width="100" />
        <el-table-column prop="t_IDnumber" label="证件号码" width="180" />
        <el-table-column prop="t_phone" label="联系方式" width="180" />
        <el-table-column prop="t_email" label="邮箱"  />
        <el-table-column prop="t_date" label="创建时间" width="180"/>
        <el-table-column prop="t_status" label="状态" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button link @click="toEdit(scope.row.t_id,scope.row.t_name,scope.row.t_IDnumber)">编辑</el-button>
            <el-button link @click="toDelete(scope.row.t_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, inject } from 'vue'
import { useCommondata } from '@/stores/common'
import { useRouter} from 'vue-router'
const { fetchGrades, fetchCourses } = useCommondata()
const router = useRouter()
const teachers = ref()
const searchipt = ref({})
//用于保存年级和班级数据来渲染表格
const grades = ref()
const course = ref({ data1: [], data2: [] })
//引入全局注入的工具函数
const success = inject('$success')
const err = inject('$err')
const usePostData = inject('$usePostData')
const useDeleteData = inject('$useDeleteData')

// 任职状态
const status = [
  { id: '0', name: '在职' },
  { id: '1', name: '离职' },
  { id: '2', name: '请假' }
]
onMounted(async () => {
  grades.value = await fetchGrades()
  const res = await fetchCourses()
  course.value.data1 = res.data1
  course.value.data2 = res.data2
  await render()
})

const render = async (params = []) => {
  await usePostData('http://localhost:3000/teacher', params).then((res) => {
    teachers.value = res.data.map((item) => {
      return {
        ...item,
        t_date: item.t_date.split('T')[0],
        t_sex: item.t_sex === '0' ? '男' : '女',
        t_status: item.t_status === '0' ? '在职' : item.t_status === '2' ? '请假' : '离职',
        g_name: grades.value.find((g) => g.g_id === item.g_id)?.g_name || 'Unknown',
        sub_name:
          course.value.data1.find((c) => c.mc_id === item.sub_id)?.mc_name ||
          course.value.data2.find((c) => c.ac_id === item.sub_id)?.ac_name ||
          'Unknown'
      }
    })
  })
}
//查询
const toSearch = () => {
  if (searchipt.value == '') {
    render()
  }
  const obj = {
    ...searchipt.value,
    sub_id:
      course.value.data1.find((c) => c.mc_name === searchipt.value.sub_name)?.mc_id ||
      course.value.data2.find((c) => c.ac_name === searchipt.value.sub_name)?.ac_id ||
      undefined
  }
  render(obj)
  success('查询成功')
}
//清空
const toReset = () => {
  searchipt.value = {
    t_name: '',
    sub_name: '',
    t_status: '',
    t_IDnumber: ''
  }
  render()
}
//删除
const toDelete = async (id) => {
  try {
    await useDeleteData('http://localhost:3000/teacher/delete', { t_id: id })
    render()
    success('删除成功')
  } catch (error) {
    console.log(error)
    err('删除失败')
  }
}
// 编辑
const toEdit = (id, name, idnumber) => {
  router.push({
    name: 'TeacherEdit',
    params: {
      id: id,
      name: name,
      IDnumber: idnumber
    }
  });
};



</script>
<style module lang="scss">
.container {
  @include table;
}
</style>

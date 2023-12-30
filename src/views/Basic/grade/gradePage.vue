<template>
  <div :class="$style.container">
    <div :class="$style.tools">
      <el-row :class="$style.row">
        <el-col :span="2" :class="$style.title">姓名：</el-col>
        <el-col :span="4"><el-input type="text" :class="$style.ipt" v-model="tname" /></el-col>
      </el-row>
      <hr />
      <div :class="$style.btn">
        <button :class="$style.btn1" @click="toSearch">查询</button>
        <button :class="$style.btn2" @click="toReset">重置</button>
      </div>
    </div>

    <div :class="$style.main">
      <div :class="$style.aside">
        <el-menu>
          <el-menu-item
            active-text-color="#3952fd"
            default-active="1"
            @click="handleGradeChange"
            v-for="item in grades"
            :key="item.g_id"
            :index="item.g_id"
            :class="$style.menu_item"
          >
            <span>{{ item.g_name }}</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div :class="$style.table">
        <div :class="$style.head">
          <div :class="$style.title">年级主任</div>
        </div>
        <div :class="$style.h_main">
          <div :class="$style.title">
            <div :class="$style.box">名称</div>
            <div :class="$style.box">联系方式</div>
            <div :class="$style.box">年级</div>
            <div :class="$style.box">操作</div>
          </div>
          <div :class="$style.content">
            <div :class="$style.box">{{ gradeData.t_name }}</div>
            <div :class="$style.box">{{ gradeData.t_phone }}</div>
            <div :class="$style.box">{{ gradeData.g_name }}</div>
            <div :class="$style.box">
              <el-button link @click="toEdit">编辑</el-button
              ><el-button link @click="toDelete">删除</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 弹出框 -->
    <el-dialog v-model="dialogTableVisible" title="设置年级主任">
      <el-table
        ref="singleTableRef"
        :data="teachers"
        highlight-current-row
        style="width: 100%"
        @current-change="handleCurrentChange"
      >
        <el-table-column type="index" width="50" />
        <el-table-column property="t_name" label="姓名" width="120" />
        <el-table-column property="t_sname" label="性别" width="120" />
        <el-table-column property="t_phone" label="联系方式" />
        <el-table-column property="t_IDnumber" label="证件号码" />
      </el-table>
      <div style="margin-top: 20px" :class="$style.dialog_btn">
        <button @click="setCurrent()" :class="$style.btn1">选择</button>
        <button @click="dialogTableVisible = false" :class="$style.btn2">取消</button>
      </div>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, onMounted, inject } from 'vue'
import { useCommondata } from '@/stores/common'

const { fetchGrades } = useCommondata()
//注入工具函数

const usePostData = inject('$usePostData')
const useDeleteData = inject('$useDeleteData')

const grades = ref()
const teachers = ref()
const tname = ref()
const gradeData = ref({})
//控制弹出框
const dialogTableVisible = ref(false)
//选择列表
const singleTableRef = ref()
const currentRow = ref()

//当前内容索引
const current = ref(1)
// 初始化
onMounted(async () => {
  grades.value = await fetchGrades()
  await getteachers()
  await changeGrade(current.value)
})
const handleGradeChange = (num) => {
  changeGrade(num.index)
  current.value = num.index
}
const changeGrade = async (num) => {
  grades.value = await fetchGrades()
  const grade = grades.value.find((item) => item.g_id === num)
  if (grade) {
    const teacher = teachers.value.find((item) => item.t_id === grade.g_headmaster)
    gradeData.value = {
      t_name: teacher && teacher.t_name ? teacher.t_name : '暂无',
      t_phone: teacher && teacher.t_phone ? teacher.t_phone : '暂无',
      g_name: grade.g_name ? grade.g_name : '暂无',
      g_id: num
    }
  } else {
    // 处理未找到对应 grade 的情况
    gradeData.value = {
      t_name: '暂无',
      t_phone: '暂无',
      g_name: '暂无',
      g_id: num
    }
  }
}
//获得教师列表
const getteachers = async (params) => {
  try {
    const res = await usePostData('http://localhost:3000/teacher', params)
    teachers.value = res.data.map((item) => {
      return {
        ...item,
        t_sname: item.t_sex == '0' ? '男' : '女'
      }
    })
  } catch (error) {
    console.log(error)
  }
}
//查询
const toSearch = () => {
  const tid = teachers.value.find((item) => item.t_name == tname.value).t_id
  const gid = grades.value.find((item) => item.g_headmaster == tid).g_id
  changeGrade(gid)
}
//编辑
const toEdit = () => {
  dialogTableVisible.value = true
}
//删除年级主任
const toDelete = async () => {
  try {
    await useDeleteData('http://localhost:3000/grade/delete', {
      g_id: current.value
    })
    gradeData.value = {
      t_name: '暂无',
      t_phone: '暂无',
      g_name: '暂无',
      g_id: current.value
    }
  } catch (error) {
    console.log(error)
  }
}
//点击设置按钮后的操作
const setCurrent = async () => {
  try {
    await usePostData('http://localhost:3000/grade/add', {
      g_id: current.value,
      g_headmaster: currentRow.value.t_id
    })
    changeGrade(current.value)
    dialogTableVisible.value = false
  } catch (error) {
    console.log(error)
  }
}

const handleCurrentChange = (val) => {
  currentRow.value = val
}
</script>
<style module lang="scss">
.container {
  @include grade_interest;
}
</style>

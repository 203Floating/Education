<template>
  <div :class="$style.container">
    <div :class="$style.tools">
      <el-row :class="$style.row">
        <el-col :span="2" :class="$style.title">课程：</el-col>
        <el-col :span="4">
          <el-select v-model="courseId" placeholder="选修课程" :class="$style.ipt">
            <el-option
              v-for="item in courseData"
              :label="item.ac_name"
              :value="item.ac_id"
              :key="item.ac_id"
            />
          </el-select>
        </el-col>
      </el-row>
      <hr />
      <div :class="$style.btn">
        <button :class="$style.btn1" @click="searchCourse">查询</button>
        <button :class="$style.btn2" @click="toReset">重置</button>
      </div>
    </div>
    <div :class="$style.main">
      <div :class="$style.main_top">
        <div>
          <span>选课任务：</span> <span>{{ taskData.cs_name }}</span>
        </div>
        <div>
          <span>年级：</span> <span>{{ taskData.g_name }}</span>
        </div>
        <div>
          <span>最多可选：</span> <span>{{ taskData.cs_max }}</span>
        </div>
        <div>
          <span>最少可选：</span> <span>{{ taskData.cs_min }}</span>
        </div>
      </div>
      <el-table
        ref="courselist"
        :data="courseData"
        border
        :class="$style.table"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" />
        <el-table-column type="index" label="全选" width="100" />
        <el-table-column prop="ac_name" label="课程名" />
        <el-table-column prop="sub_year" label="学制" />
        <el-table-column prop="g_name" label="年级" />
        <el-table-column prop="timetable_name" label="开课时间" />
        <el-table-column prop="select_status" label="是否已经选择" />
      </el-table>
      <div :class="$style.bottom">
        <div :class="$style.btn">
          <button :class="$style.btn1" @click="toSave">保存</button>
          <button :class="$style.btn2" @click="toReset">清空</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, inject, onMounted } from 'vue'
import { useCommondata } from '@/stores/common'
import { success, warning } from '@/utils/popupUtils'
import { useAuthorization } from '@/stores/Authorization'
const { getAuthority } = useAuthorization()
const { fetchGrades } = useCommondata()
const usePostData = inject('$usePostData')
const changeWeek = inject('$changeWeek')
//获得全部的年级信息
const gradeData = ref([])
//获得当前学生的学号
const { level, userId } = getAuthority()
//获得学生的详细信息
const userData = ref({})
//获得学生可选任务的详细信息
const taskData = ref({})
//可选课程的信息
const courseData = ref([])
//查询课程的id
const courseId = ref()
const courselist = ref()
onMounted(async () => {
  gradeData.value = await fetchGrades()
  await getStudents()
  await getTask()
  await getCourse()
  if (taskData.value.cs_status != '1') [(courseData.value = '')]
})
console.log(level)
//选课
const toSave = async () => {
  const course = courselist.value.map((item) => {
    return item.ac_id
  })
  const course1 = JSON.stringify(
    courselist.value.map((item) => {
      return item.timetable
    })
  )
  const course2 = JSON.stringify([
    ...new Set(
      courselist.value.map((item) => {
        return item.timetable
      })
    )
  ])
  if (course2 == course1) {
    success('成功')
    try {
      await usePostData('http://localhost:3000/student/updateSubs', {
        stu_id: userId,
        subs: course
      })
    } catch (error) {
      console.log(error)
    }
  } else {
    warning('课程冲突!')
  }
}
//查询指定课程
const searchCourse = async () => {
  try {
    const res = await usePostData('http://localhost:3000/assistclass', {
      ac_id: courseId.value
    })
    if (res.data.data[0].g_id == userData.value.g_id) {
      courseData.value = []
      courseData.value.push({
        ...res.data.data[0],
        g_name: gradeData.value.find((g) => g.g_id === res.data.data[0].g_id).g_name,
        timetable_name: changeWeek(res.data.data[0].timetable)
      })
    }
  } catch (error) {
    console.log(error)
  }
}
//查询是否已经选择该课程
const searchSelectCourse = async (id) => {
  const subs = userData.value.subs.split(',')
  let tag = true
  subs.forEach((e) => {
    if (e == id) {
      tag = false
    }
  })
  return tag
}
// 表格选项改变
const handleSelectionChange = (val) => {
  courselist.value = val
}
//获得学生的详细信息
const getStudents = async () => {
  try {
    const res = await usePostData('http://localhost:3000/student', { stu_id: userId })
    userData.value = res.data[0]
  } catch (error) {
    console.log(error)
  }
}
//获得用户参与的选课任务信息
const getTask = async () => {
  try {
    const res = await usePostData('http://localhost:3000/course', { cs_id: userData.value.task_id })
    taskData.value = res.data[0]
    taskData.value.g_name = gradeData.value.find((g) => g.g_id === res.data[0].g_id).g_name
  } catch (error) {
    console.log(error)
  }
}
//获得可选课程的信息
const getCourse = async () => {
  try {
    for (const e of taskData.value.sub_ids.split(',')) {
      const res = await usePostData('http://localhost:3000/assistclass', {
        ac_id: e
      })
      if (!res.data.data.length) {
        courseData.value = []
      } else {
        if (res.data.data[0].g_id == userData.value.g_id) {
          courseData.value.push({
            ...res.data.data[0],
            g_name: gradeData.value.find((g) => g.g_id === res.data.data[0].g_id).g_name,
            timetable_name: changeWeek(res.data.data[0].timetable),
            select_status: (await searchSelectCourse(res.data.data[0].ac_id)) ? '未选' : '已选'
          })
        }
      }
    }
  } catch (error) {
    console.log(error)
  }
}
//重置输入框
const toReset = () => {
  courseId.value = ''
}
</script>
<style module lang="scss">
.container {
  @include table;
  .main_top {
    margin: 10px 20px 20px 10px;
    display: flex;
    justify-content: space-between;
    span {
      padding: 5px;
      padding-right: 0px;
    }
  }
}
</style>

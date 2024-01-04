<template>
  <div :class="$style.container">
    <el-row :class="$style.row">
      <el-col :span="3" :class="$style.header">基本信息&nbsp;&nbsp;&nbsp;</el-col>
    </el-row>
    <el-row :class="$style.row">
      <el-col :span="3" :class="$style.left">选课任务名称：</el-col
      ><el-col :span="8">{{ taskData.cs_name }}</el-col>
      <el-col :span="3" :class="$style.left">选课年级：</el-col
      ><el-col :span="8">{{ taskData.g_name }}</el-col>
    </el-row>
    <el-row :class="$style.row">
      <el-col :class="$style.left" :span="3">选课班级：</el-col
      ><el-col :span="8">{{ taskData.c_names }}</el-col>
    </el-row>
    <el-row :class="$style.row">
      <el-col :class="$style.left" :span="3">任务描述：</el-col
      ><el-col :span="8">{{ taskData.cs_title }}</el-col>
    </el-row>
    <el-row :class="$style.row">
      <el-col :class="$style.header" :span="3">选选课设置&nbsp;&nbsp;&nbsp;</el-col>
    </el-row>
    <el-row :class="$style.row">
      <el-col :class="$style.left" :span="3">选课课程：</el-col
      ><el-col :span="8">{{ taskData.sub_names }}</el-col>
    </el-row>
    <el-row :class="$style.row">
      <el-col :class="$style.left" :span="3">选课说明：</el-col><el-col :span="8"></el-col>
    </el-row>
    <el-row :class="$style.row">
      <el-col :class="$style.left" :span="3">互斥课程：</el-col><el-col :span="8">{{mutualCourse}}</el-col>
    </el-row>
    <el-row :class="$style.row">
      <el-col :class="$style.left" :span="3">禁选课程：</el-col><el-col :span="8">{{banCourse}}</el-col>
    </el-row>
    <el-row :class="$style.row">
      <el-col :class="$style.left" :span="3">连选课程：</el-col><el-col :span="8">{{connectCourse}}</el-col>
    </el-row>
  </div>
</template>
<script setup>
import { ref, onMounted, inject } from 'vue'
import { useCommondata } from '@/stores/common'
const { fetchGrades, fetchClass, fetchCourses } = useCommondata()
import { useRoute } from 'vue-router';
const usePostData = inject('$usePostData')
const useGetData = inject('$useGetData')
//保存选课任务的数据
const taskData = ref({})
const gradeData = ref([])
const classData = ref([])
const courseData = ref([])
const route = useRoute()
const taskId = route.params.id


const mutualCourse = ref('')
const connectCourse = ref('')
const banCourse = ref('')
onMounted(async () => {

  gradeData.value = await fetchGrades()
  classData.value = await fetchClass()
  const res = await fetchCourses()
  courseData.value = res.data2
  await getMutual()
  await getConnect()
  await getBan ()
  console.log(courseData.value)
  await getTask()
})
//获得任务详情数据
const getTask = async () => {
  try {
    const res = await usePostData('http://localhost:3000/course', { cs_id: taskId })
    taskData.value = res.data[0]
    taskData.value.g_name = gradeData.value.find((g) => g.g_id === res.data[0].g_id).g_name
    taskData.value.c_names = await changeClass(taskData.value.c_ids, classData)
    taskData.value.sub_names = await changeCourse(taskData.value.sub_ids, courseData)
    console.log(taskData.value, 'taskData')
  } catch (error) {
    console.log(error)
  }
}
//获得互斥课程
const getMutual = async () => {
  try {
    const res = await useGetData('http://localhost:3000/course/banlink', {
      cs_id: taskId
    })
    for (let i = 0; i < res.data.length; i++){
      mutualCourse.value+='    '
      mutualCourse.value+=changeCourse(res.data[i].c_ids,courseData)
    }
  } catch (error) {
    console.log(error)
  }
}
//获得连选课程
const getConnect = async () => {
  try {
    const res = await useGetData('http://localhost:3000/course/link', {
      cs_id: taskId
    })
    for (let i = 0; i < res.data.length; i++){
      connectCourse.value+='    '
      connectCourse.value+=changeCourse(res.data[i].c_ids,courseData)
    }
  } catch (error) {
    console.log(error)
  }
}//获得禁选课程
const getBan = async () => {
  try {
    const res = await useGetData('http://localhost:3000/course/banlink', {
      cs_id: taskId
    })
    for (let i = 0; i < res.data.length; i++){
      banCourse.value +='    '
      banCourse.value+=changeCourse(res.data[i].c_ids,courseData)
    }
  } catch (error) {
    console.log(error)
  }
}
//班级处理
const changeClass = (str, classes) => {
  // 添加检查确保 str 不为 null 或 undefined
  if (str === null || str === undefined) {
    console.error('Input string is null or undefined')
    return
  }
  // 否则，执行原先的逻辑
  const strs = str.split(',').map((item) => {
    return classes.value.find((c) => c.c_id == item)?.c_name || 'unknown'
  })
  return strs.join(',')
}

//科目处理
const changeCourse = (str, course) => {
  // 添加检查确保 str 不为 null 或 undefined
  if (str === null || str === undefined) {
    console.error('Input string is null or undefined')
    return
  }
  // 否则，执行原先的逻辑
  const strs = str.split(',').map((item) => {
    return course.value.find((c) => c.ac_id == item)?.ac_name || 'unknown'
  })
  return strs.join(',')
}
</script>

<style lang="scss" module>
.container {
  .row {
    line-height: 20px;
    height: 20px;
    margin-top: 20px;
    .left,
    .header {
      text-align: right;
    }
    .header {
      border-left: 3px solid $primary;
    }
  }
}
</style>

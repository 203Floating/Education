<template>
  <div :class="$style.container">
    <div :class="$style.box"><div :class="$style.BarGraph" id="BarGraph"></div></div>
    <div :class="$style.table">
      <table>
        <thead>
          <tr>
            <th>班级</th>
            <td v-for="item in taskData.datax" :key="item">{{ item }}</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(i, index) in classData.name" :key="i">
            <th>{{ i }}总计：({{ classData.total[index] }})</th>
            <td v-for="j in classData.value[index]" :key="i + j">{{ j }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, inject } from 'vue'
import { useCommondata } from '@/stores/common'
import * as echarts from 'echarts'
import { useRoute } from 'vue-router'
const usePostData = inject('$usePostData')
const route = useRoute()
const { fetchGrades, fetchCourses, fetchClass } = useCommondata()
const grades = ref([]) //年级数据
const tasks = ref({}) //当前选课任务的数据
const subs = ref([]) //获得当前选课任务的所有可选课程数据
const students = ref([]) //获得所有学生数据
const course = ref([]) //所有兴趣课程数据
const classData = ref({
  name: [],
  value: [],
  id: [],
  subs: [],
  subIds: [],
  total: []
}) //拿到所有的班级数据
const taskId = route.params.id
const taskData = ref({
  datay: [],
  datax: [],
  ids: []
})

onMounted(async () => {
  grades.value = await fetchGrades()

  await getTasks(taskId)
  await getStudents()

  await getTaskData()
  await getClass()
  //获取小图要挂载的dom
  const BarGraph = document.getElementById('BarGraph')
  getBarGraph(BarGraph, taskData)
})

//柱状图
const getBarGraph = (chartDom, data) => {
  let myChart = echarts.init(chartDom)
  let option
  option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: data.value.datax,
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: '人数',
        type: 'bar',
        barWidth: '60%',
        data: data.value.datay
      }
    ]
  }

  option && myChart.setOption(option)
}
//计算拿到所需要的数据
const getTaskData = async () => {
  for (let s of subs.value) {
    const res1 = course.value.find((c) => c.ac_id == s).ac_name
    classData.value.subs.push(res1)
    classData.value.subIds.push(s)
    taskData.value.datax.push(res1)
    taskData.value.datay.push(0)
    taskData.value.ids.push(s)
  }
  for (let s of students.value) {
    const subjects = s.subs.split(',')
    if (subjects.length == 1) {
      for (let t in taskData.value.datax) {
        if (taskData.value.ids[t] === subjects[0]) {
          taskData.value.datay[t]++
        }
      }
    }
    if (subjects.length > 1) {
      for (let id of subjects) {
        for (let i in taskData.value.ids) {
          if (taskData.value.ids[i] == id) {
            taskData.value.datay[i]++
          }
        }
      }
    }
  }
}
//获得当前选课任务的数据
const getTasks = async (id) => {
  try {
    const res = await usePostData('http://localhost:3000/course', {
      cs_id: id
    })
    tasks.value = res.data[0]
    subs.value = tasks.value.sub_ids.split(',')
    const res2 = await fetchCourses()
    course.value = res2.data2
  } catch (error) {
    console.log(error)
  }
}
//获得所有学生数据
const getStudents = async () => {
  try {
    const res = await usePostData('http://localhost:3000/student')
    for (let s of res.data) {
      if (s.task_id == tasks.value.cs_id) {
        students.value.push(s)
      }
    }
  } catch (error) {
    console.log(error)
  }
}
//获得该任务下的班级数据
const getClass = async () => {
  const res = await fetchClass()
  const c_ids = tasks.value.c_ids.split(',')
  for (let id of c_ids) {
    for (let c of res) {
      if (id == c.c_id) {
        classData.value.name.push(c.c_name)
        classData.value.id.push(c.c_id)
        getClassTaskStudent(tasks.value.cs_id, c.c_id, classData)
      }
    }
  }
}
//根据班级id和选课任务id来定向查找学生
const getClassTaskStudent = (id1, id2, data) => {
  let total = new Array(data.value.subIds.length).fill(0)
  for (let s of students.value) {
    let arr = new Array(data.value.subIds.length).fill(0)
    if (s.task_id == id1 && s.c_id == id2) {
      const stu_subs = s.subs.split(',')
      for (let i in data.value.subIds) {
        for (let id of stu_subs) {
          if (id == data.value.subIds[i]) {
            arr[i]++
          }
        }
      }
      for (let i in arr) {
        if (arr[i] != 0) {
          total[i]++
        }
      }
    }
  }
  let sum = total.reduce((a, c) => {
    return a + c
  }, 0)
  data.value.value.push(total)
  data.value.total.push(sum)
}
//计算属性
</script>
<style module lang="scss">
.container {
  .box {
    box-sizing: border-box;
    padding: 30px;
    display: flex;
    justify-content: center;
    .BarGraph {
      width: 60%;
      height: 400px;
    }
  }
  .table {
    box-sizing: border-box;
    padding: 30px;
    display: flex;
    justify-content: center;
    table {
      border-collapse: collapse;
      text-align: center;
      width: 80%;

      th,
      td {
        border: 1px solid #ddd;
        height: 50px;
      }
      th{
        font-weight: normal;
        width:40%;
      }
      td{
        width: 20%;
        // background-color: #e9f3ff;
      }
    }
  }
}
</style>

<template>
  <div :class="$style.container">
    <div :class="$style.box1">
      <div :class="$style.box1_aside">
        <div :class="$style.aside_top">
          <div :class="$style.title">学生基础信息</div>
          <div :class="$style.content_title">
            <div :class="$style.total">
              <span>{{ studentData.data[0].value + studentData.data[1].value }}</span
              ><br />
              <span>总人数</span>
            </div>
            <div :class="$style.total">
              <span>{{ studentData.data[0].value }}</span
              ><br />
              <span>男生</span>
            </div>
            <div :class="$style.total">
              <span>{{ studentData.data[0].value }}</span
              ><br />
              <span>女生</span>
            </div>
          </div>
        </div>
        <div :class="$style.aside_bottom">
          <div :class="$style.title">学生性别分布</div>
          <div :class="$style.content_map" id="StudentSexChart"><PieChart /></div>
        </div>
      </div>
      <div :class="$style.box1_main">
        <div :class="$style.aside_top">
          <div :class="$style.title">兴趣课程选课</div>
          <div :class="$style.content_title">
            <div :class="$style.total">
              <span>{{ studentData.data[0].value + studentData.data[1].value }}</span
              ><br />
              <span>总人数</span>
            </div>
            <div :class="$style.total">
              <span>{{ studentData.data[0].value }}</span
              ><br />
              <span>男生</span>
            </div>
            <div :class="$style.total">
              <span>{{ studentData.data[0].value }}</span
              ><br />
              <span>女生</span>
            </div>
          </div>
        </div>
        <div :class="$style.title" id="selectStudentnum" style="margintop: 10px">选课人数分布</div>
        <div :class="$style.content_map" id="interestMap" style="width: 99%; height: 320px">
          <PieChart />
        </div>
      </div>
      <div :class="$style.box1_aside">
        <div :class="$style.aside_top">
          <div :class="$style.title">教师基础信息</div>
          <div :class="$style.content_title">
            <div :class="$style.total">
              <span>{{ teacherData.data[0].value + teacherData.data[1].value }}</span
              ><br />
              <span>总人数</span>
            </div>
            <div :class="$style.total">
              <span>{{ teacherData.data[0].value }}</span
              ><br />
              <span>男生</span>
            </div>
            <div :class="$style.total">
              <span>{{ teacherData.data[0].value }}</span
              ><br />
              <span>女生</span>
            </div>
          </div>
        </div>
        <div :class="$style.aside_bottom">
          <div :class="$style.title">教师性别分布</div>
          <div :class="$style.content_map" id="TeacherSexChart"><PieChart /></div>
        </div>
      </div>
    </div>
    <div :class="$style.box2">
      <div :class="$style.box2_aside">
        <div :class="$style.title">学生基础信息</div>
        <div :class="$style.content_map" id="gradeMap"><PieChart /></div>
      </div>

      <div :class="$style.box2_main">
        <div :class="$style.title">选课任务的选择人数分布</div>
        <div :class="$style.content_map" id="taskMap"><PieChart /></div>
      </div>

      <div :class="$style.box2_aside">
        <div :class="$style.title">各学科教师分布</div>
        <div :class="$style.content_map" id="subjectMap"><PieChart /></div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref, inject } from 'vue'
import { useCommondata } from '@/stores/common'
import * as echarts from 'echarts'

const usePostData = inject('$usePostData')

const { fetchGrades, fetchCourses } = useCommondata()
const grades = ref([]) //年级数据
const students = ref([]) //学生数据
const teachers = ref([]) //教师数据
const subjects = ref([]) //课程数据
const studentData = ref({
  data: [
    {
      value: 0,
      name: '男'
    },
    {
      value: 0,
      name: '女'
    }
  ],
  text: '学生性别分布'
})
const teacherData = ref({
  data: [
    {
      value: 0,
      name: '男'
    },
    {
      value: 0,
      name: '女'
    }
  ],
  text: '教师性别分布'
})
const gradeData = ref({
  datay: [0, 0, 0, 0, 0, 0],
  datax: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级']
})
const subjectData = ref({
  data: [],
  text: '学科',
  subText: '各学教师人数分布'
})
const interestData = ref({
  data: [],
  text: '兴趣课程',
  subText: '选这人数分布'
})
const taskData = ref({
  datay: [],
  datax: [],
  ids: []
})
onMounted(async () => {
  grades.value = await fetchGrades()
  const res1 = await usePostData('http://localhost:3000/student')
  const res2 = await usePostData('http://localhost:3000/teacher')
  students.value = res1.data
  teachers.value = res2.data

  const res = await fetchCourses()

  await getCourse(res)
  await getTSData(students, studentData, 's')
  await getTSData(teachers, teacherData, 't')
  await getGradeData(students, gradeData)
  await getInterestData(students, interestData)
  await getTaskData(students)
  //获取小图要挂载的dom
  const chartDom1 = document.getElementById('StudentSexChart')
  const chartDom2 = document.getElementById('TeacherSexChart')
  const chartDom3 = document.getElementById('subjectMap')
  const chartDom4 = document.getElementById('gradeMap')
  const chartDom5 = document.getElementById('interestMap')
  const chartDom6 = document.getElementById('taskMap')
  getPieEchart(chartDom1, studentData)
  getPieEchart(chartDom2, teacherData)
  getPieEchart(chartDom3, subjectData)
  getBarGraph(chartDom4, gradeData)
  getPieEchart(chartDom5, interestData)
  getBarGraph(chartDom6, taskData)
})
//饼图
const getPieEchart = (chartDom, data) => {
  let myChart = echarts.init(chartDom)
  let option

  option = {
    title: {
      text: data.value.text,
      subtext: data.value.subtext,
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      show: false
    },
    series: [
      {
        name: '人数',
        type: 'pie',
        radius: '50%',
        data: data.value.data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }

  option && myChart.setOption(option)
}
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
//获得每个选课任务选择的学生数目
const getTaskData = async (students) => {
  console.log(students.value, '学生数据')
  try {
    const res = await usePostData('http://localhost:3000/course')
    for (let i = 0; i < res.data.length; i++) {
      console.log(res.data[i].cs_name)
      taskData.value.datax.push(res.data[i].cs_name)
      taskData.value.datay.push(0)
      taskData.value.ids.push(res.data[i].cs_id)
    }
    for (let i = 0; i < taskData.value.datax.length; i++) {
      for (let j = 0; j < students.value.length; j++) {
        if (students.value[j].task_id == taskData.value.ids[i]) {
          taskData.value.datay[i]++
        }
      }
    }
  } catch (error) {
    console.log(error)
  }
}
//获得各个年级的学生数据
const getGradeData = (arr, data) => {
  for (let i = 0; i < arr.value.length; i++) {
    let x = arr.value[i].g_id
    data.value.datay[+x - 1]++
  }
}
//获得人数数据
const getTSData = (arr, data, tag) => {
  let m = 0
  let n = 0
  if (tag == 's') {
    for (let i = 0; i < arr.value.length; i++) {
      if (arr.value[i].stu_sex == '0') m++
      if (arr.value[i].stu_sex == '1') n++
    }
  } else {
    for (let i = 0; i < arr.value.length; i++) {
      if (arr.value[i].t_sex == '0') m++
      if (arr.value[i].t_sex == '1') n++
    }
  }

  data.value.data = [
    {
      value: m,
      name: '男'
    },
    {
      value: n,
      name: '女'
    }
  ]
}
//获得学科数据
const getCourse = (data) => {
  for (let i = 0; i < data.data1.length; i++) {
    subjects.value.push({
      sub_name: data.data1[i].mc_name,
      sub_id: data.data1[i].mc_id
    })
  }
  for (let i = 0; i < data.data2.length; i++) {
    subjects.value.push({
      sub_name: data.data2[i].ac_name,
      sub_id: data.data2[i].ac_id
    })
    interestData.value.data.push({
      name: data.data2[i].ac_name,
      value: 0,
      sub_id: data.data2[i].ac_id
    })
  }
  subjectData.value.data = subjects.value.map((item) => {
    return {
      value: getNumCourseTeacher(item.sub_id),
      name: item.sub_name
    }
  })
}
//获得兴趣课程人数
const getInterestData = async (students, data) => {
  for (let i = 0; i < students.value.length; i++) {
    if (students.value[i].subs) {
      const s = students.value[i].subs.split(',')
      if (s.length > 1) {
        for (let j = 0; j < s.length; j++) {
          for (let m = 0; m < data.value.data.length; m++) {
            if (data.value.data[m].sub_id == s[j]) {
              data.value.data[m].value++
            }
          }
        }
      }
      if (s.length == 1) {
        for (let m = 0; m < data.value.data.length; m++) {
          if (data.value.data[m].sub_id == s[0]) {
            data.value.data[m].value++
          }
        }
      }
    }
  }
}
//获得教授指定课程的教师数目
const getNumCourseTeacher = (id) => {
  let arr = 0
  for (let i = 0; i < teachers.value.length; i++) {
    if (id == teachers.value[i].sub_id) {
      arr++
    }
  }

  return arr
}
//计算属性
</script>
<style module lang="scss">
.container {
  width: 100%;
  .content_title {
    display: flex;
    margin-top: 20px;
    width: 100%;
    height: 60px;

    .total {
      width: 33.33%;
      line-height: 30px;
      text-align: center;
    }
  }
  .box1 {
    display: flex;
    justify-content: space-between;
    height: 450px;
    .box1_aside {
      width: 28%;
      .aside_top {
        border-radius: 8px;
        padding-top: 5px;
        height: 120px;
        background-color: $btn_bgc;
      }
      .aside_bottom {
        border-radius: 8px;
        padding-top: 5px;
        margin-top: 10px;
        height: 320px;
        background-color: $btn_bgc;
      }
    }
    .box1_main {
      border-radius: 8px;
      padding-top: 5px;
      margin-left: 20px;
      margin-right: 20px;
      width: 40%;
      background-color: $btn_bgc;
    }
  }
  .box2 {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    height: 340px;
    .box2_aside {
      border-radius: 8px;
      padding-top: 5px;
      width: 28%;
      background-color: $btn_bgc;
    }
    .box2_main {
      border-radius: 8px;
      padding-top: 5px;
      margin-left: 20px;
      margin-right: 20px;
      width: 40%;
      background-color: $btn_bgc;
    }
  }
  .title {
    box-sizing: border-box;
    margin-left: 5px;
    margin-top: 8px;
    padding-left: 15px;
    border-left: 3px solid #fcca00;
  }
  .content_map {
    margin: 0 auto;
    margin-top: 20px;
    width: 90%;
    height: 280px;
  }
}
</style>

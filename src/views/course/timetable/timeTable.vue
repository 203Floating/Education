<template>
  <div :class="$style.container">
    <div :class="$style.header">
      <el-row :class="$style.row">
        <el-col :span="2" :class="$style.title">年级：</el-col>
        <el-col :span="4">
          <el-select
            v-model="data.g_id"
            placeholder="年级"
            :class="$style.ipt"
            @change="changeClass"
          >
            <el-option
              v-for="item in grades"
              :key="item.g_id"
              :label="item.g_name"
              :value="item.g_id"
            />
          </el-select>
        </el-col>

        <el-col :span="2" :class="$style.title">班级：</el-col>
        <el-col :span="4">
          <el-select
            v-model="data.c_id"
            placeholder="班级"
            :class="$style.ipt"
            @change="changeTable"
          >
            <el-option
              v-for="item in data.class"
              :key="item.c_id"
              :label="item.c_name"
              :value="item.c_id"
            />
          </el-select>
        </el-col>
      </el-row>
    </div>
    <div :class="$style.main">
      <table :class="$style.timetable">
        <thead>
          <tr>
            <th :class="$style.time">时间</th>
            <th>星期一</th>
            <th>星期二</th>
            <th>星期三</th>
            <th>星期四</th>
            <th>星期五</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td :class="$style.time">8:00~8:40</td>
            <td rowspan="2">{{ timetable[0][0] }}</td>
            <td rowspan="2">{{ timetable[1][0] }}</td>
            <td rowspan="2">{{ timetable[2][0] }}</td>
            <td rowspan="2">{{ timetable[3][0] }}</td>
            <td rowspan="2">{{ timetable[4][0] }}</td>
          </tr>
          <tr>
            <td :class="$style.time">8:50~9:30</td>
          </tr>
          <tr>
            <td :class="$style.time">10:00~10:40</td>
            <td rowspan="2">{{ timetable[0][1] }}</td>
            <td rowspan="2">{{ timetable[1][1] }}</td>
            <td rowspan="2">{{ timetable[2][1] }}</td>
            <td rowspan="2">{{ timetable[3][1] }}</td>
            <td rowspan="2">{{ timetable[4][1] }}</td>
          </tr>
          <tr>
            <td :class="$style.time">10:50~11:30</td>
          </tr>
          <tr>
            <td :class="$style.time">2:30~3:10</td>
            <td rowspan="2">{{ timetable[0][1] }}</td>
            <td rowspan="2">{{ timetable[1][1] }}</td>
            <td rowspan="2">{{ timetable[2][1] }}</td>
            <td rowspan="2">{{ timetable[3][1] }}</td>
            <td rowspan="2">{{ timetable[4][1] }}</td>
          </tr>
          <tr>
            <td :class="$style.time">3:30~4:10</td>
          </tr>
          <tr>
            <td :class="$style.time">4:30~5:30</td>
            <td>{{ interest[0] }}</td>
            <td>{{ interest[1] }}</td>
            <td>{{ interest[2] }}</td>
            <td>{{ interest[3] }}</td>
            <td>{{ interest[4] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, inject } from 'vue'
import { useCommondata } from '@/stores/common'

const { fetchClass, fetchGrades, fetchCourses } = useCommondata()
const timetableDay = inject('$timetableDay')
const usePostData = inject('$usePostData')
const grades = ref([])
const classes = ref([])

//用户所在班级的课程对象
const timetable = ref([
  ['', '', ''],
  ['', '', ''],
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
])
//定义年级与班级
const data = ref({})
const interest = ref(['待选', '待选', '待选', '待选', '待选'])
//主修课程名
const mcourse = ref([])
const acourse = ref([])
onMounted(async () => {
  grades.value = await fetchGrades()
  classes.value = await fetchClass()
  data.value = {
    g_id: grades.value[0].g_id,
    c_id: ''
  }
  await getCourse()
  await getTimetable(classes.value[0].c_id)
})
//切换课表
const changeTable = async () => {
  timetable.value = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ]
  await getTimetable(data.value.c_id)
}
//获得当前班级的课表
//拿到课程表数据
const getTimetable = async (c_id) => {
  try {
    const res1 = await usePostData('http://localhost:3000/timetable')
    const res2 = await fetchClass()
    for (let c of res2) {
      if (c.c_id == c_id) {
        classes.value = c
      }
    }
    for (let t of res1.data) {
      if (t.timetable_id == classes.value.timetable_id) {
        timetable.value = [
          timetableDay(t.day1, mcourse),
          timetableDay(t.day2, mcourse),
          timetableDay(t.day3, mcourse),
          timetableDay(t.day4, mcourse),
          timetableDay(t.day5, mcourse)
        ]
      }
    }
  } catch (error) {
    console.log(error)
  }
}

//动态切换当前班级
const changeClass = async () => {
  console.log(data.value.g_id)
  data.value.c_id = ''
  try {
    const res = await usePostData('http://localhost:3000/class', {
      g_id: data.value.g_id
    })
    data.value.class = res.data.data
  } catch (error) {
    console.log(error)
  }
}
//获得课程数据
const getCourse = async () => {
  const res = await fetchCourses()
  mcourse.value = res.data1
  acourse.value = res.data2
}
</script>
<style module lang="scss">
.container {
  @mixin bgc_timetable {
    background-color: #fff;
    border-radius: 10px;
    margin-bottom: 20px;
    padding: 20px;
    box-sizing: border-box;
    width: 100%;
  }
  .header {
    @include bgc_timetable;
    .row {
      line-height: 30px;
      .title {
        text-align: right;
        width: 100px;
      }
    }
  }
  .main {
    height: 700px;
    @include bgc_timetable;
    display: flex;
    justify-content: center;
    .timetable {
      width: 90%;
      margin-right: 30px;
      border-collapse: collapse;
      margin: 15px;
      th,
      td {
        box-sizing: border-box;
        padding: 10px;
        height: 80px;
        border: 1px solid #baccd9;
        text-align: center;
        // background-color: #f4f9ff;
      }
      th {
        // background-color: #daedff;
      }
      .time {
        width: 10%;
        // background-color: #e9f3ff;
      }
    }
  }
}
</style>

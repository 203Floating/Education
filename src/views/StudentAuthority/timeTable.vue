<template>
  <div :class="$style.container">
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
</template>
<script setup>
import { ref, inject, onMounted } from 'vue'
import { useCommondata } from '@/stores/common'
const { fetchClass, fetchCourses } = useCommondata()
import { useAuthorization } from '@/stores/Authorization'
const { getAuthority } = useAuthorization()
const usePostData = inject('$usePostData')
const timetableDay = inject('$timetableDay')
//用户所在班级的课程对象
const timetable = ref([
  ['', '', ''],
  ['', '', ''],
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
])
const interest = ref(['自习', '自习', '自习', '自习', '自习'])
const { userId } = getAuthority()
//用户所在班级的数据
const classes = ref({})
//获得主修课程数据
const course = ref([])
//辅修课程数据
const acourse = ref([])
//用户信息
const userData = ref({})
onMounted(async () => {
  await getUserData()
  await getCourse()
  await getTimetable()
})

//拿到课程表数据
const getTimetable = async () => {
  try {
    const res1 = await usePostData('http://localhost:3000/timetable')
    const res2 = await fetchClass()
    for (let c of res2) {
      if (c.c_id == userData.value.c_id) {
        classes.value = c
      }
    }
    for (let t of res1.data) {
      if (t.timetable_id == classes.value.timetable_id) {
        timetable.value = [
          timetableDay(t.day1, course),
          timetableDay(t.day2, course),
          timetableDay(t.day3, course),
          timetableDay(t.day4, course),
          timetableDay(t.day5, course)
        ]
      }
    }
    const res = userData.value.subs.split(',').map((item) => {
      return {
        date: acourse.value.find((ac) => ac.ac_id == item).timetable,
        name: acourse.value.find((ac) => ac.ac_id == item).ac_name
      }
    })
    for (let t of res) {
      interest.value[+t.date - 1] = t.name
    }
  } catch (error) {
    console.log(error)
  }
}
//获得主修课程数据
const getCourse = async () => {
  const res = await fetchCourses()
  course.value = res.data1
  acourse.value = res.data2
}
//查询拿到当前学生用户信息
const getUserData = async () => {
  try {
    const res = await usePostData('http://localhost:3000/student', { stu_id: userId })
    userData.value = res.data[0]
  } catch (error) {
    console.log(error)
  }
}
</script>
<style lang="scss" module>
.container {
  @include bg_style_edit;
  display: flex;
  justify-content: center;
}
.timetable {
  width: 90%;
  margin-right: 30px;
  border-collapse: collapse;
  margin: 20px;
  th,
  td {
    box-sizing: border-box;
    padding: 10px;
    height: 80px;
    border: 1px solid #ddd;
    text-align: center;
    background-color: #f4f9ff;
  }
  th {
    background-color: #daedff;
  }
  .time {
    width: 10%;
    background-color: #e9f3ff;
  }
}
</style>

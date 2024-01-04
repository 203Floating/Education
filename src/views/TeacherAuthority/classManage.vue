<template>
  <div :class="$style.container">
    <div :class="$style.ul">
      <ul>
        <li
          v-for="c in classlist"
          :key="c.c_id"
          :class="{ [$style.active]: activeId == c.c_id }"
          @click="() => changeClassShow(c.c_id)"
        >
          <el-button link> {{ c.c_name }}</el-button>
        </li>
        <span :class="$style.span">教师课表</span>
      </ul>
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
            <td rowspan="2">{{ timetable[0][2] }}</td>
            <td rowspan="2">{{ timetable[1][2] }}</td>
            <td rowspan="2">{{ timetable[2][2] }}</td>
            <td rowspan="2">{{ timetable[3][2] }}</td>
            <td rowspan="2">{{ timetable[4][2] }}</td>
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
import { useAuthorization } from '@/stores/Authorization'
const { fetchClass, fetchGrades, fetchCourses } = useCommondata()
const { getAuthority } = useAuthorization()
//拿到当前教师用户的id
const { userId } = getAuthority()
const usePostData = inject('$usePostData')
const grades = ref([])
const classes = ref([])
//拿到该教师用户的个人信息数据
const userData = ref({})
//班级数据
const classlist = ref([])
//用户所在班级的课程对象
const timetable = ref([
  ['', '', ''],
  ['', '', ''],
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
])
const interest = ref([' ', ' ', ' ', ' ', ' '])
//主修课程名
const mcourse = ref([])
const acourse = ref([])
//当前激活的样式
const activeId = ref()
onMounted(async () => {
  grades.value = await fetchGrades()
  classes.value = await fetchClass()
  await getCourse()
  await getUserData()
  await getClassList()
  await getTimeTable(classlist.value[0].c_id)
  activeId.value = classlist.value[0].c_id
})
//切换当前班级显示列表
const changeClassShow = async (c_id) => {
  timetable.value = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ]
  activeId.value = c_id
  await getTimeTable(c_id)
}
//获得当前班级的课表
const getTimeTable = async (c_id) => {
  try {
    const res1 = await usePostData('http://localhost:3000/timetable')
    let res2 = {}
    for (let c of classlist.value) {
      const res3 = res1.data.find((t) => t.timetable_id == c.timetable_id)
      if (c_id == c.c_id) {
        res2 = res3
      }
    }
    const id = userData.value.sub_id
    console.log(res2, 'res2', id, 'id')
    if (id == '1' || id == '2' || id == '3') {
      const subName = mcourse.value.find((m) => m.mc_id == id).mc_name
      const tag1 = searchCourseTime(res2.day1, id)
      const tag2 = searchCourseTime(res2.day2, id)
      const tag3 = searchCourseTime(res2.day3, id)
      const tag4 = searchCourseTime(res2.day4, id)
      const tag5 = searchCourseTime(res2.day5, id)
      timetable.value[0][tag1] = subName
      timetable.value[1][tag2] = subName
      timetable.value[2][tag3] = subName
      timetable.value[3][tag4] = subName
      timetable.value[4][tag5] = subName
    } else {
      const subName = acourse.value.find((a) => a.ac_id == id).ac_name
      const tag = acourse.value.find((a) => a.ac_id == id).timetable - 1
      interest.value[tag] = subName
    }
  } catch (error) {
    console.log(error)
  }
}
//查询该教师所教授的课程的时间段
const searchCourseTime = (arr, id) => {
  if (arr[0] == id) {
    return 0
  } else if (arr[2] == id) {
    return 1
  } else {
    return 2
  }
}
//获得班级数据
const getClassList = async () => {
  const res1 = await fetchClass()
  const res2 = []
  const res3 = []
  for (let c of res1) {
    res2.push({
      c_id: c.c_id,
      t_ids: c.t_id.split(',')
    })
  }
  //从班级的教师表里面搜索教师，查看教师都教哪些班级
  for (let m of res2) {
    if (m.t_ids.length > 1) {
      for (let n of m.t_ids) {
        if (n == userId) {
          res3.push(m.c_id)
        }
      }
    } else {
      if (m.t_ids[0] == userId) {
        res3.push(m.c_id)
      }
    }
  }
  for (let id of res3) {
    const res4 = res1.find((c) => c.c_id == id)
    classlist.value.push(res4)
  }
}
//拿到改用户的个人信息数
const getUserData = async () => {
  try {
    const res = await usePostData('http://localhost:3000/teacher', { t_id: userId })
    userData.value = res.data[0]
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
  @include bg_style_edit;
  .ul {
    height: 40px;
    position: relative;
    .span {
      position: absolute;
      right: 150px;
      line-height: 40px;
    }
    ul {
      display: flex;
      transform: translateX(30px);
      margin-bottom: 0;
      li {
        line-height: 40px;
        box-sizing: border-box;
        list-style: none;
        text-align: center;
        margin-right: 50px;
        &.active {
          border-bottom: 2px solid $primary;
        }
      }
    }
  }
  .main {
    width: 100%;
    display: flex;
    justify-content: center;
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
  }
}
</style>

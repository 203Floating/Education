<template>
  <div :class="$style.container">
    <div :class="$style.basic">
      <div :class="$style.header">基础信息</div>
      <div :class="$style.main">
        <el-row :class="$style.row">
          <el-col :span="2" :class="$style.title" v-if="isID"> 班级ID：</el-col
          ><el-col :span="5" v-if="isID"
            ><el-input type="text" :class="$style.ipt1" v-model="editData.c_id" />
          </el-col>
          <el-col :span="1" v-if="isID"></el-col>
          <el-col :span="2" :class="$style.title"> 班级名：</el-col
          ><el-col :span="5"
            ><el-input type="text" :class="$style.ipt1" v-model="editData.c_name" />
          </el-col>
          <el-col :span="1"></el-col>
          <el-col :span="2" :class="$style.title">年级：</el-col>
          <el-col :span="5"> <gradesIpt :stue="stue" /></el-col>
        </el-row>

        <el-row :class="$style.row">
          <el-col :span="2" :class="$style.title"> 班级类型：</el-col>
          <el-col :span="5">
            <el-select :class="$style.ipt1" v-model="editData.c_type" placeholder="班级类型">
              <el-option value="0" label="普通班" key="0" />
              <el-option value="1" label="重点班" key="1" />
              <el-option value="2" label="火箭班" key="2" />
            </el-select>
          </el-col>
          <el-col :span="1"></el-col>
          <el-col :span="2" :class="$style.title"> 课程方案：</el-col>
          <el-col :span="5">
            <el-select
              :class="$style.ipt1"
              v-model="editData.timetable_id"
              placeholder="选课可方案（第一天）"
            >
              <el-option value="1" label="语文，数学，外语" key="1" />
              <el-option value="2" label="外语，语文，数学" key="2" />
              <el-option value="3" label="数学，外语，语文" key="3" />
            </el-select>
          </el-col>
        </el-row>
      </div>
    </div>
    <div :class="$style.extra">
      <div :class="$style.header">教学信息</div>
      <div :class="$style.main">
        <el-row :class="$style.row">
          <el-col :span="2" :class="$style.title"> 语文老师：</el-col
          ><el-col :span="5">
            <el-select :class="$style.ipt1" v-model="teachers.chinese" placeholder="姓名">
              <el-option
                v-for="item in chinese"
                :key="item.t_id"
                :label="item.t_name"
                :value="item.t_id"
              />
            </el-select>
          </el-col>
        </el-row>
        <el-row :class="$style.row">
          <el-col :span="2" :class="$style.title"> 数学老师：</el-col
          ><el-col :span="5">
            <el-select :class="$style.ipt1" v-model="teachers.math" placeholder="姓名">
              <el-option
                v-for="item in math"
                :key="item.t_id"
                :label="item.t_name"
                :value="item.t_id"
              />
            </el-select>
          </el-col>
        </el-row>
        <el-row :class="$style.row">
          <el-col :span="2" :class="$style.title"> 外语老师：</el-col
          ><el-col :span="5">
            <el-select :class="$style.ipt1" v-model="teachers.English" placeholder="姓名">
              <el-option
                v-for="item in English"
                :key="item.t_id"
                :label="item.t_name"
                :value="item.t_id"
              />
            </el-select>
          </el-col>
        </el-row>
        <el-row :class="$style.row">
          <el-col :span="2" :class="$style.title"> 班主任：</el-col>
          <el-col :span="5"
            ><el-select :class="$style.ipt1" v-model="editData.c_headmaster" placeholder="姓名">
              <el-option
                :label="item.name"
                v-for="item in header"
                :key="item.id"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>
      </div>
    </div>
    <div>
      <div :class="$style.btn">
        <button :class="$style.btn1" @click="toEdit">确认</button>
        <button :class="$style.btn2" @click="toReset">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, inject, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
//自定义组件
import gradesIpt from '@/components/input/gradeIpt.vue'

import { useCommondata } from '@/stores/common'
const { fetchGrades, fetchCourses, fetchTeachers } = useCommondata()
//导入路由
const route = useRoute()
const router = useRouter()

const isID = ref(false)
const usePostData = inject('$usePostData')
// 课程和年纪信息
const course = ref({})
const grades = ref({})

const teachers = ref({
  chinese: '',
  math: '',
  English: ''
})
//获取全部的语文、数学、外语老师’
const chinese = ref()
const English = ref()
const math = ref()
const header = ref()

//基础信息
const editData = ref({})

const stue = ref({
  g_id: '',
  c_id: '',
  size: false
})
//监听任课老师的改变，动态渲染班主任列表的选择项
watch(
  () => teachers,
  () => {
    if (teachers.value.chinese && teachers.value.math && teachers.value.English) {
      editData.value.c_headmaster = ''
      header.value = [
        {
          id: teachers.value.chinese,
          name:
            (chinese.value || []).find((t) => t.t_id === teachers.value.chinese)?.t_name ||
            'Unknown'
        },
        {
          id: teachers.value.math,
          name: (math.value || []).find((t) => t.t_id === teachers.value.math)?.t_name || 'Unknown'
        },
        {
          id: teachers.value.English,
          name:
            (English.value || []).find((t) => t.t_id === teachers.value.English)?.t_name ||
            'Unknown'
        }
      ]
    }
  },
  { deep: true }
)
onMounted(async () => {
  grades.value = await fetchGrades()
  const res = await fetchCourses()
  course.value.data1 = res.data1
  course.value.data2 = res.data2
  chinese.value = await fetchTeachers(1)
  English.value = await fetchTeachers(2)
  math.value = await fetchTeachers(3)
  if (route.params.id != -1) {
    await usePostData('http://localhost:3000/class', {
      c_id: route.params.id
    }).then((res) => {
      editData.value = res.data.data[0]
      isID.value = false
    })
  } else {
    isID.value = true
  }
})
//确认
const toEdit = async () => {
  try {
    const str = teachers.value.English + ',' + teachers.value.chinese + ',' + teachers.value.math
    editData.value.t_id = str
    editData.value.g_id = stue.value.g_id
    const res = await usePostData('http://localhost:3000/class/edit', editData.value)
    if (res.data.status) {
      router.push({
        name: 'Class'
      })
    }
  } catch (error) {
    console.log(error)
  }
}
//取消
const toReset = () => {
  router.push({
    name: 'Class'
  })
}
</script>
<style module lang="scss">
.container {
  @include edit;
}
</style>

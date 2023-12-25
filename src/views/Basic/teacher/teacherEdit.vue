<template>
  <div :class="$style.container">
    <div :class="$style.basic">
      <div :class="$style.header">基础信息</div>
      <div :class="$style.main">
        <el-row :class="$style.row">
          <el-col :span="2" :class="$style.title"> 姓名：</el-col
          ><el-col :span="5"
            ><el-input type="text" :class="$style.ipt1" v-model="editData.t_name" />
          </el-col>
          <el-col :span="2" :class="$style.title"> 性别：</el-col
          ><el-col :span="5">
            <el-select v-model="editData.t_sex" placeholder="性别" :class="$style.ipt1">
              <el-option label="男" value="0" key="0" />
              <el-option label="女" value="1" key="1" />
            </el-select>
          </el-col>
        </el-row>
        <el-row :class="$style.row">
          <el-col :span="2" :class="$style.title"> 工号：</el-col
          ><el-col :span="5"
            ><el-input type="text" :class="$style.ipt1" v-model="editData.t_id" />
          </el-col>
          <el-col :span="2" :class="$style.title"> 联系方式：</el-col
          ><el-col :span="5"
            ><el-input type="text" :class="$style.ipt1" v-model="editData.t_phone"
          /></el-col>
          <el-col :span="2" :class="$style.title"> 邮箱：</el-col
          ><el-col :span="5"
            ><el-input type="text" :class="$style.ipt1" v-model="editData.t_email"
          /></el-col>
        </el-row>
        <el-row :class="$style.row">
          <el-col :span="2" :class="$style.title"> 民族：</el-col
          ><el-col :span="5"
            ><el-input type="text" :class="$style.ipt1" v-model="editData.t_m"
          /></el-col>
          <el-col :span="2" :class="$style.title"> 生日：</el-col
          ><el-col :span="5">
            <el-date-picker
              :class="$style.ipt1"
              v-model="editData.t_bornDate"
              type="dates"
              placeholder="请选择你的生日"
          /></el-col>
          <el-col :span="2" :class="$style.title"> 任职状态：</el-col
          ><el-col :span="5">
            <el-select :class="$style.ipt1" v-model="editData.t_status" placeholder="任职状态">
              <el-option value="0" label="在职" key="0" />
              <el-option value="1" label="离职" key="1" />
              <el-option value="2" label="请假" key="2" />
            </el-select>
          </el-col>
        </el-row>
        <el-row :class="$style.row">
          <el-col :span="2" :class="$style.title">通信地址：</el-col>
          <linkAge :address="address" />
          <el-col :span="2" :class="$style.title"> 详细地址：</el-col
          ><el-col :span="5"
            ><el-input type="text" :class="$style.ipt1" v-model="detail_address"
          /></el-col>
        </el-row>
        <el-row :class="$style.row">
          <el-col :span="2" :class="$style.title">证件类型：</el-col>
          <el-col :span="5">
            <el-select v-model="editData.t_IDtype" :class="$style.ipt2" placeholder="证件类型">
              <el-option label="身份证" value="身份证" key="1" />
              <el-option label="护照" value="护照" key="2" />
              <el-option label="军官证" value="军官证" key="3" />
              <el-option label="其它" value="其它" key="4" />
            </el-select>
          </el-col>
          <el-col :span="2" :class="$style.title"> 证件号：</el-col
          ><el-col :span="5"
            ><el-input type="text" :class="$style.ipt1" v-model="editData.t_IDnumber"
          /></el-col>
        </el-row>
      </div>
    </div>
    <div :class="$style.extra">
      <div :class="$style.header">教学信息</div>
      <div :class="$style.main">
        <el-row :class="$style.row">
          <el-col :span="2" :class="$style.title"> 任职学校：</el-col
          ><el-col :span="5"><el-input type="text" :class="$style.ipt1" /></el-col>
        </el-row>

        <el-row :class="$style.row">
          <el-col :span="2" :class="$style.title"> 课程：</el-col
          ><el-col :span="5">
            <courseIpt :subject="subject"></courseIpt>
          </el-col>

          <el-col :span="2" :class="$style.title"> 年级：</el-col
          ><el-col :span="5">
            <el-select :class="$style.ipt1" placeholder="年级" v-model="editData.g_id">
              <el-option
                v-for="item in grades"
                :key="item.g_id"
                :label="item.g_name"
                :value="item.g_id"
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
import { onMounted, ref, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
//自定义组件
import linkAge from '@/components/linkage/LinkAge.vue'
import courseIpt from '@/components/input/courseIpt.vue'

import { useCommondata } from '@/stores/common'
const { fetchGrades, fetchCourses } = useCommondata()
//导入路由
const route = useRoute()
const router = useRouter()

const usePostData = inject('$usePostData')
// 课程和年纪信息
const course = ref({})
const grades = ref({})

//基础信息
const editData = ref({})
//详细地址
const address = ref({
  province: '',
  city: '',
  county: '',
  detail: ''
})
const subject = ref({})

const detail_address = ref()
onMounted(async () => {
  grades.value = await fetchGrades()
  const res = await fetchCourses()
  course.value.data1 = res.data1
  course.value.data2 = res.data2
  if (route.params.id!=-1) {
    await usePostData('http://localhost:3000/teacher', {
      t_id: route.params.id,
      t_name: route.params.name,
      t_IDnumber: route.params.IDnumber
    }).then((res) => {
      editData.value = res.data[0]
    })
  }
})
//确认
const toEdit = async () => {
  try {
    editData.value.t_address =
      address.value.province + address.value.city + address.value.county + detail_address.value
      editData.value.sub_id=subject.value.id
    const res = await usePostData('http://localhost:3000/teacher/edit', editData.value)
    if (res.data.status) {
      router.push({
        name: 'Teacher',
      })
    }
  } catch (error) {
    console.log(error)
  }
}
//取消
const toReset = () => {
  router.push({
    name: 'Teacher'
  })
}
</script>
<style module lang="scss">
.container {
  @include edit;
}
</style>

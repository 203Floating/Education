<template>
  <div :class="$style.container">
    <div :class="$style.basic">
      <div :class="$style.header">基础信息</div>
      <div :class="$style.main">
        <el-row :class="$style.row">
          <el-col :span="2" :class="$style.title"> 姓名：</el-col
          ><el-col :span="5"
            ><el-input type="text" :class="$style.ipt1" v-model="editData.stu_name" />
          </el-col>
          <el-col :span="2" :class="$style.title"> 性别：</el-col
          ><el-col :span="5">
            <el-select v-model="editData.stu_sex" placeholder="性别" :class="$style.ipt1">
              <el-option label="男" value="0" key="0" />
              <el-option label="女" value="1" key="1" />
            </el-select>
          </el-col>
        </el-row>
        <el-row :class="$style.row">
          <el-col :span="2" :class="$style.title"> 民族：</el-col
          ><el-col :span="5"
            ><el-input type="text" :class="$style.ipt1" v-model="editData.stu_M"
          /></el-col>
          <el-col :span="2" :class="$style.title"> 生日：</el-col
          ><el-col :span="5">
            <el-date-picker
              :class="$style.ipt1"
              v-model="editData.stu_bornDate"
              type="dates"
              placeholder="请选择你的生日"
          /></el-col>
        </el-row>

        <el-row :class="$style.row">
          <el-col :span="2" :class="$style.title">紧急联系人：</el-col>
          <el-col :span="5">
            <el-input v-model="editData.stu_linkman" :class="$style.ipt1" />
          </el-col>
          <el-col :span="2" :class="$style.title"> 手机号：</el-col
          ><el-col :span="5"
            ><el-input type="text" :class="$style.ipt1" v-model="editData.stu_phone"
          /></el-col>
        </el-row>
        <el-row :class="$style.row">
          <el-col :span="2" :class="$style.title">证件类型：</el-col>
          <el-col :span="5">
            <el-select v-model="editData.stu_IDtype" :class="$style.ipt2" placeholder="证件类型">
              <el-option label="身份证" value="身份证" key="1" />
              <el-option label="护照" value="护照" key="2" />
              <el-option label="军官证" value="军官证" key="3" />
              <el-option label="其它" value="其它" key="4" />
            </el-select>
          </el-col>
          <el-col :span="2" :class="$style.title"> 证件号：</el-col
          ><el-col :span="5"
            ><el-input type="text" :class="$style.ipt1" v-model="editData.stu_IDnumber"
          /></el-col>
        </el-row>

        <el-row :class="$style.row">
          <el-col :span="2" :class="$style.title">通信地址：</el-col>
          <linkAge :address="address" />
          <el-col :span="2" :class="$style.title"> 详细地址：</el-col
          ><el-col :span="5"
            ><el-input type="text" :class="$style.ipt1" v-model="detail_address"
          /></el-col>
        </el-row>
      </div>
    </div>
    <div :class="$style.extra">
      <div :class="$style.header">额外信息</div>
      <div :class="$style.main">
        <el-row :class="$style.row">
          <el-col :span="2" :class="$style.title"> 学号：</el-col
          ><el-col :span="5"
            ><el-input type="text" :class="$style.ipt1" v-model="editData.stu_id" />
          </el-col>
        </el-row>

        <el-row :class="$style.row">
          <el-col :span="2" :class="$style.title"> 年级：</el-col
          ><el-col :span="5">
            <gradesIpt :stue="stue" />
          </el-col>
        </el-row>

        <el-row :class="$style.row">
          <el-col :span="2" :class="$style.title"> 班级：</el-col>
          <el-col :span="5">
            <classIpt :stue="stue" />
          </el-col>
        </el-row>
      </div>
    </div>
    <div>
      <div :class="$style.btn">
        <button :class="$style.btn1" @click="toEdit">确认</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, inject } from 'vue'
import { useAuthorization } from '@/stores/Authorization'
import linkAge from '@/components/linkage/LinkAge.vue'
import gradesIpt from '@/components/input/gradeIpt.vue'
import classIpt from '@/components/input/classIpt.vue'
import { useCommondata } from '@/stores/common'
import { success } from '@/utils/popupUtils'
const { fetchGrades } = useCommondata()
const { getAuthority } = useAuthorization()
const { userId } = getAuthority()
const usePostData = inject('$usePostData')
// 课程和年纪信息
const grades = ref({})

const stue = ref({
  g_id: '',
  c_id: '',
  size: false
})
//基础信息
const editData = ref({})
//详细地址
const address = ref({
  province: '',
  city: '',
  county: '',
  detail: ''
})
const detail_address = ref()
onMounted(async () => {
  grades.value = await fetchGrades()
  if (userId != -1) {
    await usePostData('http://localhost:3000/student', {
      stu_id: userId
    }).then((res) => {
      editData.value = {
        stu_name: res.data[0].stu_name,
        stu_sex: res.data[0].stu_sex,
        stu_M: res.data[0].stu_M,
        stu_IDtype: res.data[0].stu_IDtype,
        stu_IDnumber: res.data[0].stu_IDnumber,
        stu_linkman: res.data[0].stu_linkman,
        stu_phone: res.data[0].stu_phone,
        stu_id: userId
      }
      stue.value.c_id = res.data[0].c_id
      stue.value.g_id = res.data[0].g_id
    })
  }
})
//确认
const toEdit = async () => {
  try {
    editData.value.stu_address =
      address.value.province + address.value.city + address.value.county + detail_address.value
    editData.value.c_id = stue.value.c_id
    editData.value.g_id = stue.value.g_id
    const res = await usePostData('http://localhost:3000/student/edit', editData.value)
    if (res.data.status) {
      success('更新成功')
    }
  } catch (error) {
    console.log(error)
  }
}
</script>
<style module lang="scss">
.container {
  @include edit;
}
</style>

<template>
  <div :class="$style.container">
    <div :class="$style.main">
      <el-row :class="$style.row">
        <el-col :span="6" :class="$style.title">选课任务ID：</el-col>
        <el-col :span="16"
          ><el-input type="text" :class="$style.ipt" v-model.number="editData.cs_id"
        /></el-col>
      </el-row>

      <el-row :class="$style.row">
        <el-col :span="6" :class="$style.title">选课任务名：</el-col>
        <el-col :span="16"
          ><el-input type="text" :class="$style.ipt" v-model="editData.cs_name"
        /></el-col>
      </el-row>

      <el-row :class="$style.row">
        <el-col :span="6" :class="$style.title">年级：</el-col>
        <el-col :span="16"><gradesIpt :stue="stue" /></el-col>
      </el-row>

      <el-row :class="$style.row">
        <el-col :span="6" :class="$style.title">可选班级：</el-col>
        <el-col :span="16">
          <div :class="$style.checkClass">
            <el-checkbox-group v-model="checkList">
              <el-checkbox :label="c.c_id" v-for="c in classList" :key="c.c_id">{{
                c.c_name
              }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </el-col>
      </el-row>
      <el-row :class="$style.row">
        <el-col :span="6" :class="$style.title">任务描述：</el-col>
        <el-col :span="16">
          <el-input type="textarea" :class="$style.texterea" v-model="editData.cs_title" />
        </el-col>
      </el-row>
      <div :class="$style.btn">
        <button :class="$style.btn1" @click="toSave">保存</button>
        <button :class="$style.btn2" @click="toReset">重置</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, inject } from 'vue'
import { useRouter } from 'vue-router'
import gradesIpt from '@/components/input/gradeIpt.vue'
import { useCommondata } from '@/stores/common'
import { warning } from '@/utils/popupUtils'
const { fetchClass } = useCommondata()
const router = useRouter()
const usePostData = inject('$usePostData')
const editData = ref({
  cs_id: '',
  cs_name: '',
  cs_title: ''
})

const toSave = async () => {
  if (checkList.value.length === 0) {
    warning('请至少选择一个班级')
    return
  }
  if (editData.value.cs_id === '') {
    warning('请填写选课任务ID')
    return
  }
  if (editData.value.cs_name === '') {
    warning('请填写选课任务名')
    return
  }
  if (editData.value.cs_title === '') {
    warning('请填写任务描述')
    return
  }
  editData.value.c_ids = checkList.value.join(',')
  editData.value.g_id = stue.value.g_id
  try {
    const res = await usePostData('http://localhost:3000/course/add', editData.value)
    console.log(res)
    if (res.statusText === "OK") {
      router.push({
        name: 'selectStudent',
        params: {
          id: editData.value.cs_id,
        }
      })
    }
  } catch (error) {
    console.log(error)
  }
}
const stue = ref({
  g_id: 1,
  c_id: '',
  size: false
})
//选中的班级列表
const checkList = ref([])
//班级列表
const classList = ref([])
//获取班级列表
onMounted(async () => {
  await getClassList()
})
//获取班级列表
const getClassList = async () => {
  const res = await fetchClass()
  classList.value = res.filter((item) => {
    return item.g_id === stue.value.g_id
  })
  console.log(classList.value, '班级列表')
}
//监听年级改变该年级所属下的班级
watch(
  () => stue,
  () => {
    getClassList()
  },
  { deep: true }
)

const toReset = () => {
  editData.value = ''
}
</script>
<style module lang="scss">
.container {
  .main {
    margin: 0 auto;
    margin-top: 100px;
    width: 450px;
    .row {
      line-height: 30px;
      margin: 30px;
      .title {
        text-align: right;
      }
      .ipt {
        @include ipt1;
      }
      .texterea {
        width: 250px;
        border: 1px solid #ccc;
        border-radius: 5px;
      }
    }
    .btn {
      margin-top: 150px;
      margin-left: 100px;
      .btn1 {
        @include button-Tools();
      }
      .btn2 {
        @include button-Tools($bgc, $primary);
      }
    }
  }
}
</style>

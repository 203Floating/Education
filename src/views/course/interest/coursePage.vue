<template>
  <div :class="$style.container">
    <div :class="$style.tools">
      <el-row :class="$style.row">
        <el-col :span="2" :class="$style.title">课程ID：</el-col>
        <el-col :span="4"
          ><el-input type="text" :class="$style.ipt" v-model="course.ac_id"
        /></el-col>
        <el-col :span="2" :class="$style.title">课程名：</el-col>
        <el-col :span="4"
          ><el-input type="text" :class="$style.ipt" v-model="course.ac_name"
        /></el-col>
        <el-col :span="2" :class="$style.title">开设年级：</el-col>
        <el-col :span="4">
          <gradesIpt :stue="stue" />
        </el-col>
        <el-col :span="2" :class="$style.title">开课时间：</el-col>
        <el-col :span="4">
          <el-select v-model="course.timetable
          " :class="$style.ipt" placeholder="星期">
            <el-option label="星期一" value="1" key="1" />
            <el-option label="星期二" value="2" key="2" />
            <el-option label="星期三" value="3" key="3" />
            <el-option label="星期四" value="4" key="4" />
            <el-option label="星期五" value="5" key="5" /> </el-select
        ></el-col>
      </el-row>
      <hr />
      <div :class="$style.btn">
        <button :class="$style.btn1" @click="toAdd">添加课程</button>
        <button :class="$style.btn2" @click="toReset">重置</button>
      </div>
    </div>
    <div :class="$style.main">
      <div :class="$style.aside">
        <el-menu active-text-color="#3952fd" :default-active="current_t" :class="$style.menu">
          <el-menu-item index="0" disabled>
            <span>兴趣课程</span>
          </el-menu-item>

          <el-menu-item
            @click="handleCurrentChange"
            v-for="item in interest"
            :key="item.ac_id"
            :index="item.ac_id"
            :class="$style.menu_item"
          >
            <span>{{ item.ac_name }}</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div :class="$style.table">
        <div :class="$style.head">
          <div :class="$style.title">教师</div>
          <div :class="$style.delete">
            <!-- 弹出确认框 -->
            <el-popover :visible="visible" placement="top" :width="160">
              <p>确认要删除该课程？</p>
              <div style="text-align: center; margin: 0">
                <el-button size="small" text @click="visible = false">取消</el-button>
                <el-button size="small" type="primary" @click="toDelete"> 确定</el-button>
              </div>
              <template #reference>
                <el-button link @click="visible = true">
                  <el-icon :class="$style.delete_btn"><CloseBold /></el-icon
                ></el-button>
              </template>
            </el-popover>
          </div>
        </div>

        <div :class="$style.h_main">
          <div :class="$style.title">
            <div :class="$style.box">姓名</div>
            <div :class="$style.box">联系方式</div>
            <div :class="$style.box">开设年级</div>
            <div :class="$style.box">学制</div>
          </div>
          <div v-if="tlen">
            <div :class="$style.content" v-for="item in teachers" :key="item.t_id">
              <div :class="$style.box">{{ item.t_name }}</div>
              <div :class="$style.box">{{ item.t_phone }}</div>
              <div :class="$style.box">{{ item.g_name }}</div>
              <div :class="$style.box">1</div>
            </div>
          </div>
          <div v-else>
            <div :class="$style.none">NO DATA</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, inject } from 'vue'
import { useCommondata } from '@/stores/common'
import { CloseBold } from '@element-plus/icons-vue'
const { fetchGrades, fetchTeachers } = useCommondata()
import gradesIpt from '@/components/input/gradeIpt.vue'
//注入工具函数

const usePostData = inject('$usePostData')
const useDeleteData = inject('$useDeleteData')
const success = inject('$success')
const warning = inject('$warning')
//年级
const stue = ref({
  g_id: '',
  c_id: '',
  size: true
})

const visible = ref(false)
//接受兴趣课程的信息
const course = ref({})
//教师信息的长度
const tlen = ref()
//获取教师相应的所在的年级
const grades = ref()
//获取当前课程下的教师数据
const teachers = ref()
//兴趣课程
const interest = ref()
//当前显示的教师
const current = ref()
// 初始化
onMounted(async () => {
  grades.value = await fetchGrades()
  await getInterest()
})
//课程改变时触发
const handleCurrentChange = (c) => {
  current.value = c.index
  handleTeachers()
}
//获得兴趣课程列表
const getInterest = async (index) => {
  try {
    const res = await usePostData('http://localhost:3000/assistclass', [])
    interest.value = res.data.data
    if (index) {
      current.value = index
    } else {
      current.value = interest.value[0].ac_id
    }

    await handleTeachers()
  } catch (error) {
    console.log(error)
  }
}
//切换到当前兴趣下的老师
const handleTeachers = async () => {
  const res = await fetchTeachers(current.value)
  teachers.value = res.map((item) => {
    return {
      ...item,
      g_name: grades.value.find((g) => g.g_id == item.g_id).g_name || 'unknowm'
    }
  })
  tlen.value = res.length > 0 ? true : false
}

//添加兴趣选修课程
const toAdd = async () => {
  course.value.g_id = stue.value.g_id
  course.value.sub_year = 1
  course.value.ac_status = true
  try {
    const res = await usePostData('http://localhost:3000/assistclass/add', course.value)
    console.log(res)
    if (res.data.status) {
      success('添加成功')
      await getInterest()
    }
    toReset()
  } catch (error) {
    console.log(error)
  }
}
//删除兴趣课程
const toDelete = async () => {
  visible.value = false
  if (teachers.value.length != 0) {
    warning('别砸老师饭碗')
  } else {
    try {
      const res = await useDeleteData('http://localhost:3000/assistclass/delete', {
        ac_id: current.value
      })
      if (res.data.status) {
        success('删除成功')
        getInterest(current.value)
      }
    } catch (error) {
      console.log(error)
    }
  }
}
//重置
const toReset = () => {
  course.value = {
    timetable: '',
    ac_id: '',
    ac_name: ''
  }
  stue.value = {
    g_id: '',
    size: true
  }
}
</script>
<style module lang="scss">
.container {
  @include grade_interest;
}
</style>

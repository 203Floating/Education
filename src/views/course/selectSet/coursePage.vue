<template>
  <div :class="$style.container">
    <div :class="$style.tools">
      <el-row :class="$style.row">
        <el-col :span="2" :class="$style.title">选课名称：</el-col>
        <el-col :span="4"
          ><el-input type="text" :class="$style.ipt" v-model="searchipt.cs_name"
        /></el-col>

        <el-col :span="2" :class="$style.title">状态：</el-col>
        <el-col :span="4"
          ><el-select v-model="searchipt.cs_status" :class="$style.ipt" placeholder="选课状态">
            <el-option label="未开始" value="0" key="0" />
            <el-option label="进行中" value="1" key="1" />
            <el-option label="已完成" value="2" key="2" />
          </el-select>
        </el-col>
      </el-row>
      <hr />
      <div :class="$style.btn">
        <button :class="$style.btn1" @click="toSearch">查询</button>
        <button :class="$style.btn2" @click="toReset">重置</button>
      </div>
    </div>
    <div :class="$style.main">
      <div :class="$style.header">
        <el-button link @click="toAdd">
          <el-icon size="20"><CirclePlus /></el-icon>
        </el-button>
      </div>
      <el-table :data="tasklist" border :class="$style.table">
        <el-table-column type="index" label="序号" width="80" />
        <el-table-column prop="cs_name" label="选课任务名" width="150" />
        <el-table-column prop="cs_class" label="选课对象" width="200" />
        <el-table-column prop="cs_grade" label="选课年级" width="100" />
        <el-table-column prop="cs_max" label="MAX" />
        <el-table-column prop="cs_min" label="MIN" />
        <el-table-column prop="cs_statusName" label="状态"/>
        <el-table-column prop="cs_Date" label="选课日期" width="120" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button link @click="toEdit(scope.row.cs_id)">编辑</el-button>
            <el-button link @click="toDelete(scope.row.cs_id)">删除</el-button>
            <el-button link @click="toCheckStatus(scope.row.cs_id,'1')" v-if="scope.row.cs_status == 0">发布</el-button>
            <el-button link @click="toCheckStatus(scope.row.cs_id,'2')"  v-if="scope.row.cs_status == 1">完成任务</el-button>

          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :page-size="10"
        :pager-count="5"
        layout="prev, pager, next"
        :total="page.total"
        :current-page="page.current"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, inject } from 'vue'
import { useCommondata } from '@/stores/common'
import { useRouter } from 'vue-router'
import { CirclePlus } from '@element-plus/icons-vue'
const router = useRouter()

const { fetchGrades, fetchClass, fetchCourses } = useCommondata()
//注入工具函数
const success = inject('$success')
const err = inject('$err')
const usePostData = inject('$usePostData')
const useDeleteData = inject('$useDeleteData')

//年级数据
const grades = ref()
//班级数据
const classes = ref()
//课程数据
const course = ref()
//拿到输入框的数据
const searchipt = ref({})
//选课任务列表
const tasklist = ref()

const page = ref({})

// 初始化
onMounted(async () => {
  grades.value = await fetchGrades()
  classes.value = await fetchClass()
  course.value = await fetchCourses()
  await render()
})

//渲染
const render = async (params = {}) => {
  try {
    const res = await usePostData('http://localhost:3000/course', params)
    tasklist.value = res.data.map((item) => {
      return {
        ...item,
        cs_class: classChange(item.c_ids),
        cs_grade: grades.value.find((g) => g.g_id == item.g_id).g_name || 'Unknown',
        cs_statusName:
          item.cs_status == '0' ? '未开始' : item.cs_status == '1' ? '进行中' : '已结束',
        cs_Date: item.cs_date.split('T')[0]
      }
    })
    if (res.data.length != 0) {
      page.value.total = res.data[0].total
    } else {
      page.value.total = 0
    }
  } catch (error) {
    console.log(error)
  }
}
//发布任务
const toCheckStatus = async(id,status) => {
  try {
    const res = await usePostData('http://localhost:3000/course/updateStatus',{
      cs_status: status,
      cs_id: id
    })
    if (res.data.status) {
      success('修改成功')
    } else {
      err('操作失败')
    }
  } catch (error) {
    console.log(error)
  }
  render()
}
//班级处理
const classChange = (str) => {
  // 添加检查确保 str 不为 null 或 undefined
  if (str === null || str === undefined) {
    console.error('Input string is null or undefined')
    return
  }
  // 否则，执行原先的逻辑
  const strs = str.split(',').map((item) => {
    return classes.value.find((c) => c.c_id == item)?.c_name || 'unknown'
  })
  return strs.join(',')
}
//分页切换
const handleCurrentChange = (num) => {
  page.value.current = num
  const obj = {
    offset: num - 1
  }
  if (searchipt.value.cs_name) {
    obj.cs_name = searchipt.value.cs_name
  }
  if (searchipt.value.cs_status) {
    obj.cs_status = searchipt.value.cs_status
  }

  render(obj)
}
//查询
const toSearch = () => {
  if (searchipt.value.cs_status == '' && searchipt.value.cs_name == '') {
    render()
  } else {
    render(searchipt.value)
  }
  success('查询成功')
}

//编辑
const toEdit = (id) => {
  router.push({
    name: 'selectStudent',
    params: {
      id: id
    }
  })
}
//添加
const toAdd = () => {
  router.push({
    name: 'selectPage',
  })
}
//删除
const toDelete = async (id) => {
  try {
    const res = await useDeleteData('http://localhost:3000/course/delete', { cs_id: id })
    console.log(res);
    render()
    success('删除成功')
  } catch (error) {
    console.log(error)
    err('删除失败')
  }
}
//重置
const toReset = () => {
  searchipt.value = {
    cs_name: '',
    cs_status: ''
  }
  render()
}
</script>
<style module lang="scss">
.container {
  @include table;
}
</style>

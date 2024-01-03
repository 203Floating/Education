<template>
  <div :class="$style.container">
    <div :class="$style.tools">
      <el-button link @click="dialogVisible = true" :class="$style.add_btn">
        <el-icon size="16" :class="$style.icon_add"><CirclePlus /></el-icon>&nbsp;添加学生
      </el-button>
      <el-button link :class="$style.add_btn">
        <el-icon size="16" :class="$style.icon_add"><Delete /></el-icon>&nbsp;批量删除</el-button
      >
      <el-button link :class="$style.add_btn">
        <el-icon size="16" :class="$style.icon_add"><Delete /></el-icon>&nbsp;全部删除</el-button
      >
      <div :class="$style.searchIpt">
        <input
          placeholder="请输入姓名查找学生"
          v-model="searchIpt"
          clearable
          :class="$style.ipt"
          @blur="toSearch"
        />
      </div>
    </div>
    <div :class="$style.class">{{ task.c_names }}</div>
    <div :class="$style.main">
      <div :class="$style.header">
        <el-button link
          ><el-icon size="15"><FolderAdd /></el-icon>
        </el-button>
      </div>
      <el-table
        ref="studentlist"
        :data="students"
        border
        :class="$style.table"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" width="50" />
        <el-table-column prop="stu_name" label="姓名" />
        <el-table-column prop="stu_id" label="学号" />
        <el-table-column prop="stu_sex" label="性别" />
        <el-table-column prop="stu_IDtype" label="证件类型" />
        <el-table-column prop="stu_IDnumber" label="证件号码" width="200" />
        <el-table-column prop="c_name" label="班级" />
        <el-table-column prop="g_name" label="年级" />
      </el-table>
      <div :class="$style.bottom">
        <div :class="$style.btn">
          <button :class="$style.btn1" @click="toSave">保存</button>
          <button :class="$style.btn2" @click="toReset">清空</button>
        </div>
        <el-pagination
          :class="$style.pagination"
          :page-size="10"
          :pager-count="5"
          layout="prev, pager, next"
          :total="page.total"
          :current-page="page.current"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, inject } from 'vue'
import { useRoute } from 'vue-router'
import { CirclePlus, Delete } from '@element-plus/icons-vue'
import { useCommondata } from '@/stores/common'
import router from '@/router'

const searchIpt = ref('')
const { fetchClass, fetchGrades } = useCommondata()
//拿到通用函数
const usePostData = inject('$usePostData')
const warning = inject('$warning')
const success = inject('$success')
const route = useRoute()
//拿到可以选择该任务的班级
const classes = ref()
//班级所属下的学生信息
const students = ref([])
//年级信息
const grades = ref()
//分页
const page = ref({})
//当前任务的详情
const task = ref({
  c_names: ''
})
//表格选择的学生数据
const studentlist = ref([])

//保存当前编辑的任务的id
const cs_id = route.params.id
onMounted(async () => {
  classes.value = await fetchClass()
  grades.value = await fetchGrades()

  await usePostData('http://localhost:3000/course', {
    cs_id: cs_id
  })
    .then(async (res) => {
      task.value = {
        ...res.data[0],
        c_names: changeClass(res.data[0].c_ids, classes)
      }
    })
    .catch((err) => {
      console.log(err)
    })
  await promiseStudents1()
})
//将数组实例化为promise
const promiseStudents1 = async () => {
  students.value = []
  const savePromises = task.value.c_ids.split(',').map(async (item) => {
    await getStudents({
      c_id: item
    })
  })
  await Promise.all(savePromises)
}
const promiseStudents2 = async (stu_name) => {
  students.value = []
  const savePromises = task.value.c_ids.split(',').map(async (item) => {
    await getStudents({
      c_id: item,
      stu_name: stu_name
    })
  })
  await Promise.all(savePromises)
}
//渲染
const getStudents = async (params = {}) => {
  try {
    const res = await usePostData('http://localhost:3000/student', params)

    const data = res.data.map((item) => {
      return {
        ...item,
        stu_sex: item.stu_sex === '0' ? '男' : '女',
        g_name: grades.value.find((grade) => grade.g_id === item.g_id)?.g_name || 'Unknown',
        c_name: classes.value.find((c) => c.c_id === item.c_id)?.c_name || 'Unknown'
      }
    })
    if (students.value.length == 0) {
      students.value = data
    } else {
      students.value = [...students.value, ...data]
    }

    if (res.data.length != 0) {
      page.value.total = res.data[0].total
    } else {
      page.value.total = 0
    }
  } catch (error) {
    console.log(error)
  }
}
// 表格选项改变
const handleSelectionChange = (val) => {
  studentlist.value = val
}
//分页切换
const handleCurrentChange = (num) => {
  page.value.current = num
  const obj = {
    offset: num - 1
  }
  getStudents(obj)
}
//查询
const toSearch = async () => {
  if (searchIpt.value) {
    await promiseStudents2(searchIpt.value)
  } else {
    await promiseStudents1()
  }
  success('查询成功')
  searchIpt.value = ''
}
//转换
const changeClass = (str, course) => {
  // 添加检查确保 str 不为 null 或 undefined
  if (str === null || str === undefined) {
    console.error('Input string is null or undefined')
    return
  }
  // 否则，执行原先的逻辑
  const strs = str.split(',').map((item) => {
    return course.value.find((c) => c.c_id == item)?.c_name || 'unknown'
  })
  return strs.join(',')
}
//保存
const toSave = () => {
  let tag = true
  if (studentlist.value.length) {
    const savePromises = studentlist.value.map(async (item) => {
      const res = await usePostData('http://localhost:3000/student/update', {
        task_id: task.value.cs_id,
        stu_id: item.stu_id
      })
      if (!res.data.status) {
        tag = false
      }
    })
    Promise.all(savePromises)
    if (tag) {
      router.push({

        name: 'selectSet',

        params: {
          id: task.value.cs_id
        }
      })
    }
  } else {
    warning('请选择学生')
  }
}
//清空选择
const toReset = () => {
  promiseStudents1()
}
</script>
<style module lang="scss">
.container {
  .tools {
    margin: 10px;
    margin-left: 0;
    margin-top: 0;
    color: $primary;
    .add_btn {
      padding: 5px;
      color: $primary;
      font-weight: 600;
      font-size: 12px;
    }
    .searchIpt {
      float: right;
      .ipt {
        box-sizing: border-box;
        padding-left: 15px;
        font-size: 12px;
        width: 250px;
        height: 30px;
        border: 1px solid #dcdfe6;
        border-radius: 20px;
        outline: none;
      }
    }
  }
  .class {
    margin-bottom: 10px;
    padding: 10px;
    width: 600px;
    background-color: #eaf8ff;
  }
}
.main {
  @include bg_style_table;
  margin: 0;
  padding: 0;
  border-radius: 10px;
  .bottom {
    margin-top: 20px;
    .btn {
      display: inline-block;
      .btn1 {
        @include button-Tools();
      }
      .btn2 {
        @include button-Tools($bgc, $primary);
      }
    }
    .pagination {
      float: right;
      margin-right: 200px;
    }
  }

  .table {
    border-radius: 10px;
    margin-bottom: 10px;
  }
  .header {
    box-sizing: border-box;
    float: right;
    padding-right: 20px;
    margin-bottom: 10px;
  }
}
</style>

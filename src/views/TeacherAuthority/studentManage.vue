<template>
  <div :class="$style.container">
    <ul :class="$style.ul">
      <li
        v-for="c in classlist"
        :key="c.c_id"
        :class="{ [$style.active]: activeId == c.c_id }"
        @click="() => changeClassShow(c.c_id)"
      >
        <el-button link> {{ c.c_name }}</el-button>
      </li>
    </ul>
    <div :class="$style.main">
      <div :class="$style.header">
        <el-button link @click="toAdd"
          ><el-icon size="15"><FolderAdd /></el-icon>
        </el-button>
      </div>
      <el-table :data="studentData" border :class="$style.table">
        <el-table-column prop="stu_name" label="姓名" />
        <el-table-column prop="stu_id" label="学号" />
        <el-table-column prop="stu_sex" label="性别" />
        <el-table-column prop="stu_IDtype" label="证件类型" />
        <el-table-column prop="stu_IDnumber" label="证件号码" width="200" />
        <el-table-column prop="c_name" label="班级" />
        <el-table-column prop="g_name" label="年级" />
        <!-- <el-table-column prop="stu_bornDate" label="出生日期" /> -->
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button link @click="toEdit(scope.row.stu_id)">修正</el-button>
            <el-button link @click="toDelete(scope.row.stu_id)">开除</el-button>
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
import { useRouter } from 'vue-router'
import { useCommondata } from '@/stores/common'
import { useAuthorization } from '@/stores/Authorization'
const router = useRouter()
const { fetchClass, fetchGrades } = useCommondata()
const { getAuthority } = useAuthorization()
//拿到当前教师用户的id
const { userId } = getAuthority()
const usePostData = inject('$usePostData')
const useDeleteData = inject('$useDeleteData')
const grades = ref([])
const classes = ref([])
//班级数据
const classlist = ref([])
const studentData = ref([])
//分页
const page = ref({})
//当前激活的样式
const activeId = ref()
onMounted(async () => {
  grades.value = await fetchGrades()
  classes.value = await fetchClass()
  await getClassList()
  await changeClassShow(classlist.value[0].c_id)
  activeId.value = classlist.value[0].c_id
  console.log(classlist.value, 'courselist')
})

//改变当前显示的班级的学生表
const changeClassShow = async (c_id, num) => {
  activeId.value = c_id
  try {
    let params = {}
    if (num) {
      params = {
        offset: num,
        c_id: c_id
      }
    } else {
      params = {
        c_id: c_id
      }
    }
    const res = await usePostData('http://localhost:3000/student', params)
    studentData.value = res.data.map((item) => {
      return {
        ...item,
        stu_sex: item.stu_sex === '0' ? '男' : '女',
        g_name: grades.value.find((grade) => grade.g_id === item.g_id)?.g_name || 'Unknown',
        c_name: classes.value.find((c) => c.c_id === item.c_id)?.c_name || 'Unknown'
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
//分页切换
const handleCurrentChange = (num) => {
  page.value.current = num
  changeClassShow(classlist.value[0].c_id, num - 1)
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
//编辑学生信息
const toEdit = (id) => {
  router.push({
    name: 'StudentEdit',
    params: {
      id
    }
  })
}
//删除
const toDelete = async (id) => {
  try {
    await useDeleteData('http://localhost:3000/student/delete', { stu_id: id })
    changeClassShow(activeId.value)
  } catch (error) {
    console.log(error)
  }
}
</script>
<style module lang="scss">
.container {
  @include bg_style_edit;
  ul {
    display: flex;
    transform: translateX(-50px);
    margin-bottom: 0;
    li {
      box-sizing: border-box;
      list-style: none;
      margin: 10px;
      padding: 5px;
      text-align: center;

      &.active {
        border-bottom: 2px solid $primary;
      }
    }
  }
}
</style>

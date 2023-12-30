<template>
  <div :class="$style.container">
    <div :class="$style.header">
      <el-button link @click="dialogVisible = true" :class="$style.add_btn">
        <el-icon size="20" :class="$style.icon_add"><CirclePlus /></el-icon>&nbsp;创建互斥课程
      </el-button>
      <el-button link :class="$style.add_btn">
        <el-icon size="20" :class="$style.icon_add"><Delete /></el-icon>&nbsp;批量删除</el-button
      >
    </div>
    <div :class="$style.title">互斥课程</div>
    <el-checkbox-group v-model="checkSub" :min="1" :max="2" :class="$style.checkboxgroup">
      <el-checkbox
        v-for="sub in subs"
        :key="sub.c_ids"
        :label="sub.c_ids"
        :class="$style.checkbox"
        >{{ sub.c_names }}</el-checkbox
      >
      <el-checkbox
        v-for="item in linkcourse"
        :key="item.c_ids"
        :label="item.c_ids"
        :class="$style.checkbox"
        >{{ item.c_names }}</el-checkbox
      >
    </el-checkbox-group>
    <div :class="$style.btn">
      <button @click="toSaveCourse">保存</button>
    </div>

    <el-dialog v-model="dialogVisible" title="添加互斥课程" :class="$style.dialog">
      <div :class="$style.dialog_main">
        <div :class="$style.dialog_left">
          <el-radio-group v-model="sub_id.left">
            <el-radio
              :label="c.ac_id"
              v-for="c in course"
              :key="c.ac_id"
              :value="c.ac_id"
              :class="$style.radio"
              >{{ c.ac_name }}</el-radio
            >
          </el-radio-group>
        </div>
        <div :class="$style.dialog_right">
          <el-radio-group v-model="sub_id.right">
            <el-radio
              :label="c.ac_id"
              v-for="c in course"
              :key="c.ac_id"
              :value="c.ac_id"
              :class="$style.radio"
              >{{ c.ac_name }}
            </el-radio>
          </el-radio-group>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer" :class="$style.dialog_footer">
          <button :class="$style.btn2" @click="dialogVisible = false">取消</button>
          <button :class="$style.btn1" @click="toSave">确认</button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { CirclePlus, Delete } from '@element-plus/icons-vue'
import { useRoute,useRouter } from 'vue-router'
import { ref, onMounted, inject } from 'vue'
import { useCommondata } from '@/stores/common'
import { useGetData, usePostData, useDeleteData } from '@/utils/asyncAxios'

const router = useRouter()
const route = useRoute()
//从路由中拿到任务id
const id = route.params.id
const { fetchCourses } = useCommondata()
//注入工具函数
const warning = inject('$warning')
const success = inject('$success')
const changeCourse = inject('$changeCourse')
const findSub = inject('$findSub')
//课程数据
const course = ref()
//选择的课程
const checkSub = ref()
const subs = ref([])
//获取互斥课程数据
const linkcourse = ref()
//弹出框
const dialogVisible = ref(false)
//获取所有课程数据
//接受选择的课程id
const sub_id = ref({
  left: '',
  right: ''
})
onMounted(async () => {
  const res = await fetchCourses()
  course.value = res.data2
  await render()
})
const render = async () => {
  try {
    const res = await useGetData('http://localhost:3000/course/banlink', {
      cs_id: id
    })
    linkcourse.value = res.data.map((item) => {
      return {
        c_ids: item.c_ids,
        c_names: changeCourse(item.c_ids, course)
      }
    })
  } catch (error) {
    console.log(error)
  }
}
//保存
const toSaveCourse = async () => {
  try {
    // 先清空该任务的所有连选设置，然后再重新设置
    const deleteRes = await useDeleteData('http://localhost:3000/course/banlink/delete', {
      cs_id: id
    })

    if (deleteRes.data.status) {
      const savePromises = checkSub.value.map(async (item) => {
        await usePostData('http://localhost:3000/course/banlink', {
          cs_id: id,
          c_ids: item
        })
      })
      await Promise.all(savePromises)
      success('保存成功')
      render()
      // subs.value = []
      // checkSub.value = []
      // sub_id.value.left = ''
      // sub_id.value.right = ''
      router.push({
        name: 'connect',
        params: {
          id:id
        }
      })
    }
  } catch (error) {
    console.log(error)
  }
}
//弹出框弹出保存
const toSave = () => {
  if (!sub_id.value.left || !sub_id.value.right) {
    warning('请选择两门课程')
    return
  } else {
    if (sub_id.value.left == sub_id.value.right) {
      warning('不能选择同一门课程')
    } else {
      dialogVisible.value = false
      const sub_id1 = sub_id.value.left + ',' + sub_id.value.right
      const sub_id2 = sub_id.value.right + ',' + sub_id.value.left
      if (subs.value.length == 0 && linkcourse.value.length == 0) {
        subs.value.push({
          c_ids: sub_id1,
          c_names: changeCourse(sub_id1, course)
        })
        success('选择成功')
      } else {
        if (findSub(sub_id1, sub_id2, subs) && findSub(sub_id1, sub_id2, linkcourse)) {
          subs.value.push({
            c_ids: sub_id1,
            c_names: changeCourse(sub_id1, course)
          })
          success('选择成功')
        } else {
          warning('已存在该互斥课程')
        }
      }
    }
  }
}
</script>
<style module lang="scss">
@include course_setting;
@include course_setting_dialog1;
</style>

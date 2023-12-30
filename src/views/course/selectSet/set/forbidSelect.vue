<template>
  <div :class="$style.container">
    <div :class="$style.header">
      <el-button link @click="dialogVisible = true" :class="$style.add_btn">
        <el-icon size="20" :class="$style.icon_add"><CirclePlus /></el-icon>&nbsp;创建禁选课程
      </el-button>
      <el-button link :class="$style.add_btn">
        <el-icon size="20" :class="$style.icon_add"><Delete /></el-icon>&nbsp;批量删除</el-button
      >
    </div>
    <div :class="$style.title">禁选课程</div>
    <el-checkbox-group v-model="checkSub" :min="1" :max="5" :class="$style.checkboxgroup">
      <el-checkbox v-for="sub in subs" :key="sub.c_id" :label="sub.c_id" :class="$style.checkbox">{{
        sub.c_names
      }}</el-checkbox>
      <el-checkbox
        v-for="item in linkcourse"
        :key="item.c_id"
        :label="item.c_id"
        :class="$style.checkbox"
        >{{ item.c_names }}</el-checkbox
      >
    </el-checkbox-group>
    <div :class="$style.btn">
      <button @click="toSaveCourse">保存</button>
    </div>

    <el-dialog v-model="dialogVisible" title="添加禁选课程" :class="$style.dialog">
      <div :class="$style.dialog_main">
        <el-radio-group v-model="sub_id">
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
import { ref, onMounted, inject } from 'vue'
import { useCommondata } from '@/stores/common'
import { useGetData, usePostData, useDeleteData } from '@/utils/asyncAxios'
import { useRoute} from 'vue-router'
const route = useRoute()
const id =route.params.id
const { fetchCourses } = useCommondata()
//注入工具函数
const warning = inject('$warning')
const success = inject('$success')
//课程数据
const course = ref()
//选择的课程
const subs = ref([])
//获取禁选课程数据
const linkcourse = ref()
//弹出框
const dialogVisible = ref(false)
//获取所有课程数据
const checkSub = ref()
//接受选择的课程id
const sub_id = ref()
onMounted(async () => {
  const res = await fetchCourses()
  course.value = res.data2
  await render()
})
const render = async () => {
  try {
    const res = await useGetData('http://localhost:3000/course/ban', {
      cs_id:id
    })
    linkcourse.value = res.data.map((item) => {
      return {
        c_id: item.c_id,
        c_names: changeCourse(item.c_id, course)
      }
    })
  } catch (error) {
    console.log(error)
  }
}
//保存
const toSaveCourse = async () => {
  try {
    //先清空该任务的所有禁选设置，然后再重新设置
    const res = await useDeleteData('http://localhost:3000/course/ban/delete', {
      cs_id: id
    })
    if (res.data.status) {
      const savePromises = checkSub.value.map(async (item) => {
        await usePostData('http://localhost:3000/course/ban', {
          cs_id: id,
          c_ids: item
        })
      })
      await Promise.all(savePromises)
      success('保存成功')
      sub_id.value = ''
      checkSub.value = []
      subs.value = []
      render()
    }
  } catch (error) {
    console.log(error)
  }
}
//弹出框弹出保存
const toSave = () => {
  if (!sub_id.value) {
    warning('请选择课程')
    return
  } else {
    dialogVisible.value = false
    if (subs.value.length === 0 && linkcourse.value.length === 0) {
      subs.value.push({
        c_id: sub_id.value,
        c_names: changeCourse(sub_id.value, course)
      })
      success('选择成功')
    } else {
      if (findSub(sub_id.value, subs) && findSub(sub_id.value, linkcourse)) {
        subs.value.push({
          c_id: sub_id.value, // 已更正为 "c_id"
          c_names: changeCourse(sub_id.value, course)
        })
        success('选择成功')
      } else {
        warning('已存在该连选课程')
      }
    }
  }
}
//查找
const findSub = (id, arr) => {
  return !arr.value.some((item) => item.c_id == id)
}
const changeCourse = (item, course) => {
  return course.value.find((c) => c.ac_id == item)?.ac_name || 'unknown'
}
</script>
<style module lang="scss">
@include course_setting;
@include course_setting_dialog2;
</style>

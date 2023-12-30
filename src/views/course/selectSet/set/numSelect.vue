<template>
  <div :class="$style.container">
    <div :class="$style.header">
      本次最少选<el-input
        type="text"
        :class="$style.iptnum"
        v-model.number="setting.cs_min"
      />门课程，最多选<el-input
        type="text"
        :class="$style.iptnum"
        v-model.number="setting.cs_max"
      />门课程。
    </div>
    <div :class="$style.content">
      <div :class="$style.title">
        本次最多开放<el-input
          type="text"
          :class="$style.iptnum"
          v-model.number="setting.max"
        />门课程，最少开放<el-input
          type="text"
          :class="$style.iptnum"
          v-model.number="setting.min"
        />门课程。
      </div>
      <hr :class="$style.hr" />
      <div :class="$style.courselist">
        <ul>
          <li v-for="course in courselist" :key="course.sub_id">{{ course.sub_name }}</li>
        </ul>
      </div>
      <div :class="$style.addsub">
        <el-button link @click="toAdd" :class="$style.add_btn">
          <el-icon size="20" :class="$style.icon_add"><CirclePlus /></el-icon>&nbsp;&nbsp;添加课程
        </el-button>
      </div>
    </div>
    <div :class="$style.btn">
      <button @click="saveSet">保存</button>
    </div>
    <!-- 弹出框 -->

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
import { CirclePlus } from '@element-plus/icons-vue'
import { useRoute,useRouter } from 'vue-router'
import { ref, onMounted, inject } from 'vue'
import { useCommondata } from '@/stores/common'
import { warning } from '@/utils/popupUtils'
import { usePostData } from '@/utils/asyncAxios'

const { fetchCourses } = useCommondata()
const route = useRoute()
const router = useRouter()
//注入工具函数
const success = inject('$success')
//课程做多最少设置
const setting = ref({
  cs_max: 1,
  cs_min: 1,
  max: 1,
  min: 1
})
//课程数据
const course = ref()
//保存选择的课程列表
const courselist = ref([])
const dialogVisible = ref(false)
//接受选择的课程id
const sub_id = ref({})
onMounted(async () => {
  const res = await fetchCourses()
  course.value = res.data2
})
const cs_id = route.params.id
//修改选课任务设置
const saveSet = async () => {
  if (courselist.value.length < setting.value.min) {
    warning('选择的课程不够')
    return
  } else {
    if (setting.value.cs_max < setting.value.cs_min) {
      warning('最多选课程不能小于最少选课程')
      return
    } else {
      if (setting.value.cs_min === 0) {
        warning('最少选课数不能为0')
        return
      } else {
        let str = ''
        courselist.value.forEach((item) => {
          if (str != '') {
            str += ','
          }
          str += item.sub_id
        })
        if ((await postCourse(str)) && (await postNum())) {
          success('修改成功')
          router.push({
            name: 'mutual',
            params: {
              id: cs_id
            }
          })
        }
      }
    }
    console.log(courselist.value)
  }
}
//添加任务的可选课程列表
const postCourse = async (str) => {
  try {
    const res = await usePostData('http://localhost:3000/course/updateSubs', {
      sub_ids: str,
      cs_id: cs_id
    })
    return res.data.status
  } catch (error) {
    console.log(error)
  }
}
//修改最大和最小选课
const postNum = async () => {
  try {
    const res = await usePostData('http://localhost:3000/course/updateNum', {
      cs_max: setting.value.cs_max,
      cs_min: setting.value.cs_min,
      cs_id: cs_id
    })
    return res.data.status
  } catch (error) {
    console.log(error)
  }
}
//弹出框弹出保存
const toSave = () => {
  if (!courselist.value.length) {
    courselist.value.push({
      sub_id: sub_id.value,
      sub_name: course.value.find((item) => item.ac_id === sub_id.value).ac_name
    })
    dialogVisible.value = false
    success('选择成功')
  } else {
    if (!findCourse()) {
      courselist.value.push({
        sub_id: sub_id.value,
        sub_name: course.value.find((item) => item.ac_id === sub_id.value).ac_name
      })
      dialogVisible.value = false
      success('选择成功')
    } else {
      warning('该课程已经存在该任务中')
    }
  }
  console.log(courselist.value)
}
//判断课程是不是已经存在
const findCourse = () => {
  return courselist.value.find((item) => item.sub_id === sub_id.value)
}
//添加课程
const toAdd = () => {
  if (courselist.value.length >= setting.value.max) {
    warning('已经达到最大值')
    return
  }
  dialogVisible.value = true
}
</script>
<style module lang="scss">
@mixin border-radius-top {
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
}
$height: 30px;
.container {
  .content {
    width: 100%;
    @include border-radius-top;
    border: 1px solid $nav_bgc;
    .title {
      @include border-radius-top;
      padding-left: 10px;
      margin-bottom: 20px;
      line-height: $height;
      width: calc(100% - #{10px});
      background-color: #fafafa;
    }
    .hr {
      margin: 20px;
      background-color: $nav_bgc;
    }
    .courselist {
      width: 100%;
      ul {
        li {
          list-style: none;
          height: 40px;
          line-height: 40px;
        }
      }
    }
    .addsub {
      margin: 10px;
      color: $primary;
      .add_btn {
        color: $primary;
        font-weight: 600;
      }
    }
  }
  .header {
    margin-left: 10px;
    line-height: $height;
  }
  .iptnum {
    width: 45px;
    height: $height;
    margin: 10px;
  }
  .btn {
    margin-top: 100px;
    button {
      @include button-Tools();
    }
  }
}
@include course_setting_dialog2;
</style>

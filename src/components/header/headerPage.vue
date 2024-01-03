<template>
  <div :class="$style.container">
    <div :class="$style.content">
      <el-icon size="30px"><Fold /></el-icon>
      <div :class="$style.title">学生管理系统</div>
      <div :class="$style.user">
        <el-popover
          :width="300"
          popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
        >
          <template #reference>
            <el-avatar src="https://avatars.githubusercontent.com/u/72015883?v=4" />
          </template>
          <template #default>
            <div class="demo-rich-conent" style="display: flex; gap: 16px; flex-direction: column">
              <div :class="$style.avatar_button">
                <el-avatar
                  :size="60"
                  src="https://avatars.githubusercontent.com/u/72015883?v=4"
                  style="margin-bottom: 8px"
                />

                <!-- 气泡确认框 -->
                <el-popconfirm
                  width="220"
                  confirm-button-text="必须的"
                  cancel-button-text="不,谢谢"
                  :icon="InfoFilled"
                  icon-color="#626AEF"
                  title="你确认退出登陆?"
                >
                  <template #reference>
                    <el-button :class="$style.btn" @click="exitLogin">退出登陆</el-button>
                  </template>
                </el-popconfirm>
              </div>
              <div>
                <p class="demo-rich-content__name" style="margin: 0; font-weight: 500">
                  {{ userData.name }}
                </p>
                <p
                  class="demo-rich-content__mention"
                  style="margin: 0; font-size: 14px; color: var(--el-color-info)"
                >
                  {{ userData.type }}
                </p>
              </div>
              <div class="demo-rich-content__desc" style="margin: 0" v-if="level != 2">
                <el-row>
                  <el-col :span="7" :class="$style.popover_text"
                    >姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别：</el-col
                  >
                  <el-col :span="17">{{ userData.sex }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="7" :class="$style.popover_text">联系方式：</el-col>
                  <el-col :span="17">{{ userData.phone }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="7" :class="$style.popover_text">家庭地址：</el-col>
                  <el-col :span="17">{{ userData.address }}</el-col>
                </el-row>
              </div>
            </div>
          </template>
        </el-popover>
        <p>{{ userData.name }}</p>
      </div>
    </div>

    <div :class="$style.header">
      <BreadcrumbNav :breadcrumb="router.currentRoute"></BreadcrumbNav>
    </div>
  </div>
</template>
<script setup>
import { ref, inject, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Fold } from '@element-plus/icons-vue'
import BreadcrumbNav from '../Breadcrumb/BreadcrumbNav.vue'
import { useAuthorization } from '../../stores/Authorization'
const usePostData = inject('$usePostData')
const router = useRouter()
const { getAuthority } = useAuthorization()
const { level, userId } = getAuthority()
const userData = ref({ name: '', type: '' })
onMounted(async () => {
  await getUser()
})
//获得用户数据
const getUser = async () => {
  if (level == '2') {
    userData.value = {
      name: '超级管理员',
      type: '超管'
    }
  } else if (level == '1') {
    try {
      const res = await usePostData('http://localhost:3000/teacher', {
        t_id: userId
      })
      userData.value = {
        name: res.data[0].t_name,
        type: '教师',
        id: res.data[0].t_id,
        sex: res.data[0].t_sex == '0' ? '男' : '女',
        phone: res.data[0].t_phone,
        address: res.data[0].t_address
      }
    } catch (error) {
      console.log(error)
    }
  } else if (level == '0') {
    try {
      const res = await usePostData('http://localhost:3000/student', {
        stu_id: userId
      })
      userData.value = {
        name: res.data[0].stu_name,
        type: '学生',
        id: res.data[0].stu_id,
        sex: res.data[0].stu_sex == '0' ? '男' : '女',
        phone: res.data[0].stu_phone,
        address: res.data[0].stu_address
      }
    } catch (error) {
      console.log(error)
    }
  } else {
    router.push({
      name: 'LoginIn'
    })
  }
}
//退出登陆
const exitLogin = () => {
  sessionStorage.removeItem('level')
  sessionStorage.removeItem('id')
  sessionStorage.removeItem('token')
  router.push({
    name: 'LoginIn'
  })
}
</script>
<style lang="scss" module>
.container {
  .header {
    height: 40px;
    line-height: 40px;
    background-color: #f0f2f7;
  }
  .content {
    position: relative;
    display: flex;
    align-items: center;
    height: 70px;
    line-height: 70px;
    .title {
      margin-left: 20px;
    }
    .user {
      display: flex;
      align-items: center;
      position: absolute;
      right: 50px;
      p {
        margin-left: 10px;
      }
      el-avatar {
        transform: translateY(-5px);
      }
      .popover_text {
        text-align: right;
      }
    }
  }
}
.avatar_button {
  display: flex;
  .btn {
    @include button-Tools();
    margin-left: 100px;
    margin-top: 20px;
    transform: scale(0.9);
  }
}
</style>

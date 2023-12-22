<template>
  <div :class="$style.container">
    <div :class="$style.school_form">
      <el-row :class="$style.row">
        <el-col :span="1" />
        <el-col :span="2" :class="$style.title">学校名:</el-col>
        <el-col :span="3">
          <el-input
            placeholder="学校名字"
            :class="$style.el_ipt"
            type="text"
            v-model="schoolData.school_name"
          />
        </el-col>
      </el-row>
      <el-row :class="$style.row">
        <el-col :span="1" />
        <el-col :span="2" :class="$style.title">学校类型:</el-col>
        <el-col :span="3">
          <el-select v-model="schoolData.school_type" placeholder="学校类型" :class="$style.el_ipt">
            <el-option v-for="item in types" :label="item.name" :value="item.name" :key="item.id" />
          </el-select>
        </el-col>
      </el-row>
      <el-row :class="$style.row">
        <el-col :span="1" />
        <el-col :span="2" :class="$style.title">学校地址:</el-col>
        <linkAge :address="address" />
        <el-col :span="3">
          <el-input
            placeholder="请输入详情地址"
            :class="$style.el_ipt"
            type="text"
            v-model="address.detail"
          />
        </el-col>
      </el-row>
      <el-row :class="$style.row">
        <el-col :span="1" />
        <el-col :span="2" :class="$style.title">学校联系人:</el-col>
        <el-col :span="3">
          <el-input
            placeholder="请输入联系方式"
            :class="$style.el_ipt"
            type="text"
            v-model="schoolData.school_linkman"
          />
        </el-col>
      </el-row>
      <el-row :class="$style.row">
        <el-col :span="1" />
        <el-col :span="2" :class="$style.title">联系方式:</el-col>
        <el-col :span="3">
          <el-input
            placeholder="请输入联系人"
            :class="$style.el_ipt"
            type="text"
            v-model="schoolData.school_phone"
          />
        </el-col>
      </el-row>
    </div>
    <div :class="$style.btn">
      <el-row>
        <el-col :span="2"></el-col>
        <button :class="$style.btn1" @click="toBack">取消</button>
        <button :class="$style.btn2" @click="toEdit">确认</button>
      </el-row>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import linkAge from '@/components/linkage/LinkAge.vue'
import { usePostData } from '@/utils/asyncAxios'

const router = useRouter()
const route = useRoute()
const types = ref([
  { id: 1, name: '民办' },
  { id: 2, name: '公办' }
])
//获取编辑输入的数据
const schoolData = ref({
  school_id: route.params.id,
  school_name: '',
  school_type: '',
  school_address: '',
  school_linkman: '',
  school_phone: ''
})
const address = ref({
  province: '',
  city: '',
  county: '',
  detail: ''
})
const toBack = () => {
  router.go(-1)
}
const toEdit = async () => {
  try {
    schoolData.value.school_address =
      address.value.province + address.value.city + address.value.county + address.value.detail
    await usePostData('http://localhost:3000/schools/edit', schoolData.value)
    router.push({
      name: 'School'
    })
  } catch (error) {
    console.log(error)
  }
}
</script>
<style module lang="scss">
.container {
  box-sizing: border-box;
  @include bgc;
  padding-top: 20px;
  .row {
    box-sizing: border-box;
    margin: 20px;
    .title {
      text-align: right;
      margin-right: 20px;
      line-height: 30px;
      font-size: 14px;
    }
    .el_ipt {
      @include ipt1;
    }
  }
  .btn {
    margin-top: 100px;
    .btn1 {
      @include button-Tools($btnColor, $btnfontColor);
    }
    .btn2 {
      @include button-Tools($btnfontColor, $btnColor);
    }
  }
}
</style>

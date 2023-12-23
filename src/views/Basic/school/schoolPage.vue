<template>
  <div :class="$style.container">
    <div :class="$style.title">
      <p>学校名称</p>
      <p>学校类型</p>
      <p>学校地址</p>
      <p>学校联系人</p>
      <p>联系方式</p>
    </div>
    <div :class="$style.content">
      <p>{{ res?.school_name }}</p>
      <p>{{ res?.school_type }}</p>
      <p>{{ res?.school_address }}</p>
      <p>{{ res?.school_linkman }}</p>
      <p>{{ res?.school_phone }}</p>
    </div>
    <div :class="$style.btn">
      <button @click="toEdit">编辑</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useGetData } from '@/utils/asyncAxios'
import { useRouter } from 'vue-router'

const router = useRouter()

console.log(router.currentRoute)

// 定义变量,获取页面数据
const res = ref('')
// 获取页面数据
onMounted(async () => {
  try {
    const data = await useGetData('http://localhost:3000/schools') // url为请求地址
    res.value = data.data.data[0]
  } catch (error) {
    console.log(error)
  }
})
const toEdit = () => {
  router.push({
    name: 'SchoolEdit',
    params: {
      id: res.value.school_id
    }
  })
}
</script>
<style module lang="scss">
@mixin div {
  display: inline-block;
  transform: translateY(30px);
  width: 120px;
  line-height: 30px;
}
@mixin p {
  text-align: center;
  font-size: 14px;
}
.container {
  @include bg_style;
  .title {
    @include div;
    p {
      @include p;
    }
  }
  .content {
    @include div;
    margin-left: 30px;
    p {
      @include p;
      text-align: left;
    }
  }
  .btn {
    margin-top: 50px;
    margin-left: 30px;
    button {
      @include button-Tools;
    }
  }
}
</style>

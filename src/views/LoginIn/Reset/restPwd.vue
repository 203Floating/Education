<template>
<div :class="$style.box">
  <div :class="$style.container">
    <div :class="$style.nav">
      <button @click="toLogin">登陆</button>
      <button>重置密码</button>
    </div>
    <div :class="$style.process">
      <div :class="{ [$style.step1]: stepbgc.step1 }" @click="checkstep(1)">确认账号</div>
      <div :class="{ [$style.step2]: stepbgc.step2 }" @click="checkstep(2)">重置密码</div>
      <div :class="{ [$style.step3]: stepbgc.step3 }">重置成功</div>
    </div>

    <div :class="$style.content">
      <div v-if="step == 1">
        <div :class="$style.ipt">
          <input type="text" placeholder="请输入账号" />
        </div>
        <div :class="$style.btn">
          <button @click="NextStep(2)">确认</button>
        </div>
      </div>
      <div v-if="step == 2">
        <div :class="$style.ipt">
          <span>新密码：</span> <input type="text" placeholder="请输入新密码" />
        </div>
        <div :class="$style.ipt">
          <span>确认密码：</span><input type="text" placeholder="请输入密码" />
        </div>
        <div :class="$style.ipt">
          <span>手机号：</span><input type="text" placeholder="15038669706" disabled />
        </div>
        <div :class="$style.ipt">
          <span>短信验证：</span><input type="text" placeholder="请输入短信验证码" />
        </div>
        <div :class="$style.btn" :style="{ marginLeft: 100 + 'px' }">
          <button @click="NextStep(3)">下一步</button>
        </div>
      </div>
      <div v-if="step == 3">
        <div :class="$style.title">
          <p>重置密码成功</p>
          <p>跳转至登录首页</p>
        </div>
        <div :class="$style.btn">
          <button>确认</button>
        </div>
      </div>
    </div>
  </div></div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, watch } from 'vue'

const step = ref(1)
const stepbgc = ref({
  step1: true,
  step2: false,
  step3: false
})
const router = useRouter()
const toLogin = () => {
  router.push({
    name: 'LoginIn'
  })
}
const checkstep = (value) => {
  if (value == 1 || step.value == 3 || (step.value >= 2 && value <= 3)) {
    step.value = value
  }
}
const NextStep = (value) => {
  step.value = value
}
watch(step, () => {
  stepbgc.value.step1 = true
  stepbgc.value.step2 = true
  stepbgc.value.step3 = true
  if (step.value == 1) {
    stepbgc.value.step2 = false
    stepbgc.value.step3 = false
  }
  if (step.value == 2) {
    stepbgc.value.step3 = false
  }
})
</script>

<style module lang="scss">
$pwidth: 100vw * 0.6;
$pheight: 50px;
@mixin box-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
.container {
  box-sizing: border-box;
  margin-top: 100px;
  @include box-center;
  .nav {
    margin-bottom: 50px;
    button {
      padding: 10px;
      font-size: 14px;
      border: none;
      background-color: $btn_bgc;
      &:first-child {
        font-weight: 700;
      }
    }
  }
  .process {
    display: flex;
    width: $pwidth;
    height: $pheight;
    background-color: #f0f2f7;
    div {
      font-size: 16px;
      width: $pwidth / 3;
      line-height: $pheight;
      text-align: center;
    }
    .step1,
    .step2,
    .step3 {
      color: #2aa94f;
    }
  }
  .content {
    @include box-center;
    margin-top: 100px;
    .ipt {
      display: flex;
      flex-wrap: nowrap;
      span {
        width: 100px;
        line-height:  $pheight;
      }
    }
    .title {
      text-align: center;
      margin-bottom: 60px;
      p {
        margin: 20px;
      }
    }
    input {
      @include ipt-user;
    }
    button {
      @include btn-user;
    }
  }
}
.box{
  width: 100%;
  height: 100%;
  background-color: #fff;
}
</style>

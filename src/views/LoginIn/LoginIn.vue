<template>
  <div :class="$style.container">
    <div :class="$style.verify_form">
      <div :class="$style.login">
        <p>登陆</p>
      </div>
      <div :class="$style.login_type">
        <button>密码登陆</button>
        <button>手机号登陆</button>
      </div>
      <div :class="$style.ipt">
        <input placeholder="登陆账号" v-model="verifyFrom.uname" type="text" />
      </div>
      <div :class="$style.ipt">
        <input placeholder="登陆密码" v-model="verifyFrom.upwd" type="password" />
      </div>
      <div :class="$style.ipt">
        <input placeholder="确认密码" v-model="verifyFrom.upwd2" type="password" />
      </div>
      <div :class="$style.btn">
        <button @click="tologin">登陆</button>
      </div>
      <div :class="$style.text">
        <button>记住密码</button>
        <button @click="toReset">忘记密码</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthorization } from '../../stores/Authorization'
const uselogin = inject('$uselogin')
const success = inject('$success')
const warning = inject('$warning')
const router = useRouter()
// const { warning, success } = popMessage
const verifyFrom = ref({
  uname: '',
  upwd: '',
  upwd2: ''
})

const toReset=()=> {
  router.push({
    name: 'Reset'
  })
}
//登录
const tologin = async () => {
  if (verifyFrom.value.uname == '' || verifyFrom.value.upwd == '' || verifyFrom.value.upwd2 == '') {
    warning('请填写完整信息')
  } else if (verifyFrom.value.upwd != verifyFrom.value.upwd2) {
    warning('两次密码不一致')
  } else {
    try {
      const res = await uselogin(verifyFrom.value.uname, verifyFrom.value.upwd)
      const { setAuthorizationTrue } = useAuthorization()
      if (res.status) {
        await setAuthorizationTrue()
        router.push({ name: 'home' })
        success('登录成功')
      }
    } catch (err) {
      console.log(err)
      // 进一步处理错误，比如显示错误提示
    }
  }
}
</script>
<style module lang="scss">
.container {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  .verify_form {
    height: 100%;

    .login {
      text-align: center;
      margin-bottom: 60px;
      font-size: 24px;
      font-weight: 700;
    }
    .login_type {
      margin-bottom: 30px;
      button {
        border: none;
        background-color: $btn_bgc;
        font-size: 16px;
      }
    }
    .ipt {
      input {
        @include ipt-user;
      }
    }
    .btn {
      button {
        @include btn-user;
      }
    }
    .text {
      display: flex;
      justify-content: space-between;
      button {
        border: none;
        background-color: #fff;
        color: #aaaaaa;
        font-size: 16px;
      }
    }
  }
}
</style>

<template>
  <div :class="$style.box">
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
          <input placeholder="登陆账号" v-model="verifyFrom.username" type="text" />
        </div>
        <div :class="$style.ipt">
          <input placeholder="登陆密码" v-model="verifyFrom.password" type="password" />
        </div>
        <div :class="$style.ipt">
          <input placeholder="确认密码" v-model="verifyFrom.password2" type="password" />
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
const verifyFrom = ref({
  username: '',
  password: '',
  password2: ''
})

const toReset = () => {
  router.push({
    name: 'Reset'
  })
}
//登录
const tologin = async () => {
  if (
    verifyFrom.value.username == '' ||
    verifyFrom.value.password == '' ||
    verifyFrom.value.password2 == ''
  ) {
    warning('请填写完整信息')
  } else if (verifyFrom.value.password != verifyFrom.value.password2) {
    warning('两次密码不一致')
  } else {
    try {
      const res = await uselogin(verifyFrom.value.username, verifyFrom.value.password)
      const { setHeader, setAuthority } = useAuthorization()
      if (res.status) {
        const tag = res.data.data[0]
        setHeader(res.data.token)
        setAuthority(tag)
        success('登录成功')
        if (tag.level == '2') {
          router.push({ name: 'home' })
        } else if (tag.level == '0') {
          router.push({ name: 'studentEdit' })
        } else if (tag.level == '1') {
          router.push({ name: 'teacherEdit' })
        }
      }
    } catch (err) {
      console.log(err)
    }
  }
}
</script>
<style module lang="scss">
.box {
  background-image: url('../../assets/image/bgc.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  // background-size: 100% 100%;
}
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
        // background-color: $btn_bgc;
        background-color: rgba(256,256,256,0);
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
        background-color:rgba(256,256,256,0);
        font-size: 16px;
      }
    }
  }
}
.box {
  width: 100%;
  height: 100%;
  background-color: #fff;
}
</style>

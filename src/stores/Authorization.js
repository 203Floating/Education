import { defineStore } from 'pinia'

export const useAuthorization = defineStore('authorization', () => {
  const isAuthorization = () => {
    const token = sessionStorage.getItem('token')
    return !!token // 使用 !! 强制将值转为布尔类型
  }

  function setHeader(token) {
    // 使用 sessionStorage.setItem 直接设置 token，无需先删除再设置
    sessionStorage.setItem('token', token)
  }

  function setAuthority(data) {
    sessionStorage.removeItem('level')
    sessionStorage.removeItem('id')

    let userId = data.username
    const level = data.level
    // 修正条件判断，应该是 data.level
    if (level == '2') {
      userId = -1
    }
    // 使用 sessionStorage.setItem保存登陆用户的 level 和 userId
    sessionStorage.setItem('level', level)
    sessionStorage.setItem('userId', userId)
  }

  function getAuthority() {
    const level = sessionStorage.getItem('level')
    const userId = sessionStorage.getItem('userId')
    return {
      level,
      userId
    }
  }

  return { isAuthorization, setHeader, setAuthority, getAuthority }
})

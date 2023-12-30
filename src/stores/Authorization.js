import { defineStore } from 'pinia'

export const useAuthorization = defineStore('authorization', () => {
  const isAuthorization = () => {
    const token = localStorage.getItem('token')
    if (token) {
      return true
    } else {
      return false
    }
  }

  function setAuthorizationFalse() {
    isAuthorization.value = true
  }
  function setHeader(token) {
    localStorage.removeItem('token')
    localStorage.setItem('token', token)
    isAuthorization.value = true
  }
  return { isAuthorization, setAuthorizationFalse, setHeader }
})

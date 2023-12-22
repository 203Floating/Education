import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthorization = defineStore('authorization', () => {
  const isAuthorization = ref(true)
  function setAuthorizationTrue() {
    isAuthorization.value = true
  }
  function setAuthorizationFalse() {
    isAuthorization.value = true
  }
  return { isAuthorization, setAuthorizationTrue, setAuthorizationFalse }
})

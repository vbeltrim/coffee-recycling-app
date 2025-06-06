import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {jwtDecode} from 'jwt-decode'



export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(token.value ? jwtDecode(token.value) : null)

  const isLoggedIn = computed(() => !!token.value)
  const role = computed(() => user.value?.role || 'guest') 
  const name = computed(() => user.value?.name || '')

  function login(newToken) {
    localStorage.setItem('token', newToken)
    token.value = newToken
    user.value = jwtDecode(newToken)
  }

  function logout() {
    localStorage.removeItem('token')
    token.value = null
    user.value = null
  }

  return {
    token,
    user,
    isLoggedIn,
    role,
    name,
    login,
    logout
  }
})

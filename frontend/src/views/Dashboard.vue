<template>
  <div class="dashboard-wrapper">
    <div class="welcome-box">
      <h2>Hi {{ name }}, welcome back!</h2>
    </div>

    <div class="options">
      <RouterLink class="dashboard-box" to="/orders">My Orders</RouterLink>
      <RouterLink class="dashboard-box" to="/profile">My Profile</RouterLink>
    </div>
  </div>
</template>
  
<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const auth = useAuthStore()

const name = auth.name
const isLoggedIn = auth.isLoggedIn
const role = auth.role

onMounted(() => {

  console.log(isLoggedIn,role)
  if (!isLoggedIn || role =='admin') {
    router.push({ name: 'Homepage' })
  }
})
</script>

<style scoped>
.dashboard-wrapper {
  max-width: 800px;
  margin: 40px auto;
  padding: 24px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.welcome-box {
  text-align: center;
  margin-bottom: 30px;
  font-family: 'Inter', sans-serif;
  color: #4b3b2f;
}

.welcome-box h2 {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 1rem;
  font-weight: 600;

}

.options {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 20px;
}

.dashboard-box {
  flex: 1 1 45%;
  text-align: center;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  text-decoration: none;
  font-family: 'Inter', sans-serif;
  color: #4b3b2f;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.dashboard-box:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  background-color: #f0f4ff;
}
</style>

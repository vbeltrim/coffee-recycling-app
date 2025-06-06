<template>
  
  <div class="profile-container">
    <h2>My Profile</h2>
    <div v-if="auth.user">
    <form @submit.prevent="handlePasswordChange">
      <div class="form-group">
        <label for="name">Name</label>
        <input id="name" type="text" :value=user.name disabled />
      </div>

      <div class="form-group">
        <label for="surname">Surname</label>
        <input id="surname" type="text" :value="user.surname" disabled />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" type="email" :value="user.email" disabled />
      </div>

      <div class="form-group">
        <label for="current-password">Current Password</label>
        <input id="current-password" v-model="currentPassword" type="password" />
      </div>

      <div class="form-group">
        <label for="new-password">New Password</label>
        <input id="new-password" v-model="newPassword" type="password" />
      </div>

      <div class="form-group">
        <label for="repeat-password">Repeat Password</label>
        <input id="repeat-password" v-model="repeatPassword" type="password" />
      </div>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <button type="submit">Change Password</button>
      <p v-if="error" class="error-message">{{ error }}</p>
      <p v-if="success" class="success-message">Password updated!</p>
    </form>
    </div>
  </div>
</template>

  
<script setup>
  import { ref, onMounted } from 'vue'
  import {useAuthStore} from '@/store/auth'
  import { updatePassword } from '@/services/api'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const auth = useAuthStore()
  
  const user = auth.user
  const currentPassword = ref('')
  const newPassword = ref('')
  const repeatPassword = ref('')
  const error = ref('')
  const success = ref(false)
  const errorMessage = ref('')

  const handlePasswordChange = async () => {
    error.value = ''
    success.value = false
  
    if (!newPassword.value || newPassword.value !== repeatPassword.value) {
      errorMessage.value = 'Passwords must match and cannot be empty.'
      return
    }
  
    try {
      await updatePassword({
         currentPassword: currentPassword.value,
         newPassword: newPassword.value})
      success.value = true
      router.push({ name: 'Success', query: { message: 'Success', subMessage: 'Your password has been changed successfully' } })
    } catch (err) {
      router.push({ name: 'Error', query: { message: 'Error', subMessage: 'There has been an error with your request. Try again later' } })
      console.error(err)
    }
  }
</script>
  
<style scoped>
.profile-container {
  max-width: 500px;
  margin: 4rem auto;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 2rem;
  border-radius: 1.5rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(6px);
  color: #3e2c23;
  font-family: 'Inter', sans-serif;
}

.profile-container h2 {
    text-align: center;
    margin-bottom: 2rem;
    font-size: 2rem;
    color: #4b3b2f;
    font-family: 'Inter', sans-serif;
  }

.form-group {
  margin-bottom: 1.2rem;
}

label {
  display: block;
  margin-bottom: 0.3rem;
  font-weight: 600;
}

input {
  width: 100%;
  padding: 0.7rem;
  border: 1px solid #ccc;
  border-radius: 1rem;
  font-size: 1rem;
  background-color: #fefaf4;
}

input:disabled {
  background-color: #f3eee6;
  color: #6a5c51;
}

button {
  width: 100%;
  padding: 0.8rem;
  background-color: #8b5e3c;
  color: white;
  border: none;
  border-radius: 1rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #a26f4f;
}

p {
  margin-top: 1rem;
  text-align: center;
}
</style>

  
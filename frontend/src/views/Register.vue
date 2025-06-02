<template>
    <div class="register-page">  
      <!-- Foreground form -->
      <div class="form-wrapper">
        <div class="form-header">Are you ready?</div>
  
        <form @submit.prevent="handleRegister">
          <label for="name">Name</label>
          <input id="name" v-model="name" type="text" required />
  
          <label for="surname">Surname</label>
          <input id="surname" v-model="surname" type="text" required />
  
          <label for="email">Email</label>
          <input id="email" v-model="email" type="email" required />
  
          <label for="password">Password</label>
          <input id="password" v-model="password" type="password" required />
  
          <label for="repeatPassword">Repeat Password</label>
          <input id="repeatPassword" v-model="repeatPassword" type="password" required />
  
          <div class="submit-container">
            <button type="submit" class="submit-btn">SIGN UP</button>
          </div>
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { registerUser } from '@/services/api'
  import { useRouter } from 'vue-router'
  

  
  const router = useRouter()
  const name = ref('')
  const surname = ref('')
  const email = ref('')
  const password = ref('')
  const repeatPassword = ref('')
  const errorMessage = ref('')
  
  const handleRegister = async () => {
       errorMessage.value = ''
      if (password.value !== repeatPassword.value) {
        alert("Passwords don't match.")
        return
      }

      const userData = {
        name: name.value,
        surname: surname.value,
        email: email.value,
        password: password.value
      }

      try {
        const response = await registerUser(userData)
        const token = response.data.token
        localStorage.setItem('token',token)
        router.push('/login')
      } catch (error) {
          if (error.response && error.response.status === 400) {
            errorMessage.value = 'User already Exists'
          } else {
            errorMessage.value = 'Something went wrong. Please try again later.'
          }
        }
  }
  </script>
 <style scoped>
 .register-page {
   height: 100%;
   display: flex;
   justify-content: center;
   align-items: center;
   padding: 2rem;
 }
 .error-message {
  color: red;
  margin-top: 0.5rem;
}
 .form-wrapper {
   background-color: rgba(255, 250, 240, 0.95);
   padding: 2.5rem;
   width: 100%;
   max-width: 500px;
   color: #4b3b2f;
   font-family: 'Inter', sans-serif;
   border-radius: 1.5rem;
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
 }
 
 .form-header {
   text-align: center;
   font-size: 1.8rem;
   font-weight: bold;
   margin-bottom: 2rem;
   color: #402315;
 }
 
 form {
   display: flex;
   flex-direction: column;
   gap: 1rem;
 }
 
 label {
   font-weight: 600;
   margin-bottom: 0.25rem;
 }
 
 input {
   padding: 0.75rem 1rem;
   border: 1px solid #c7a07b;
   border-radius: 1rem;
   background-color: #fff;
   font-size: 1rem;
   color: #4b3b2f;
 }
 
 input::placeholder {
   color: #a68a72;
 }
 
 .submit-container {
   display: flex;
   justify-content: center;
   margin-top: 1.5rem;
 }
 
 .submit-btn {
   padding: 0.75rem 2rem;
   background-color: #8b5e3c;
   color: white;
   border: none;
   border-radius: 1rem;
   font-size: 1rem;
   font-weight: bold;
   cursor: pointer;
   transition: background-color 0.3s ease;
 }
 
 .submit-btn:hover {
   background-color: #a26f4f;
 }
 </style>
 
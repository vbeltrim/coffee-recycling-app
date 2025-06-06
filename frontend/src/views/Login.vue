<template>
    <div class="login-page">
      <div class="form-container">
        <div class="form-wrapper">
          <div class="form-section">
            <h2>Welcome Back to the Blend</h2>
            <form @submit.prevent="handleLogin">
              <label for="email">Email</label>
              <input id="email" v-model="email" type="email" required />
    
              <label for="password">Password</label>
              <input id="password" v-model="password" type="password" required />
              <button type="submit" class="login-btn">LOG IN</button>
              <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
            </form>
    
            <div class="signup-link">
              <p>Don't have an account yet?</p>
              <RouterLink to="/register">SIGN UP</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  

<script setup>
    import { ref} from 'vue'
    import { useRouter } from 'vue-router'
    import { loginUser } from '@/services/api'
    import { useAuthStore } from '@/store/auth'

    const router = useRouter()
    const email = ref('')
    const password = ref('')
    const errorMessage = ref('')
    const auth = useAuthStore()


    /*When the user clicks on LOG IN, they trigger the handleLogin function. */
    const handleLogin = async () => { 
      errorMessage.value = ''
        try {
            const response = await loginUser({ // the responso to the api request is saved on "response"
            email: email.value, //The req uses email and password to authenticate the user. 
            password: password.value
            })
            const token = response.data.token
            auth.login(token) //The token provided in a success response is passed as argument to the auth pinia store. 
            if(auth.role == "admin"){ // If the role provided by the auth store is admin. They are pushed to the orders. 
                router.push('/orders');
            }
            else{
                router.push('/dashboard') //In case they are a "buyer", they are pushed to dashboard
            }
          } catch (error) {
          if (error.response && error.response.status === 400) { //If the api responds with a 400 STATUS CODE it means either the password or the mail are not correct.
            errorMessage.value = 'Invalid email or password.'
          } else {
            errorMessage.value = 'Something went wrong. Please try again later.' //Any other error that can be provided by this endpoint (e.g 500 server error), returns this message. 
          }
        }
    } //aqui

</script>
<style scoped>
.login-page {
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

.form-container {
  width: 100%;
  max-width: 500px;
  display: flex;
  justify-content: center;
}

.form-wrapper {
  background-color: rgba(255, 250, 240, 0.95);
  padding: 2.5rem;
  width: 100%;
  color: #4b3b2f;
  font-family: 'Inter', sans-serif;
  border-radius: 1.5rem;
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

h2 {
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 1rem;
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

.login-btn {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #8b5e3c;
  color: white;
  border: none;
  border-radius: 1rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login-btn:hover {
  background-color: #a26f4f;
}

.signup-link {
  text-align: center;
  font-size: 0.95rem;
  color: #4b3b2f;
  margin-top: 1rem;
}

.signup-link a {
  font-weight: bold;
  margin-left: 0.25rem;
  color: #8b5e3c;
  text-decoration: none;
}

.signup-link a:hover {
  text-decoration: underline;
}
</style>

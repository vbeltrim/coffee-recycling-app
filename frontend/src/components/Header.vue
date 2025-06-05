<template> <!--The options displayed in the Header depend on the role of the user, and whether the user is logged in -->
  <header class="header">
    <nav class="nav-container">

      <div class="nav-left">
        <RouterLink class="logo" to="/">CoffeeFuel</RouterLink>
        <RouterLink class="nav-link" to="/products">Products</RouterLink>

        <template v-if="auth.role !== 'admin'">
          <RouterLink class="nav-link" to="/collaborate">Collaborate</RouterLink>
        </template>

        <template v-if="auth.role === 'admin'">
          <RouterLink class="nav-link" to="/orders">Orders</RouterLink>
          <RouterLink class="nav-link" to="/contacts">Contacts</RouterLink>
        </template>

        <template v-if="auth.role === 'buyer'">
          <RouterLink class="nav-link" to="/orders">My Orders</RouterLink>
        </template>
      </div>

      <div class="nav-right">
        <template v-if="auth.isLoggedIn">
          <RouterLink class="nav-link" to="/dashboard"><img src="@/images/home-button.png" alt="home"/></RouterLink>
          <button class="nav-button" @click="handleLogout">OUT</button>
        </template>
        <template v-else>
          <RouterLink class="nav-link" to="/login">LOG IN</RouterLink>
        </template>
      </div>
    </nav>
  </header>
</template>



  
<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { storeToRefs } from 'pinia'

const auth = useAuthStore()
const { isLoggedIn, role } = storeToRefs(auth) 
const router = useRouter()
/*// Once the user wants to log out, the user clicks on the OUT button which triggers the function. The function calls the logout method on the auth store, 
which makes effective the logout. For the sake of UX, the router displayes the Homepage. */
const handleLogout = () => { 
  auth.logout()
  router.push('/')
}
</script>

<style scoped>

  .header {
    background-color: #d2b48c; 
    padding: 1rem 2rem;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    font-family: 'Inter', sans-serif;
  }
  
  .nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .nav-left,
  .nav-right {
    display: flex;
    gap: 1.5rem;
    align-items: center;
  }
  
  .logo {
    font-weight: 700;
    font-size: 1.3rem;
    color: #fff;
    text-decoration: none;
  }
  
  .nav-link {
    color: #fff;
    text-decoration: none;
    font-weight: 500;
    transition: opacity 0.2s ease;
  }
  
  .nav-link:hover {
    opacity: 0.8;
  }
  
  .nav-button {
    background-color: #4b3b2f;
    color: white;
    border: none;
    padding: 0.4rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
  }
  
  </style>
  

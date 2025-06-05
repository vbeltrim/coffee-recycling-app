  <template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-left">
        <p class="footer-text">© 2025 CoffeeFuel. All rights reserved.</p>
      </div>

      <div class="footer-right">
        <router-link
          v-if="!auth.isLoggedIn || auth.role !== 'admin'"
          to="/contact"
          class="footer-link"
        >
          Contact Us
        </router-link>
      </div>
    </div>
  </footer>
</template>
<script setup>
//The footer simply uses the authStore to check is the user is an admin or not. In case it is, it will not display the ContactUs link. 
  import {useAuthStore} from '@/store/auth'
  const auth = useAuthStore()
</script>
  
  <style scoped>
  .footer {
    background-color: #d2b48c; 
    padding: 1rem 2rem;
    font-family: 'Inter', sans-serif;
    box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.1);
  }
  
  .footer-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
  }
  
  .footer-left {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }
  
  .footer-text {
    color: #fff;
    font-weight: 500;
    font-size: 0.95rem;
  }
  
  .footer-link {
    color: #fff;
    text-decoration: none;
    font-weight: 500;
    font-size: 0.95rem;
    transition: opacity 0.2s ease;
  }
  
  .footer-link:hover {
    opacity: 0.8;
    text-decoration: underline;
  }
  .footer-left {
  font-size: 0.9rem;
  color: #4b3b2f;
}

  .footer-right {
    display: flex;
    gap: 1rem;
  }

  .footer-link {
    color: #4b3b2f;
    text-decoration: none;
    font-weight: 500;
  }

  </style>
  
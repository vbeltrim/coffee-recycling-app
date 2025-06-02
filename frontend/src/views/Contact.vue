<template>
    <div class="collaborate-wrapper">
      <h2>Do you need any help?</h2>
      <p class="intro-text">
        We are grateful to know from you
      </p>
  
      <form class="collab-form" @submit.prevent="submitForm">
        <div class="form-grid">
          <div class="left-fields">
            <input type="text" v-model="form.name" placeholder="Name" required />
            <input type="text" v-model="form.surname" placeholder="Surname" required />
            <input type="email" v-model="form.email" placeholder="Email" required />
            <input type="tel" v-model="form.phone" placeholder="Phone" />
          </div>
  
          <div class="message-box">
            <label for="message">Would you like to leave us a message?</label>
            <textarea id="message" v-model="form.message" rows="6" placeholder=""></textarea>
          </div>
        </div>
  
        <button type="submit" class="submit-button">Submit</button>
      </form>
    </div>
</template>
  
  <script setup>
  import { ref } from 'vue'

  import { useRouter } from 'vue-router'
  const router = useRouter()
  import {submitContact} from '@/services/api'
  
  const form = ref({
    name: '',
    surname: '',
    email: '',
    phone: '',
    message: ''
  })
  
  const submitForm = async () => {
  try {
    await submitContact(form.value)
    alert('Thank you for your message! We will get back to you soon.')
    router.push({name:'Homepage'})
  } catch (err) {
    alert('Something went wrong while submitting your message.')
    console.error(err)
    router.push({name:'Homepage'})
  }
}
  </script>
  
  <style scoped>
  
  .collaborate-wrapper {
    max-width: 900px;
    margin: 3rem auto;
    padding: 2.5rem;
    border-radius: 1.5rem;
    background-color: rgba(255, 255, 255, 0.95);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
    font-family: 'Inter', sans-serif;
    color: #4b3b2f;
  }
  
  h2 {
    font-size: 2rem;
    text-align: center;
    margin-bottom: 1rem;
  }
  
  .intro-text {
    text-align: center;
    margin-bottom: 2.5rem;
    font-size: 1.05rem;
    color: #5a3e2b;
  }
  
  .collab-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .form-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
  }
  
  .left-fields {
    flex: 1 1 45%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .message-box {
    flex: 1 1 45%;
    display: flex;
    flex-direction: column;
  }
  
  input,
  textarea {
    border: 1px solid #c7a07b;
    border-radius: 1rem;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    background-color: #fefaf4;
    color: #4b3b2f;
  }
  
  textarea {
    resize: vertical;
    margin-top: 20px;
  }
  
  .submit-button {
    align-self: flex-end;
    padding: 0.6rem 2rem;
    background-color: #8b5e3c;
    color: white;
    border: none;
    border-radius: 1rem;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .submit-button:hover {
    background-color: #a26f4f;
  }
  </style>
  
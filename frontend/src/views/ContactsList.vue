<template>
    <div class="messages-wrapper">
      <h2>Contact Requests</h2>
  
      <div v-if="messages.length === 0" class="no-messages">
        <p>No contact messages found.</p>
      </div>
  
      <div v-else class="messages-list">
        <div v-for="msg in messages" :key="msg.id" class="message-card">
          <p><strong>Name:</strong> {{ msg.name }} {{ msg.surname }}</p>
          <p><strong>Email:</strong> {{ msg.email }}</p>
          <p><strong>Phone:</strong> {{ msg.phone || 'N/A' }}</p>
          <p><strong>Message:</strong> {{ msg.message }}</p>
          <p class="timestamp"><em>{{ formatDate(msg.created_at) }}</em></p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue'
  import { getContacts } from '@/services/api'
  import { useAuthStore } from '@/store/auth'
  import { useRouter } from 'vue-router'
  
  const auth = useAuthStore()
  const router = useRouter()
  const messages = ref([])
  
  onMounted(async () => {
    if (auth.role !== 'admin') {
      router.push({ name: 'Homepage' })
      return
    }
  
    try {
      const res = await getContacts()
      messages.value = res.data
    } catch (err) {
      console.error('Failed to load contact messages:', err)
    }
  })
  
  function formatDate(dateStr) {
    const d = new Date(dateStr)
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString()
  }
  </script>
  
  <style scoped>
  .messages-wrapper {
    width: 100%;
    max-width: 1100px;
    padding: 3rem;
    background-color: rgba(255, 255, 255, 0.75);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    margin: auto;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
    font-family: 'Inter', sans-serif;
    color: #4b3b2f;
  }
  .messages-wrapper h2 {
    text-align: center;
    margin-bottom: 2rem;
    font-size: 2rem;
    color: #4b3b2f;
    font-family: 'Inter', sans-serif;
  }
  .message-card {
    padding: 1.5rem;
    border-radius: 1.25rem;
    background-color: #fefaf4;
    border: 1px solid #decdb2;
  }
  
  .timestamp {
    margin-top: 0.5rem;
    font-size: 0.85rem;
    color: #7a6a58;
  }
  
  .no-messages {
    text-align: center;
    font-size: 1.1rem;
    color: #5a3e2b;
  }
  .messages-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  </style>
  
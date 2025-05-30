<template>
  <div class="orders-wrapper">
    <h2>My Orders</h2>

    <div v-if="orders.length === 0" class="no-orders">
      <p>No orders found</p>
    </div>

    <div v-else class="orders-list">
      <FilterBar :role="auth.role" @filter="applyFilter" />
      <div v-for="order in filteredOrders" :key="order.order_id" class="order-card">
        <p><strong>Order #{{ order.order_id }}</strong></p>
        <p>Status: {{ order.status }}</p>
        <p>Total: €{{ order.price.toFixed(2) }}</p>
        <p>Ordered on: {{ formatDate(order.created_at) }}</p>
        <OrderItem :item="order" :role="auth.role"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getOrders } from '@/services/api'
import OrderItem from '@/components/OrderItem.vue'
import FilterBar from '@/components/FilterBar.vue'
import {useAuthStore} from '@/store/auth'

const auth = useAuthStore()

const orders = ref([])
const filteredOrders = ref([]) 


const applyFilter = (filters) => {
  filteredOrders.value = orders.value.filter(order => {
    const orderDate = new Date(order.created_at)
    const matchesStart = filters.initialDate ? orderDate >= new Date(filters.initialDate) : true
    const matchesEnd = filters.finalDate ? orderDate <= new Date(filters.finalDate) : true
    const matchesUser = filters.username
      ? order.username?.toLowerCase().includes(filters.username.toLowerCase())
      : true

    return matchesStart && matchesEnd && matchesUser
  })
}

onMounted(async () => {
  try {
    const response = await getOrders()
    orders.value = response.data
    filteredOrders.value = [...response.data]
  } catch (err) {
    console.error('Failed to load orders:', err)
  }
})

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString()
}
</script>

  
<style scoped>
  .orders-wrapper {
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
  
  .orders-wrapper h2 {
    text-align: center;
    margin-bottom: 2rem;
    font-size: 2rem;
    color: #4b3b2f;
    font-family: 'Inter', sans-serif;
  }
  
  .no-orders {
    text-align: center;
    font-size: 1.1rem;
    color: #5a3e2b;
  }
  
  .orders-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .order-card {
    padding: 1.5rem;
    border-radius: 1.25rem;
    background-color: #fefaf4;
    border: 1px solid #decdb2;
  }
  
  .order-info p {
    margin: 0.25rem 0;
  }
  </style>
  
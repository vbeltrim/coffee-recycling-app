<template>
    <div v-if="!connectionProblem" class="orders-wrapper">
      <h2>My Orders</h2>
    <div v-if="orders.length === 0" class="no-orders">
      <p>No orders found</p>
    </div>
    <div v-else class="orders-list"> <!-- If there are orders, it displays the filter bar + the order items-->
      <FilterBar :role="auth.role" @filter="applyFilter" />
      <div v-for="order in filteredOrders" :key="order.order_id" class="order-card">
        <p><strong>Order #{{ order.order_id }}</strong></p>
        <p v-if="role == 'admin'"><strong>Name: {{ order.name }}</strong></p>
        <p>Status: {{ order.status }}</p>
        <p>Total: €{{ order.price.toFixed(2) }}</p>
        <p>Ordered on: {{ formatDate(order.created_at) }}</p>
        <OrderItem :item="order" :role="auth.role"/>
      </div>
    </div>
    </div>
       <div v-else class="error-container">
        <h1 class="title">We're having trouble loading the orders</h1>
        <img src="@/images/network-error.png" alt="Network error" class="error-icon" />
      </div>
</template>

<script setup>
import { ref, onMounted} from 'vue'
import { getOrders } from '@/services/api'
import OrderItem from '@/components/OrderItem.vue'
import FilterBar from '@/components/FilterBar.vue'
import {useAuthStore} from '@/store/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const role = auth.role
const router = useRouter()
const orders = ref([])
const filteredOrders = ref([])  //Filtered orders contains the orders that pass the filter provided by the filterbar. 
const connectionProblem = ref(false)


const applyFilter = (filters) => { //Apply filter is emited by the filter bar with the filter characteristics. Start date, end date, and depending on role user. 
  filteredOrders.value = orders.value.filter(order => { //he value of filter orders will be the one after applying all the filters. 
    const orderDate = new Date(order.created_at)
    const matchesStart = filters.initialDate ? orderDate >= new Date(filters.initialDate) : true
    const matchesEnd = filters.finalDate ? orderDate <= new Date(filters.finalDate) : true
    const matchesUser = filters.name
      ? order.name?.toLowerCase().includes(filters.name.toLowerCase())
      : true

    return matchesStart && matchesEnd && matchesUser
  })
}
onMounted(async () => { 
    try {
        const response = await getOrders() //Http request  to get the list of orders. If admin, list of all orders. Else, the list just for the user. 
        orders.value = response.data //The response is copied to orders. 
        console.log(orders.value)
        filteredOrders.value = [...response.data] //Shallow operator

      } catch (err) {
        console.error('Failed to load orders:', err)
        connectionProblem.value=true; //If there is a connection 
      }
})
/* Takes the JS date object and returns a new more readible.  */
function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString()
}
</script>

  
<style scoped>
.title {
  font-size: 2.5rem;
  text-align: center;
  color: #4b3b2f;
  font-family: 'Inter', sans-serif;
  margin-bottom: 2rem;
}
.error-container {
  text-align: center;
  margin-top: 2rem;
}
.error-icon {
  width: 300px;
  height: auto;
  margin-bottom: 1rem;
}
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
  .error-container {
    text-align: center;
    margin: auto;
    width: 100%;
    max-width: 1100px;
    padding: 3rem;
    border-radius: 20px;
    font-family: 'Inter', sans-serif;
    color: #4b3b2f;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    background-color: #f4e6d9;
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
  
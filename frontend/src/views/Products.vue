<template>
  <div class="overlay">
    <div class="products-wrapper">
      <div class="content-layer">
        <h1 class="products-title">Products</h1>

        <div class="products-container">
          <ProductItem
            v-for="product in products"
            :key="product.id"
            :product="product"
            v-model="quantities[product.id]"
          />

          <button class="buy-btn" v-if="!isAdmin" @click="goToCheckout">
            Buy Selected Items
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


  <script setup>
  import { ref, onMounted,watch } from 'vue'
  import ProductItem from '@/components/ProductItem.vue'
  import { getProducts } from '@/services/api'
  import { useRouter } from 'vue-router'
  import { useCartStore } from '@/store/cart'
  import {useAuthStore} from '@/store/auth'


  const products = ref([])
  const quantities = ref({})
  const router = useRouter()
  const isAdmin = ref([])
  const auth = useAuthStore()
  const cart = useCartStore()

  onMounted(async () => {
    try {
      if (auth.role == 'admin'){
        isAdmin.value = true
      }else{
         isAdmin.value=false;
      }
      const response = await getProducts()
      products.value = response.data
      console.log(products)
    
      products.value.forEach(product => {
      quantities.value[product.id] = 0
      })
      
    } catch (error) {
      console.error('Error fetching products:', error)
    }

  })
  watch(quantities, (newVal) => {
  console.log('Updated quantities:', newVal)}, { deep: true })


  const goToCheckout = () => {
  if (!auth.isLoggedIn) {
    router.push({ name: 'Login' })
    return
  }


  const selected = products.value
  .filter(p => quantities.value[p.id] > 0)
  .map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    quantity: quantities.value[p.id],
    stock: p.stock
  }))
  const invalid = selected.find(p => p.quantity > p.stock)

  if (invalid) {
    alert(`Not enough stock for "${invalid.name}". Only ${invalid.stock} available.`)
    return
  }

  if (selected.length === 0) {
    alert('Please select at least one product.')
    return
  }

  cart.setCart(selected)
  router.push({ name: 'Checkout' })
}
  </script>
  
  <style scoped>
.overlay {
  
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.75);
  padding: 3rem 2rem;
  border-radius: 20px;
  max-width: 1100px;
  margin: 4rem auto;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  justify-content: center;
  background-color: #f4e6d9;
  padding: 4rem 1rem;
  overflow: hidden;
}

.products-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 2rem;
}

.content-layer {
  width: 100%;
}

.products-title {
  font-size: 2.5rem;
  text-align: center;
  color: #4b3b2f;
  font-family: 'Inter', sans-serif;
  margin-bottom: 2rem;
}

.products-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 100%;
  max-width: 800px; 
  margin: 0 auto;
}


.buy-btn {
  display: block;
  margin: 3rem auto 0;
  padding: 0.75rem 2rem;
  font-size: 1.1rem;
  font-weight: bold;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.buy-btn:hover {
  background-color: #2c80b4;
}
</style>
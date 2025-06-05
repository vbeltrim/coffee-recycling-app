<template>
  <div class="overlay">
    <div class="products-wrapper">
      <div class="content-layer">
        <h1 class="products-title">Products</h1>

        <div class="products-container"> 
          <!--Displays the list of the avaliable products to be purchased. The role is passed to the child to tell to restrinct the admin role to see different parts.-->
          <ProductItem 
            v-for="product in products"
            :key="product.id"
            :product="product"
            :role = "auth.role" 
            v-model="quantities[product.id]"
          />
          <!--The warning message displays a warning is the amount to be bought is higher than the available, or the user has not selected any amount-->
          <p v-if="warningMessage" class="warning-banner">{{ warningMessage }}</p>
          <!--The v-model keeps track of the selected quantities on the child component to later on be able to process to checkout-->
          <button class="buy-btn" v-if="!isAdmin" @click="goToCheckout"> <!--Admin CANNOT see this button-->
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
  const warningMessage = ref('')

  onMounted(async () => { 
    try {
      if (auth.role == 'admin'){//Checks if the user is admin or not. 
        isAdmin.value = true
      }else{
         isAdmin.value=false;
      }
      const response = await getProducts() //Fetches the products through an api request. 
      products.value = response.data //the response is copied to the products variable.
    
      products.value.forEach(product => {  //For each product, it adds a new key in the quantities object using the product's ID, and sets its value to 0.
        quantities.value[product.id] = 0
      })
      
    } catch (error) {
      console.error('Error fetching products:', error)
    }

  })
  watch(quantities, (newVal) => {
  console.log('Updated quantities:', newVal)}, { deep: true })

  watch(quantities, () => {
  warningMessage.value = ''
  }, { deep: true })

  const goToCheckout = () => { //Checks if the user is logged in, otherwise, it has to be so in order to process to checkout.
  if (!auth.isLoggedIn) {
    router.push({ name: 'Login' })
    return
  }

/*The code takes the values of products and takes only those the user has selected.  */
  const selected = products.value
  .filter(p => quantities.value[p.id] > 0) //Takes on the the products which quantities are more than 0
  .map(p => ({ //
    id: p.id,
    name: p.name,
    price: p.price,
    quantity: quantities.value[p.id],
    stock: p.stock
  }))
  const invalid = selected.find(p => p.quantity > p.stock) //Compares the actual stock offer, to the one the user has selected. If one if smaller than the other . It is invalid. 
  //However, the backend also checks the quantity to be bought is actually smaller than the offer. 

  if (invalid) { //Displays a warning informing that there is not enough stock for the product selected. 
    warningMessage.value = `Not enough stock for "${invalid.name}". Only ${invalid.stock} available.`
    return
  }

  if (selected.length === 0) { //Displays a message informing that it has to be selected at least one product to process to checkout. 
    warningMessage.value = 'Please select at least one product.'
    return
  }

  cart.setCart(selected) //Sets the pinia cart store with the selected products. 
  router.push({ name: 'Checkout' }) //Pushes to checkout.
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
.warning-banner {
  color: #b23b3b;
  background-color: #ffe6e6;
  padding: 0.75rem 1rem;
  border: 1px solid #e0b4b4;
  border-radius: 8px;
  margin-top: 1.5rem;
  margin-bottom: -1rem;
  text-align: center;
  font-weight: 500;
}

</style>
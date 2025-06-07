<template>
  <div class="checkout-wrapper">
    <h2>Checkout</h2>

    <div v-if="items.length === 0" class="empty-cart">
      <p>Your cart is empty.</p>
      <button class="back-button" @click="goBackToProducts">Back to Products</button>
    </div>

    <div v-else class="checkout-content">
      <div class="checkout-form">
        <label>Delivery Address:</label>
        <input type="text" v-model="deliveryAddress" placeholder="e.g. 123 Coffee Street" />

        <label>Billing Address:</label>
        <input type="text" v-model="billingAddress" placeholder="e.g. Same as delivery" />

        <div class="checkout-list">
          <div class="checkout-item" v-for="item in items" :key="item.id">
            <div class="item-name">{{ item.name }}</div>
            <div class="item-qty">× {{ item.quantity }}</div>
            <div class="item-total">€{{ (item.price * item.quantity).toFixed(2) }}</div>
          </div>
        </div>
      </div>

      <div class="checkout-summary">
        <div class="checkout-total">
          <strong>Total:</strong> €{{ total.toFixed(2) }}
        </div>

        <!--Botó PayPal -->
        <div id="paypal-button-container" class="paypal-button-wrapper"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCartStore } from '@/store/cart'
import { useRouter } from 'vue-router'
import { createOrder } from '@/services/api'
import {useAuthStore} from '@/store/auth'

const router = useRouter()
const cart = useCartStore()
const auth = useAuthStore()
const items = computed(() => cart.items)

const total = computed(() =>
  items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
)

const deliveryAddress = ref('')
const billingAddress = ref('')

const goBackToProducts = () => {
  router.push('/products')
}

onMounted(() => {
  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID
  const script = document.createElement('script')
  script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=EUR`
  script.onload = initPayPalButtons
  document.body.appendChild(script)
})

function initPayPalButtons() {
  if (!window.paypal || items.value.length === 0) return

  window.paypal.Buttons({
    onInit: function (data, actions) {
      actions.enable()
  },
    createOrder: (data, actions) => {
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: total.value.toFixed(2)
          }
        }]
      })
    },
    onApprove: async (data, actions) => {
      
      const details = await actions.order.capture()

    
      const cleanItems = items.value.map(item => ({
        id: item.id.toString(),        
        quantity: item.quantity.toString()  
      }))

      const orderPayload = { //The payload of the http request contains the following fields. 
        paypalOrderId: data.orderID,
        items: cleanItems,
        price: total.value.toFixed(2),
        deliveryAddress: deliveryAddress.value,
        billingAddress: billingAddress.value
      }
      await createOrder(orderPayload)
      cart.clearCart()
      /*In case everything is fine, then pushed to the ThankYou page with the following messages*/
      router.push({ name: 'Success', query: { message: 'Thank you for your purchase!', subMessage: 'Your order has been processed.', redirectTo:'Orders'} })
    },
    onError: (err) => {
      /*In case of error, is sent to the Error page with this message. */
      router.push({ name: 'Error', query: { message: 'There has been an error', subMessage: 'Your order has not been processed.' } })
      console.error('PayPal error:', err)
    }
  }).render('#paypal-button-container') //It is rendered into this container
}
</script>

<style scoped>
.checkout-wrapper {
  max-width: 900px;
  margin: 3rem auto;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 2.5rem 2rem;
  border-radius: 1.5rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  font-family: 'Inter', sans-serif;
  color: #4b3b2f;
}

.checkout-wrapper h2 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.8rem;
  font-weight: 700;
  color: #5a3e2b;
}

.empty-cart {
  text-align: center;
  margin-top: 3rem;
  font-size: 1.1rem;
  color: #5a3e2b;
}

.back-button {
  margin-top: 1.5rem;
  padding: 0.6rem 1.5rem;
  background-color: #8b5e3c;
  color: white;
  border: none;
  border-radius: 1rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.back-button:hover {
  background-color: #a26f4f;
}

.checkout-content {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  margin-top: 2rem;
}

.checkout-form,
.checkout-summary {
  flex: 1;
}

.checkout-form label {
  display: block;
  margin-bottom: 0.3rem;
  font-weight: 600;
  color: #5a3e2b;
}

.checkout-form input {
  width: 100%;
  padding: 0.6rem;
  margin-bottom: 1.2rem;
  border: 1px solid #ccc;
  border-radius: 1rem;
  background-color: #fefaf4;
  font-size: 1rem;
  font-family: inherit;
}

.checkout-list {
  margin-top: 2rem;
}

.checkout-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  border-bottom: 1px solid #e0c4a0;
  padding-bottom: 0.5rem;
}

.checkout-total {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #3e2c23;
}

.paypal-button-wrapper {
  width: 100%; 
}
</style>


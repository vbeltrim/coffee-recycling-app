<template>
  <div class="order-item-card">
    <p><strong>Pellets:</strong> {{ item.pellets }}</p>
    <p><strong>Logs:</strong> {{ item.logs }}</p>
    <p><strong>Delivery Address:</strong> {{ item.delivery_address }}</p>
    <p><strong>Billing Address:</strong> {{ item.billing_address }}</p>
    <p><strong>PayPal Order ID:</strong> {{ item.paypal_order_id }}</p>
    <p><strong>Status: </strong> {{ item.status }}</p>

    <!-- Review buttons (conditionally rendered) -->
    <div v-if="role !== 'admin' && item.status === 'Delivered'" class="review-actions">
      <button v-if="item.pellets > 0" @click="openReview('pellets')">Write a Review for Pellets</button>
      <button v-if="item.logs > 0" @click="openReview('logs')">Write a Review for Logs</button>
    </div>

    <reviewForm
      v-if="showModal"
      :orderId="item.order_id"
      :productType="selectedProduct"
      @close="showModal = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import reviewForm from './ReviewForm.vue' 

const props = defineProps({
  item: { type: Object, required: true },
  role: { type: String, required: true }
})

const showModal = ref(false)
const selectedProduct = ref(null)

function openReview(product) {
  selectedProduct.value = product
  showModal.value = true
}
</script>

<style scoped>
.order-item-card {
  background-color: #fefaf4;
  border: 1px solid #e0c4a0;
  border-radius: 1rem;
  padding: 1rem;
  margin-top: 1rem;
  color: #4b3b2f;
  position: relative; /* Needed for absolute positioning */
}

/* Floating review button container */
.review-actions {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Stylish review button */
.review-actions button {
  background-color: #d2b48c; /* soft brown */
  color: white;
  border: none;
  border-radius: 1rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.review-actions button:hover {
  background-color: #b8956d;
}

</style>

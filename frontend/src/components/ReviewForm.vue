<template>
    <div class="modal-overlay">
      <div class="modal-card">
        <h3>Write a Review for {{ productTypeLabel }}</h3>
  
        <label>Description:</label>
        <textarea v-model="description" placeholder="Write your feedback here..." />
  
        <label>Rating:</label>
        <select v-model="star_rating">
          <option disabled value="">Select a rating</option>
          <option v-for="n in 5" :key="n" :value="n">{{ n }} ⭐</option>
        </select>
  
        <div class="actions">
          <button @click="submitReview">Submit</button>
          <button @click="$emit('close')">Cancel</button>
        </div>
  
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref,computed } from 'vue'
  import { useAuthStore } from '@/store/auth'
  import { postReview } from '@/services/api'
  import { useRouter } from 'vue-router'
  
  const props = defineProps({ //From the parent component (orderItem) it is passed the props. 
    orderId: { type: Number, required: true }, //Orderid is used to make a http request to post this review. 
    productType: { type: String, required: true }
  })
  
  const emit = defineEmits(['close'])
  
  const auth = useAuthStore()
  const description = ref('')
  const star_rating = ref('')
  const errorMessage = ref('')
  const router = useRouter()
  
  const productTypeLabel = computed(() => { //Displays Pellets or logs depending on the prop passed is "Pellets". 
    return props.productType === 'pellets' ? 'Pellets' : 'Logs'
  })
  
  async function submitReview() { //Triggered when clicked the submit button
    if (!description.value || !star_rating.value) { //Checks whether the mandatory fields are fillet. //This along with the order_id and product_id will be the body of the request. 
      errorMessage.value = 'Please fill out all fields.'
      return
    }
  
    try {
      const productId = props.productType === 'pellets' ? 1 : 2 // Sets 1 for pellets, 2 for logs.  
      await postReview({  // sends and api request with the following fields that will become the body. The api.js will add the authorization header. 
        order_id: props.orderId,
        product_id: productId,
        description: description.value,
        star_rating: parseInt(star_rating.value)
      })
      //emit('close') //Sends a close request to the parent component (orderItem) to close the modal. 
      router.push({ name: 'Success', query: { message: 'Thanks for the Review', subMessage: 'Reviews help us improve' } })
    } catch (err) {
      /*the backend may respond with several errors, if 409 means that the current logged in user has already reviewed this item
      The 403 means that somehow the user is trying to evaluate a product that has not been delivered yet. */ 
      if (err.response?.status === 409) { 
        errorMessage.value = 'You have already reviewed this product.'
      } else if (err.response?.status === 403) {
        errorMessage.value = 'You can only review products from delivered orders.'
      } else {
        console.log(err)
        errorMessage.value = 'An error occurred. Please try again.'
      }
    }
  }
  </script>
  
  <style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4); /* Softer dim effect */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-card {
  background-color: #fefaf4; /* same as order card */
  border: 1px solid #e0c4a0;
  border-radius: 1.5rem;
  padding: 2rem;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
  color: #4b3b2f;
  font-family: 'Inter', sans-serif;
}

h3 {
  margin-bottom: 1.5rem;
  font-size: 1.4rem;
  color: #4b3b2f;
}

label {
  display: block;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

textarea,
select {
  width: 100%;
  padding: 0.6rem;
  border-radius: 0.75rem;
  border: 1px solid #ccc;
  font-size: 1rem;
  background-color: #fffaf0;
}

textarea {
  resize: vertical;
  min-height: 80px;
}

.actions {
  margin-top: 2rem;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.actions button {
  flex: 1;
  background-color: #d2b48c;
  color: white;
  border: none;
  border-radius: 1rem;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.actions button:hover {
  background-color: #b8956d;
}

.error {
  color: #c0392b;
  margin-top: 1rem;
  font-size: 0.95rem;
}
  </style>
  
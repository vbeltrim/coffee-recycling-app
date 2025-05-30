<template>
    <div class="product-card">
      <div class="quantity-container">
        <div class="quantity-selector">
          <button @click="decrease">−</button>
          <span class="quantity">{{ quantity }}</span>
          <button @click="increase">+</button>
        </div>
      </div>
  

      <img v-if="product.id === 1" src="/images/pellets.jpg" alt="product image" class="product-image" />
      <img v-else src="/images/logs.jpeg" alt="product image" class="product-image" />
      <div class="product-info">
        <h2 class="product-title">{{ product.name }}</h2>
        <p class="product-short">{{ product.shortDescription }}</p>
  
        <div class="product-details">
          {{ product.longDescription }}
        </div>
        <div class="reviews-button-container">
          <button class="reviews-btn" @click="showModal = true">
           Check Reviews
          </button>
        </div>
        <ReviewList
          v-if="showModal"
          :productId="product.id"
          @close="showModal = false"
        />
      </div>
    </div>
  </template>
  
  
  <script setup>
  import { ref, watch } from 'vue'
  import ReviewList from '@/views/ReviewList.vue';

  const image = ref([]);
  const showModal = ref(false)
  const props = defineProps({
  product: Object,
  modelValue: Number
})
const emit = defineEmits(['update:modelValue'])
  const quantity = ref(props.modelValue ?? 0)

  const increase = () => {
  quantity.value++
  emit('update:modelValue', quantity.value)
}

const decrease = () => {
  if (quantity.value > 0) {
    quantity.value--
    emit('update:modelValue', quantity.value)
  }
}
watch(() => props.modelValue, val => {
  quantity.value = val
})

const toggleDetails = () => {
    showDetails.value = !showDetails.value
}
</script>
  
<style scoped>
.product-card {
  display: flex;
  position: relative;
  align-items: flex-start;
  background-color: #fffaf0;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  font-family: 'Inter', sans-serif;
  line-height: 1.6;
  max-width: 1000px;
  width: 100%;
}

.product-image {
  width: 140px;
  height: auto;
  border-radius: 12px;
  margin-right: 2rem;
  object-fit: cover;
}
.product-details{
  white-space: pre-line;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.product-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: #4b3b2f;
  margin-bottom: 0.2rem;
}

.product-short {
  font-size: 1.1rem;
  color: #5a4b3b;
  font-weight: 500;
}


.quantity-container {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.quantity-selector {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
}

.quantity-selector button {
  width: 30px;
  height: 30px;
  background-color: #c19a6b;
  color: white;
  font-weight: bold;
  font-size: 1.1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.quantity {
  font-size: 1.1rem;
  font-weight: 500;
}
.reviews-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #d2b48c;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.reviews-btn:hover {
  background-color: #b8956d;
}
  </style>
  
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
  
        <button @click="toggleDetails" class="details-btn">
          {{ showDetails ? 'Hide' : 'Details' }}
        </button>
  
        <div v-if="showDetails" class="product-details">
          {{ product.longDescription }}
        </div>
      </div>
    </div>
  </template>
  
  
  <script setup>
  import { ref, watch } from 'vue'

  const image = ref([]);
  
  const props = defineProps({
  product: Object,
  modelValue: Number
})
const emit = defineEmits(['update:modelValue'])
  const showDetails = ref(false)
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
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-family: 'Inter', 'Segoe UI', sans-serif;
  width: 100%;
  max-width: 1000px;
}

.product-image {
  width: 140px;
  height: auto;
  border-radius: 10px;
  margin-right: 1.5rem;
  object-fit: cover;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.8rem; 
}

.product-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: #4b3b2f;
}

.product-short {
  font-size: 1rem;
  color: #5a4b3b;
  line-height: 1.4;
}

.product-details {
  font-size: 0.95rem;
  color: #6b5b4a;
  background-color: rgba(255, 255, 255, 0.4);
  padding: 0.5rem 1rem;
  border-radius: 6px;
}

.details-btn {
  align-self: flex-start;
  padding: 0.3rem 0.8rem;
  border-radius: 6px;
  background-color: #c19a6b;
  color: white;
  border: none;
  cursor: pointer;
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

  </style>
  
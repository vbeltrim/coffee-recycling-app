<template>
    <div class="review-card">
      <div class="review-header">
        <span class="user-name">{{ review.name }}</span>
        <div class="stars">
          <span
            v-for="n in 5"
            :key="n"
            class="star"
          >★</span>
        </div>
      </div>
      <p class="review-text">{{ review.description }}</p>
    </div>
  </template>
  
  <script setup>
  defineProps({
    review: Object
  })
  </script>
  
  <style scoped>
 .review-card {
  background-color: #fff7ef;
  border: 1px solid #e0c4a0;
  border-radius: 1rem;
  padding: 1.2rem 1.5rem;
  margin-bottom: 1rem;
  color: #4b3b2f;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.user-name {
  font-weight: bold;
  font-size: 1rem;
  color: #3e3228;
}

.stars {
  font-size: 1.2rem;
  color: #fcd34d; 
}


.review-text {
  font-size: 1rem;
  line-height: 1.5;
}
  </style>  
<template>
    <div class="modal-overlay">
      <div class="modal-content">
        <h2 class="modal-title">Product Reviews</h2>
  
        <div v-if="reviews.length === 0" class="no-reviews">
          No reviews yet.
        </div>
  
        <div v-else class="reviews-list">
          <ReviewItem
            v-for="review in reviews"
            :key="review.id"
            :review="review"
          />
        </div>
  
        <button class="close-btn" @click="$emit('close')">Close</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue'
  import { getReviewsByProductId } from '@/services/api'
  import ReviewItem from '@/components/ReviewItem.vue'
  
  const props = defineProps({
    productId: {
      type: Number,
      required: true
    }
  })
  
  const reviews = ref([])
  
  onMounted(async () => {
    try {
      const res = await getReviewsByProductId(props.productId)
      reviews.value = res.data
    } catch (err) {
      console.error('Failed to load reviews:', err)
    }
  })
  </script>
  
  <style scoped>
 .modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100%;
  background: rgba(50, 30, 10, 0.4);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 99;
  padding-top: 4rem;
}
  
  .modal-content {
    background: #fefaf4;
    padding: 2rem;
    border-radius: 1rem;
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
  
  .modal-title {
    font-size: 1.6rem;
    color: #4b3b2f;
    margin-bottom: 1.5rem;
    text-align: center;
  }
  
  .no-reviews {
    color: #8a7663;
    text-align: center;
    font-style: italic;
  }
  
  .close-btn {
    margin-top: 2rem;
    display: block;
    margin-left: auto;
    padding: 0.6rem 1.2rem;
    background-color: #c19a6b;
    color: white;
    font-weight: bold;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
  }
  </style>
  
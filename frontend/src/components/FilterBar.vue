<template>
    <div class="filter-bar">
      <div class="filter-group">
        <label>Initial Date</label>
        <input type="date" v-model="filters.initialDate" />
      </div>
  
      <div class="filter-group">
        <label>Final Date</label>
        <input type="date" v-model="filters.finalDate" />
      </div>
  
      <div class="filter-group" v-if="role === 'admin'">
        <label>User Name</label>
        <input type="text" v-model="filters.username" placeholder="Search by name" />
      </div>
  
      <button class="reset-btn" @click="resetFilters">Reset</button>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, defineEmits } from 'vue'
  
  const props = defineProps({
    role: {
      type: String,
      default: 'buyer'
    }
  })
  
  const emit = defineEmits(['filter'])
  
  const filters = ref({
    initialDate: '',
    finalDate: '',
    username: ''
  })

  const resetFilters = () => {
    filters.value = {
    initialDate: '',
    finalDate: '',
    username: ''
  }
  emit('filter', { ...filters.value })
  }
  
watch(filters, (newFilters) => {
  emit('filter', { ...newFilters })
}, { deep: true })
  
</script>
  
  <style scoped>
  .filter-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    align-items: flex-end;
    margin: 2rem 0;
    padding: 1rem;
    background-color: #fefaf4;
    border-radius: 1rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }
  
  .filter-group {
    display: flex;
    flex-direction: column;
  }
  
  .filter-group label {
    font-weight: 600;
    margin-bottom: 0.3rem;
    color: #4b3b2f;
  }
  
  input {
    padding: 0.5rem 1rem;
    border: 1px solid #c7a07b;
    border-radius: 1rem;
    background-color: #fff;
    color: #4b3b2f;
  }
  
  .reset-btn {
    padding: 0.6rem 1.5rem;
    background-color: #8b5e3c;
    color: white;
    border: none;
    border-radius: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .apply-btn:hover {
    background-color: #a26f4f;
  }
  </style>
  
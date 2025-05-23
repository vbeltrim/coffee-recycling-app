<template>
    <div class="order-item-card">
      <p><strong>Pellets:</strong> {{ item.pellets }}</p>
      <p><strong>Logs:</strong> {{ item.logs }}</p>
      <p><strong>Delivery Address:</strong> {{ item.delivery_address }}</p>
      <p><strong>Billing Address:</strong> {{ item.billing_address }}</p>
      <p><strong>PayPal Order ID:</strong> {{ item.paypal_order_id }}</p>
    </div>
  </template>
  
  <script setup>
  defineProps({
    item: {
      type: Object,
      required: true
    }
  })
  </script>
  
  <style scoped>
  .order-item-card {
    background-color: #fefaf4;
    border: 1px solid #e0c4a0;
    border-radius: 1rem;
    padding: 1rem;
    margin-top: 1rem;
    color: #4b3b2f;
  }
  </style>
  
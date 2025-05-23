import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])

  function setCart(newItems) {
    items.value = newItems
  }

  function clearCart() {
    items.value = []
  }

  return { items, setCart, clearCart }
})

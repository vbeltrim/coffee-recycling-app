import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

// Register a new user
export const registerUser = async (userData) => {
    return axios.post(`${API_URL}/register`, userData)
  }
  
  export const loginUser = async (userData) => {
    return axios.post(`${API_URL}/login`, userData)
  }
  export const getProducts = async => {
    return axios.get(`https://coffee-fuel.shop/products`)
  }
  export const updatePassword = async (email, newPassword) => {
    const token = localStorage.getItem('token')
    return axios.post(`${API_URL}/password`, 
      { email, newPassword},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )
  }
  export const createOrder = async (orderData) => {
    const token = localStorage.getItem('token')
    return axios.post(`${API_URL}/orders`, orderData, {
        headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
  }
  export const getStock = async () => {
    return axios.get(`${API_URL}/stock`)
  }
  import { jwtDecode } from 'jwt-decode'

  export const getOrders = async () => {
    const token = localStorage.getItem('token')
    const decoded = jwtDecode(token)
  
    return axios.get(`${API_URL}/orders`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        id: decoded.id,
        role: decoded.role
      }
    })
  }
  export const submitCollaboration = async (formData) => {
    return axios.post(`${API_URL}/collaborate`, formData)
  }
  
  
    
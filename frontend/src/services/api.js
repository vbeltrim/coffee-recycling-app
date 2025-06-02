import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL
import { jwtDecode } from 'jwt-decode'

// Register a new user
  export const registerUser = async (userData) => {
    return axios.post(`${API_URL}/register`, userData)
  }
  
  //Login a user into the platform
  export const loginUser = async (userData) => {
    return axios.post(`${API_URL}/login`, userData)
  }
  //Gets all the products for sale from the database. 
  export const getProducts = async => {
    return axios.get(`${API_URL}/products`)
  }
  //Updates the password from a user. The user must be logged in. 
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
  //Creates a new order. 
  export const createOrder = async (orderData) => {
    const token = localStorage.getItem('token')
    return axios.post(`${API_URL}/orders`, orderData, {
        headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
  }
  //Returns all orders from a given user. If the user has role = 'admin' it will return the orders from every user. 
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
  //Creates a new collaboration entry in the database. 
  export const submitCollaboration = async (formData) => {
    return axios.post(`${API_URL}/collaborate`, formData)
  }
  //Creates a review for a certain product in the database. 
  export const postReview = async (reviewData) => {
    const token = localStorage.getItem('token')
    return axios.post(`${API_URL}/review`, reviewData, {
        headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
  }
  //Returns the reviews made from a certain product. 
  export async function getReviewsByProductId(productId) {
    return axios.get(`${API_URL}/review/product/${productId}`)
  }
  //Creates a new contact entry in the database. 
  export const submitContact = async (formData) => {
    return axios.post(`${API_URL}/contact`, formData)
  }
  //Returns the contact requests to the user 'Admin'
  export const getContacts = async () => {
    const token = localStorage.getItem('token')
    const decoded = jwtDecode(token)
  
    return axios.get(`${API_URL}/contact`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        id: decoded.id,
        role: decoded.role
      }
    })
  }
  
    
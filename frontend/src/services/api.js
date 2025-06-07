import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL
import {useAuthStore} from '@/store/auth'


const api = axios.create({
  baseURL: `${API_URL}`, 
  withCredentials: true,
})

//Set interceptors to check whether is received a 401 CODE from the backend. Meaning the user is not authorized. Then they should be redirected. 
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status == 401) {
      const auth = useAuthStore()
      auth.logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

api.interceptors.request.use((config) => {
  const auth = useAuthStore()
  const token = auth.token  

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})


  //Login a user into the platform
  export const loginUser = async (userData) => {
    return api.post('/login', userData)
  }

// Register a new user
  export const registerUser = async (userData) => {
    return api.post('/register', userData)
  }
  

  //Gets all the products for sale from the database. 
  export const getProducts = async => {
    return api.get('/products')
  }
  //Updates the password from a user. The user must be logged in.
 export const updatePassword = async ({currentPassword, newPassword }) => {
  return api.post('/password', {
    currentPassword,
    newPassword
  })
}
  
  //Creates a new order. 
  export const createOrder = async (orderData) => {
    return api.post('/orders', orderData) 
  }
  //Returns all orders from a given user. If the user has role = 'admin' it will return the orders from every user. 
  export const getOrders = async () => {
    return api.get('/orders')
  }
  //Creates a new collaboration entry in the database. 
  export const submitCollaboration = async (formData) => {
    return api.post('/collaborate', formData)
  }
  //Creates a review for a certain product in the database. 
  export const postReview = async (reviewData) => {
    return api.post('/review', reviewData)
  }
  //Returns the reviews made from a certain product. 
  export async function getReviewsByProductId(productId) {
    return api.get(`/review/product/${productId}`)
  }
  //Creates a new contact entry in the database. 
  export const submitContact = async (formData) => {
    return api.post('/contact', formData)
  }
  //Returns the contact requests to the user 'Admin'
  export const getContacts = async () => {
    return api.get('/contact')
  }
  
export default api
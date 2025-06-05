
import { createRouter, createWebHistory } from 'vue-router'


const Homepage = () => import('@/views/Homepage.vue')
const Login = () => import('@/views/Login.vue')
const Register = () => import('@/views/Register.vue')
const Products = () => import('@/views/Products.vue')
const Orders = () => import('@/views/Orders.vue')
const Profile = () => import('@/views/Profile.vue')
const Collaborate = () => import('@/views/Collaborate.vue')
const Dashboard = () => import('@/views/Dashboard.vue')
const Checkout = () => import('@/views/Checkout.vue')
const Contact = () => import('@/views/Contact.vue')
const Contacts = () => import('@/views/ContactsList.vue')
const Success = () => import('@/views/Success.vue')
const Error = () => import('@/views/Error.vue')

const routes = [
  { path: '/', name: 'Homepage', component: Homepage },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/products', name: 'Products', component: Products },
  { path: '/orders', name: 'Orders', component: Orders },
  { path: '/profile', name: 'Profile', component: Profile },
  { path: '/collaborate', name: 'Collaborate', component: Collaborate },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/checkout', name: 'Checkout', component: Checkout },
  { path: '/contact', name: 'Contact', component: Contact },
  { path: '/contacts', name: 'Contacts', component: Contacts },
  { path: '/success', name: 'Success', component: Success },
  { path: '/error', name: 'Error', component: Error }
  
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

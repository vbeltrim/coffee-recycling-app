
import { createRouter, createWebHistory } from 'vue-router'


const Homepage = () => import('@/views/Homepage.vue')
const Login = () => import('@/views/Login.vue')
const Register = () => import('@/views/Register.vue')
const Products = () => import('@/views/Products.vue')
const ProductItem = () => import('@/components/ProductItem.vue')
const Orders = () => import('@/views/Orders.vue')
const Profile = () => import('@/views/Profile.vue')
const Collaborate = () => import('@/views/Collaborate.vue')
const Dashboard = () => import('@/views/Dashboard.vue')
const Checkout = () => import('@/views/Checkout.vue')

const routes = [
  { path: '/', name: 'Homepage', component: Homepage },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/products', name: 'Products', component: Products },
  { path: '/products/:id', name: 'ProductItem', component: ProductItem, props: true },
  { path: '/orders', name: 'Orders', component: Orders },
  { path: '/profile', name: 'Profile', component: Profile },
  { path: '/collaborate', name: 'Collaborate', component: Collaborate },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/checkout', name: 'Checkout', component: Checkout },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router


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
  { path: '/', name: 'Homepage', component: Homepage, meta: {requiresAuth: false}},
  { path: '/login', name: 'Login', component: Login, meta: {requiresAuth: false, guestOnly: true}},
  { path: '/register', name: 'Register', component: Register, meta: {requiresAuth: false, guestOnly: true}},
  { path: '/products', name: 'Products', component: Products, meta: {requiresAuth: false}},
  { path: '/orders', name: 'Orders', component: Orders, meta: {requiresAuth: true, role: ['buyer','admin']} },
  { path: '/profile', name: 'Profile', component: Profile, meta: {requiresAuth: true, role: 'buyer'}},
  { path: '/collaborate', name: 'Collaborate', component: Collaborate, meta: {requiresBuyersGuests: true} },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: {requiresAuth: true, role: 'buyer'} },
  { path: '/checkout', name: 'Checkout', component: Checkout, meta: {requiresAuth: true, role: 'buyer'} },
  { path: '/contact', name: 'Contact', component: Contact, meta: {requiresBuyersGuests: true} },
  { path: '/contacts', name: 'Contacts', component: Contacts, meta: {requiresAuth: true, role: 'admin'} },
  { path: '/success', name: 'Success', component: Success },
  { path: '/error', name: 'Error', component: Error }
  
]


const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
import { useAuthStore } from '@/store/auth'
router.beforeEach((to, from, next) => {

  const auth = useAuthStore()
  const isLoggedIn = auth.isLoggedIn
  const userRole = auth.role || ''

  // Authenticated-only pages 
  if (to.meta.requiresAuth) {
    if (!isLoggedIn) return next({ name: 'Login' })
    if (to.meta.role && !to.meta.role.includes(userRole)) {
      return next({ name: 'Homepage' })
    }
  }
  // Guest-only pages
  if (to.meta.guestOnly && isLoggedIn) {
    return next({ name: 'Homepage' })
  }
  // Buyer OR guest pages
  if (to.meta.requiresBuyersGuests) {
    if (isLoggedIn && userRole !== 'buyer') {
      return next({ name: 'Homepage' })
    }
  }
  next()
})
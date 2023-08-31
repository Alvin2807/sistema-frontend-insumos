import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/inicio',
    name: 'Inicio',
    
    component: () => import(/* webpackChunkName: "about" */ '../views/Inicio.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router

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
    
    component: () => import('../views/Inicio.vue'),
    children:[
      {
        path:'/categorias',
        name:'Categorias',

        component: () =>import('../views/Categorias.vue')
      },

      {
        path:'/marcas',
        name:'Marcas',

        component: () =>import('../views/Marcas.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router

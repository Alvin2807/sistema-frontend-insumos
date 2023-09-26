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
      },

      {
        path:'/depositos',
        name: 'Depositos',

        component: () =>import('../views/Depositos.vue')
      },

      {
        path:'/localizaciones',
        name:'Localizaciones',

        component: () =>import('../views/Localizaciones.vue')
      },

      {
        path:'/unidades_de_medidas',
        name:'Unidades',

        component: () =>import('../views/Unidades.vue')
      },

      {
        path:'/productos',
        name:'Productos',

        component: ()=>import('../views/Productos.vue')
      },

      {
        path:'/acciones_pendientes',
        name:'AccionesPendientes',

        component: ()=>import('../views/AccionesPendientes')
      },

      {
        path:'/crear_entrada',
        name:'CrearEntrada',

        component: ()=>import('../views/CrearEntrada')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router

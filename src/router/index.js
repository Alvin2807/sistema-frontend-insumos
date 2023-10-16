import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import store from '../store'
Vue.use(VueRouter)

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: 
  [
    {
      path: '/',
      name: 'Login',
      component: Login,
      
    },
    {
      path: '/inicio',
      name: 'Inicio',
      meta: {requireAuth: true},
     
      component: () => import('../views/Inicio.vue'),
     

      children:[
        {
          path:'/categorias',
          name:'Categorias',
          meta: {requiresAuth: true},
  
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
  
})


router.beforeEach((to, from, next) =>{
  const rutaProtegida = to.matched.some(record =>record.meta.requireAuth)
  if (rutaProtegida && store.getters.autenticated === '') {
    next({name: 'Login'});
  } else {
    next()
  }
})



export default router

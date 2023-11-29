import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import store from '../store'
Vue.use(VueRouter)


const routes = 
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

        component: () =>import('../views/Categorias.vue'),
        meta: { requireAuth: true }
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
      },

      {
        path:'/edicion_de_solicitud',
        name:'EdicionEntrada',

        component: ()=>import('../views/EdicionEntrada')
      }
    ]
  }
]
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  // Usamos to para verificar si requiera autenticación
  const protectedRoute = to.meta.requireAuth ? to.meta.requireAuth : false
      // Procedemos a verificar el token
  if (protectedRoute && store.state.loginDatos.user === '') {
      next({ name: 'Login' })
  } else {
      next()
  }


})

/* const router = new VueRouter({
  mode: "hash",
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
  
          component: () =>import('../views/Categorias.vue'),
          meta: { requireAuth: true }
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
        },

        {
          path:'/edicion_de_solicitud',
          name:'EdicionEntrada',

          component: ()=>import('../views/EdicionEntrada')
        }
      ]
    }
  ]
  
}) */


/* router.beforeEach((to, from, next) =>{
  const rutaProtegida = to.matched.some(record =>record.meta.requireAuth)
  if (rutaProtegida && store.getters.autenticated === '') {
    next({name: 'Login'});
  } else {
    next()
  }
}) */






export default router

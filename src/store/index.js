import Vue from 'vue'
import Vuex from 'vuex'
import API from '@/API'
import decode from 'jwt-decode'
Vue.use(Vuex)

export default new Vuex.Store({
 
  state: {
    pendientes: '',
    loginInfo:'',
    loginDatos:{
      name:'',
      usuario:'',
      email:'',
      fk_despacho:'',
      fk_rol:''
    }
  },
  mutations: {
  
    aumentar(state, payload) {
      state.pendientes = payload
      state.total = payload
    },

    mostrarDetallesLogin(state, payload){
      state.loginDatos = payload

    },

    accederLogin(state, payload) {
      state.loginInfo = payload
    },
  },
  actions: {

    incrementar: function(context) {
      API 
      .get('contar_acciones_pendientes')
      .then(respuesta=>{
        context.commit('aumentar', respuesta.data.total)
      })
     
    },

    iniciarSession: function(context) {
      API
      .post('iniciar_sesion')
      .then(respuesta => {
          context.commit('accederLogin', respuesta.data)
      })
  }

  },
  modules: {
  }
})

import Vue from 'vue'
import Vuex from 'vuex'
import API from '@/API'
import decode from 'jwt-decode'
Vue.use(Vuex)

export default new Vuex.Store({
 
  state: {
    pendientes: '',
  },
  mutations: {
  
    aumentar(state, payload) {
      state.pendientes = payload
      state.total = payload
    }
  },
  actions: {

    incrementar: function(context) {
      API 
      .get('contar_acciones_pendientes')
      .then(respuesta=>{
        context.commit('aumentar', respuesta.data.total)
      })
     
    },

  },
  modules: {
  }
})

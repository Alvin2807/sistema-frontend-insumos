import Vue from 'vue'
import Vuex from 'vuex'
import API from '@/API'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    acciones:{}
  },
  getters: {
    items: state =>{
      return state.acciones
    }
  },
  mutations: {
    SET_Item(state, acciones){
      state.items = acciones
    }
  },
  actions: {
    datosAcciones({commit}) {
      API
      .get('contar_acciones_pendientes')
      .then(respuesta => respuesta.data.total_acciones)
      .then(acciones =>{
        console.log(acciones);
        commit('SET_Item', acciones),
        localStorage.setItem('total_acciones', acciones)
      })
      
    }
    
  },
  modules: {
  }
})

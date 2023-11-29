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
    },

    datos:{
      id_accion:'',
      fk_tipo_accion:'',
      fk_despacho_solicitud:'',
      fk_despacho_requerido:'',
      funcionario_solicitud:'',
      no_nota:'',
      fecha_nota:'',
      fecha_registro:'',
      num_entrada:'',
      fecha_entrada:'',
      fecha_confirmacion:'',
      funcionario:'',
      num_salida:'',
      fecha_incidencia:'',
      usuario_incidencia:'',
      titulo_incidencia:'',
      fk_despacho_incidencia:'',
      fecha_salida:'',
      comentario:'',
      cantidad_llegada:'',
      cantidad_pendiente:'',
      cantidad_entregada:'',
      estado:'',
      tiempo_accion:'',
      titulo_nota:'',
      funcionario_confirma:'',
      tipo_accion:'',
      despacho_incidencia:'',
      despacho_requerido:'',
      despacho_solicitud:''
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

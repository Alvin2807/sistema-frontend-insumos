import Vue from 'vue'
import Vuex from 'vuex'
import API from '@/API'
import decode from 'jwt-decode'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token:'',
    usuarioDB:''
    /* acciones:{},
    loginDatos:{},
    token: {
     
    },
    usuarioDB: '',
    authenticated:false
    
    
    ,
    user:{} */
  },
  getters: {
   /*  items: state =>{
      return state.acciones
    },

     authenticated(state){
            return state.authenticated
      },
    user(state){
        return state.user
    },

    estaActivo: state => !!state.token,

    datosUsuarios: state=>{
      return state.loginDatos
    } */
  },
  mutations: {
    obternerUsuario(state, payload) {
      state.token = payload;
      if (payload === '') {
        state.usuarioDB = ''
      } else {
        state.usuarioDB = decode(payload);
      }
    }
   /*  SET_Item(state, acciones){
      state.items = acciones
    },

    SET_AUTHENTICATED (state, value) {
        state.authenticated = value
    },
    SET_USER (state, value) {
        state.user = value
    },

    USUAROS(state, loginDatos) {
      state.datosUsuarios = loginDatos
    },

    obtenerUsuario(state, payload){
      state.token = payload; */
      /* if(payload === ''){
        state.usuarioDB = ''
      }else{
        state.usuarioDB = decode(payload);
        this.$router.push({path:'/inicio'});
      } */
    //}
  },
  actions: {
    guardarUsuario({commit}, payload) {
      localStorage.setItem('token', payload)
      commit('obternerUsuario', payload)
      
    }
    /* datosAcciones({commit}) {
      API
      .get('contar_acciones_pendientes')
      .then(respuesta => respuesta.data.total_acciones)
      .then(acciones =>{
        console.log(acciones);
        commit('SET_Item', acciones),
        localStorage.setItem('total_acciones', acciones)
      })
      
    },

    guardarUsuario({commit}, payload){
      localStorage.setItem('usuario', payload);
      commit('obtenerUsuario', payload)
    },
    cerrarSesion({commit}){
      commit('obtenerUsuario', '');
      localStorage.removeItem('token');
      router.push({name: 'login'});
    },
    leerToken({commit}){

      const token = localStorage.getItem('token');
      if(token){
        commit('obtenerUsuario', token);
      }else{
        commit('obtenerUsuario', '');
      }

    },

    

    accederLogin({commit}){
      API
      .post('iniciar_sesion')
      .then(respuesta=>respuesta.data)
      .then(loginDatos=>{
        console.log(loginDatos);
        commit('USUAROS', loginDatos),
        localStorage.setItem('token', loginDatos)
      })
    } */
    
  },

  
 
})

import API from '@/API'
export default {
    namespaced: true,
    state: {
        success: '',
        token: localStorage.getItem('token') || '',
        user: {}
    },

    mutations: {
        AUTH_REQUEST(state) {
          state.status = 'loading'
        },
    
        AUTH_SUCCESS(state, token, user) {
          state.status = 'success'
          state.token   = token
          state.user    = user
        },
    
        AUTH_ERROR(state) {
          state.status = 'error'
        },
    
        AUTH_LOGOUT(state) {
          state.status = ''
          state.token = ''
        },
    
      },

    actions: {
        LOGIN({ commit }, user) {
            API.post('iniciar_sesion', {
      
                usuario: user.usuario,
                password: user.password
      
              })
                
              .then(response => {
      
                  const token = response.data.token
                  const user  = response.data.user
      
                  localStorage.setItem('token', token)
                  localStorage.setItem('user', JSON.stringify(user))
      
                  axios.defaults.headers.common['Authorization'] = "Bearer" +token
                  commit('AUTH_SUCCESS', token, user)
      
                  resolve(response)
                  console.log(user);
      
              }).catch(err => { 
      
                  commit('AUTH_ERROR')
                  localStorage.removeItem('token')
      
                  reject(err)
      
              })
          },
       /*  async login({ commit }, user) {
            try {
              const res = await API('iniciar_sesion', {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
              });
              const userDB = await res.json();
              commit("setToken", userDB.data.token);
              localStorage.setItem("token", userDB.data.token);
              console.log(userDB);
            } catch (error) {
              console.log("Error: ", error);
            }
          }, */

          

          
    },

    getters: {
        isLoggedIn: state => !!state.token,
        authStatus: state => state.status,
    }
}
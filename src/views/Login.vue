<template>
    <v-app>
       <login-sistema/>
       <v-container>
        <v-layout align-center justify-center>
            <v-flex xs12 sm8 md3>
                <v-card class="elevation-0">
                    <v-card-text>
                        <h3 id="tituloIniciar" class="text-center">{{ iniciarLoginTitulo }}</h3>
                        <v-form ref="validacion">
                            <v-row class="mt-2">
                                <v-col 
                                    cols="12"
                                    sm="12"
                                >
                                    <v-text-field
                                        v-model="editedItem.usuario"
                                        label="Usuario"
                                        type="text"
                                        color="#011258"
                                        :rules="campoObligatorio"
                                        prepend-inner-icon="person"
                                    >
                                    </v-text-field>
                                </v-col>
                                <v-col
                                    cols="12"
                                    sm="12"
                                >
                                <v-text-field
                                    v-model="editedItem.password"
                                    label="Contraseña"
                                    :type="show1 ? 'text' : 'password'"
                                    color="#011258"
                                    dense
                                    :rules="campoObligatorio"
                                    prepend-inner-icon="password"
                                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                                    @click:append="show1 = !show1"
                                >
                                </v-text-field>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            class="elevation-0"
                            color="#011258"
                            dark
                            :loading="btnCargar"
                            @click="acceder()"
                        >
                        <v-icon class="mx-1">login</v-icon>
                        acceder
                        </v-btn>
                    </v-card-actions>
                </v-card>

            </v-flex>

        </v-layout>
       </v-container>
    </v-app>
</template>
<script src="sweetalert2.all.min.js"></script>
<script>
import LoginSistema from '../components/LoginSistema.vue'
import Swal from 'sweetalert2'
import API from '@/API'
export default {
 components:{
    LoginSistema,
 },

 data() {
        return {
            titulo:-1,
            show1: false,
            loader:null,
            password: 'Password',
            btnCargar:false,
            editedItem:{
                usuario:'',
                password:''
            },
            campoObligatorio:[
                v => !!v || 'Campo obligatorio'
            ]
        }
    },

    watch:{
        loader(){
            const l = this.loader
            this[l] = !this[l]

            setTimeout(() =>(this[l] = false), 1000)
            this.loader = null
        }
    },

    computed: {
        iniciarLoginTitulo(){
            return this.titulo === -1 ? 'Iniciar Sesion' : ''
        }
    },

    methods: {
        async acceder(){
        try {

            if (this.$refs.validacion.validate()) {
                this.loader = 'btnCargar'
                const loguear = await API.post('iniciar_sesion', this.editedItem) 
                .then(respuesta=>{
                    // eslint-disable-next-line no-empty
                    if (respuesta.data.ok == true) {
                        const token  = respuesta.data.token
                        const user   = respuesta.data.data.name
                        const usuario = respuesta.data.data.usuario
                        localStorage.setItem('token', token)
                        localStorage.setItem('user', JSON.stringify(user))
                        localStorage.setItem('usuario', JSON.stringify(usuario))
                        API.defaults.headers.common['Authorization'] = "Bearer" +token
                        this.$router.push({path:'/inicio'})
                        this.mensajeUsuarioExitoso(respuesta.data.exitoso)
                    // eslint-disable-next-line no-empty
                    } else if (respuesta.data.ok == false){
                        this.mensajeError(respuesta.data.error)
                    } else {
                        this.mensajeErrorUsuarioIncorrecto(respuesta.data.message)
                    }
                }) 
                return loguear
            }
           
        } catch (error) {
          if (error) {
            Swal.fire({
                icon:'error',
                title:'Hubo un error consulte con el administrador del sistema',
                showConfirmButton:false,
                timer:2000
            })
          }
        }
           
        },


        mensajeErrorUsuarioIncorrecto(message){
            Swal.fire({
                icon:'error',
                title: message,
                showConfirmButton: false,
                timer:2000
            })
        },

        mensajeError(error){
            Swal.fire({
                icon: 'error',
                title: 'Hubo un error',
                text: error,
                showConfirmButton:false,
                timer:2000
            })
        },

        mensajeUsuarioExitoso(exitoso){
            Swal.fire({
                icon:'success',
                title:'!Genial',
                text: exitoso,
                showConfirmButton:false,
                timer:2000
            })
        }
    },
}
</script>
<style>
#tituloIniciar{
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    font-size: 18px;
 }

 #campoLogin{
   font-size: 18px; 
 }
</style>

<template>
    <v-app id="fondo">
       
       <v-container>
        <v-layout align-center justify-center class="mt-16">
            <v-flex xs12 sm8 md3>
                <v-card class="elevation-5">
                    <v-card-text>
                    <v-toolbar flat height="100px" >    
                        <v-spacer></v-spacer>
                        <img height="90px" :src="require('../assets/mp.png')"/>
                        <img height="90px" class="mx-5" :src="require('../assets/sistema.png')"/>
                        <v-spacer></v-spacer>
                    </v-toolbar>
                       <v-toolbar flat>
                        <h3 id="tituloIniciar" class="mx-auto">Sistema de Control de Insumos</h3>
                       </v-toolbar>
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
                                    prepend-inner-icon="key"
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
                            color="#070346"
                            dark
                            width="100%"
                            height="40px"
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
//import LoginSistema from '../components/LoginSistema.vue'
import Swal from 'sweetalert2'
import API from '@/API'
import {mapActions, mapMutations, mapState} from 'vuex'
export default {
 /* components:{
    LoginSistema,
 }, */

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

    mounted() {
        window.location.hash="";
        window.location.hash="Again-No-back-button" //chrome
        window.onhashchange=function(){window.location.hash="";}
    },

    computed: {
        ...mapState(['loginDatos']),
        iniciarLoginTitulo(){
            return this.titulo === -1 ? 'Iniciar Sesion' : ''
        }
    },

    methods: {
        ...mapMutations(['mostrarDetallesLogin']),
        async acceder(){
            try {
                if (this.$refs.validacion.validate()) {
                    this.loader = 'btnCargar'
                    API
                    .post('iniciar_sesion', this.editedItem) 
                    .then(respuesta=>{
                        if (respuesta.data.ok == true) {
                            this.mostrarDetallesLogin(respuesta.data.data) 
                            this.mensajeUsuarioExitoso(respuesta.data.exitoso)
                            localStorage.setItem('usuario', JSON.stringify(respuesta.data.data))
                            this.$router.push({path:'/inicio'})
                        } else if (respuesta.data.ok == false) {
                            this.mensajeError(respuesta.data.error)
                        } else {
                            this.mensajeErrorUsuarioIncorrecto(respuesta.data.message)
                        }
                    })
                }
            } catch (error) {
                
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
 }

 #campoLogin{
   font-size: 18px; 
 }

 #fondo{
    background-image: linear-gradient(#FBFCFC,#5DADE2, #FDFEFE);
 }
</style>

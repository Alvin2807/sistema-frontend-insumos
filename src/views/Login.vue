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
<script>
import LoginSistema from '../components/LoginSistema.vue'
export default {
 components:{
    LoginSistema,
 },

 data() {
        return {
            titulo:-1,
            show1: false,
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

    computed: {
        iniciarLoginTitulo(){
            return this.titulo === -1 ? 'Iniciar Sesion' : ''
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

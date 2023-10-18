<template>
   <v-app>
    <v-container>
        <v-toolbar flat id="tituloToolbar">
            <v-toolbar-title>
                {{  tituloToolbar }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn
                color="#053565"
                dark
                height="40px"
                class="elevation-0"
                @click="crear()"
            >
                <v-icon>add</v-icon>
                crear
            </v-btn>
        </v-toolbar>

        <v-col cols="12" sm="6">
            <v-text-field
                v-model="buscar"
                label="Buscar"
                autocomplete="off"
                type="text"
                class="caption"
                color="#053565"
                prepend-inner-icon="search"
            >
            </v-text-field>
        </v-col>
        
        <v-data-table
            no-data-text="No hay datos disponibles"
            class="elevation-0"
            :footer-props="{itemsPerPageText:'Depositos por páginas'}"
            :items-per-page="10"
            :search="buscar"
            no-results-text="No se encontro resultado"
            :loading="cargarDatos"
            loading-text="Por favor espere..."
            :items="desserts"
            :headers="campos"
        >
            <template v-slot:[`item.actions`]="{item}">
                <v-tooltip left>
                    <template v-slot:activator="{on,attrs}">
                        <v-btn
                            class="mr-2 elevation-0"
                            x-small
                            fab
                            v-on="on"
                            v-bind="attrs"
                            color="green"
                            dark
                            @click="editar(item)"
                        >
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                    </template>
                    <span>Editar</span>
                </v-tooltip>
            </template>
        </v-data-table>
      <v-overlay :value="overlay" :opacity="opacity">
        <v-progress-circular
            indeterminate
            size="100"
            width="10"
            color="#053565"
        >
        </v-progress-circular>
      </v-overlay>

      <v-dialog
        v-model="dialogRegistrar"
        persistent
        width="600px"
        transition="fab-transition"
      >
        <v-card>
            <v-toolbar flat id="tituloModal">
                <v-toolbar-title>{{ tituloModal }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn class="elevation-0" x-small id="btnCerrarModal" fab @click="cerrarModalRegistro()">X</v-btn>
            </v-toolbar>
            <v-divider></v-divider>
            <v-card-text>
                <v-form ref="validacion">
                    <v-row class="mt-2">
                        <v-col cols="12" sm="12">
                            <v-text-field
                                v-model="editedItem.deposito"
                                label="Deposito"
                                type="text"
                                autocomplete="off"
                                maxLength="100"
                                color="#053565"
                                class="caption my-input"
                                :rules="camposObligatorio"
                            >
                            </v-text-field>
                        </v-col>
                        <v-col
                            cols="12"
                            sm="12"
                        >
                            <v-autocomplete
                                v-model="editedItem.fk_piso"
                                label="Piso"
                                color="#053565"
                                autocomplete="off"
                                class="caption my-input"
                                dense
                                no-data-text="No hay datos disponibles"
                                type="text"
                                :items="pisos"
                                item-text="piso"
                                item-value="id_piso"
                                :rules="camposObligatorio"
                            >
                            </v-autocomplete>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    class="elevation-0"
                    outlined
                    color="#053565"
                    :loading="btnRegistrar"
                    @click="registrar()"
                >
                    registrar
                </v-btn>
            </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
   </v-app>
</template>
<script src="sweetalert2.min.js"></script>
<script>
import API from '@/API'
import Swal from 'sweetalert2/dist/sweetalert2.js'
export default {
    data() {
        return {
            titulo:-1,
            buscar:'',
            overlay:false,
            dialogRegistrar:false,
            opacity:0,
            cargarDatos:true,
            loader:null,
            btnRegistrar:false,
            campos:
            [
                {text:'Deposito', value:'deposito'},
                {text:'Piso', value:'piso'},
                {text:'Acciones', value:'actions', sortable:false},
            ],

            camposObligatorio:
            [
                v => !!v || 'Campo obligatorio'
            ],
            desserts:[],
            editedItem:{
                deposito:'',
                usuario:'',
                fk_despacho:'',
                fk_piso:''
            },

            pisos:[]
        }
    },

    watch: {
        loader(){
            const l = this.loader
            this[l] = !this[l]

            setTimeout(()=>(this[l] = false),1000)
            this.loader = null
        }
    },

    computed: {
        tituloToolbar(){
            return this.titulo === -1 ? 'Depositos' : ''
        },

        tituloModal(){
            return this.titulo === -1 ? 'Crear Deposito' : ''
        },

        datos(){
            return localStorage.getItem('usuario').replace(/['"]+/g, '');
        },

        despachoDato(){
            return parseInt(localStorage.getItem('fk_despacho'));
        },

        tituloModalLocalizacion(){
            return this.titulo === -1 ? 'Registrar Localización' : ''
        }
    },

    mounted() {
        this.mostrarDepositos()
    },

    methods: {
    
        async mostrarDepositos(){
            this.cargarDatos = true
            const mostrar = await API.get('depositos')
            .then(respuesta=>{
                this.desserts = respuesta.data.data
                this.cargarDatos = false
            })
            return mostrar
        },

        async  mostrarPisos(){
            const mostrarData = await API.get('pisos')
            .then(respuesta=>{
               this.pisos = respuesta.data.data
            })
            return mostrarData
        },

        crear(){
            this.overlay = true
            setTimeout(() =>{
                this.overlay = false
                this.dialogRegistrar = true
                this.mostrarPisos()
            },2000)
        
        },

        cerrarModalRegistro(){
            this.dialogRegistrar = false
            this.resetearCampos()
        },

        resetearCampos(){
            this.$refs.validacion.reset()
            this.$refs.validacion.resetValidation()
        },

        resetearCamposLocalizacion(){
            this.$refs.validacionLocalizaciones.reset()
            this.$refs.validacionLocalizaciones.resetValidation()
        },

      async  registrar(){
           try {
            if (this.$refs.validacion.validate()) {
                this.loader = 'btnRegistrar'
                this.editedItem.usuario     = this.datos
                this.editedItem.fk_despacho = this.despachoDato
                const registrarDeposito = await API.post('depositos', this.editedItem)
                .then(respuesta=>{
                    if (respuesta.data.ok == true) {
                        this.mostrarDepositos()
                        this.dialogRegistrar = false
                        this.resetearCampos()
                        this.mensajeRegistroExitoso(respuesta.data.exitoso)
                    } else if (respuesta.data.ok == false) {
                        this.mensajeErrorRegistro(respuesta.data.errorRegistro)
                    } else if (respuesta.data.existe) {
                        this.mensajeExisteRegistroDeposito(respuesta.data.existe)
                    }
                    
                })

                return registrarDeposito
            }
            
           } catch (error) {
            if (error) {
                Swal.fire({
                    icon:'error',
                    title: 'Hubo un error consulte con el Administrador del sistema',
                    showConfirmButton:false,
                    timer:2000
                })
            }
           }
        },

        mensajeRegistroExitoso(exitoso) {
            Swal.fire({
                icon:'success',
                title:'!Genial',
                text: exitoso,
                showConfirmButton:false,
                timer:2000
            })
        },

        mensajeExisteRegistroDeposito(existe){
            Swal.fire({
                icon:'warning',
                title: existe,
                showConfirmButton:false,
                timer:2000
            })
        },

        mensajeErrorRegistro(errorRegistro){
            Swal.fire({
                icon:'error',
                title: errorRegistro,
                showConfirmButton:false,
                timer:2000
            })
        },

    },
}
</script>
<style>
#tituloToolbar{
    border-left: solid 8px #053565;
    font-family:Verdana, Geneva, Tahoma, sans-serif;
}

#tituloModal{
    font-family: Verdana, Geneva, Tahoma, sans-serif; 
}

#btnCerrarModal:hover{
    background-color: red;
    color: white;
}

.my-input input{
    text-transform: uppercase;
}
</style>
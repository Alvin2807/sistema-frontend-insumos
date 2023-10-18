<template>
   <v-app>
    <v-container>
        <v-toolbar flat id="tituloToolbar">
            <v-toolbar-title>{{ tituloToolbar }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn class="elevation-0" color="#053565" dark @click="crear()" height="40px"> <v-icon>add</v-icon> crear</v-btn>
        </v-toolbar>
        <v-col cols="12" sm="6">
            <v-text-field
                v-model="buscar"
                color="#053565"
                label="Buscar"
                type="text"
                autocomplete="off"
                class="caption"
                prepend-inner-icon="search"
            >
            </v-text-field>
        </v-col>
        <v-data-table
            no-data-text="No hay datos disponibles"
            no-results-text="No se encontro resultado"
            :footer-props="{itemsPerPageText:'Categorías por páginas'}"
            :items-per-page=10
            :search="buscar"
            :headers="campos"
            :items="desserts"
            :loading="cargarDatos"
            loading-text="Cargando por favor espere..."
        >
        <template v-slot:[`item.actions`]="{ item }">
            <v-btn
                color="green"
                dark
                fab
                x-small
                class="elevation-0"
                @click="editar(item)"
            >
                <v-icon>mdi-pencil</v-icon>
            </v-btn>
        </template>
        </v-data-table>
    </v-container>
   
    <v-overlay :value="overlay" :opacity="opacity">
      <v-progress-circular
        indeterminate
        size="100"
        width="10"
        color="#053565"
      ></v-progress-circular>
    </v-overlay>

    <v-dialog
        v-model="dialogRegistrar"
        persistent
        width="600px"
        transition="fab-transition"
    >
        <v-card>
            <v-toolbar flat>
                <v-toolbar-title id="tituloModal">{{ tituloModalRegistro }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn 
                    class="elevation-0" 
                    id="btnCerrar" 
                    small
                    fab
                    @click="cerrarModalRegistrar()"
                >
                X
            </v-btn>
            </v-toolbar>
            <v-divider></v-divider>
            <v-card-text>
                <v-form ref="validacion">
                    <v-row class="mt-2">
                        <v-col cols="12" sm="12">
                            <v-text-field
                                v-model="editedItem.categoria"
                                label="Categoría"
                                type="text"
                                color="#053565"
                                autocomplete="off"
                                maxLength="100"
                                class="my-input caption"
                                :rules="camposObligatorio"
                            >
                            </v-text-field>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
            
            <v-card-actions>
                
                <v-spacer></v-spacer>
                <v-btn 
                    outlined
                    color="#053565" 
                    class="elevation-0" 
                    :loading="btnRegistrar"
                    @click="registrar()"
                >
                registrar</v-btn>
            </v-card-actions>

        </v-card>

    </v-dialog>
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
            opacity:0,
            cargarDatos:true,
            btnRegistrar:false,
            dialogRegistrar:false,
            loader:null,
            campos:
            [
                {text:'Categoría', value:'categoria'},
                {text:'Editar', value:'actions', sortable:false}
            ],
            desserts:[],
            camposObligatorio:
            [
                v => !!v || 'Campo obligatorio'
            ],
            editedItem:{
                usuario:'',
                categoria:''
            },
        }
    },

    mounted() {
        this.mostrarCategoria()
    },

    watch:{ 
        loader() {
            const l = this.loader
            this[l] = !this[l]

            setTimeout(() =>(this[l] = false), 1000)
            this.loader = null
        }
    },


    computed: {
        tituloToolbar(){
            return this.titulo === -1 ? 'Categorías' : ''
        },

        tituloModalRegistro(){
            return this.titulo === -1 ? 'Crear Categoría' : ''
        },

        datos(){
            return localStorage.getItem('usuario').replace(/['"]+/g, '');
        },

    },

    methods: {
        async mostrarCategoria(){
            this.cargarDatos = true
            await API.get('categorias')
            .then(respuesta=>{
                this.desserts = respuesta.data.data
                this.cargarDatos = false
            })
        },

        editar(){

        },

        resetearValidacion(){
            this.$refs.validacion.resetValidation()
            this.$refs.validacion.reset()
        },

        crear(){
            this.overlay = true
            setTimeout(()=>{
                this.overlay = false
                this.dialogRegistrar = true
                
            },2000)
        },

        cerrarModalRegistrar(){
            this.dialogRegistrar = false
            this.resetearValidacion()
        },

      async registrar(){
            try {
                this.editedItem.usuario = this.datos
                if (this.$refs.validacion.validate()) {
                    this.loader = 'btnRegistrar'
                    const registrarCategoria = await API.post('categorias', this.editedItem)
                    .then(respuesta=>{
                    if (respuesta.data.ok == true) {
                        this.mensajeRegistrar(respuesta.data.exitoso)
                        this.resetearValidacion()
                        this.dialogRegistrar = false
                        this.mostrarCategoria()
                    } else if (respuesta.data.existe) {
                        this.mensajeExisteRegistro(respuesta.data.existe)
                    } else if (respuesta.data.ok == false) {
                        this.mensajeError(respuesta.data.errorRegistro)
                    }
                    })
                    return registrarCategoria
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

        mensajeRegistrar(exitoso){
            Swal.fire({
                icon: 'success',
                title:'!Genial',
                text: exitoso,
                showConfirmButton:false,
                timer:2000
            })
        },

        mensajeExisteRegistro(existe){
            Swal.fire({
                icon: 'warning',
                text: existe,
                showConfirmButton:false,
                timer:2000
            })
        },

        mensajeError(errorRegistro){
            Swal.fire({
                icon: 'error',
                title: 'Hubo un error',
                text: errorRegistro,
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

#btnCerrar:hover{
    background-color: red;
    color: white;
}

.my-input input{
    text-transform: uppercase;
}
</style>
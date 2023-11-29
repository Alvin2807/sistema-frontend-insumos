<template>
  <v-app>
    <v-container>
        <v-toolbar flat id="tituloToolbar">
            <v-toolbar-title>
                {{ tituloToolbar }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn
                class="elevation-0"
                color="#053565"
                dark
                height="40px"
                @click="crear()"
            >
                <v-icon>add</v-icon>
                crear
            </v-btn>
        </v-toolbar>
        <v-col
            cols="12"
            sm="6"
        >
            <v-text-field
                v-model="buscar"
                label="Buscar"
                type="text"
                color="#053565"
                autocomplete="off"
                class="caption"
                prepend-inner-icon="search"
                placeholder="Bucar por código"
            >

            </v-text-field>
        </v-col>

        <v-data-table
            :search="buscar"
            no-data-text="No hay datos disponibles"
            no-results-text="No se encontro resultado"
            :items="desserts"
            :headers="campos"
            :footer-props="{itemsPerPageText:'Productos por páginas'}"
            :items-per-page="10"
            :loading="cargarDatos"
            loading-text="Cargando por favor espere..."
        >
            <template v-slot:[`item.actions`]="{item}">
               <v-btn
                class="elevation-0"
                fab
                x-small
                color="green"
                dark
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
        >
        </v-progress-circular>
    </v-overlay>

    <v-dialog
        v-model="dialogRegistrar"
        width="800px"
        persistent
        transition="fab-transition"
    >
        <v-card>
            <v-toolbar flat id="tituloModal">
                <v-toolbar-title>
                    {{ tituloModalRegistrar }}
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn
                    class="elevation-0"
                    fab
                    x-small
                    id="btnCerrarModal"
                    @click="cerrarModalRegistro()"
                >
                    X
                </v-btn>
            </v-toolbar>
            <v-divider></v-divider>
            <v-card-text>
                <span class="text--primary">Campos obligatorios*</span>
                <v-form ref="validacion">
                  
                    <v-row >
                        <v-col
                            cols="12"
                            sm="3"
                        >
                            <v-text-field
                                v-model="editedItem.codigo_producto"
                                label="Código*"
                                type="text"
                                maxLength="11"
                                autocomplete="off"
                                color="#053565"
                                class="caption my-input"
                                :rules="campoObligatorio"
                            >

                            </v-text-field>

                        </v-col>
                        <v-col
                            cols="12"
                            sm="5"
                        >
                            <v-text-field
                                v-model="editedItem.producto"
                                label="Producto*"
                                type="text"
                                maxLength="100"
                                autocomplete="off"
                                color="#053565"
                                class="caption my-input"
                                :rules="campoObligatorio"
                            >
                            </v-text-field>
                        </v-col>

                        <v-col
                            cols="12"
                            sm="4"
                        >
                            <v-autocomplete
                                v-model="editedItem.fk_categoria"
                                label="Categoría*"
                                type="text"
                                color="#053565"
                                autocomplete="off"
                                dense
                                :items="categoriaData"
                                item-text="categoria"
                                item-value="id_categoria"
                                class="caption my-input mt-5"
                                no-data-text="No hay datos disponibles"
                                :rules="campoObligatorio"
                            >
                            </v-autocomplete>
                        </v-col>
                        <v-col
                            cols="12"
                            sm="6"
                        >
                            <v-autocomplete
                                v-model="editedItem.fk_marca"
                                label="Marca*"
                                type="text"
                                color="#053565"
                                autocomplete="off"
                                dense
                                :items="marcasData"
                                item-text="nombre_marca"
                                item-value="id_marca"
                                class="caption my-input"
                                no-data-text="No hay datos disponibles"
                                :rules="campoObligatorio"
                                @change="mostrarModelos(editedItem.fk_marca)"
                              
                            >
                            </v-autocomplete>
                        </v-col>

                        <v-col
                            cols="12"
                            sm="6"
                        >
                            <v-autocomplete
                                v-model="editedItem.fk_impresora"
                                label="Modelo de impresora*"
                                type="text"
                                color="#053565"
                                autocomplete="off"
                                dense
                                :items="modelos"
                                item-text="impresora"
                                item-value="id_impresora"
                                class="caption my-input"
                                no-data-text="No hay datos disponibles"
                                :rules="campoObligatorio"
                              
                            >
                            </v-autocomplete>
                        </v-col>

                        <v-col
                            cols="12"
                            sm="6"
                        >
                            <v-autocomplete
                                v-model="editedItem.fk_unidad_medida"
                                label="Unidad de Medida*"
                                type="text"
                                color="#053565"
                                autocomplete="off"
                                dense
                                :items="medidas"
                                item-text="unidad_medida"
                                item-value="id_unidad_medida"
                                class="caption my-input"
                                no-data-text="No hay datos disponibles"
                                :rules="campoObligatorio"
                            >
                            </v-autocomplete>
                        </v-col>

                        <v-col
                            cols="12"
                            sm="6"
                        >
                            <v-autocomplete
                                v-model="editedItem.fk_color"
                                label="Color"
                                type="text"
                                color="#053565"
                                autocomplete="off"
                                dense
                                :items="colores"
                                item-text="color"
                                item-value="id_color"
                                class="caption my-input"
                                no-data-text="No hay datos disponibles"
                            >
                            </v-autocomplete>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-spacer></v-spacer>
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

  </v-app>
</template>
<script src="sweetalert2.min.js"></script>
<script>
import API from '@/API'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import {mapState} from 'vuex'
export default {
    data() {
        return {
            titulo:-1,
            buscar:'',
            overlay:false,
            opacity:0,
            loader:null,
            cargarDatos:true,
            btnRegistrar:false,
            dialogRegistrar:false,
            campos:
            [
                {text:'Código', value:'codigo_producto'},
                {text:'Producto', value:'producto', filterable:false},
                {text:'Marca', value:'nombre_marca', filterable:false},
                {text:'Categoría', value:'categoria', filterable:false},
                {text:'Color', value:'color', filterable:false},
                {text:'Impresora', value:'impresora', filterable:false},
                {text:'Stock', value:'stock', filterable:false},
                {text:'Estado', value:'estado', filterable:false},
                {text:'Editar', value:'actions', sortable:false}
            ],
            desserts:[],
            categoriaData:[],
            medidas:[],
            marcasData:[],
            colores:[],
            modelos:[],
            campoObligatorio:
            [
                v => !!v || 'Campo obligatorio'
            ],
            editedItem:{
                codigo_producto:'',
                producto:'',
                fk_categoria:'',
                fk_marca:'',
                fk_unidad_medida:'',
                fk_color:'',
                fk_impresora:'',
                usuario:''
            }
        }
    },

    watch: {
        loader(){
            const l = this.loader
            this[l] = !this[l]

            setTimeout(() =>(this[l] = false), 1000)
            this.loader = null
        }
    },

    computed: {
        ...mapState(['loginDatos']),
        tituloToolbar(){
            return this.titulo === -1 ? 'Productos' : ''
        },

        tituloModalRegistrar(){
            return this.titulo === -1 ? 'Registrar Producto' : ''
        },

    },

    mounted() {
        this.mostrarProductos()
    },

    methods: {
        async mostrarProductos(){
            this.cargarDatos = true
            await API.get('productos')
            .then(respuesta=>{
                this.desserts = respuesta.data.data
                this.cargarDatos = false
            })
        },

        crear(){
            this.overlay = true
            setTimeout(()=>{
                this.overlay = false
                this.dialogRegistrar = true
                this.mostrarCategoriasProductos()
                this.mostrarMarcas()
                this.mostrarUnidadesMedidasProductos()
                this.mostrarColoresProductos()
            },2000)
        },

        cerrarModalRegistro(){
            this.dialogRegistrar = false
            this.resetearModalRegistro()
        },

        resetearModalRegistro(){
            this.$refs.validacion.reset()
            this.$refs.validacion.resetValidation()
        },

      async  mostrarCategoriasProductos()
        {
            await API.get('categorias')
            .then(respuesta=>{
                this.categoriaData = respuesta.data.data
            })
        },

        async mostrarMarcas(){
            await API.get('marcas')
            .then(respuesta=>{
                this.marcasData = respuesta.data.data
            })
        },

       async mostrarUnidadesMedidasProductos(){
            await API.get('unidades_de_medidas')
            .then(respuesta=>{
                this.medidas = respuesta.data.data
            })
        },

       async mostrarColoresProductos(){
            await API .get('colores')
            .then(respuesta=>{
                this.colores = respuesta.data.data
            })
        },


      async  registrar(){
            try {
                if (this.$refs.validacion.validate()) {
                    this.editedItem.usuario = this.loginDatos.usuario
                    this.loader = 'btnRegistrar'
                    const registrarProducto = await API.post('productos', this.editedItem)
                    .then(respuesta=>{
                        if (respuesta.data.ok == true) {
                            this.mostrarProductos()
                            this.dialogRegistrar = false
                            this.resetearModalRegistro()
                            this.mensajeExitosoRegistro(respuesta.data.exitoso)
                        } else if (respuesta.data.existe) {
                            this.mensajeExisteRegistro(respuesta.data.existe)
                        } else if (respuesta.data.ok == false) {
                            this.mensajeErrorRegistro(respuesta.data.errorRegistro)
                        }
                    })
                    return registrarProducto
                }
            } catch (error) {
                if (error) {
                    Swal.fire({
                        icon:'error',
                        title:'Hubo un error consulte con el Administrador del sistema',
                        showConfirmButton:false,
                        timer:2000
                    })
                }
            }
        },

        mensajeExitosoRegistro(exitoso){
            Swal.fire({
                icon:'success',
                title:'!Genial',
                text: exitoso,
                showConfirmButton:false,
                timer:2000
            })
        },

        mensajeExisteRegistro(existe){
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

        mostrarModelos(fk_marca){
            if (fk_marca !== null) {
                API
                .get('selectModelos/' + fk_marca)
                .then(respuesta=>this.modelos = respuesta.data.data)
            } else {
                this.editedItem.modelos = null
                this.modelos = []
                return
            }
        }
    },
}
</script>
<style>
#tituloToolbar{
    border-left: solid 8px #053565;
    font-family:Verdana, Geneva, Tahoma, sans-serif;
    font-weight: bold;
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
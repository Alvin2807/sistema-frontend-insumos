<template>
    <v-app>
        <v-container>
            <v-card class="elevation-0">
                <v-toolbar flat id="tituloToolbar">
                    <v-toolbar-title>{{ tituloToolbar }}</v-toolbar-title>
                </v-toolbar>
                <v-divider></v-divider>
                <v-card-text>
                    <v-toolbar flat>
                        <v-toolbar-title>
                            <span id="tituloDato">Datos Generales</span>
                        </v-toolbar-title>
                    </v-toolbar>
                    <v-form ref="validacion">
                        <span>Campos Obligatorios</span>
                        <v-row class="mt-2">
                            <v-col
                                cols="12"
                                sm="6"
                            >
                                <v-text-field
                                    v-model="editeItem.no_nota"
                                    color="#053565"
                                    label="No. de nota*"
                                    autocomplete="off"
                                    type="text"
                                    maxLength="20"
                                    class="my-input"
                                    :rules="Obligatorio"
                                >
                                </v-text-field>
                            </v-col>
                            <v-col
                                cols="12"
                                sm="6"
                            >
                                <v-text-field
                                    v-model="editeItem.titulo_nota"
                                    color="#053565"
                                    label="Titulo de nota*"
                                    autocomplete="off"
                                    type="text"
                                    maxLength="100"
                                    class="my-input"
                                    :rules="Obligatorio"
                                >
                                </v-text-field>
                            </v-col>
                            <v-col
                                cols="12"
                                sm="12"
                            >
                                <v-autocomplete
                                    v-model="editeItem.fk_despacho_requerido"
                                    label="Despacho a solicitar*"
                                    autocomplete="off"
                                    color="#053565"
                                    dense
                                    :items="despachos"
                                    item-text="despacho"
                                    item-value="id_despacho"
                                    no-data-text="No hay datos disponible"
                                    :rules="Obligatorio"
                                >
                                </v-autocomplete>
                            </v-col>
                            <v-col
                                cols="12"
                                sm="12"
                            >
                                <v-textarea
                                    v-model="editeItem.comentario"
                                    label="Obervación"
                                    autocomplete="off"
                                    color="#053565"
                                    type="text"
                                    maxLength="100"
                                    counter="100"
                                    dense
                                    rows="1"
                                >
                                </v-textarea>
                            </v-col>
                        </v-row>
                        <v-toolbar flat>
                            <span id="tituloDato">Productos a solicitar({{ totalProductosSolicitados }})</span>
                            <v-btn 
                                color="#053565" 
                                text 
                                class="mx-2"
                                outlined
                                :loading="loading"
                                @click="buscarProducto()"
                            >
                            <v-icon>search</v-icon>
                            </v-btn>
                            <v-spacer></v-spacer>
                            <v-col
                                cols="12"
                                sm="6"
                            >
                                <v-text-field
                                    v-model="buscar"
                                    type="text"
                                    class="caption"
                                    color="#053565"
                                    label="Buscar"
                                    autocomplete="off"
                                    placeholder="Buscar por código o producto"
                                    clearable
                                >
                                </v-text-field>
                            </v-col>
                        </v-toolbar>
                        <div
                            v-for="(producto, index) in editeItem.productos" 
                            v-bind:key="index + producto"
                            
                            
                        >
                        <v-toolbar class="mt-2 elevation-0" style="border-bottom:1px solid black">
                            <h3 class="mt-3 red--black">N° item: {{producto.item}}</h3>
                        </v-toolbar>
                        <span>Código
                                    <p>{{producto.codigo_producto}}</p>
                                </span>
                        
                   <!--      <v-data-table
                            class="elevation-0 user-table"
                            :items="editeItem.productos"
                            :headers="camposData"
                            :search="buscarData"
                            no-data-text="No hay productos en la listas"
                            no-results-text="No se encontro resultado"
                            :footer-props="{itemsPerPageText:'Productos por páginas'}"
                            :items-per-page="5"
                            >
                            <template v-slot:item="{ item }" >
                                
                                <tr>
                                <td class="text-xs-right pa-4"> {{ item.codigo_producto }} </td>
                                <td class="text-xs-right pa-4"> {{ item.producto }} </td>
                                <td class="text-xs-right pa-4"> {{ item.categoria }} </td>
                                <td class="text-xs-right pa-4"> {{ item.nombre_marca }} </td>
                                <td class="text-xs-right pa-4"> {{ item.color }} </td>
                                <td class="text-xs-right pa-4">
                                    <v-col cols="12" sm="3">
                                        <v-text-field
                                            v-model="item.cantidad"
                                            color="#053565"
                                            type="number"
                                            autocomplete="off"
                                            :rules="campoObligatorio"
                                        >
                                        </v-text-field>
                                    </v-col>
                                </td>
                                <td class="text-xs-right pa-4">
                                    <v-btn text small color="red" @click="eliminar()">
                                    <v-icon>close</v-icon>
                                    </v-btn>
                                </td>
                                </tr>
                            </template>
                        </v-data-table> -->
                            
                        </div>

                    

                 

                 
                    </v-form>
                </v-card-text>
            </v-card>
            <v-dialog
                v-model="dialog"
                persistent
                transition="fab-transition"
                max-width="700px"
            >
                <v-card class="elevation-0">
                    <v-toolbar flat>
                        <v-toolbar-title>{{ tituloModal }}</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn class="elevation-0" x-small id="btnCerrarModal" fab @click="cerrarModal()">X</v-btn>
                    </v-toolbar>
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-toolbar flat>
                            <v-spacer></v-spacer>
                            <v-col
                                cols="12"
                                sm="6"
                            >
                                <v-text-field
                                    v-model="buscar"
                                    type="text"
                                    class="caption mt-5"
                                    color="#053565"
                                    label="Buscar"
                                    autocomplete="off"
                                    placeholder="Buscar por código o producto"
                                    clearable
                                    prepend-inner-icon="search"
                                >

                                </v-text-field>

                            </v-col>
                        </v-toolbar>
                        <v-data-table
                            class="elevation-0 user-table"
                            :headers="campos"
                            :items="desserts"
                            :search="buscar"
                            :footer-props="{itemsPerPageText:'Productos por páginas'}"
                            :loading="cargarDatos"
                            loading-text="Cargando por favor espere..."
                            :items-per-page="5"
                            no-data-text="No hay datos disponibles"
                            no-results-text="No se encontro resultado"
                        >
                        <template v-slot:item="{ item }">
                            <tr>
                            <td class="text-xs-right pa-4"> {{ item.codigo_producto }} </td>
                            <td class="text-xs-right pa-4"> {{ item.producto }} </td>
                            <td class="text-xs-right pa-4"> {{ item.categoria }} </td>
                            <td class="text-xs-right pa-4"> {{ item.nombre_marca }} </td>
                            <td class="text-xs-right pa-4"> {{ item.color }} </td>
                            <td class="text-xs-right pa-4">
                            <v-btn
                                fab
                                small
                                dark
                                color="green"
                                class="elevation-0"
                                @click="elegir(item)"
                            >
                            <v-icon>add</v-icon>
                            </v-btn> 
                            </td>
                            </tr>
                        </template>

                      
                        </v-data-table>

                    </v-card-text>
                </v-card>
            </v-dialog>
        </v-container>
    </v-app>
</template>
<script>
import API from '@/API'
import { mapState } from 'vuex'
export default {
    data() {
        return {
            titulo: -1,
            dialog:false,
            loading:false,
            buscar:'',
            buscarData:'',
            loader:null,
            cargarDatos:true,
            editeItem:{
                id_accion:'',
                no_nota:'',
                titulo_nota:'',
                fk_despacho_requerido:'',
                comentario:'',
                productos:{
                    fk_producto:'',
                    codigo_producto:'',
                    producto:'',
                    categoria:'',
                    nombre_marca:'',
                    color:'',
                    cantidad:'',
                    actions:false
                }
            },

            Obligatorio:
            [
                v =>!!v || 'Campo Obligatorio'
            ],
            despachos:[],
            desserts:[],
            datosProductos:[],
            camposData:
            [
                {text:'Código', value:'codigo_producto'},
                {text:'Producto', value:'producto'},
                {text:'Categoría', value:'categoria', filterable:false},
                {text:'Marca', value:'nombre_marca', filterable:false},
                {text:'Color', value:'color', filterable:false},
                {text:'Cantidad', value:'cantidad', filterable:false},
                {text: 'Eliminar', value:'actions', sortable:false},
                
            ],
            campos:
            [
                {text:'Código', value:'codigo_producto'},
                {text:'Producto', value:'producto'},
                {text:'Categoría', value:'categoria', filterable:false},
                {text:'Marca', value:'nombre_marca', filterable:false},
                {text:'Color', value:'color', filterable:false},
                {text: 'Elegir', value:'actions', sortable:false},
                
            ],
            campoObligatorio:
            [
                v => !!v || 'Campo requerido',
                v => v > 0 || 'Campo obligatorio'
            ],
        }
    },

    watch: {
      loader () {
        const l = this.loader
        this[l] = !this[l]

        setTimeout(() => (this[l] = false), 2000)

        this.loader = null
      },
    },
    mounted() {
        this.mostrarData()
    },

    computed: {
        ...mapState(['loginDatos','datos']),
        tituloToolbar(){
            return this.titulo === -1 ? 'Edicion de Solicitud' : ''
        },

        totalProductosSolicitados(){
            return this.editeItem.productos.length
        },

        tituloModal(){
            return this.titulo === -1 ? 'Productos' : ''
        },

       productosData(){
           this.editeItem.productos
        }
    },

    methods: {
        async mostrarDespachosEntradas(){
            API.get('despachos_disponibles_para_entrada')
            .then(respuesta=>{
                this.despachos = respuesta.data.data
            })
        },

        async  mostrarData(){
            const solicitudes = localStorage.getItem('id_accion')
            this.datos.id_accion = solicitudes
            const respuesta = await API.get('detalle_de_solicitud_pendiente/' + solicitudes)
            this.editeItem  = respuesta.data.data
            this.mostrarProductos()
            this.mostrarDespachosEntradas()
            
        },

        buscarProducto(){
            this.loader = 'loading'
            setTimeout(()=>{
                this.dialog = true
            },2000)
      },

      async  mostrarProductos() {
        this.cargarDatos = true
        API.get('mostrar_productos_para_entrada')
        .then(respuesta=>{
            this.desserts = respuesta.data.data
            this.cargarDatos = false
        })
      },

      cerrarModal(){
        this.dialog = false
      },
    },
}
</script>

<style>
#tituloToolbar{
    border-left: solid 8px #053565;
    font-family:Verdana, Geneva, Tahoma, sans-serif;
    font-weight: bold;
}

#tituloDato{
    font-family:Verdana, Geneva, Tahoma, sans-serif;
    font-size: 18px;
}

</style>
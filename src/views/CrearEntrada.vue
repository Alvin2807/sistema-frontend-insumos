<template>
    <v-app>
        <v-container>
            <v-card class="elevation-0">
                <v-toolbar flat id="tituloToolbar">
                    <v-toolbar-title>{{ tituloToolbar }}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn 
                        color="red" 
                        dark 
                        :loading="btnNuevo" 
                        class="elevation-0 pa-5"  
                        @click="nuevo()">
                        Nuevo
                    </v-btn>
                    <v-btn 
                        color="#053565" 
                        dark 
                        class="elevation-0 pa-5 mx-2" 
                        :loading="btnRegistrar"  
                        @click="registrar()"
                    >
                    registrar
                    </v-btn>
                </v-toolbar>
                <v-divider></v-divider>
                <v-card-text>
                    <v-toolbar flat>
                        <v-toolbar-title>
                            <span id="tituloDato">Datos Generales</span>
                        </v-toolbar-title>
                    </v-toolbar>
                    <v-form ref="validacion">
                        <span>Campos Obligatorios*</span>
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
                                v-model="editeItem.fk_despaho_requerido"
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
                        <v-btn class="mx-2 elevation-0" color="#053565" text outlined :loading="loading" @click="buscarProducto()"><v-icon>search</v-icon></v-btn>
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
                        <v-toolbar-title>
                           
                        </v-toolbar-title>
                       </v-toolbar>

                        <v-data-table
                                class="elevation-0 user-table"
                                :items="editeItem.productos"
                                :headers="camposData"
                                :search="buscarData"
                                no-data-text="No hay productos en la listas"
                                no-results-text="No se encontro resultado"
                                :footer-props="{itemsPerPageText:'Productos por páginas'}"
                                :items-per-page="5"
                            >
                            <template v-slot:item="{ item }">
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
                        </v-data-table>
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
<script src="sweetalert2.min.js"></script>
<script>
import API from '@/API'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import {mapActions, mapMutations, mapState} from 'vuex'
export default {
    data() {
        return {
            titulo: -1,
            buscarData:'',
            cargarDatos:true,
            buscar:'',
            btnNuevo:false,
            btnRegistrar:false,
            loader:null,
            dialog:false,
            loading:false,
            editeItem:{
            no_nota:'',
            titulo_nota:'',
            fk_despaho_requerido:'',
            fk_tipo_accion:1,
            fk_despacho:'',
            funcionario_solicitud:'',
            usuario:'',
            productos:
            [
              {
                id_producto:'',
                codigo_producto:'',
                producto:'',
                categoria:'',
                nombre_marca:'',
                color:'',
                cantidad:'',
                actions:false
              }

            ],

          },
          desserts:[],
          despachos:[],
          campoObligatorio:
          [
            v => !!v || 'Campo requerido',
            v => v > 0 || 'Campo obligatorio'
          ],

          Obligatorio:
          [
            v => !!v || 'Campo requerido',
            
          ],
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
        }
    },

    mounted() {
        this.mostrarProductosDisponibles()
        this.mostrarDespachosEntradas()
    },

    watch: {
      loader () {
        const l = this.loader
        this[l] = !this[l]

        setTimeout(() => (this[l] = false), 2000)

        this.loader = null
      },
    },

    computed: {
        ...mapState(['contador']),
        tituloToolbar(){
            return this.titulo === -1 ? 'Formulario de Entrada' : ''
        },

        totalProductosSolicitados(){
            return this.editeItem.productos.length
        },

        tituloModal(){
            return this.titulo === -1 ? 'Productos' : ''
        },

        datos(){
            return localStorage.getItem('usuario').replace(/['"]+/g, '');
        },

        despachoUsuario(){
            return localStorage.getItem('fk_despacho').replace(/['"]+/g, '');
        },

        usuarioSolicitud(){
            return localStorage.getItem('user').replace(/['"]+/g, '');
        },

    },

    methods: {
        ...mapActions(['incrementar']),
        ...mapMutations(['aumentar']),
        async mostrarDespachosEntradas(){
        API.get('despachos_disponibles_para_entrada')
        .then(respuesta=>{
            this.despachos = respuesta.data.data
        })
      },

      async  mostrarProductosDisponibles() {
        this.cargarDatos = true
        API.get('mostrar_productos_para_entrada')
        .then(respuesta=>{
            this.desserts = respuesta.data.data
            this.cargarDatos = false
            this.editeItem.productos = []
        })
      },

      buscarProducto(){
        this.loader = 'loading'
        setTimeout(()=>{
            this.dialog = true
        },2000)
      },

      cerrarModal(){
        this.dialog = false
      },

      elegir(item){

        let {productos} = this.editeItem
        //const result = productos.filter((word) => word.id_producto == item.id_producto);
        const result = productos.filter(data=>data.id_producto === item.id_producto);
        if (result.length > 0) {
            Swal.fire({
                icon:'warning',
                title: 'Ya existe el código ' + item.codigo_producto + ' en la lista',
                showConfirmButton: false,
                timer:2000
            })
        } else {
        this.editeItem.productos.push({
            id_producto: item.id_producto,
            codigo_producto: item.codigo_producto,
            producto: item.producto,
            categoria: item.categoria,
            nombre_marca: item.nombre_marca,
            color: item.color,
            cantidad:1,
        }) 

        } 
      },

      eliminar(){
        this.editeItem.productos.splice(this.editedIndex, 1)
      },

      resetProductos(){
        this.$refs.validacion.reset()
        this.$refs.validacion.resetValidation()
      },

      nuevo(){
        this.loader = 'btnNuevo'
        this.resetProductos()
        this.editeItem.productos = []
      },

      registrar(){
        if (this.$refs.validacion.validate()) {
            if (this.editeItem.productos.length == 0) {
                Swal.fire({
                    icon:'warning',
                    title:'Faltan campos obligatorios',
                    showConfirmButton:false,
                    timer:2000
                }) 
            } else {
                this.loader = 'btnRegistrar'
                this.editeItem.usuario = this.datos
                this.editeItem.funcionario_solicitud = this.usuarioSolicitud
                this.editeItem.fk_despacho = parseInt(this.despachoUsuario)  
                const registrarDatos = async () =>{
                    try {
                        this.loader = 'btnRegistrar'
                        this.editeItem.usuario = this.datos
                        this.editeItem.funcionario_solicitud = this.usuarioSolicitud
                        this.editeItem.fk_despacho = parseInt(this.despachoUsuario)
                        const respuesta = await API.post('acciones', this.editeItem)
                        if (respuesta.data.ok == true) {
                            const {id} = respuesta.data.data
                            localStorage.setItem('id_accion', id)
                            this.incrementar()
                            this.$router.push('/edicion_de_solicitud')
                            this.mensajeRegistrarExitoso(respuesta.data.exitoso)
                        } else if (respuesta.data.existe) {
                            this.mensajeExisteRegistro(respuesta.data.existe)
                        } else if (respuesta.data.ok == false) {
                            this.mensajeRegistraError(respuesta.data.errorRegistro)
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
                }
                return registrarDatos();
            }
        }

       /*  try {
            if (this.$refs.validacion.validate()) {
                if (this.editeItem.productos == 0) {
                    Swal.fire({
                        icon:'warning',
                        title:'Faltan campos obligatorios',
                        showConfirmButton:false,
                        timer:2000
                    })
                } else {
                    this.loader = 'btnRegistrar'
                    this.editeItem.usuario = this.datos
                    this.editeItem.funcionario_solicitud = this.usuarioSolicitud
                    this.editeItem.fk_despacho = parseInt(this.despachoUsuario)
                   API.post('acciones', this.editeItem)
                    .then(respuesta=>{
                        if (respuesta.data.ok == true) {
                            const {id_accion} = respuesta.data.data
                            localStorage.setItem('id_accion', id_accion)
                            this.incrementar()
                            this.mensajeRegistrarExitoso(respuesta.data.exitoso)
                        } else if (respuesta.data.existe) {
                            this.mensajeExisteRegistro(respuesta.data.existe)
                            
                        } else if (respuesta.data.existe) {
                           
                    }
                    })
                }
            } else {
                Swal.fire({
                    icon:'warning',
                    title:'Faltan campos obligatorios',
                    showConfirmButton:false,
                    timer:2000
                })
                
            } 
        } catch (errorDatos) {
            if (errorDatos) {
                Swal.fire({
                    icon:'error',
                    title:'Hubo un error consulte con el Administrador del sistema',
                    showConfirmButton:false,
                    timer:2000
                })  
            }
        } */
       
        
      },

      mensajeRegistrarExitoso(exitoso){
        Swal.fire({
            icon:'success',
            title:'!Genial',
            text: exitoso,
            showConfirmButton:false,
            timer:2000
        })
      },

      mensajeRegistraError(errorRegistro){
        Swal.fire({
            icon:'error',
            title:errorRegistro,
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

#btnCerrarModal:hover{
    background-color: red;
    color: white;
}

.my-input input{
    text-transform: uppercase;
}
</style>
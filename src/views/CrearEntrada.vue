<template>
    <v-app>
        <v-container>
            <v-stepper
                v-model="formulario"
                vertical
                class="elevation-0"
                v-if="!buscando && !mensaje"
            >
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
                            color="teal" 
                            dark 
                            class="elevation-0 pa-5 mx-2" 
                            @click="registrar()"
                        >
                        registrar
                        </v-btn>
                </v-toolbar>
                <v-divider></v-divider>
                <v-stepper-step
                    :complete="formulario>1"
                    step="1"
                    color="#053565" 
                ><span id="tituloDato">Datos Generales</span>
                </v-stepper-step>
                <v-stepper-content step="1">
                    <span>Campos Obligatorios*</span>
                    <v-card class="elevation-0">
                        <v-form ref="validacion">
                            <v-row class="mt-3">
                                <v-col
                                    cols="12"
                                    sm="6"
                                >
                                    <v-text-field
                                        v-model="editeItem.no_nota"
                                        type="text"
                                        color="#053565"
                                        maxlength="11"
                                        label="N° de nota*"
                                        class="my-input"
                                        autocomplete="off"
                                        :counter="11"
                                        :rules="rulesNotas"
                                        hint="Ejemplo: NT-001-1991"
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
                                        :rules="rulesTituloNota"
                                    >
                                    </v-text-field>
                                </v-col>
                                <v-col
                                    cols="12"
                                    sm="5"
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
                                        @change="getDireccionDespacho()"
                                    >
                                    </v-autocomplete>
                                </v-col>
                                <v-col
                                    cols="12"
                                    sm="4"
                                >
                                    <v-text-field
                                        v-model="editeItem.direccion"
                                        label="Lugar de destino*"
                                        autocomplete="off"
                                        color="#053565"
                                        type="text"
                                        maxLength="100"
                                        dense
                                        readonly
                                    >
                                    </v-text-field>
                                </v-col>

                                <v-col
                                    cols="12"
                                    sm="3"
                                >
                                    <v-text-field
                                        v-model="editeItem.provincia"
                                        label="Ciudad de destino*"
                                        autocomplete="off"
                                        color="#053565"
                                        type="text"
                                        maxLength="100"
                                        dense
                                        readonly
                                    >
                                    </v-text-field>
                                </v-col>
                                <v-col
                                    cols="12"
                                    sm="12"
                                >
                                    <v-textarea
                                        v-model="editeItem.comentario"
                                        label="Obervación*"
                                        autocomplete="off"
                                        color="#053565"
                                        type="text"
                                        maxLength="100"
                                        counter="100"
                                        dense
                                        rows="1"
                                        :rules="Obligatorio"
                                    >
                                    </v-textarea>
                                </v-col>
                            </v-row>

                        </v-form>
                    </v-card>
                    <v-btn
                        color="#053565"
                        dark
                        class="white--text"
                        @click="btnSiguiente()"
                    >
                        siguiente
                        <v-icon class="mx-1">skip_next</v-icon>
                    </v-btn>

                </v-stepper-content>

                <v-stepper-step
                    :complete="formulario > 2"
                    color="#053565"
                    step="2"
                >
                <span id="tituloDato">Detalles de Productos a Solicitar</span>
                </v-stepper-step>

                <v-stepper-content step="2">
                    <v-card class="elevation-0">
                        <v-toolbar class="elevation-0" height="100px">
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
                                    placeholder="Buscar por código, producto, modelo o estado"
                                    clearable
                                    prepend-inner-icon="search"
                                >
                                </v-text-field>
                            </v-col>
                        </v-toolbar>
                 
                        <v-data-table
                            no-data-text="No hay productos para mostrar"
                            no-results-text="No se encontro resultado"
                            :items-per-page="5"
                            :footer-props="{itemsPerPageText:'Productos por páginas'}"
                            :loading="cargarDatos"
                            loading-text="Cargando por favor espere..."
                            :items="desserts"
                            :headers="campos"
                            :search="buscar"
                        >
                            <template v-slot:[`item.stock`]="{ item }">
                            <v-chip
                                :color="getColor(item.stock)"
                                dark
                            >
                                {{ item.stock }}
                            </v-chip>
                            </template>

                            <template v-slot:[`item.actions`]="{item}">
                                <v-btn
                                    fab
                                    dark
                                    color="teal"
                                    x-small
                                    @click="agregar(item)"
                                >
                                    <v-icon>add</v-icon>
                                </v-btn>
                                
                            </template>
                            <v-progress-linear v-show="progressBar" slot="progress"  color="#053565" indeterminate></v-progress-linear>
                        </v-data-table>
                        <v-form ref="validarDetalle">
                            <div
                                v-for="(producto, index) in editeItem.productos" :key="index + producto"
                            >
                                <v-toolbar style="border-bottom:1px solid black" class="elevation-1 mt-5">
                                    <v-toolbar-title>N° {{producto.no_item}}</v-toolbar-title>
                                </v-toolbar>
                                <v-container>
                                    <v-row class="mt-3">
                                        <span class="mt-5 text-subtitle-2">Código
                                            <p>{{ producto.codigo_producto }}</p>
                                        </span>

                                        <span class="mx-3 mt-5 text-subtitle-2">Producto
                                            <p>{{ producto.producto }}</p>
                                        </span>

                                        <span class="mx-3 mt-5 text-subtitle-2">Categoría
                                            <p>{{ producto.categoria }}</p>
                                        </span>

                                        <span class="mx-3 mt-5 text-subtitle-2">Marca
                                            <p>{{ producto.nombre_marca }}</p>
                                        </span>

                                        <span class="mx-3 mt-5 text-subtitle-2">Impresora
                                            <p>{{ producto.impresora }}</p>
                                        </span>

                                        <span class="mx-3 mt-5 text-subtitle-2">Color
                                            <p>{{ producto.color }}</p>
                                        </span>
                                        <v-col 
                                            cols="12"
                                            sm="2"
                                        >
                                        <v-text-field
                                            v-model="producto.cantidad"
                                            label="Cantidad*"
                                            color="#053565"
                                            autocomplete="off"
                                            class="my-input"
                                            dense
                                            type="number"
                                            min="1"
                                            :rules="campoObligatorio"
                                        >
                                        </v-text-field>
                                        </v-col>

                                        <div>
                                            <v-btn
                                                color="red"
                                                text
                                                outlined
                                                @click="eliminar(index)"
                                            >
                                                eliminar
                                            </v-btn>
                                        </div>
                                    </v-row>
                                </v-container>
                            </div>
                        </v-form>
                    </v-card>
                    <v-btn
                        color="#053565"
                        class="white--text mt-3"
                        @click="atras()"
                    >
                    atras
                    <v-icon>skip_previous</v-icon>
                    </v-btn>

                </v-stepper-content>

            </v-stepper>
            <v-alert
                outlined
                dense
                type="info"
                v-if="buscando"
            >
            Buscando...
            </v-alert>

            <v-alert
                outlined
                dense
                type="error"
                v-if="!buscando && mensaje"
            >
                No se puede crear una <strong>solicitud de entrada</strong> porque no existe ningún producto en el sistema
            </v-alert>

            <v-overlay :value="overlay" :opacity="opacity">
                <v-progress-circular
                    indeterminate
                    size="100"
                    width="10"
                    color="#053565"
                ></v-progress-circular>
            </v-overlay>

        </v-container>
    </v-app>
</template>
<script src="sweetalert2.min.js"></script>
<script>
import API from '@/API'
import {mapState, mapActions, mapMutations} from 'vuex'
import Swal from 'sweetalert2/dist/sweetalert2.js'
export default {
    data() {
        return {
            buscando:true,
            mensaje:false,
            formulario:1,
            btnNuevo:false,
            titulo:-1,
            cargarDatos:true,
            overlay:false,
            opacity:0,
            buscar:'',
            progressBar:true,
            dataProducto:{},
            loader:null,
            editeItem:{
                no_nota:'',
                titulo_nota:'',
                fk_despaho_requerido:'',
                comentario:'',
                direccion:'',
                provincia:'',
                fk_despacho:'',
                fk_tipo_accion:1,
                productos:
                [
                    {
                        no_item:1,
                        codigo_producto:'',
                        producto:'',
                        categoria:'',
                        impresora:'',
                        nombre_marca:'',
                        impresora:'',
                        color:'',
                        cantidad:'',
                    }
                ]
            },
            rulesNotas: 
            [
                value => !!value || 'Campo obligatorio.',
                v => /^['A-Za-z']+[-]+[0-9]+[-]+[0-9]+$/.test(v) || 'El campo debe de tener letras, numeros y guión',
                value => (value && value.length == 11) || 'El campo debe de tener maximo 11 caracteres',
            ],
            rulesTituloNota:[
                value => !!value || 'Campo obligatorio.',
            ],

            Obligatorio:[
            value => !!value || 'Campo obligatorio.',
            ],
            campoObligatorio:
            [
                v => !!v || 'Campo requerido',
                v => v > 0 || 'Campo obligatorio'
            ],
            despachos:[],
            desserts:[],
            campos:
            [
                {text:'Código', value:'codigo_producto'},
                {text:'Producto', value:'producto'},
                {text:'Categoría', value:'categoria', filterable:false},
                {text:'Marca', value:'nombre_marca', filterable:false},
                {text:'Modelo de Impresora', value:'impresora'},
                {text:'Color', value:'color', filterable:false},
                {text:'Stock', value:'stock', filterable:false},
                {text:'Estado', value:'estado'},
                {text: 'Elegir', value:'actions', sortable:false},
                
            ],
        }
    },

    mounted() {
        this.mostrarProductosSistema()
    },

    loader () {
        const l = this.loader
        this[l] = !this[l]

        setTimeout(() => (this[l] = false), 2000)

        this.loader = null
      },

    computed: {
        ...mapState(['loginDatos']),
        tituloToolbar(){
            return this.titulo === -1 ? 'Solicitud de Entrada' : ''
        }, 

        cantArrayArticulo () {
            return this.editeItem.productos.length
        },
    },

    methods: {
        ...mapActions(['incrementar']),
        async mostrarProductosSistema(){
            const buscarData = await API.get('verificar_si_existe_producto')
            .then(respuesta=>{
                this.dataProducto = respuesta.data.data
               
                if (this.dataProducto === 0) {
                    this.mensaje = true
                    this.buscando = false
                } else {
                    this.buscando = false
                    this.buscando = false
                    this.mostrarProductosDisponibles()
                    this.mostrarDespachosEntradas()
                    this.editeItem.productos = []
                    
                    
                }
            })
           
            return buscarData
        },

        btnSiguiente(){
            this.formulario = 2
        },

        atras(){
            this,this.formulario = 1
        },

        async  mostrarProductosDisponibles() {
            this.cargarDatos = true
            API.get('productos')
            .then(respuesta=>{
                this.desserts = respuesta.data.data
                this.cargarDatos = false
            })
        },

        async mostrarDespachosEntradas(){
            API.get('despachos_disponibles_para_entrada')
            .then(respuesta=>{
                this.despachos = respuesta.data.data
            })
        },

        getColor (stock) {
            if (stock >= 10) return 'green'
            else if (stock == 0) return 'red'
            //else if (stock == 0) return 'red'
            else return 'orange'
      },

      agregar(item){
        let {productos} = this.editeItem
        let result = productos.filter(data=>data.id_producto === item.id_producto);
        if (result.length > 0) {
            Swal.fire({
                icon:'warning',
                title: 'Ya existe el código ' + item.codigo_producto + ' en la lista',
                showConfirmButton: false,
                timer:2000
            })
        } else {
        this.editeItem.productos.push({
            no_item: this.cantArrayArticulo + 1,
            id_producto: item.id_producto,
            codigo_producto: item.codigo_producto,
            producto: item.producto,
            categoria: item.categoria,
            impresora:item.impresora,
            nombre_marca: item.nombre_marca,
            color: item.color,
            cantidad:1,
        }) 
        }
         
      },

      eliminar(index){
        this.editeItem.productos.splice(index, 1)
        this.updateItem()
      },

    updateItem () {
        this.editeItem.productos.forEach((data, i) => {
        data.no_item = i + 1
        })
    },

    getDireccionDespacho(){
        if (this.editeItem.fk_despaho_requerido !== null) {
            let objDireccion = this.despachos.find(data =>data.id_despacho === this.editeItem.fk_despaho_requerido)
            this.editeItem.direccion = objDireccion.direccion
            this.editeItem.provincia = objDireccion.provincia
        } else {
            this.editeItem.direccion = null
            this.editeItem.provincia = null
        }
    },

    registrar(){

        if (this.editeItem.productos.length == 0) {
            Swal.fire({
            icon: 'warning',
            title: 'No hay productos a solicitar en el listado',
            showConfirmButton: false,
            timer: 1500
            }) 
        } else {

            const registrarData = async()=>{
                if (this.$refs.validarDetalle.validate() && this.$refs.validacion.validate()){
                    this.editeItem.usuario = this.loginDatos.usuario
                    this.editeItem.funcionario_solicitud = this.loginDatos.name
                    this.editeItem.fk_despacho = parseInt(this.loginDatos.fk_despacho)
                    const respuesta = await API.post('acciones', this.editeItem)
                    if (respuesta.data.ok == true) {
                        const {id} = respuesta.data.data
                        localStorage.setItem('id_accion', id)
                        this.incrementar()
                        this.overlay = true
                        setTimeout(()=>{
                            this.overlay = false
                            this.mensajeRegistrarExitoso(respuesta.data.exitoso)
                            this.$router.push({path:'/edicion_de_solicitud'})
                        },2000)
                    } else if (respuesta.data.ok == false) {
                        this.mensajeRegistraError(respuesta.data.errorRegistro)
                    }
                } else {
                    Swal.fire({
                    icon:'warning',
                    title:'Faltan campos obligatorios',
                    showConfirmButton:false,
                    timer:2000
                }) 
                }
            }
            return registrarData();
            
        }
            
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

    nuevo(){
        this.loader = 'btnNuevo'
        this.resetProductos()
        this.editeItem.productos = []
        this.formulario = 1
    },

    resetProductos(){
        this.$refs.validacion.reset()
        this.$refs.validacion.resetValidation()
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
.my-input input{
    text-transform: uppercase;
}

#tituloDato{
    font-family:Verdana, Geneva, Tahoma, sans-serif;
    font-size: 15px;
    color: #053565;
}
</style>
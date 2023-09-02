<template>
    <v-app>
        <v-container>
            <v-toolbar flat id="tituloToolbar">
                <v-toolbar-title>{{ tituloToolbar }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn 
                    color="#053565" 
                    dark
                    class="elevation-0"
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
                    class="caption"
                    color="#053565"
                    autocomplete="off"
                >

                </v-text-field>

            </v-col>
            <v-data-table
                no-data-text="No hay datos disponibles"
                :footer-props="{itemsPerPageText:'Marcas por páginas'}"
                :items-per-page="10"
                :search="buscar"
                no-results-text="No se encontro resultado"
                :loading="cargarDatos"
                loading-text="Por favor espere..."
                :items="desserts"
                :headers="campos"
            >
                <template v-slot:[`item.actions`]="{item}">
                   <v-icon
                    class="mr-2"
                    mb
                    @click="editar(item)"
                   >
                   mdi-pencil
                   </v-icon>
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
            persistent
            width="600px"
            transition="fab-transition"
        >
            <v-card>
                <v-toolbar id="tituloModal" flat>
                    <v-toolbar-title>
                        {{  tituloModalRegistro }}
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn 
                        class="elevation-0" 
                        id="btnCerrar" 
                        small
                        fab
                        @click="cerrarModalRegistro"
                    >
                    X
                    </v-btn>
                </v-toolbar>
                <v-divider></v-divider>
                <v-card-text>
                    <v-form ref="validacion">
                        <v-row>
                            <v-col
                                cols="12"
                                sm="12"
                            >
                                <v-text-field
                                    v-model="editedItem.nombre_marca"
                                    type="text"
                                    label="Marca"
                                    autocomplete="off"
                                    color="#053565"
                                    maxLength="80"
                                    class="caption my-input"
                                    :rules="camposObligatorios"
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
                        text
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
export default {
    data() {
        return {
            titulo:-1,
            buscar:'',
            cargarDatos:true,
            dialogRegistrar:false,
            btnRegistrar:false,
            overlay:false,
            loader:null,
            opacity:0,
            campos:[
                {text:'Marca', value:'nombre_marca'},
                {text:'Editar', value:'actions', sortable:false}
            ],
            desserts:[],
            camposObligatorios:[
                v => !! v || 'Campo obligatorio'
            ],
            editedItem:{
                nombre_marca:'',
                usuario:''
            }
        }
    },

    computed: {
        tituloToolbar(){
            return this.titulo === -1 ? 'Marcas' : ''
        },

        tituloModalRegistro(){
            return this.titulo === -1 ? 'Crear Marcas' : ''
        },

        datos(){
            return localStorage.getItem('usuario').replace(/['"]+/g, '');
        }
    },

    watch: {
        loader(){
            const l = this.loader
            this[l] = !this[l]

            setTimeout(()=>(this[l] = false), 1000)
            this.loader = null
        }
    },

    mounted() {
        this.mostrarMarcas()
    },

    methods: {
        async mostrarMarcas()
        {
            this.cargarDatos = true
            await API.get('marcas')
            .then(respuesta=>{
                this.desserts = respuesta.data.data
                this.cargarDatos = false
            })
        },

        crear(){
            this.overlay = true
            setTimeout(() =>{
                this.overlay = false
                this.dialogRegistrar = true
            },2000)
        },

        editar(item){
            console.log(item);
        },

        cerrarModalRegistro(){
            this.dialogRegistrar = false
            this.resetearCampos()
        },

        resetearCampos(){
            this.$refs.validacion.reset()
            this.$refs.validacion.resetValidation()
        },

       async registrar(){
            try {
                if (this.$refs.validacion.validate()) {
                    this.loader = 'btnRegistrar'
                    this.editedItem.usuario = this.datos
                    const registrarMarca = await API.post('marcas', this.editedItem)
                    .then(respuesta=>{
                        if (respuesta.data.ok == true) {
                            this.mensajeRegistoExistoso(respuesta.data.exitoso)
                            this.mostrarMarcas()
                            this.resetearCampos()
                            this.dialogRegistrar = false
                        } else if (respuesta.data.existe) {
                            this.mensajeExisteMarca(respuesta.data.existe)
                        } else if (respuesta.data.ok == false) {
                            this.mensajeErrorRegistro(respuesta.data.errorRegistro)
                        }
                    })
                    return registrarMarca
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

        mensajeRegistoExistoso(exitoso){
            Swal.fire({
                icon:'success',
                title:'!Genial',
                text: exitoso,
                showConfirmButton:false,
                timer:1000
            })
        },

        mensajeExisteMarca(existe){
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
        }
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
<template>
   <v-app>
    <v-container>
        <v-toolbar class="elevation-0" id="tituloToolbar">
        <v-toolbar-title>{{ tituloToolbar }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn 
            color="#053565" 
            dark 
            class="elevation-0"
            @click="crear()"
        >
        <v-icon class="mx-1">add</v-icon>
        crear
    </v-btn>
    </v-toolbar>

    <v-col
        cols="12"
        sm="6"
    >
        <v-text-field
            v-model="buscar"
            label="Bucar"
            autocomplete="off"
            color="#053565"
            type="text"
            prepend-inner-icon="search"
        >

        </v-text-field>

    </v-col>

    <v-data-table
        no-data-text="No hay datos disponibles"
        :footer-props="{itemsPerPageText:'Unidades por páginas'}"
        :items-per-page="10"
        :headers="campos"
        :items="desserts"
        :search="buscar"
        :loading="cargandoDatos"
        loading-text="Cargando por favor espere..."
    >
        <template v-slot:[`item.actions`]="{item}">
            <v-btn
                x-small
                fab
                class="elevation-0"
                dark
                color="green"
                @click="editar(item)"
            >
            <v-icon>mdi-pencil</v-icon>
            </v-btn>
        </template>
    </v-data-table>
    </v-container>

    <v-overlay :value="overlay" :opacity="opacity">
        <v-progress-circular
            size="100"
            width="10"
            indeterminate
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
                <v-toolbar-title>{{ tituloToolbarModalRegistro }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn
                    class="elevation-0"
                    fab
                    x-small
                    id="btnCerrarModal"
                    @click="cerrarModal()"
                >
                    X
                </v-btn>
            </v-toolbar>
            <v-divider></v-divider>
            <v-card-text>
                <v-form ref="validacion">
                    <v-row class="mt-3">
                        <v-col
                            cols="12"
                            sm="12"
                        >
                            <v-text-field
                                v-model="editedItem.unidad_medida"
                                label="Unidad de medida"
                                type="text"
                                maxLength="80"
                                color="#053565"
                                autocomplete="off"
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
                    color="#053565"
                    text
                    outlined
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
            cargandoDatos:true,
            dialogRegistrar:false,
            overlay:false,
            opacity:0,
            loader:null,
            btnRegistrar:false,
            campos:
            [
                {text:'Unidad de medida', value:'disposicion'},
                {text:'Editar', value:'actions', sortable:false}
            ],
            desserts:[],
            editedItem:{
                unidad_medida:'',
                usuario:''
            },
            camposObligatorios:
            [
                v => !!v || 'Campo obligatorio'
            ]
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

    computed: {
        tituloToolbar(){
            return this.titulo === -1 ? 'Unidades de Medidas' : ''
        },

        tituloToolbarModalRegistro(){
            return this.titulo === -1 ? 'Registrar Unidad de Medidas' : ''
        },

        datos(){
            return localStorage.getItem('usuario').replace(/['"]+/g, '');
        },
    },

    mounted() {
        this.mostrarUnidades()
    },

    methods: {
        async mostrarUnidades()
        {
            this.cargandoDatos = true
            await API.get('unidades_de_medidas')
            .then(respuesta=>{
                this.desserts = respuesta.data.data
                this.cargandoDatos = false
            })
        },

        crear(){
            this.overlay = true
            setTimeout(() => {
                this.overlay = false
                this.dialogRegistrar = true
            }, 2000);
        },

        cerrarModal(){
            this.dialogRegistrar = false
            this.resetear()
        },

        resetear(){
            this.$refs.validacion.reset()
            this.$refs.validacion.resetValidation()
        },

      async  registrar(){
            try {
                this.editedItem.usuario = this.datos
                if (this.$refs.validacion.validate()) {
                    this.loader = 'btnRegistrar'
                    const registrarUnidadMedida = await API.post('unidades_de_medidas', this.editedItem)
                    .then(respuesta=>{
                        if (respuesta.data.ok == true) {
                            this.mostrarUnidades()
                            this.mensajeExitosoRegistrar(respuesta.data.exitoso)
                            this.dialogRegistrar = false
                            this.resetear()
                        } else if (respuesta.data.existe) {
                            this.mensajeExisteRegistro(respuesta.data.existe)
                        } else if (respuesta.data.errorRegistro) {
                            this.mensajeErrorRegitro(respuesta.data.errorRegistro)
                        }
                    })

                    return registrarUnidadMedida
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

        mensajeExitosoRegistrar(exitoso){
            Swal.fire({
                icon:'success',
                title:'!Genial',
                text:exitoso,
                showConfirmButton:false,
                timer:2000
            })
        },

        mensajeExisteRegistro(existe){
            Swal.fire({
                icon:'warning',
                title:existe,
                showConfirmButton:false,
                timer:2000
            })
        },

        mensajeErrorRegitro(errorRegistro){
            Swal.fire({
                icon:'error',
                title:errorRegistro,
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

#btnCerrarModal:hover{
    background-color: red;
    color: white;
}

.my-input input{
    text-transform: uppercase;
}
</style>
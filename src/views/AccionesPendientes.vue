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

                        
                <v-spacer></v-spacer>
                <v-col
                    cols="12"
                    sm="6"
                    class="mt-3"
                >
                    <v-text-field
                        v-model="buscar"
                        autocomplete="off"
                        color="#053565"
                        clearable
                        label="Bucar"
                        placeholder="Bucar por número de nota"
                        prepend-inner-icon="search"
                    >
                    </v-text-field>

                </v-col>
                </v-toolbar>
                <v-data-table
                    no-data-text="No hay datos disponibles"
                    no-results-text="No se encontro resultado"
                    :items-per-page="10"
                    :search="buscar"
                    :footer-props="{itemsPerPageText:'Acciones por páginas'}"
                    :items="desserts"
                    :headers="campos"
                    :loading="cargarDatos"
                    loading-text="Cargando por favor espere..."
                >
                    <template v-slot:[`item.actions`]="{item}">
                        <v-btn
                            x-small
                            color="green"
                            dark
                            fab
                            @click="editarConfirmar(item)"
                        >
                        <v-icon>edit</v-icon>
                        </v-btn>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
        <v-overlay :value="overlay" :opacity="opacity">
            <v-progress-circular
                indeterminate
                size="100"
                width="10"
                color="#053565"
            >
            </v-progress-circular>
        </v-overlay>
    </v-container>
   </v-app>
</template>
<script>
import API from '@/API'
export default {
    data() {
        return {
            titulo:-1,
            buscar:'',
            cargarDatos:true,
            overlay:false,
            opacity:0,
            campos:
            [
                {text:'Tipo de Acción', value:'tipo_accion', filterable:false},
                {text:'Número nota', value:'no_nota'},
                {text:'Despacho solicitado', value:'despacho_requerido', filterable:false},
                {text:'Cantidad Solicitada', value:'cantidad_solicitada', filterable:false},
                {text:'Cantidad Pendiente', value:'cantidad_pendiente', filterable:false},
                {text:'Cantidad Llegada', value:'cantidad_llegada', filterbale:false},
                {text:'Estado', value:'estado', filterable:false},
                {text:'Editar/Confirmar', value:'actions', sortable:false}
            ],
            desserts:[]
        }
    },

    computed: {
        tituloToolbar(){
            return this.titulo === -1 ? 'Acciones' : ''
        }
    },

    mounted() {
        this.mostrarAcciones()
    },

    methods: {
        async mostrarAcciones(){
            this.cargarDatos = true
            await API.get('acciones_pendientes')
            .then(respuesta=>{
                this.desserts = respuesta.data.data
                this.cargarDatos = false
            })
        },

        editarConfirmar(item){
            this.overlay = true
            setTimeout(()=>{
                this.overlay = false
                console.log(item);
                this.$router.push({path:'/edicion_de_solicitud'})
            },2000)
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
</style>
<template>
   <v-app>
    <v-container>
        <v-toolbar flat id="tituloToolbar">
            <v-toolbar-title>{{ tituloToolbar }}</v-toolbar-title>
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

        </v-data-table>
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
            campos:
            [
                {text:'Tipo de Acción', value:'tipo_accion'},
                {text:'Entrada', value:'num_entrada'},
                {text:'Salida', value:'salida'},
                {text:'Despacho', value:'despacho'},
                {text:'Total de unidades', value:'cantidad_total'},
                {text:'Estado', value:'estado'}
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
               /*  localStorage.setItem('token', token) */
                this.desserts = respuesta.data.data
                this.cargarDatos = false
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
</style>
<template>
    <v-app>
        <v-container>
            <v-toolbar flat id="tituloToolbar">
                <v-toolbar-title>
                    {{ tituloToolbar }}
                </v-toolbar-title>
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
                    placeholder="Bucar por localización y piso"
                >

                </v-text-field>

            </v-col>
            <v-data-table
                no-data-text="No hay datos disponibles"
                :footer-props="{itemsPerPageText:'Localizaciones por páginas'}"
                :items-per-page="10"
                :search="buscar"
                :items="desserts"
                :headers="campos"
                no-results-text="No se encontro resultado"
                :loading="DatosCargar"
                loading-text="Cargando datos por favor espere..."
            >
                <template v-slot:[`item.actions`]="{item}">
                   <v-btn
                    fab
                    x-small
                    color="green"
                    dark
                    class="elevation-0"
                    @click="editar(item)"
                   >
                   <v-icon>mdi-pencil</v-icon>
                   </v-btn>
                </template>

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
            DatosCargar:true,
            campos:
            [
                {text:'Deposito', value:'deposito',filterable:false},
                {text:'Localización', value:'localizacion'},
                {text:'Piso', value:'piso'},
                {text:'Editar', value:'actions', sortable:false}
            ],
            desserts:[]
        }
    },

    computed: {
        tituloToolbar(){
            return this.titulo === -1 ? 'Localizaciones' : ''
        }
    },

    mounted() {
        this.mostrarLocalizacion()
    },

    methods: {
        async mostrarLocalizacion(){
            this.DatosCargar = true
            await API.get('localizaciones')
            .then(respuesta=>{
                this.desserts = respuesta.data.data
                this.DatosCargar = false
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
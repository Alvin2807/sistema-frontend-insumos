<template>
    <v-app>
       <v-container>
            <v-stepper
                v-model="formulario"
                vertical
                class="elevation-0"
            >
                <v-toolbar class="elevation-0" id="tituloToolbar">
                    <v-toolbar-title>{{ tituloToolbar }}</v-toolbar-title>

                </v-toolbar>
                <v-stepper-step
                    :complete="formulario > 1"
                    step="1"
                    color="#053565"
                >
                Datos Generales
                </v-stepper-step>

                <v-stepper-content step="1">
                    <v-card
                        class="elevation-0"
                    >
                       <v-form>
                        <v-row>
                            <v-col
                                cols="12"
                                sm="2"
                            >
                                <v-text-field
                                    v-model="editeItem.numero_entrada"
                                    color="#053565"
                                    label="No. de trans"
                                    autocomplete="off"
                                    type="text"
                                    maxLength="20"
                                    class="caption my-input"
                                    :rules="campoObligatorio"
                                >

                                </v-text-field>

                            </v-col>

                            <v-col
                                cols="12"
                                sm="10"
                            >
                                <v-autocomplete
                                    v-model="editeItem.fk_despacho"
                                    label="Despacho que entrega"
                                    autocomplete="off"
                                    color="#053565"
                                    :items="despachos"
                                    item-text="despacho"
                                    item-value="id_despacho"
                                    class="caption"
                                    no-data-text="No hay datos disponible"
                                    :rules="campoObligatorio"
                                >
                                </v-autocomplete>
                            </v-col>

                            <v-col
                                cols="12"
                                sm="4"
                            >
                                <v-autocomplete
                                    v-model="editeItem.entregado_por"
                                    label="Entregado por"
                                    color="#053565"
                                    no-data-text="No hay datos disponibles"
                                    autocomplete="off"
                                    :rules="campoObligatorio"
                                    
                                >

                                </v-autocomplete>

                            </v-col>

                            <v-col
                                cols="12"
                                sm="4"
                            >
                                <v-autocomplete
                                    v-model="editeItem.recibido_por"
                                    label="Recibido por"
                                    color="#053565"
                                    no-data-text="No hay datos disponibles"
                                    autocomplete="off"
                                    :rules="campoObligatorio"
                                    
                                >
                                </v-autocomplete>
                            </v-col>

                            <v-col
                                cols="12"
                                sm="4"
                            >
                            <v-menu
                                v-model="menu2"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    v-model="computedDateFormatted"
                                    label="Fecha de Entrada"
                                    hint="Día/Mes/Año"
                                    persistent-hint
                                    prepend-inner-icon="mdi-calendar"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                    color="#053565"
                                ></v-text-field>
                                </template>
                                <v-date-picker
                                    v-model="editeItem.fecha_entrega"
                                    
                                    locale="es"
                                    color="#053565"
                                    @input="menu2 = false"
                                >
                            </v-date-picker>
                            </v-menu>
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
                       </v-form>
                    </v-card>
                <v-btn
                    color="#053565"
                    dark
                    @click="formulario = 2"
                >
                   siguiente
                   <v-icon>skip_next</v-icon>
                </v-btn>
               
                </v-stepper-content>

                <v-stepper-step
                    :complete="formulario > 2"
                    step="2"
                    color="#053565"
                >
                Detalles
                </v-stepper-step>

                <v-stepper-content step="2">
                <v-card
                    class="elevation-0"
                >
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
                        >

                        </v-text-field>

                    </v-col>
                    <v-data-table
                        no-data-text="No hay datos disponibles"
                        :items-per-page="10"
                        :footer-props="{itemsPerPageText:'Productos por páginas'}"
                        no-results-text="No se encontro resultado"
                        :search="buscar"
                        :headers="campos"
                        :items="desserts"
                        :loading="cargarDatos"
                        loading-text="Cargando por favor espere..."
                    >
                        <template v-slot:[`item.actions`]="{item}">
                            <v-btn
                                color="green"
                                fab
                                x-small
                                dark
                                @click="elegir(item)"
                            >
                                <v-icon>edit</v-icon>

                            </v-btn>
                        </template>

                    </v-data-table>
                </v-card>
                <v-btn
                    color="#053565"
                    dark
                    @click="formulario = 1"
                >
                    atras
                    <v-icon>skip_previous</v-icon>
                </v-btn>
                </v-stepper-content>

              

            </v-stepper>
       </v-container>
    </v-app>
</template>
<script>
import API from '@/API'
export default {
    data() {
        return {
          titulo:-1,
          formulario: 1,
          buscar:'',
          cargarDatos:true,
          editeItem:{
            numero_entrada:'',
            fk_despacho:'',
            entregado_por:'',
            recibido_por:'',
            fecha_entrega:'',
          },

          campoObligatorio:
          [
            v => !! v || 'Campo Obligatorio'
          ],
          menu2:false,
          date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
          campos:
          [
            {text:'Código', value:'codigo_producto'},
            {text:'Producto', value:'producto'},
            {text:'Categoría', value:'categoria', filterable:false},
            {text:'Marca', value:'nombre_marca', filterable:false},
            {text:'Modelo', value:'nombre_modelo', filterable:false},
            {text:'Color', value:'color', filterable:false},
            {text:'Elegir', value:'actions', sortable:false}
          ],
          desserts:[],
          despachos:[]
         
        }
    },

    mounted() {
        this.mostrarProductosDisponibles()
        this.mostrarDespachosEntradas()
    },

    computed: {
        tituloToolbar(){
            return this.titulo === -1 ? 'Formulario de Entrada' : ''
        },

        computedDateFormatted () {
      return this.formatDate(this.editeItem.fecha_entrega)
    },
    },

    methods: {
        formatDate (fecha_entrega) {
            if (!fecha_entrega) return null

            const [year, month, day] = fecha_entrega.split('-')
            return `${month}/${day}/${year}`
        },

        parseDate (fecha_entrega) {
            if (!fecha_entrega) return null

            const [month, day, year] = fecha_entrega.split('/')
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        },

      async  mostrarProductosDisponibles() {
        this.cargarDatos = true
        API.get('vista_productos_disponibles')
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
      }


    },
}
</script>
<style>
#tituloToolbar{
    border-left: solid 8px #053565;
    font-family:Verdana, Geneva, Tahoma, sans-serif;
}

.my-input input{
    text-transform: uppercase;
}


</style>
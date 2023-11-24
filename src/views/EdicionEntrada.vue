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
                    </v-form>
                </v-card-text>
            </v-card>
        </v-container>
    </v-app>
</template>
<script>
import API from '@/API'
export default {
    data() {
        return {
            titulo: -1,
            editeItem:{
                no_nota:'',
                titulo_nota:'',
                fk_despaho_requerido:'',
                comentario:''
            },

            Obligatorio:
            [
                v =>!!v || 'Campo Obligatorio'
            ],
            despachos:[]
        }
    },
    mounted() {
        this.mostrarDespachosEntradas()
    },

    computed: {
        tituloToolbar(){
            return this.titulo === -1 ? 'Edicion de Solicitud' : ''
        } 
    },

    methods: {
        async mostrarDespachosEntradas(){
            API.get('despachos_disponibles_para_entrada')
            .then(respuesta=>{
                this.despachos = respuesta.data.data
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

</style>
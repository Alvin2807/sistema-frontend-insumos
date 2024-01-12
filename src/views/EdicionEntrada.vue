<template>
    <v-app>
        <v-container>
            <v-stepper
                vertical
                class="elevation-0"
                v-model="formulario"
            >
                <v-toolbar flat id="tituloToolbar">
                    <v-toolbar-title>{{ tituloToolbar }}</v-toolbar-title>
                    <v-spacer></v-spacer>
                        <v-btn 
                            color="red" 
                            dark 
                            :loading="btnCancelar" 
                            class="elevation-0 pa-5 mx-1"  
                            @click="cancelar()"
                        >
                        <v-icon>close</v-icon>
                        cancelar
                        </v-btn>
                        <v-btn 
                            color="teal" 
                            dark 
                            class="elevation-0 pa-5 mx-1" 
                            @click="guardar()"
                        >
                        <v-icon>save</v-icon>
                        guardar
                        </v-btn>
                        <v-btn 
                            color="info" 
                            dark 
                            class="elevation-0 pa-5 mx-1" 
                            @click="confirmar()"
                        >
                        <v-icon>done</v-icon>
                        confirmar
                        </v-btn>
                        <v-btn 
                            color="#053565" 
                            text
                            class="elevation-0 pa-5 mx-1" 
                            @click="imprimir()"
                        >
                        <v-icon>print</v-icon>
                        imprimir
                        </v-btn>
                </v-toolbar>
                <v-divider></v-divider>

                <v-stepper-step
                    :complete="formulario > 1"
                    color="#053565" 
                    step="1"
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
                                        @change="getDireccionDespacho()"
                                    >
                                    </v-autocomplete>
                                </v-col>
                                <v-col
                                    cols="12"
                                    sm="4"
                                >
                                    <v-text-field
                                        v-model="editeItem.lugar_destino"
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
                                        v-model="editeItem.ciudad_destino"
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
                        class="white--text mt-3"
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
                        <v-toolbar flat>
                            <v-toolbar-title>Productos a solicitar({{ cantArrayArticulo }})</v-toolbar-title>
                        </v-toolbar>

                        <v-form ref="validarDetalle">
                            <div
                                v-for="(producto, index) in editeItem.productos" :key="index + producto"
                            >
                                <v-toolbar style="border-bottom:1px solid black" class="elevation-1 mt-5">
                                    <v-toolbar-title>N° {{ producto.no_item }}</v-toolbar-title>
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
                                            v-model="producto.cantidad_solicitada"
                                            label="Cantidad*"
                                            color="#053565"
                                            autocomplete="off"
                                            class="my-input mt-6"
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
                        dark
                        class="white--text mt-3"
                        @click="atras()"
                    >
                    atras
                    <v-icon class="mx-1">skip_previous</v-icon>
                    </v-btn>
                </v-stepper-content>
            </v-stepper>
        </v-container>

    </v-app>
</template>
<script>
import API from '@/API'
import { jsPDF } from "jspdf";
import {mapState} from 'vuex'
import mpImg from '@/assets/logoMP.js';
import autoTable from 'jspdf-autotable'
import sistemaMP from '@/assets/sistemaMP';
export default {
    data() {
        return {
            formulario:1,
            titulo:-1,
            btnCancelar:false,
            buscar:'',
            cargarDatos:true,
            progressBar:true,
            editeItem:{
                no_nota:'',
                titulo_nota:'',
                fk_despacho_requerido:'',
                comentario:'',
                lugar_destino:'',
                ciudad_destino:'',
                fk_despacho:'',
                fk_tipo_accion:1,
                fecha_nota:'',
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
                        cantidad_solicitada:'',
                    }
                ]
            },
            datosTitulos:{
                republica:'República de Panamá',
                ministerio:'Ministerio Público',
                provincia:'Cólon,',
                atentamente:'Atentamente'
               
              
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
        this.mostrarData()
       
        
    },

    computed: {
        ...mapState(['datos']),
        tituloToolbar(){
            return this.titulo === -1 ? 'Solicitud de Entrada' : ''
        }, 

        cantArrayArticulo () {
            return this.editeItem.productos.length
        },

        fecha_nota: { 
            get () { 
                return this.formatoFechaNota(this.editeItem.fecha_nota)   
            },

            set () {
                this.editeItem.fecha_nota = null
            }
        },
    },

    methods: {

        async  mostrarData(){
            const solicitudes = localStorage.getItem('id_accion')
            this.datos.id_accion = solicitudes
            const respuesta = await API.get('detalle_de_solicitud_pendiente/' + solicitudes)
            this.editeItem  = respuesta.data.data
            this.mostrarDespachosEntradas()
            this.mostrarProductosDisponibles()
            
          
        },

        async mostrarDespachosEntradas(){
            API.get('despachos_disponibles_para_entrada')
            .then(respuesta=>{
                this.despachos = respuesta.data.data
            })
        },

        getDireccionDespacho(){
            if (this.editeItem.fk_despacho_requerido !== null) {
                let objDireccion = this.despachos.find(data =>data.id_despacho === this.editeItem.fk_despacho_requerido)
                this.editeItem.lugar_destino = objDireccion.direccion
                this.editeItem.ciudad_destino = objDireccion.provincia
                
            } else {
                this.editeItem.lugar_destino = null
                this.editeItem.ciudad_destino = null
            }
        },

        async  mostrarProductosDisponibles() {
            this.cargarDatos = true
            API.get('productos')
            .then(respuesta=>{
                this.desserts = respuesta.data.data
                this.cargarDatos = false
            })
        },

        btnSiguiente(){
            this.formulario = 2
        },

        getColor (stock) {
            if (stock >= 10) return 'green'
            else if (stock == 0) return 'red'
            else return 'orange'
        },

        atras(){
            this.formulario = 1
        },

        formatoFechaNota (fechaFR) {
           if (!fechaFR) return null
           const [year, month, day] = fechaFR.split('-')
           return `${day}/${month}/${year}`
        },

        imprimir(){
           
            const doc = new jsPDF("a4");
                const addFooters = doc => {

                const pageCount = doc.internal.getNumberOfPages()
                doc.setFont('helvetica', 'italic')
                doc.setFontSize(10)
                for (var i = 1; i <= pageCount; i++) {
                    doc.setPage(i)
                    doc.text('Página ' + String(i) + ' de ' + String(pageCount), doc.internal.pageSize.width / 2, 287, {
                        align: 'center'
                    })
                }
                    var x = 100; var y = 10;
                    doc.setFontSize(15);
                    doc.text( x , y, this.datosTitulos.republica, 'center')
                    
                    // 73= lado x, 12= altura, 20= ancho, 25= lado y
                    doc.addImage(mpImg, "PNG", 73, 12, 25, 20)
                    doc.addImage(sistemaMP, "PNG", 102, 12, 25, 20)

                    var x = 79; var y = 39;
                    doc.setFontSize(15);
                    doc.text( x , y, this.datosTitulos.ministerio)
                
                    var x = 20; var y = 80;
                    doc.setFontSize(14);
                    doc.text( x , y, this.editeItem.despacho_solicitud)

                    var x = 32; var y = 85;
                    doc.setFontSize(12);
                    doc.text( x , y, this.editeItem.no_nota, 'center');
                   

                    var x = 28; var y = 99;
                    doc.setFontSize(12);
                    doc.text( x , y, this.editeItem.profesion_jefe, 'center')

                    var x = 25; var y = 105;
                    doc.setFontSize(12);
                    doc.text( x , y, this.editeItem.nombre_jefe, 'center')

                    var x = 41; var y = 105;
                    doc.setFontSize(12);
                    doc.text( x , y, this.editeItem.apellido_jefe, 'center')

                    var x = 42; var y = 112;
                    doc.setFontSize(13);
                    doc.text( x , y, this.editeItem.cargo_jefe, 'center')

                    var x = 25; var y = 119;
                    doc.setFontSize(13);
                    doc.text( x , y, this.editeItem.sigla_jefe, 'center')


                    var x = 15; var y = 138;
                    doc.setFontSize(13);
                    doc.text( x , y, this.editeItem.profesion_jefe)

                    var x = 45; var y = 138;
                    doc.setFontSize(13);
                    doc.text( x , y, this.editeItem.apellido_jefe, 'center')

                    var x = 87; var y = 148;
                    doc.setFontSize(11);
                    doc.text( x , y, this.editeItem.comentario, 'center')

                    var x = 140; var y = 60;
                    doc.setFontSize(10);
                    doc.text( x , y, this.datosTitulos.provincia, 'center')

                    var fecha = new Date().toLocaleDateString('es-us', { weekday:"long", year:"numeric", month:"long", day:"numeric"}) 
                    var x = 170; var y = 60;
                    doc.setFontSize(10);
                    doc.text( x , y, fecha,'center').setFont(undefined,'Arial Rounded MT Bold', 'normal');

                    let datosPDF = []
                    let arrayDatos = []

                    for (let index = 0; index <this.editeItem.productos.length; index++) {

                       arrayDatos[0] = this.editeItem.productos[index].categoria
                       arrayDatos[1] = this.editeItem.productos[index].codigo_producto
                       arrayDatos[2] = this.editeItem.productos[index].nombre_marca
                       arrayDatos[3] = this.editeItem.productos[index].impresora
                       arrayDatos[4] = this.editeItem.productos[index].color
                       arrayDatos[5] = this.editeItem.productos[index].cantidad_solicitada
                       datosPDF.push(arrayDatos)
                       arrayDatos = []
                        
                    }

                    var ladoy = 152 +1
                    autoTable(doc,
                    {
                        styles: {overflow: 'linebreak', fontSize: 10},
                        startY: ladoy,
                        theme: 'grid',
                        tableWidth: 'auto',
                        headStyles :{fillColor : [205, 97, 85]},
                        head: [['Categoría','Código', 'Marca','Modelo de Impresora','Color', 'Cantidad Solicitada']],
                        body: datosPDF
                    }
                    )

                    doc.setFontSize(12);
                    y = doc.lastAutoTable.finalY + 15
                    doc.text( x = 15, y , this.datosTitulos.atentamente).setFont(undefined, 'normal');

                    doc.setFontSize(12);
                    y = doc.lastAutoTable.finalY + 35
                    doc.text( x = 15, y , this.editeItem.nombre_jefe_solicitud).setFont(undefined, 'normal');

                    doc.setFontSize(12);
                    y = doc.lastAutoTable.finalY + 35
                    doc.text( x = 27, y , this.editeItem.apellido_jefe_solicitud).setFont(undefined, 'normal');

                    doc.setFontSize(12);
                    y = doc.lastAutoTable.finalY + 41
                    doc.text( x = 15, y , this.editeItem.cargo_jeje_solicitud).setFont(undefined, 'normal');


                  

                   

                    
                  
                    

                 

                    


                    


                 

                    
                   
                }
                    addFooters(doc)
                doc.save(this.editeItem.no_nota);
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

#tituloDato{
    font-family:Verdana, Geneva, Tahoma, sans-serif;
    font-size: 15px;
    color: #053565;
}
</style>
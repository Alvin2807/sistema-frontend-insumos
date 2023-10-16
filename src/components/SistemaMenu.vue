<template>
   <v-app id="inspire">
    <div>
        <v-navigation-drawer 
            v-model="drawer" 
            app
            class="elevation-0"
            width="240px"
        >
            <template v-slot:prepend>
                <v-list-item two-line>
                <v-list-item-avatar>
                   <v-icon size="50px">account_circle</v-icon>
                </v-list-item-avatar>

                <v-list-item-content>
                    <v-list-item-title class="secondary--text">{{ datos }}</v-list-item-title>
                </v-list-item-content>
                </v-list-item>
            </template>
            <v-divider></v-divider>
            <v-list>
                <v-list-group
                    v-for="item in items"
                    :key="item.title"
                    v-model="item.active"
                    :prepend-icon="item.action"
                    no-action
                    color="#030C52"
                
                >
                    <template v-slot:activator>
                    <v-list-item-content>
                        <v-list-item-title color="#053565">{{ item.title }}</v-list-item-title>
                        
                    </v-list-item-content>
                    </template>

                    <v-list-item
                        v-for="child in item.items"
                        :key="child.title"
                        color="blue darken-4"
                        link
                        :to="child.path"
                    >
                    <v-list-item-content>
                        <v-list-item-title>{{ child.title }}</v-list-item-title>
                    </v-list-item-content>
                    </v-list-item>
                </v-list-group>
            </v-list>


        </v-navigation-drawer>

        <v-app-bar app color="#053565" dark>
           
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-spacer></v-spacer>
            <img height="50px" :src="require('../assets/mp.png')"/>
            <v-toolbar-title class="mx-2">{{ tituloToolbar }}</v-toolbar-title>
            <img height="50px" :src="require('../assets/sistema.png')"/>
            <v-spacer></v-spacer>
           
            <v-badge
                color="red"
                :content="totalAcciones"
            >
           
            <v-icon>notifications_active</v-icon>
            
            </v-badge>
           
        </v-app-bar>

        <router-view/>

     
        
    </div>

   </v-app>
</template>
<script>
import { mapState, mapActions} from 'vuex'
export default {
    name:'SistemaMenu',
    data() {
        return {
            drawer:null,
            titulo:-1,
            items:[
                {
                    action:'segment',
                    items:
                    [
                        {title:'Categorías', path:'/categorias'},
                        {title:'Depositos', path:'/depositos'},
                        {title:'Medidas', path:'/unidades_de_medidas'}

                        //{title: 'Marcas', path:'/marcas'}
                    ],
                    title:'Parametros'
                },

                {
                    action:'dashboard',
                    items:
                    [
                        {title:'Productos', path:'/productos'},
                    ],
                    title:'Productos'
                },

                {
                    action:'app_registration',
                    items:
                    [
                        {title:'Entradas/Salidas', path:'/acciones_pendientes'},
                        {title:'Crear entrada', path:'/crear_entrada'}
                    ],
                    title:'Acciones'
                },
            ]
        }
    },

    mounted() {
        this.datos
        this.datosAcciones();
        window.location.hash="";
        window.location.hash="Again-No-back-button" //chrome
        window.onhashchange=function(){window.location.hash="";}
    },

    computed: {
        ...mapState(['acciones','loginDatos']),
        tituloToolbar(){
            return this.titulo === -1 ? 'Sistema de Control de Insumos' : ''
        },

        datos(){
            return localStorage.getItem('user').replace(/['"]+/g, '');
        },

        totalAcciones(){
            return localStorage.getItem('total_acciones')
        }
    },
    methods: {
       ...mapActions(['datosAcciones']) 
    },
}


</script>
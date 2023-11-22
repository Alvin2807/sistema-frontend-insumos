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
                   <v-icon size="50px" color="#053565">account_circle</v-icon>
                </v-list-item-avatar>

                <v-list-item-content>
                    <v-list-item-title class="secondary--text">{{ loginDatos}}</v-list-item-title>
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

            <div class="text-center">
                <v-menu
                    v-model="menu"
                    :close-on-content-click="false"
                    :nudge-width="200"
                    offset-y
                >
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        color="#053565"
                        dark
                        v-bind="attrs"
                        v-on="on"
                        class="elevation-0"
                    >
                    <v-icon size="30px">person</v-icon>
                    </v-btn>
                </template>

                <v-card>
                    <v-list>
                    <v-list-item>
                        <v-list-item-avatar>
                            <v-icon size="50px" color="#053565">account_circle</v-icon>
                        </v-list-item-avatar>

                        <v-list-item-content>
                        <v-list-item-title>{{ datos }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    </v-list>

                    <v-divider></v-divider>

                    <v-list>
                    <v-list-item>
                        <v-list-item-action>
                            <v-btn 
                                class="elevation-0" 
                                color="red" 
                                text
                                @click="cerrarSession()"
                            >
                                <v-icon>block</v-icon>
                            </v-btn>
                        </v-list-item-action>
                        <v-list-item-title>Cerrar Sesion</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-action>
                            <v-btn class="elevation-0" color="green" text>
                                <v-icon>visibility</v-icon>
                            </v-btn>
                        </v-list-item-action>
                        <v-list-item-title>Ver Perfil</v-list-item-title>
                    
                    </v-list-item>
                    </v-list>

                    <v-card-actions>
                    <v-spacer></v-spacer>
                    </v-card-actions>
                </v-card>
                </v-menu>
            </div>
            <v-btn 
                color="#053565" 
                class="elevation-0"
                v-if="totalAcciones > 0"
                @click="verNotificacion()"
            >
                <v-badge
                    color="red"
                    :content="totalAcciones"
                >
                <v-icon>
                notifications_active
                </v-icon>
                </v-badge>
            </v-btn>
         
           
           
        </v-app-bar>
        <router-view/>
    </div>

    <v-overlay :value="overlay" :opacity="opacity">
        <v-progress-circular
            indeterminate
            size="100"
            width="10"
            color="#053565"
        >
        </v-progress-circular>
    </v-overlay>

   </v-app>
</template>
<script src="sweetalert2.min.js"></script>
<script>
import { mapState, mapActions, mapMutations} from 'vuex'

import Swal from 'sweetalert2/dist/sweetalert2.js'
export default {
    name:'SistemaMenu',
    data() {
        return {
            drawer:null,
            titulo:-1,
            opacity:0,
            total:'',
            overlay:false,
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
                        //{title:'Entradas/Salidas', path:'/acciones_pendientes'},
                        {title:'Crear entrada', path:'/crear_entrada'}
                    ],
                    title:'Acciones'
                },
            ],
                menu: false,
                message: false,
                hints: true,
        }
    },

    mounted() {
        this.datos
        this.mostrarPerfilLogin()
        this.incrementar()
        window.location.hash="";
        window.location.hash="Again-No-back-button" //chrome
        window.onhashchange=function(){window.location.hash="";}
    },

    computed: {
        ...mapState(['acciones','loginDatos', 'pendientes']),
        tituloToolbar(){
            return this.titulo === -1 ? 'Sistema de Control de Insumos' : ''
        },

        datos(){
            return localStorage.getItem('user').replace(/['"]+/g, '');
        },

        totalAcciones(){
          return  this.pendientes
        }
    },
    methods: {
       ...mapActions(['incrementar']),
       ...mapMutations(['aumentar','mostrarDetallesLogin']),

       cerrarSession(){
        Swal.fire({
            title: '¿Estas seguro de cerrar sesion?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí',
            cancelButtonText:'No'
        }).then((result) => {
        if (result.isConfirmed) {
            this.menu = false
            this.overlay = true
            setTimeout(()=>{
            this.overlay = false
            this.$router.push({path:'/'})
        },2000)
        }
        })
      
       },

       verNotificacion(){
        this.overlay = true
        setTimeout(() =>{
            this.overlay = false
            if (this.$route.name !== 'navbar') 
            this.$router.push({path:'/acciones_pendientes'})
            .catch(()=>{});
        },2000)
       },

       mostrarPerfilLogin(){
        const detallesLogin = localStorage.getItem('user');
        this.mostrarDetallesLogin(JSON.parse(detallesLogin))
       }

    }
    
}


</script>
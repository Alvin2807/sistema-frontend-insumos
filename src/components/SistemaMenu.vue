<template>
   <v-app id="inspire">
    <div>
        <v-navigation-drawer 
            v-model="drawer" 
            app
           
        >
            <template v-slot:prepend>
                <v-list-item two-line>
                <v-list-item-avatar>
                   <v-icon size="50px">account_circle</v-icon>
                </v-list-item-avatar>

                <v-list-item-content>
                    <v-list-item-title>{{ datos }}</v-list-item-title>
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
                    color="#053565"
                
                >
                    <template v-slot:activator>
                    <v-list-item-content>
                        <v-list-item-title color="#053565">{{ item.title }}</v-list-item-title>
                        
                    </v-list-item-content>
                    </template>

                    <v-list-item
                        v-for="child in item.items"
                        :key="child.title"
                        color="#053565"
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

        <v-app-bar app>
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-spacer></v-spacer>
            <img height="50px" :src="require('../assets/mp.png')"/>
            <v-toolbar-title class="mx-2">{{ tituloToolbar }}</v-toolbar-title>
            <img height="50px" :src="require('../assets/sistema.png')"/>
            <v-spacer></v-spacer>
        </v-app-bar>

        <router-view/>

     
        
    </div>

   </v-app>
</template>
<script>
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
                        {title:'Categorías', path:'/categorias'}
                    ],
                    title:'Parametros'
                }
            ]
        }
    },

    mounted() {
        this.datos
    },

    computed: {
        tituloToolbar(){
            return this.titulo === -1 ? 'Sistema de Control de Insumos' : ''
        },

        datos(){
            return localStorage.getItem('user').replace(/['"]+/g, '');
        }
    },
}
</script>
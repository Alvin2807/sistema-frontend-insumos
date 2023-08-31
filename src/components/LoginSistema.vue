<template>
    <div>
        <v-toolbar flat id="fondoToolbar" height="80px">
            <v-spacer></v-spacer>
            <v-toolbar-title>
                <img height="50px" :src="require('../assets/mp.png')"/>
                {{ tituloToolbar }}
                <img height="50px" :src="require('../assets/sistema.png')"/>
            </v-toolbar-title>
            <v-spacer></v-spacer>

        </v-toolbar>
    </div>
</template>
<script>
export default {
    data() {
        return {
            titulo:-1
        }
    },

    computed: {
        tituloToolbar(){
            return this.titulo === -1 ? 'Sistema de Control de Insumos' : ''
        }
    },
}
</script>
<style>
#fondoToolbar{
  background-color: #011258;
  color:white;
  border-bottom: yellow solid 5px;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}
</style>
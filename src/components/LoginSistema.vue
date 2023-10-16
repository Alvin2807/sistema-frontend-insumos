<template>
    <div>
        <v-toolbar flat id="fondoToolbar" height="100px">
            <v-spacer></v-spacer>
            <v-toolbar-title>
                <img height="70px" :src="require('../assets/mp.png')"/>
                <span style="font-size: 25px;"> {{ tituloToolbar }}</span>
                <img height="70px" class="mx-2" :src="require('../assets/sistema.png')"/>
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
  background-color:#070346 ;
  color:white;
  border-bottom: yellow solid 5px;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}
</style>
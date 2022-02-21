<template>
    <div class="shadow p-3 mb-5 bg-white rounded">
        <h5 class="text-center mb-3">LISTADO DE DOCENTES</h5> <hr>
        
        <div class="float">
            <router-link :to="`/admin`">Volver</router-link>
        </div><br>

       <Docentes></Docentes> 

    </div>
</template>

<script>
import Docentes from '@/components/Docentes.vue';

export default {
    name: 'DocentesSalud',
    components: {
        Docentes,
    },
    data () {
        return {
                  
        }
    },

}
</script>

<style>
.float {
    float: right;
}
</style>
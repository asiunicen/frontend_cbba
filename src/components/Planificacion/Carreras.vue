<template>
    <h6 class="text-center">PLANIFICACIÓN ACADÉMICA - CARRERAS DISPONIBLES</h6> <hr>
    
    <div class="mt-4"> <!-- shadow p-3 mb-5 bg-white rounded -->
        <table class="table table-sm table-hover table-bordered">
            <thead class="table-dark text-center">
            <tr>
                <th scope="col" style="font-weight:normal">RESOLUCIÓN</th>
                <th scope="col" style="font-weight:normal">COD CARRERA</th>
                <th scope="col" style="font-weight:normal">CARRERA</th>
                <th scope="col" style="width:200px">GESTIÓN</th>
                <th scope="col" style="font-weight:normal">OPCIONES</th>
            </tr>
            </thead>
            <tbody> 
                <tr v-for="(carrera, index) in carreras" :key="index">
                    <td>{{ carrera.resolucion }}</td>
                    <td>{{ carrera.cod_carrera }}</td>
                    <td>{{ carrera.nombre }} - {{ carrera.plan_estudio }}</td>
                    <td>
                        <select class="form-control form-control-sm" v-model="carrera.gestion">
                            <option :value="null" class="text-center">Elija una Gestión</option>                    
                            <option v-for="(gestion, index) in gestiones" :key="index" :value="gestion">{{gestion.descripcion}} </option>
                        </select>         
                    </td>
                    <td v-if="carrera.gestion != null" class="text-center pt-2">
                        <router-link :to="`/materias/${carrera.id_plan_estudio}/${carrera.nombre}/${carrera.plan_estudio}/${carrera.gestion.id_gestion}`" class="link">
                        <i class="fas fa-eye"></i> Ver Materias
                        </router-link>
                    </td>
                    <td v-else></td>
                
                </tr>
            </tbody>
        </table>
    </div>
    
        
</template>

<script>
import { getCarrerasSalud } from '@/services/carreraService.js';
import * as gestionService from '@/services/gestionService.js'


export default {
    name: 'Carreras',
    components: {},
    data () {
        return {
            carreras: [],
            gestiones: [],
            gestion: {}
        }
    },
    methods: {
        async getCarreras() {
            try {
                let res = await getCarrerasSalud();
                this.carreras = res.data; 
                this.carreras.forEach( item => item.gestion = null)
                //console.log(res.data);
            } catch (error) {
                console.log(error);
            }
        },
        async getGestion() {
            try {
                let res = await gestionService.getGestiones();
                this.gestiones = res.data;
                // console.log(this.gestiones)
            } catch (error) {
                console.log(error);
            }
        } 
       
    },
    mounted () {
        this.getCarreras()
        this.getGestion()
    }

}  


</script>

<style > 
.fa-eye {
    font-size: 16px;
}
.link{
    /* color: black ;*/
    text-decoration:none;
}

</style>
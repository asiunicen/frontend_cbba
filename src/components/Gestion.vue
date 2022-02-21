<template>

    <!-- <div class="row mb-3">
        <label for="gestion" class="col-sm-2 col-form-label">Seleccionar Gestión:</label> -->
            <div class="col-sm-6">
                <select class="form-select form-select-sm"
                        id="gestion" 
                        required
                        v-model="gestion.descripcion">
                    <option disabled :value="null">Elige Gestión</option> 
                    <option v-for="(gestion, index) in gestiones" :key="index"
                            :value="gestion.descripcion">
                            {{ gestion.descripcion }}
                    </option>
                </select> 
            </div>
    <!-- </div>  -->

</template>

<script>
import { getGestionActual } from "@/services/gestionService.js";

export default {
    name: 'Gestion',
    components: {
        
    },
    data() {
        return {
            gestiones: [],
            gestion: {
                descripcion: null
            },
        
        }
    },
    methods: {
        async getGestion() {
            try {
                let res = await getGestionActual();
                this.gestiones = res.data;    
            } catch (error) {
                console.log(error);
            }
        },
       
    },
    mounted () {
        this.getGestion();    
    },

}

</script>

<style>

</style>
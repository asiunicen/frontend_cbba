<template>
  <div class="row">
    <div class="card mt-4">
      <div class="card-body">
        <div class="row">
            <div class="col-11">
                <h4 class="card-title text-center">Reporte Carrera - Materias</h4>
            </div>
            <div class="col-1" v-if="id_gestion > 0 && id_plan_estudio > 0">
                <router-link :to="`/imprimirReporteCarreraMaterias/${id_gestion}/${id_plan_estudio}/${descripcion}/${nombre_carrera}`" class="texto"> 
                    <button type="button" class="btn btn-warning btn-xxl"><i class="fas fa-print"></i></button>
                </router-link>
                
            </div>
        </div>        
        <p class="card-text"></p>
        <div class="form-group row mb-2">
          <label for="grupo-uno" class="col-1 col-form-label text-center">Gestion:</label>
          <div class="col-2">
              <select class="form-select form-select-sm" required v-model="id_gestion" @change="elejirGestion()">
                    <option selected :value="0">Elija la Gestion</option>
                    <option v-for="(gestion, index) in gestiones"  :key="index"  :value="gestion.id_gestion">{{gestion.descripcion}} </option>
              </select>
            <!-- <label class="form-control-plaintext text-left" id="grupo-uno"><strong>2/2022</strong></label> -->
          </div>
          <label for="grupo-uno" class="col-1 col-form-label text-center">Carrera:</label>
          <div class="col-4">
            <select class="form-select form-select-sm" required v-model="id_plan_estudio" @change="elejirCarrera()">
                <option selected :value="0">Elija la Carrera</option>
                <option v-for="(carrera, index) in carreras" :key="index" :value="carrera.id_plan_estudio">{{carrera.nombre}} ({{carrera.cod_carrera}}) </option>
            </select>
          </div>  
          <div class="col-2">
               <button type="button" class="btn btn-warning btn-sm" @click="mostrarReporte()">Mostrar Reporte</button>
            </div>        
        </div>
        <div class="form-group row mt-3">
            <label for="grupo-dos" class="col-sm-3 col-form-label">Filtrar por: MATERIA, CODIGO y DOCENTE TEORIA</label>
            <div class="col-sm-6">
                <input type="search" class="form-control form-control-sm" id="grupo-dos" v-model="filtro" autofocus placeholder="ingrese el nombre del docente...">
            </div>            
            {{filtro}}
        </div>

        <div class="row mt-4">          
          <table class="table table-striped table-hover table-bordered">
            <thead class="cabecera-tabla">
              <tr>                
                <th scope="col">MATERIA</th>
                <th scope="col">CODIGO</th>
                <th scope="col">GR. TEORICO</th>
                <th scope="col">DOCENTE</th>
                <th scope="col">AULA</th>
                <th scope="col">GR. PRACTICA</th>
                <th scope="col">DOCENTE</th>
                <th scope="col">AULA</th>
              </tr>
            </thead>
            <tbody>              
              <tr v-for="(materia, index) in filtrando" :key="index">
                <td>{{materia.nombre}}</td>
                <td>{{materia.cod_materia}}</td>
                <td class="text-center">{{materia.grupo}}</td>
                <td>{{materia.docente_teoria}}</td>
                <td>{{materia.aula}}</td>
                <td class="text-center" v-if="materia.id_grupo_practica > 0">{{materia.grupo}}.{{materia.id_grupo_practica}}</td>
                <td v-else></td>
                <td>{{materia.docente_practica}}</td>
                <td>{{materia.aula_practica}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import * as reportesService from '@/services/reportesService.js'
import * as gestionService from '@/services/gestionService.js'
import * as carrerasService from '@/services/carreraService.js';

export default {
    data(){
        return {
            filtro: '',
            id_plan_estudio: 83,//105,
            id_gestion: 94,
            materias: [],
            materia: {},
            gestiones: [],
            descripcion: ' ',
            nombre_carrera: ' ',
            carreras: []
        }
    },
    methods:{

        async mostrarReporte(){
            try {
                if(this.id_gestion > 0 && this.id_plan_estudio > 0){
                    const resp = await reportesService.getAllMateriasCarrera(this.id_plan_estudio, this.id_gestion)
                    this.materias = resp.data
                    //console.log(this.materias)
                }else{
                    this.$swal({
                        position: 'center',
                        icon: 'warning',
                        title: 'GESTION o CARRERA NO SELECCIONADO...!',
                        text: 'Debe seleccionar una gestion y carrera correspondiente...!',
                        showConfirmButton: true,
                    })
                }                
            } catch (error) {
                console.log(error)
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
        },
        async getCarreras() {
            try {
                let res = await carrerasService.getCarrerasSalud();
                this.carreras = res.data; 
                this.carreras.forEach( item => item.gestion = null)
                //console.log(res.data);
            } catch (error) {
                console.log(error);
            }
        },
        elejirGestion(){
            if(this.id_gestion > 0)
                this.descripcion = this.gestiones.find(item => item.id_gestion == this.id_gestion).descripcion.replace('/','-')            
        },
        elejirCarrera(){
            if(this.id_plan_estudio > 0){
                let resp = this.carreras.find(item => item.id_plan_estudio == this.id_plan_estudio)            
                this.nombre_carrera = resp.nombre +' '+ resp.cod_carrera
            }            
        }
    },    
    computed: {
        filtrando: function () { 
            if(this.materias){                
                return this.materias.filter((item) => {                    
                    return (
                        item.docente_teoria.match(this.filtro.toUpperCase()) || item.nombre.match(this.filtro.toUpperCase()) || item.cod_materia.match(this.filtro.toUpperCase())
                    )
                })
            }
        }        
    },
    mounted() {        
        this.getGestion()
        this.getCarreras()
        setTimeout(() => {
            this.elejirGestion()    
        }, 200);
        setTimeout(() => {
            this.elejirCarrera()
        }, 200);
        
        //this.mostrarReporte()
    }
};
</script>

<style lang="scss" scoped>
.cabecera-tabla {
  background-color: #00244e;
  color: #ffffff;
  text-align: center;
  font-size: 12px;
  margin: 0px;
  padding: 0px;
}
</style>


<template>
  <div class="modal fade show" tabindex="-1" role="dialog" 
         aria-hidden="true" style="display: block"
      v-show="showModal"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="loginModalLabel">Actualizar Materia (Practica = SI/NO)</h5>
                <button type="button" @click="hideModal()" class="btn-close"></button>
            </div>
            <div class="modal-body">
              <label class="form-label">Materia: {{update_materia.nombre}}</label>
                <div class="col-md-12 mb-2 d-flex justify-content-center">                    
                    <label class="form-label mt-2">Practica:</label>
                    <select class="form-select form-select-sm mx-2" required
                            v-model="update_materia.practica_hospitalaria" >
                        <option value="0">NO</option>
                        <option value="1">SI</option>
                    </select> 
                </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-success btn-sm" @click="updatePractica()">
              <i class="far fa-check-circle"></i> CONFIRMAR
            </button>
                <button type="button" class="btn btn-primary btn-sm" @click="hideModal()">
                    <i class="far fa-times-circle"></i> CANCELAR
                </button>
          </div>
        </div>
      </div>
    </div>

  <div class="card mt-5">
    <div class="card-header">
      <h6 class="text-center pt-2"><strong>MATERIAS DISPONIBLES PARA PROGRAMAR HORARIOS Y DOCENTES</strong></h6>
    </div>
    <div class="card-body pb-0">
      <div class="card-title d-flex">
        <div class="container">
          <h6 class="text-center">Carrera: <strong>{{nombre_carrera}}</strong></h6>
        </div>
        <div class="container">
          <h6 class="text-center">Gestión: <strong>{{gestion.descripcion}}</strong></h6>
        </div>
      </div>      
    </div>
  </div>

  <div class="mt-1"> <!-- shadow p-3 mb-5 bg-white rounded -->
    <table class="table table-sm table-hover table-bordered">
      <thead class="table-dark text-center">
        <tr>
          <th scope="col" style="width: 100px">SEMESTRE</th>
          <th scope="col" style="width: 100px">COD. MAT.</th>
          <th scope="col">NOMBRE MATERIA</th>
          <th scope="col" style="width: 20px">PRÁCTICA</th>
          <th scope="col" style="width: 100px">OPCIONES</th>
          <th scope="col" style="width: 100px">EDITAR</th>
          <!-- <th scope="col" style="width: 100px">OBSERVAR</th> -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="(materia, index) in materiasCarrera" :key="index">
            <th class="text-center">{{ materia.id_nivel }}</th>
            <td class="text-center">{{ materia.cod_materia }}</td>
            <td>{{ materia.nombre }}</td>
            <td class="text-center">{{ materia.practica_hospitalaria == 0 ? 'NO': 'SI' }}</td> 
            <td class="text-center">
                <router-link :to="`/adicion/grupo/teorico/${id_gestion_actual}/${materia.practica_hospitalaria}/${materia.id_plan_materia}/${nombre_carrera}/${this.$route.params.idgestion}`" class="link">
                  <span class="badge rounded-pill bg-info text-dark">PLANIFICAR</span>
                </router-link>
            </td>
            <td class="text-center">
              <!-- <button type="button" class="btn btn-success btn-sm" @click="updatePractica()">
                <i class="far fa-check-circle"></i> CONFIRMAR
              </button> -->
              <span @click="editarMateria(materia)"> 
                <i class="fas fa-pen mx-2" title="Editar"/> 
              </span>
            </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import * as materiasCarreraService from "@/services/materiasCarrera.js";
import * as gestionService from '@/services/gestionService.js'

export default {
  name: "Materias",
  components: {},
  data() {
    return {
      id_gestion_actual: 0,
      nombre_carrera : '',
      gestion: {},
      showModal: false,
      update_materia: {},
      materiasCarrera: [],
    }
  },
  methods: {
    editarMateria(materia){
      this.update_materia = materia
      this.updateModal()
    },
    updateModal() {
      this.showModal = true
    },
    hideModal() {
      this.showModal = false
    },
    async updatePractica(){
      this.hideModal()
      try {
        let resp = await materiasCarreraService.updatePracticaHospitalaria(this.update_materia.id_plan_materia, this.update_materia.practica_hospitalaria)
        console.log(resp)
      } catch (error) {
        console.log(error)
      }
    },
    clearPostValues() {
      this.update_materia = {          
      }
    },
    async getMateriaCarreraById() {
      try {
        this.id = this.$route.params.id
        this.nombre_carrera = this.$route.params.nombre + '(' + this.$route.params.carrera + ')'
        let res = await materiasCarreraService.getMateriasByIdPlanEstudio(`${this.id}`)
        this.materiasCarrera = res.data        
        //console.log(res)        
      } catch (error) {
        console.log(error);
      }
    },
    async getGestion() {
      try {
        let res = await gestionService.getGestiones();
        this.gestiones = res.data;
        this.gestion = this.gestiones.find( item => {
          return item.id_gestion === this.$route.params.idgestion
        })
      } catch (error) {
        console.log(error);
      }
    },
    async obtenerGestionActual() {
      try {
        let res = await gestionService.getGestionActual();
        let gestionActual = res.data.data;
        //console.log('la gestion es: ', gestionActual)
        this.id_gestion_actual = gestionActual.id_gestion
      } catch (error) {
        console.log(error);
      }
    }
  },

  mounted() {
    this.getMateriaCarreraById();
    this.getGestion()
    this.obtenerGestionActual()
  },

  created() {},
}
</script>

<style>
th {
  font-weight:normal
}
</style>

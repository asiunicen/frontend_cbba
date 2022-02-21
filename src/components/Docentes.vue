<template>
  
  <div class="search-wrapper">
      <div class="row mb-3">
          <label for="gestion" class="col-sm-2 col-form-label">Buscar Docente:</label>
          <div class="col-sm-10 input-group-sm">
            <input type="text" 
                class="form-control"      
                placeholder="Criterio de busqueda"
                v-model="search"
                />
            <span>Puede realizar una busqueda por Nombres o Apellidos.</span>
          </div>
      </div> <br>

      <table class="table table-hover table-sm table-bordered">
        <thead class="table-dark text-center">
          <tr>
            <th scope="col">CODIGO</th>
            <th scope="col">NOMBRES</th>
            <th scope="col">COD PERSONAL</th>
            <th scope="col">CARGO</th>
            <th scope="col">OPCIONES</th>
          </tr>
        </thead>
        <tbody>  
          <!-- <tr v-for="(docente, index) in docentes" :key="index"> -->
          <tr v-for="(docente, index) in filteredList" :key="index">
            <td>{{ docente.id_datos_personal }}</td>
            <td>{{ docente.paterno }} {{ docente.materno }} {{docente.nombres}}</td>
            <td>{{ docente.id_personal }}</td>
            <td>{{ docente.descripcion }}</td>
            <td></td>
          </tr>
        </tbody>
      </table> 
    
  </div>

</template>

<script>

import { getDocentesSalud } from '@/services/docentesService.js';

export default {
    name: 'DocenteHorario',
    components: {},
    data() {
      return {
        docentes: [],
        search: '',
        dias: [
          {"id":1, "descripcion": "LUNES"},
          {"id":2, "descripcion": "MARTES"},
          {"id":3, "descripcion": "MIERCOLES"},
          {"id":4, "descripcion": "JUEVES"},
          {"id":5, "descripcion": "VIERNES"},
          {"id":6, "descripcion": "SABADO"},
        ]
      } 
    },
    methods: {
      async getDocente() {
        try {
          let res = await getDocentesSalud();
          this.docentes = res.data;
        } catch (error){
            console.log(error);
        }
      },
      /* showModal() {
        this.displayModal = true;
      },
      closeModal() {
        this.displayModal= false
      }, */
      async getFranjas() {
        try {
          let res = await franjaHorarioAula();
            this.franjaHoraria = res.data; 
            //console.log(res);
        } catch (error) {
          console.log(error);
        }
      },
         
    },
    mounted() {
      this.getDocente();
      
    },
    computed: {
      filteredList() {
        return this.docentes.filter((docente) => {
          return docente.paterno.toLowerCase().match(this.search) ||
               docente.materno.toLowerCase().match(this.search) || 
               docente.nombres.toLowerCase().match(this.search);    
            });
      },
      rows() {
        return this.docentes.length
      }
    }
  

}
</script>

<style>
@import url('../assets/style.css');
table {
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  font-size: 12px;
}

</style>
<template>
  <h6 class="text-center mb-3">ASIGNACION DE PERFILES A ESTUDIANTES</h6>
  <hr />

  <!--<div >
    <form @submit.prevent="guardarNuevaArea()">
        <div class="modal fade in" id="areaModal" tabindex="-1" aria-labelledby="areaModalEtiqueta" aria-hidden="true" role="dialog">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="areaModalEtiqueta">DIAT - AREAS</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <p v-if="errores.length">
                  <b>Por favor, corrija el(los) siguiente(s) error(es):</b>
                  <ul>
                    <li v-for="error in errores" :key="error">{{ error }}</li>
                  </ul>
                </p>
                <label for="nuevaArea" class="form-label">Nueva Area:</label>
                <textarea v-model="areaDetalle" class="form-control form-control-sm" rows="2" id="nuevaArea" required></textarea>
              </div>
              <div class="modal-footer">
                <button type="submit" class="btn btn-success btn-sm"><i class="fas fa-save"></i> GUARDAR </button>
                <button class="btn btn-primary btn-sm"  data-bs-dismiss="modal"><i class="far fa-times-circle"></i> CANCELAR </button>                
              </div>
            </div>
          </div>
        </div>
    </form> 
  </div>-->

  <div>
    <form @submit.prevent="agregarPerfil()">
        <div class="modal fade show" id="perfilModal" tabindex="-1" aria-hidden="true" v-show="showModal" role="dialog">

        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title text-center" id="perfilModalLabel">ASIGNAR PERFIL</h5>
                <button type="button" class="btn-close" @click="hideModal()"></button>
            </div>
                <div class="modal-body">
                    <div class="row mb-2">
                        <label for="nombre" class="col-sm-3 form-label">Nombre:</label>
                        <div class="col-sm-9">
                          <span class="h6">{{ perfil_trabajo.paterno }} {{perfil_trabajo.materno}} {{ perfil_trabajo.nombres }}</span>
                        </div>
                    </div> 
                    <div class="row mb-2">
                        <label for="carrera" class="col-sm-3 form-label">Carrera:</label>
                        <div class="col-sm-9">
                          <span class="h6">{{ perfil_trabajo.carrera }}</span>            
                        </div>
                    </div> 
                    <div class="row mb-2">
                        <label for="area" class="col-sm-3 form-label">Area:</label>
                        <div class="col-sm-9">
                            <select v-model="perfil_trabajo.id_area_trabajo" class="form-select form-select-sm"
                                    id="area" required
                            @change="filtrarCampos">
                                <option disabled value="">Seleccione un Area</option>
                                <option v-for="area in areas"
                                        :key="area.id_area_trabajo"
                                        :value="area.id_area_trabajo">
                                        {{ area.detalle }}
                                </option>
                            </select>
                            
                        </div>
                        <!--<span class="col-sm-1 h4 p-0" data-bs-toggle="modal" data-bs-target="#areaModal"><i class="fa fa-plus-circle" aria-hidden="true"></i></span>-->
                      </div>                      
                    <div class="row mb-2">
                        <label for="campo" class="col-sm-3 form-label">Campo:</label>
                        <div class="col-sm-9">
                            <select v-model="perfil_trabajo.id_campo_trabajo" class="form-select form-select-sm"
                                    id="campo" required
                            @change="filtrarSubCampos">

                                <option disabled value="">Seleccione un campo</option>
                                <option v-for="campo in campos"
                                        :key="campo.id_campo_trabajo"
                                        :value="campo.id_campo_trabajo">
                                        {{ campo.detalle }} {{campo.id_campo_trabajo}}
                                </option>                                
                            </select>
                        </div>
                        <!--<span class="col-sm-1 h4 p-0"><i class="fa fa-plus-circle" aria-hidden="true"></i></span>-->
                    </div>
                    <div class="row mb-2">
                        <label for="subCampo" class="col-sm-3 form-label">Sub Campo:</label>
                        <div class="col-sm-9">
                            <select v-model="perfil_trabajo.id_sub_campo_trabajo" class="form-select form-select-sm"                                    
                                    id="subCampo" required>

                                <option disabled value="">Seleccione un sub campo</option>
                                <option v-for="subcampo in subCampos"
                                        :key="subcampo.id_sub_campo_trabajo"
                                        :value="subcampo.id_sub_campo_trabajo">
                                        {{ subcampo.detalle }} {{subcampo}}
                                </option>
                            </select>                             
                        </div>
                        <!--<span class="col-sm-1 h4 p-0"><i class="fa fa-plus-circle" aria-hidden="true"></i></span>-->
                    </div>                   

                    <div class="row mb-2">
                        <label for="nombrePerfil" class="col-sm-3 form-label">Nombre Perfil:</label>
                        <div class="col-sm-9">
                            <textarea v-model="perfil_trabajo.perfil" class="form-control form-control-sm"
                                    id="nombrePerfil" required                                    
                            >
                            </textarea>
                        </div>                        
                    </div>

                    <div class="row mb-2">
                        <label for="subCampo" class="col-sm-3 form-label">Fecha:</label>
                        <div class="col-sm-6">
                          <input type="date" v-model.trim="perfil_trabajo.fecha" class="form-control form-control-sm" 
                          required id="fecha"                          
                        >
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="submit" class="btn btn-success btn-sm"><i class="fas fa-save"></i> {{showUpdateModal?'MODIFICAR':'GUARDAR'}}</button>
                    <button type="button" class="btn btn-primary btn-sm" @click="hideModal()"><i class="far fa-times-circle"></i> CANCELAR</button>
                </div>
            </div>
        </div>
        </div>
    </form> 
  </div>

  <div>
    <nav class="navbar navbar-light bg-light">
      <div class="container-fluid row">
        <span class="navbar-text"
          >Filtrar la busqueda Completa por: (Nombres - Apellido Paterno - Apellido
          Materno)</span
        >
        <form class="d-flex">
          <input id="campo_busqueda"
            v-model="filtro" 
            v-on:click="getDataPagina(1)"
            class="form-control me-2"
            type="search"
            placeholder="busqueda del estudiante..."
            aria-label="buscar"
          />
          <button class="btn btn-outline-success" type="submit">Buscar</button>
        </form>
      </div>
    </nav>
  </div>  
  <div class="p-3">        
    <table class="table table-hover table-sm table-bordered">
      <thead class="table-dark text-center">
        <tr>
          <th scope="col">MATRICULA</th>
          <th scope="col">NOMBRE</th>
          <th scope="col">CARRERA</th>
          <th scope="col">PERFIL</th>
          <th scope="col">ACCION</th>          
        </tr>
      </thead>
      <tbody>
        <tr v-for="(estudiante, index) in filtroEstudiantes" :key="index">
          <td>{{ estudiante.matricula }}</td>
          <td class="text-left">{{ estudiante.paterno }} {{estudiante.materno}} {{ estudiante.nombres }} </td>
          <td>{{ estudiante.carrera }}</td>
          <td>{{ estudiante.perfil }}</td>          
          <td class="text-center">
            <button class="btnactualizar" title="Nuevo Perfil" @click="mostrarModalGuardar(estudiante)">
              <i class="fa fa-plus" aria-hidden="true"></i>
            </button>
            <button class="btnactualizar" title="Actualizar Perfil" @click="mostrarModalActualizar(estudiante)">
              <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>    

    <nav class="paginacion" aria-label="Page navigation example">
      <ul class="pagination justify-content-start">
        <li class="page-item" v-on:click="getPreviousPage()"><a class="page-link" href="/?#/diat/PerfilEstudiantes">Previous</a></li>
        <li v-for="(pagina, index) in totalPaginas()" :key="index" v-on:click="getDataPagina(pagina)" class="page-item" v-bind:class="isActive(pagina)"><a class="page-link" href="/?#/diat/PerfilEstudiantes">{{pagina}}</a></li>
        <li class="page-item" v-on:click="getNextPage()"><a class="page-link" href="/?#/diat/PerfilEstudiantes">Next</a></li>
      </ul>
    </nav>

  </div>
</template>

<script>
import {getAllEstudiantesEgresados, crearPerfilEstudiante} from "@/services/estudiantesEgresados.js";
import {getAreasTrabajo, getCamposTrabajo, getSubCamposTrabajo} from "@/services/areasTrabajo.js";

export default {
  name: "IndexEgresados",
  components: {},
  data() {
    return {
      estudiantes: [],
      areas: [],
      campos: [],
      subCampos: [],
      errores: [],
      filtro: "",
      areaDetalle: "",
      elementosPorPagina: 18,
      datosPaginados: [],
      pages: [],      
      paginaActual: 1,      
      mostrarModal: false,
      perfil_trabajo: {
        nombres: null,
        paterno: null,
        materno: null,
        carrera: null,
        id_perfil_trabajo: null,
        id_estudiante: null,
        nombre: "",
        fecha: "",
        id_plan_estudio: null,
        detalle: "",
        id_sub_campo_trabajo: null
      },      
      id_area_trabajo: null,
      id_campo_trabajo: null,  
      id_sub_campo_trabajo: null,    
      showModal: false,
      showUpdateModal: false,
    };
  },
  methods: {    
    async getEstudiantes() {
      try {
        this.estudiantes = [];
        let res = await getAllEstudiantesEgresados();
        this.estudiantes = res.data.data;
        //console.log(res.data.data);
        this.getDataPagina(1);
      } catch (error) {
        console.log(error);
      }
    },
    async getAreas(){
      try {
          let res = await getAreasTrabajo()
          this.areas = res.data.data;
          //console.log(res.data.data);
      } catch (error) {
          console.log(error);
      }
    },
    async getCampos(id_area_trabajo){      
      //console.log(id_area_trabajo);
      try {
          let res = await getCamposTrabajo(id_area_trabajo)
          this.campos = res.data.data;
          //console.log(res.data.data);
      } catch (error) {
          console.log(error);
      }
    },
    async getSubCampos(id_campo_trabajo){      
      console.log(id_campo_trabajo);
      try {
          let res = await getSubCamposTrabajo(id_campo_trabajo, "subcampo")
          this.subCampos = res.data.data;
          console.log(res.data.data);
      } catch (error) {
          console.log(error);
      }
    },
    filtrarCampos(event) {
      //console.log(event.target.value);
      this.getCampos(event.target.value);
    },
    filtrarSubCampos(event) {
      console.log(event.target.value);
      this.getSubCampos(event.target.value);
    },
    totalPaginas() {
        return Math.ceil(this.estudiantes.length / this.elementosPorPagina);
    },
    getDataPagina(nroPagina){
        this.paginaActual = nroPagina;
        this.datosPaginados = [];
        let ini = (nroPagina * this.elementosPorPagina) - this.elementosPorPagina;
        let fin = (nroPagina * this.elementosPorPagina);

        this.datosPaginados = this.estudiantes.slice(ini, fin);        
    },
    getPreviousPage(){
        if(this.paginaActual > 1){
            this.paginaActual--;
        }
        this.getDataPagina(this.paginaActual);
    },
    getNextPage(){
        if(this.paginaActual < this.totalPaginas()){
            this.paginaActual++;
        }
        this.getDataPagina(this.paginaActual);
    },
    isActive(nroPagina){
        return nroPagina == this.paginaActual ? 'active': '';
    },
    openModal(){
      this.showModal = true      
    },
    hideModal() {
      this.showModal = false;
      this.showUpdateModal = false
      this.perfil_trabajo = {
        nombres: null,
        paterno: null,
        materno: null,
        carrera: null,
        id_perfil_trabajo: null,
        id_estudiante: null,
        nombre: "",
        fecha: "",
        id_plan_estudio: null,
        detalle: "",
        id_sub_campo_trabajo: null
      }
    },
    agregarPerfil(){
      if (this.showUpdateModal) {
        /*try { 
            let resAula = await admAulasService.updateAulaTorre(this.aula.id_aula, {
                id_tipo_aula: this.aula.id_tipo_aula,
                id_bloque: this.aula.id_bloque,
                nombre: this.aula.nombre.toUpperCase(),
                capacidad: this.aula.capacidad
            })
            
            this.hideModal()
            this.getAulas()
            //console.log(resAula);
        } catch (error) {
            console.log(error);
        }*/
      } else {
        if (this.perfil_trabajo) {
            try {
              if(confirm("Esta seguro que desea crear un NUEVO PERFIL de estudiante...?")){
                //let res = crearPerfilEstudiante(this.perfil_trabajo);
                console.log(this.id_sub_campo_trabajo);
                this.perfil_trabajo.id_sub_campo_trabajo = this.id_sub_campo_trabajo;
                console.log(this.perfil_trabajo);
                this.hideModal();
                this.getEstudiantes();
              }
            } catch (error) {
                console.log(error);
            }  
        }
      }      
    },
    mostrarModalGuardar(data){
      console.log(data);
      this.perfil_trabajo.nombres = data.nombres;
      this.perfil_trabajo.paterno = data.paterno;
      this.perfil_trabajo.materno = data.materno;
      this.perfil_trabajo.carrera = data.carrera;
      this.perfil_trabajo.id_perfil_trabajo = data.id_perfil_trabajo;
      this.perfil_trabajo.id_estudiante = data.id_estudiante;
      this.perfil_trabajo.nombre = data.perfil;
      this.perfil_trabajo.fecha = "";
      this.perfil_trabajo.id_plan_estudio = data.id_plan_estudio;
      this.perfil_trabajo.detalle = "";
      this.perfil_trabajo.id_sub_campo_trabajo = data.id_sub_campo_trabajo;

      this.showUpdateModal = false;
      this.openModal();
    },
    mostrarModalActualizar(data){
      //console.log(data.id_aula);
      this.perfil_trabajo = data;
      this.showUpdateModal = true
      this.openModal() 
    }
  },
  computed: {
    filtroEstudiantes: function () {
        let ini = (this.paginaActual * this.elementosPorPagina) - this.elementosPorPagina;
        let fin = (this.paginaActual * this.elementosPorPagina);
      return this.estudiantes.filter((estudiante) => {
        return (
          estudiante.nombres.match(this.filtro) ||                     
          estudiante.paterno.match(this.filtro) ||
          estudiante.materno.match(this.filtro)
        );
      }).slice(ini, fin);
    },
  },  
  mounted() {
    this.getEstudiantes()    
    this.getAreas()    
  },
};
</script>

<style lang="scss" scoped>

.paginacion {
    font-size: .7rem;
}
.form-select {
  font-size: 12px;
}
#perfilModal {
  display: block;
}
.fa-pencil-square-o {
  color: green;
}
.fa-plus{
  color: rgb(8, 1, 104);
}
.btnactualizar:hover {
  background-color: #ff7300;
}
.btnactualizar {
  border-radius: 50%;
  border: none;
}
.btn-new {
  background-color: #00244e;
  border: none;
  color: white;
}
.btn-new:hover {
  background-color: #ff7300;
}
.fa-pencil-square-o:hover {
  background-color: #ff7300;
  color: white;
}
.fa-plus:hover {
  background-color: #ff7300;
  color: white;
}
</style>

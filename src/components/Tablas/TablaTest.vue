<template>
  <h6 class="text-center mb-3">PLANIFICACIÓN DEL PROGRAMA ACADÉMICO</h6>
  <hr />

  <div>
    <form @submit.prevent="savePlanEstudio()">
      <div
        class="modal fade show"
        id="programaModal"
        tabindex="-1"
        aria-hidden="true"
        v-show="showModal"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="aulaModalLabel">
                <span class="text-center">{{
                  !showUpdateModal
                    ? "NUEVO PLAN DE ESTUDIOS"
                    : "MODIFICAR DATOS DEL PLAN ESTUDIOS"
                }}</span>
              </h5>
              <button
                type="button"
                class="btn-close"
                @click="hideModal()"
              ></button>
            </div>
            <div class="modal-body">
              <div class="row mb-2">
                <label for="id_carrera" class="col-sm-4 form-label"
                  >CARRERA:</label
                >
                <div class="col-sm-8">
                  <select class="form-select form-select-sm" id="id_carrera" required v-model="programa.id_plan_estudio" @click=" cambiarCodCarrera(), !showUpdateModal ? cargarTiposPlan() : true ">
                    <option :disabled="!showUpdateModal ? false : true" :value="0" >
                      Elige una Carrera
                    </option>
                    <option v-for="carrera in carreras" :key="carrera.id_plan_estudio" :value="carrera.id_plan_estudio" :disabled="!showUpdateModal ? false : true" >
                      {{ carrera.nombre_carrera }} ({{ carrera.tipo_carrera }})
                    </option>
                  </select>
                </div>
              </div>

              <div class="row mb-2">
                <label for="cod_carrera" class="col-sm-4 form-label"
                  >CODIGO:</label
                >
                <div class="col-sm-8">
                  <input
                    type="text"
                    class="form-control form-control-sm"
                    id="cod_carrera"
                    required
                    v-model="cod_carrera"
                    readonly
                  />
                </div>
              </div>

              <div class="row mb-2">
                <label for="id_plan" class="col-sm-4 form-label"
                  >TIPO PLAN:</label
                >
                <div class="col-sm-8">
                  <select
                    class="form-select form-select-sm"
                    id="id_plan"
                    required
                    v-model="programa.id_tipo_plan_estudio"
                  >
                    <option
                      :disabled="!showUpdateModal ? false : true"
                      :value="0"
                    >
                      Elige un Plan de Estudio
                    </option>
                    <option
                      v-for="plan in tiposPlan"
                      :key="plan.id_tipo_plan_estudio"
                      :value="plan.id_tipo_plan_estudio"
                      :disabled="!showUpdateModal ? false : true"
                    >
                      {{ plan.descripcion }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="row mb-2">
                <label for="id_tipoCarrera" class="col-sm-4 form-label">
                  NIVEL ACADEMICO:</label
                >
                <div class="col-sm-8">
                  <select
                    class="form-select form-select-sm"
                    id="id_tipoCarrera"
                    required
                    v-model="programa.id_tipo_carrera"
                  >
                    <option
                      :disabled="!showUpdateModal ? false : true"
                      :value="0"
                    >
                      Elige el Nivel Academico
                    </option>
                    <option
                      v-for="tipo in tiposCarrera"
                      :key="tipo.id_tipo_carrera"
                      :value="tipo.id_tipo_carrera"
                      :disabled="!showUpdateModal ? false : true"
                    >
                      {{ tipo.descripcion }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="row mb-2">
                <label for="id_resolucion" class="col-sm-4 form-label"
                  >RESOLUCION:</label
                >
                <div class="col-sm-8">
                  <input
                    type="text"
                    class="form-control form-control-sm"
                    id="id_resolucion"
                    required
                    v-model="programa.resolucion"
                  />
                  <!-- {{programa.capacidad}} -->
                </div>
              </div>

              <div class="row mb-2">
                <label for="id_estado" class="col-sm-4 form-label"
                  >ESTADO:</label
                >
                <div class="col-sm-8">
                  <select
                    class="form-select form-select-sm"
                    id="id_estado"
                    required
                    v-model="programa.activo"
                  >
                    <option :value="1">ACTIVO</option>
                    <option :value="0">INACTIVO</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="submit" class="btn btn-success btn-sm">
                <i class="fas fa-save"></i>
                {{ showUpdateModal ? "MODIFICAR" : "GUARDAR" }}
              </button>
              <button
                type="button"
                class="btn btn-primary btn-sm"
                @click="hideModal()"
              >
                <i class="far fa-times-circle"></i> CANCELAR
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>

  <div>
    <nav class="navbar navbar-light bg-light justify-content-between">
      <div class="mx-3">
        <label for="busqueda" class="form-label">Filtrar la busqueda Completa por: (COD CARRERA - NOMBRE CARRERA - NIVEL CARRERA - RESOLUCION - ESTADO)</label>
        <input type="search" class="form-control" id="busqueda" v-model="filtro" placeholder="Filtro de busqueda..." aria-label="buscar" autofocus/>
      </div>
      {{filtro}}
      <button class="btn btn-new btn-sm mx-3 mt-4" @click="openModal()"> AÑADIR </button>
    </nav>
  </div>

  <div class="py-2">
    <table class="table table-hover table-sm table-bordered">
      <thead class="table-dark text-center">
        <tr>
          <th scope="col">ID</th>
          <th scope="col">COD CARRERA</th>
          <th scope="col">NOMBRE CARRERA</th>
          <th scope="col">NIVEL CARRERA</th>
          <th scope="col">RESOLUCION</th>
          <th scope="col">ESTADO</th>
          <th scope="col">ACCIONES</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(programa, index) in filtrando" :key="index">
          <td class="text-center">{{ programa.id_plan_estudio }}</td>
          <td class="text-center">{{ programa.cod_carrera }}</td>
          <td class="text-left">{{ programa.nombre_carrera }} ({{ programa.tipo_carrera }})</td>
          <td class="text-center">{{ programa.descripcion }}</td>
          <td class="text-center">{{ programa.resolucion }}</td>
          <td class="text-center">{{ programa.activo }}</td>
          <td class="text-center">
            <button
              class="btnactualizar"
              title="Modificar Programa"
              @click="editPrograma(programa), cambiarCodCarrera()"
            >
              <i class="fas fa-pen"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import * as programaService from "@/services/programaService.js";

export default {
  name: "IndexProgramas",
  components: {},
  data() {
    return {
      programas: [],
      tiposCarrera: [],
      carreras: [],
      tiposPlan: [],
      id_ultimo_plan_estudio: 0,
      id_carrera: 0,
      filtro: '',
      programa: {
        id_plan_estudio: 0,
        id_tipo_plan_estudio: 0,
        id_carrera: 0,
        id_tipo_carrera: 0,
        cod_carrera: '',
        nombre_carrera: '',
        tipo_carrera: '',
        resolucion: '',
        activo: 0,
        descripcion: '',
      },
      cod_carrera: '',
      showModal: false,
      showUpdateModal: false,
    };
  },
  methods: {
    async getProgramas() {
      try {
        let res = await programaService.getProgramaCarrera();
        this.programas = res.data;
        //console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    },
    async getCarreras() {
      try {
        let res = await programaService.getProgramaCarrera();
        this.carreras = res.data;
        //console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    },

    async getTiposCarrera() {
      try {
        let res = await programaService.getAllTiposCarrera();
        this.tiposCarrera = res.data;
        //console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    },
    async savePlanEstudio() {
      if (this.validarCampos()) {
        if (this.showUpdateModal) {
          try {
            let resp = await programaService.updatePlanEstudios({
              id_plan_estudio: this.programa.id_plan_estudio,
              id_tipo_plan_estudio: this.programa.id_tipo_plan_estudio,
              id_carrera: this.programa.id_carrera,
              resolucion: this.programa.resolucion.toUpperCase(),
              fecha_creacion: this.programa.fecha_creacion,
              activo: this.programa.activo,
              semana_periodo: 0,
              total_horas_acad: 0,
            });
            //console.log(resp);
            this.hideModal();
            this.getProgramas();
            this.getCarreras();
            this.getTiposCarrera();
            this.cargarTiposPlan();
            //console.log(resAula);
          } catch (error) {
            console.log(error);
          }
        } else {
          if (this.programa) {
            try {
              let res = await programaService.createPlanEstudios({
                id_plan_estudio: this.id_ultimo_plan_estudio,
                id_tipo_plan_estudio: this.programa.id_tipo_plan_estudio,
                id_carrera: this.id_carrera,
                resolucion: this.programa.resolucion.toUpperCase(),
                fecha_creacion: new Date().toISOString().substr(0, 10),
                activo: this.programa.activo,
                semana_periodo: 0,
                total_horas_acad: 0,
              });
              //console.log(res);
              this.hideModal();
              this.getProgramas();
              this.getCarreras();
              this.getTiposCarrera();
              this.cargarTiposPlan();
            } catch (error) {
              console.log(error);
            }
          }
        }
      }
    },
    async obtenerUltimoPlanEstudio() {
      try {
        let res = await programaService.getLastIdPlanEstudio();
        res = res.data;
        this.id_ultimo_plan_estudio = res[0].id_plan_estudio + 1;

        //console.log(res);
      } catch (error) {
        console.log(error);
      }
    },

    async cargarTiposPlan() {
      try {
        let res = await programaService.getTiposPlan(this.id_carrera);
        this.tiposPlan = res.data;
        //console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    },

    validarCampos() {
      if (this.programa.id_plan_estudio > 0) {
        if (this.programa.id_tipo_plan_estudio > 0) {
          if (this.programa.id_tipo_carrera > 0) {
            if (this.programa.resolucion.trim() != "") {
              if (this.programa.activo == 0 || this.programa.activo == 1) {
                return true;
              }
            } else {
              alert("el campo RESOLUCION, no puede estar VACIO...!");
            }
          } else {
            alert("Debe elegir un NIVEL ACADÉMICO...!");
          }
        } else {
          alert("Debe elegir un TIPO PLAN DE CARRERA...!");
        }
      } else {
        alert("Debe elegir una CARRERA ACADÉMICA...!");
      }
    },
    cambiarCodCarrera() {
      this.carreras.forEach((carrera) => {
        if (carrera.id_plan_estudio === this.programa.id_plan_estudio) {
          this.cod_carrera = carrera.cod_carrera;
          this.id_carrera = carrera.id_carrera;
        }
      });
    },

    openModal() {
      this.showModal = true;
      this.cod_carrera = "";
      if (!this.showUpdateModal) this.obtenerUltimoPlanEstudio();
    },
    hideModal() {
      this.showModal = false;
      this.showUpdateModal = false;
      this.programa = {
        id_plan_estudio: 0,
        id_tipo_plan_estudio: 0,
        id_carrera: 0,
        id_tipo_carrera: 0,
        cod_carrera: "",
        nombre_carrera: "",
        tipo_carrera: "",
        resolucion: "",
        activo: 0,
        descripcion: "",
      };
      this.id_carrera = 0,
      this.id_ultimo_plan_estudio = 0,
      this.getProgramas();
      this.getCarreras();
    },
    editPrograma(data) {
      //console.log(data);
      this.programa = data;
      this.showUpdateModal = true;
      this.openModal();
    },
  },
  computed: {
    filtrando: function () {       
      return this.programas.filter((item) => {
        return (
          item.cod_carrera.match(this.filtro.toUpperCase()) ||
          item.nombre_carrera.match(this.filtro.toUpperCase()) ||
          item.descripcion.match(this.filtro.toUpperCase()) ||
          item.resolucion.match(this.filtro.toUpperCase()) ||
          item.activo.match(this.filtro.toUpperCase())         
        );
      });
    },
  }, 
  mounted() {
    this.getProgramas();
    this.getCarreras();
    this.getTiposCarrera();
    this.cargarTiposPlan();
  },
};
</script>

<style lang="scss" scoped>
.form-select {
  font-size: 12px;
}
// input {
//   text-transform: uppercase;
// }
#programaModal {
  display: block;
}
.fa-recycle {
  color: green;
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
.fa-recycle:hover {
  background-color: #ff7300;
  color: white;
}
</style>

<template>
<div class="pt-3 d-flex justify-content-end"><button type="button" class="btn btn-warning mb-2" @click="exportToPDF()">DESCARGAR REPORTE</button></div>
  <div class="row" ref="document">
    <div class="card mt-4">
      <div class="card-body">
        <div class="card-header bg-w text-center d-flex">
          <img
            src="@/assets/unicenLogo.jpg"
            alt=""
            width="200"
            height="100"
            class="img-fluid"
          />
          <h3 class="mx-2 text-center mt-3">UNICEN - COCHABAMBA - SALUD</h3>
        </div>        
        <p class="card-text"></p>
        <div class="form-group row">
          <label for="grupo-uno" class="col-2 col-form-label text-center"
            >Gestion:</label
          >
          <div class="col-2">
            <label class="form-control-plaintext text-left" id="grupo-uno"
              ><strong>{{
                descripcion.replace("-", "/").toUpperCase()
              }}</strong></label
            >
          </div>
          <label for="grupo-dos" class="col-2 col-form-label text-center"
            >Carrera:</label
          >
          <div class="col-4">
            <label class="form-control-plaintext text-left" id="grupo-dos"
              ><strong>{{ carrera.toUpperCase() }}</strong></label
            >
          </div>
        </div>

        <div class="row mt-2">
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
              <tr v-for="(materia, index) in materias" :key="index">
                <td>{{ materia.nombre }}</td>
                <td>{{ materia.cod_materia }}</td>
                <td class="text-center">{{ materia.grupo }}</td>
                <td>{{ materia.docente_teoria }}</td>
                <td>{{ materia.aula }}</td>
                <td class="text-center" v-if="materia.id_grupo_practica > 0">
                  {{ materia.grupo }}.{{ materia.id_grupo_practica }}
                </td>
                <td v-else></td>
                <td>{{ materia.docente_practica }}</td>
                <td>{{ materia.aula_practica }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as reportesService from "@/services/reportesService.js";
import * as gestionService from "@/services/gestionService.js";
import * as carrerasService from "@/services/carreraService.js";
import html2pdf from 'html2pdf.js'

export default {
  data() {
    return {
      id_plan_estudio: this.$route.params.idplanestudio,
      id_gestion: this.$route.params.idgestion,
      carrera: this.$route.params.carrera,
      descripcion: this.$route.params.descripcion,
      materias: [],
      materia: {},
      gestiones: [],
      carreras: [],
    };
  },
  methods: {
    exportToPDF() {
        html2pdf(this.$refs.document, {
            margin: 0.2,
            filename: 'reporteCarreraMaterias.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { dpi: 192, letterRendering: true, scale: 1, useCORS: true },          
            jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' },
            //pagebreak: { before: '#inscrito', after: '#inscrito', avoid: '' } portrait
        })
        
    },
    async mostrarReporte() {
      try {
        if (this.id_gestion > 0 && this.id_plan_estudio > 0) {
          const resp = await reportesService.getAllMateriasCarrera(
            this.id_plan_estudio,
            this.id_gestion
          );
          this.materias = resp.data;
          //console.log(this.materias)
        } else {
          this.$swal({
            position: "center",
            icon: "warning",
            title: "GESTION o CARRERA NO SELECCIONADO...!",
            text: "Debe seleccionar una gestion y carrera correspondiente...!",
            showConfirmButton: true,
          });
        }
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
    },
    async getCarreras() {
      try {
        let res = await carrerasService.getCarrerasSalud();
        this.carreras = res.data;
        this.carreras.forEach((item) => (item.gestion = null));
        //console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    },
  },
  computed: {},
  mounted() {
    this.getGestion();
    this.getCarreras();
    this.mostrarReporte();
  },
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


<template>
    <!-- <h6 class="text-center mb-3">ASIGNACIÓN DE HORARIOS</h6>  -->
      <!-- {{$route.params.idgrupo}} -->
    <br>
    <div class="shadow-lg bg-body rounded mb-3">
        <div class="card bg-light mb-3" >
            <div class="card-header text-center"><h5 class="mt-1">HORARIO - DOCENTE (TEÓRICO)</h5></div>
            <div class="card-body">
                <div class="container d-flex justify-content-around">
                    <div>
                        <h6 class="card-title">Docente: <strong>{{nombre_completo}}</strong></h6>
                        <h6 class="card-text">Carrera: <strong>{{carrera}}</strong></h6>
                        <h6 class="card-text">Gestión: <strong>{{gestion}}</strong></h6>
                    </div>
                    <div>
                        <h6 class="card-text">Cant Estudiantes: <strong class="mx-3">{{cant}}</strong></h6>
                        <h6 class="card-text">Fecha Inicio: <strong class="mx-2">{{fecha_inicio}}</strong></h6>
                        <h6 class="card-text">Fecha Final: <strong class="mx-3">{{fecha_fin}}</strong></h6>
                    </div>
                </div>
            </div>   
        </div>
    </div> 

    <!-- Tabla -->
    <!-- v-show="postValues.id_aula !== null" -->
    <div class="mt-3">
        <table id="mytable1" class="table table-sm table-bordered text-center">
            <thead class="table-dark">
              <tr>
                <th scope="col" style="width: 90px">INICIO - FIN</th>
                <th scope="col" style="width: 100px" 
                    v-for="(dia, id_dia) in dias" :key="id_dia"
                >
                    {{dia.descripcion}}
                </th>
              </tr>
            </thead>
            <tbody>
                <tr v-for="(hora, id_franja_horaria) in franjaHoraria" :key="id_franja_horaria">
                    <td> {{ hora.horario }} </td>                    
                    <td v-for="(day, id_dia) in dias" :key="id_dia">
                        <li class="badge rounded-pill bg-info text-dark text-wrap cursor" v-for="(det, index) in detallesAula(id_franja_horaria, id_dia)" :key="index">
                            {{det.cod_carrera}} - {{det.nombre}} : (aula: {{det.aula}}) - (grupo: {{det.grupo}})
                        </li>
                    </td>
                </tr>
            </tbody>
        </table>  
    </div> 
    
</template>

<script>
import * as asignacionService from '@/services/asignacionService.js'
import * as admAulasService from '@/services/admAulasService.js'
import * as gestionService from '@/services/gestionService.js'

export default {
    name: 'HorarioTeorico',
    components: {},
    data () {
        return {
          nombre_completo: this.$route.params.nombrecompleto,
          carrera: this.$route.params.carrera,
          gestion: '',
          id_personal: this.$route.params.idpersonal,
          id_gestion : this.$route.params.idgestion,
          cod_materia: this.$route.params.codmateria,
          cant: this.$route.params.cant,
          fecha_inicio: this.$route.params.fechainicio,
          fecha_fin: this.$route.params.fechafin,
          franjaHoraria: [],
          aulas: [],
          asignacionesAula: [],
          showModal: false, 
          upHere: false,
          dias: [
              {"id_dia" : 1, "descripcion": "LUNES"},
              {"id_dia" : 2, "descripcion": "MARTES"},
              {"id_dia" : 3, "descripcion": "MIÉRCOLES"},
              {"id_dia" : 4, "descripcion": "JUEVES"},
              {"id_dia" : 5, "descripcion": "VIERNES"},
              {"id_dia" : 6, "descripcion": "SÁBADO"}
          ],
          postValues: {
              id_grupo: null,
              id_aula: null,
              id_franja_horaria: null,
              id_dia: null,
              id_gestion: null
          },
        }
    },
    methods: {
        async getFranjasDocente(){
            try {
                let res = await asignacionService.franjaHorarioAula()
                 this.franjaHoraria = res.data
                // console.log('franjas', res.data);      
             } catch (error) {
               console.log(error);
              }
         },
        async getAulas(){
            try {                
                 let res = await admAulasService.getAulasTeoricas(this.id_gestion, this.cod_materia)
                 this.aulas = res.data.data
                // console.log(this.aulas);
            } catch (error) {
                console.log(error);
            }
        },
        async getGestion() {
            try {
                let res = await gestionService.getGestiones()
                this.gestiones = res.data
                this.gestion = this.gestiones.find( item => { 
                    return item.id_gestion === this.$route.params.idgestion
                }).descripcion
                return this.gestiones.id_gestion
            } catch (error) {
              console.log(error);
            }
        },
        async getDetallesAulasTotal() {
            
            try {
                //console.log('el id_gestion es: ', this.id_gestion)
                let res = await asignacionService.determinadoFranjaHorarioAula(this.id_personal, this.id_gestion)
                this.asignacionesAula = res.data
            } catch (error) {
                console.log(error);
            }
        },
        detallesAula(id_franja, id_dia) {  // filter
            let franja = this.franjaHoraria[id_franja];
            let dia = this.dias[id_dia];
  
            const res = this.asignacionesAula.filter((e) => {                
                return (e.id_franja_horaria === franja.id_franja_horaria && e.id_dia === dia.id_dia )
            })
            //console.log('franja ' + franja.id_franja_horaria + ', Day ' + dia.id_dia);
            //console.log('ressss', res);            
            return res
        },
        async reservar(id_franja, id_dia) {  // reservador
            let franjaSelected = this.franjaHoraria[id_franja].id_franja_horaria;
            let diaSelected = this.dias[id_dia].id_dia;
            let id_grupo = this.$route.params.idgrupo; 
            let id_gestion = await this.getGestion()
            let verificacionCelda = this.detallesAula(id_franja, id_dia)

            if (verificacionCelda.length === 0 && this.postValues) {
                if (confirm(`Confirma asignación de horas: ${this.franjaHoraria[id_franja].horario} y dia: ${this.dias[id_dia].descripcion}`)) {
                    try {
                        //   let res = await asignacionService.createAsignacion({
                        //     "id_grupo": id_grupo,
                        //     "id_aula": this.postValues.id_aula,
                        //     "id_franja_horaria": franjaSelected,
                        //     "id_dia": diaSelected,
                        //     "id_gestion": id_gestion 
                        //     }); 
                        let res = {
                            "id_grupo": id_grupo,
                            "id_aula": this.postValues.id_aula,
                            "id_franja_horaria": franjaSelected,
                            "id_dia": diaSelected,
                            "id_gestion": id_gestion 
                            }                            
                    // console.log(res); 
                    this.getDetallesAulasTotal()            
                    } catch (error) {
                    console.log(error);
                    }  
                }
            } else {   
                alert('El horario seleccionado ya ha sido reservado.')
            }              
        },        
        async deleteReserva(id) {    
            try {
                if (confirm(`¿Desea eliminar esta reserva?`)) {
                    let idDeleted = await asignacionService.deleteAsignacion(id)
                }
                this.getDetallesAulasTotal() 
                //console.log(id);
            } catch (error) {
                console.log(error);
            }
        }     
    },
    mounted() {
      this.getFranjasDocente()      
      this.getAulas()
      this.getGestion()
      this.getDetallesAulasTotal()
      
    },
    computed: {}
}
 
</script>

<style  lang="scss" scoped>
.form-select{
    font-size: 12px;
}
.btn {
    background-color: #00244e;
    border: none;
    color: white;
    }
.btn:hover {
    background-color: #ff7300;
}
.cursor{
    cursor: pointer;
}
/* li, .form-select{
    font-family: "Roboto", sans-serif;
} */
li:hover {
    color: black;
}
</style>

<template>
  <h6 class="text-center mb-3"> ASIGNACIÓN DE HORARIOS PRÁCTICA</h6> <hr>
      <!-- {{$route.params.idgpractica}} {{$route.params.idgpadre}} -->
    <div class="container d-flex justify-content-between my-0 py-0">
        <div class="alert alert-info my-1 py-1">
            <strong>Asignar Horario - </strong> Presione click con el boton izquierdo del mouse.
        </div>
        <div class="alert alert-info my-1 py-1">
            <strong>Eliminar Horario - </strong> Presione la tecla Ctrl+click  con el boton izquierdo del mouse.
        </div>
    </div>

    <div class="row my-2">
      <div class="col-md-12">
          <select class ="form-select form-select-sm"
                  id="aula" required  
                  v-model="postValues.id_aula"  @click="getDetallesAulasPracticaTotal()">
            <option disabled :value="null">Elegir Aula/Lugar</option>
            <option v-for="aula in aulas" :key="aula.id_aula" 
                    :value="aula.id_aula">
                    ({{ aula.nombre }} - {{ aula.bloque.nombre}} - ({{aula.capacidad}})
            </option>
          </select>   
      </div> <!-- {{postValues.id_aula}} -->

      <!-- <div class="col-md-2 text-center">
        <button type="button" class="btn btn-sm" @click="getDetallesAulasPracticaTotal()">
            <i class="fas fa-search"></i> BUSCAR
        </button>
      </div> -->

    </div> 

    <!-- Tabla -->
    <div class="mt-3" v-show="postValues.id_aula !== null">
        <table class="table table-sm table-bordered text-center">
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
                    <td v-for="(day, id_dia) in dias" :key="id_dia" 
                        @click.exact="reservar(id_franja_horaria, id_dia)"  
                    >
                        <li class="badge rounded-pill bg-success text-wrap cursor" 
                            @click.ctrl.exact="deleteReserva(det.id_asignacion_practica)"
                            v-for="(det, index) in detallesAulaPractica(id_franja_horaria, id_dia)" :key="index">
                                <!-- {{det.cod_materia}} G-{{$route.params.idgpadre}}.{{det.id_grupo_practica}} -->
                                {{det.nombre}} - (aula: {{det.hospital}}) - (grupo: {{det.grupo}})
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

export default {
    name: 'HorarioPractico',
    data() {
        return {
            franjaHoraria: [],
            aulas: [],
            asignacionesAulaPractica: [],
            dias: [
               {"id_dia" : 1, "descripcion": "LUNES"},
               {"id_dia" : 2, "descripcion": "MARTES"},
               {"id_dia" : 3, "descripcion": "MIÉRCOLES"},
               {"id_dia" : 4, "descripcion": "JUEVES"},
               {"id_dia" : 5, "descripcion": "VIERNES"},
               {"id_dia" : 6, "descripcion": "SÁBADO"},
               {"id_dia" : 7, "descripcion": "DOMINGO"},
            ],
            postValues: {
               id_g_practica: null,
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
                //console.log('franjas', res.data);      
            } catch (error) {
              console.log(error);
            }
        },
        async getAulas(){ //only hospitales
            try {
              let res = await admAulasService.getAulasPractica()
              this.aulas = res.data.data
              //console.log(res.data.data);
            } catch (error) {
                console.log(error);
            }
        },
        async getDetallesAulasPracticaTotal() {   // get All reservas
            let id_aula = this.postValues.id_aula
            try {
                if (id_aula !== null) {
                    //console.log('el id_gestion es: ', this.$route.params.idgestion)
                    let res = await asignacionService.getDetallesAulaPractica(id_aula, this.$route.params.idgestion, 0)  
                    this.asignacionesAulaPractica = res.data.data                 
                    //console.log('aula', res.data.data); 
                    //console.log(res.status);
                    //return res    
                } 
            } catch (error) {
                console.log(error);
            }
        },
        detallesAulaPractica(id_franja, id_dia) {  // filter
            let franja = this.franjaHoraria[id_franja];
            let dia = this.dias[id_dia];

            const res = this.asignacionesAulaPractica.filter((e) => {
                return (e.id_franja_horaria === franja.id_franja_horaria && e.id_dia === dia.id_dia )
            })
            //console.log('franja ' + franja.id_franja_horaria + ', Day ' + dia.id_dia);
            //console.log('ressss', res); 
            return res    
        }, 
        async reservar(id_franja, id_dia) {  // reservador
            let franjaSelected = this.franjaHoraria[id_franja].id_franja_horaria;
            let diaSelected = this.dias[id_dia].id_dia;
            let id_g_practica = parseInt(this.$route.params.idgpractica)
            
            if (this.postValues) {

                let datos = await asignacionService.getHorarioPracticaDisponible(this.$route.params.idgestion, this.$route.params.idpersonal, franjaSelected, diaSelected)
                const verificador = datos.data.data
                if(verificador.length === 0){
                    if (confirm(`Confirma asignación de horas: ${this.franjaHoraria[id_franja].horario} y dia: ${this.dias[id_dia].descripcion}`)) {
                        try {
                            let res = await asignacionService.createAsignacionPractica({
                                "id_g_practica": id_g_practica,
                                "id_aula": this.postValues.id_aula,
                                "id_franja_horaria": franjaSelected,
                                "id_dia": diaSelected,
                                //"id_gestion": id_gestion 
                            }); 
                        //console.log(res); 
                        this.getDetallesAulasPracticaTotal()            
                        } catch (error) {
                            console.log(error);
                        }  
                    }
                }else{
                    this.$swal({
                        position: 'center',
                        icon: 'warning',
                        title: 'FALLO!',
                        text: 'No puede seleccionar el dia: '+verificador[0].dia+' a hrs. '+verificador[0].hora_inicio.substring(0, 5)+' -  '+verificador[0].hora_fin.substring(0, 5)+' Existe choque con el docente: '+verificador[0].paterno+' '+verificador[0].materno+' '+verificador[0].nombres,
                        showConfirmButton: true                        
                    })
                }
            }  
        }, 
        async deleteReserva(id) {    
            try {
                if (confirm(`¿Desea eliminar esta reserva?`)) {
                    let idDeleted = await asignacionService.deleteAsignacionPractica(id)
                }
                this.getDetallesAulasPracticaTotal()
            } catch (error) {
                console.log(error);
            }        
        },  
    },
    mounted() {
        this.getFranjasDocente()
        this.getAulas()
        //this.getDetallesAulasPracticaTotal()
    }
}
</script>

<style lang="scss" scoped> 
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
li, .form-select{
    font-family: "Roboto", sans-serif;
}
li:hover {
    color: black;
}
.cursor{
    cursor: pointer;
}
</style>

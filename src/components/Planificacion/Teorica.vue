<template>
    <div class="shadow-lg bg-body rounded mt-4">
        <div class="card bg-light" >
            <div class="card-header text-center">
                <div class="container d-flex justify-content-around pt-2">
                    <div>
                        <h5>CARRERA: <strong>{{carrera}}</strong></h5>
                    </div>
                    <div>
                        <h5>MATERIA: <strong>{{materia != null ? materia.nombre : ''}}</strong></h5>        
                    </div>
                    <div>
                        <h5>GESTIÓN: <strong>{{gestion.descripcion}}</strong></h5>        
                    </div>
                </div>                
            </div>
            <div class="card-body text-center my-0">
                <h5 class="mt-1">ADICIONAR NUEVO GRUPO</h5>
            </div>   
        </div>
    </div> 
    
    <!-- <h6 class="text-center" v-for="mat in materiaActual" :key="mat.id_materia">
      ADICIONAR NUEVO GRUPO
    </h6> <hr />   -->
    <!-- {{$route.params.idplanmateria}} / {{$route.params.practica}} practica?  --> 
    
    <!-- updateModal  -->
    <div class="modal fade show" tabindex="-1" role="dialog" 
         aria-hidden="true" style="display: block"
      v-show="showModal"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="loginModalLabel">Actualizar</h5>
                <button type="button" @click="hideModal()" class="btn-close"></button>
            </div>
            <div class="modal-body">
                <div class="col-md-12 mb-2">
                    <label class="form-label">Docente Téoria:</label>
                    <select class="form-select form-select-sm" required
                            v-model="post.id_personal" >
                        <option disabled :value="null">Seleccionar Docente</option>
                        <option v-for="docente in docentes" 
                                :key="docente.id_personal" 
                                :value="docente.id_personal">
                                {{ docente.paterno }} {{ docente.materno }} {{ docente.nombres }}
                        </option>
                    </select> 
                </div>
                <div class="col-md-12 mb-2">
                    <label class="form-label">Fecha Inicio:</label>
                    <input type="date" class="form-control form-control-sm" 
                        required id="f_inicio"
                        v-model="post.fecha_inicio"
                    >
                </div> 
                <div class="col-md-12">
                    <label class="form-label">Fecha Fin</label>
                    <input type="date" class="form-control form-control-sm" 
                        required id="f_fin"
                        v-model="post.fecha_fin"
                    > 
                </div>  
                <div class="col-md-12 mt-2">
                    <label class="form-label">Turno</label>
                        <select class="form-select form-select-sm"
                            id="turno" required  
                            v-model="post.id_turno" >
                        <option disabled :value="null">Seleccionar Turno</option>
                        <option v-for="turno in turnos" :key="turno.id_turno"
                                :value="turno.id_turno">
                                {{ turno.descripcion }}
                        </option>
                        </select> <!-- {{ postValues.id_turno }} -->
                </div> 
                
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-success btn-sm" @click="updateGrupo()">
                    <i class="far fa-check-circle"></i> CONFIRMAR
                </button>
                <button type="button" class="btn btn-primary btn-sm" @click="hideModal()">
                    <i class="far fa-times-circle"></i> CANCELAR
                </button>
          </div>
        </div>
      </div>
    </div>

    
    <!-- form -->
    <div class="shadow-sm p-2 bg-body rounded">
        <form @submit.prevent="savePlanificacion()">
            <div class="row g-3">
                <div class="col-md-4">
                    <label class="form-label">Gestión </label>
                    <select class="form-select form-select-sm"
                            id="gestion" required 
                            v-model="postValues.id_gestion" >
                        <option :value="gestion.id_gestion" selected >
                                {{ gestion.descripcion }}
                        </option>
                    </select> <!-- {{postValues.id_gestion}} -->
                </div>
                <div class="col-md-4">
                    <label class="form-label">Cantidad Estimada</label>
                    <input type="number" class="form-control form-control-sm"
                            id="nombre" placeholder="0" required
                            v-model="postValues.num_estudiantes" 
                    >   <!-- {{postValues.num_estudiantes}} -->     
                </div>
                <div class="col-md-4">
                    <label class="form-label">Turno</label>
                        <select class="form-select form-select-sm"
                            id="turno" required  
                            v-model="postValues.id_turno" >
                        <option disabled :value="null">Seleccionar Turno</option>
                        <option v-for="turno in turnos" :key="turno.id_turno"
                                :value="turno.id_turno">
                                {{ turno.descripcion }}
                        </option>
                        </select> <!-- {{ postValues.id_turno }} -->
                </div>    
            </div>
            
            <div class="row mt-2">
                <div class="col-12">   
                    <label class="form-label">Docente Teoría:</label>
                    <select class="form-select form-select-sm" 
                            id="docentes" required
                            v-model="postValues.id_personal" >
                        <option disabled :value="null">Seleccionar Docente</option>
                        <option v-for="docente in docentes" 
                                :key="docente.id_personal" 
                                :value="docente.id_personal">
                                {{ docente.paterno }} {{ docente.materno }} {{docente.nombres}}
                        </option>
                    </select> <!-- {{ id_personal }} -->
                </div> 
            </div>
            <div class="row mt-3 justify-content-center">
                <div class="col-auto">
                    <button type="submit" class="btn btn-save btn-sm">CREAR NUEVO GRUPO</button> 
                </div>
            </div>
        </form>
    </div>    

    <!-- tabla -->
    <div class="mt-3">
        <div>
            <p class="text-center m-1"><b> GRUPOS DISPONIBLES </b></p>
        </div>
        <table class="table table-hover table-sm table-bordered">
            <thead class="table-dark text-center">
                <tr>
                    <th scope="col">GRUPO</th>
                    <th scope="col">DOCENTE</th>
                    <th scope="col">CANT.</th>
                    <th scope="col">TURNO</th>
                    <th scope="col">INICIO</th>
                    <th scope="col">FIN</th> 
                    <th scope="col">H. TEÓRICO</th> 
                    <th scope="col">PRÁCTICA</th> 
                    <th scope="col">OPCIONES</th> 
                    <th scope="col">HORARIO/DOCENTE</th> 
                    <!-- <th scope="col">AULAS P.</th>  -->
                </tr>
            </thead>
            <tbody>
                <tr v-if="datosPlanficacion.length === 0">
                    <td colspan="9" class="text-center">
                        <b>No existen registros</b>
                    </td>
                </tr>
                <tr v-for="(datos, index) in datosPlanficacion" :key="index">                    
                    <th scope="row" class="text-center">{{ datos.grupo }}</th>
                    <td> {{ datos.paterno }} {{ datos.materno }} {{ datos.nombres }} </td>
                    <td class="text-center"> {{ datos.num_estudiantes }} </td>
                    <td class="text-center"> {{ datos.turno }} </td>
                    <td class="text-center"> {{ datos.fecha_inicio }} </td> 
                    <td class="text-center"> {{ datos.fecha_fin }}</td>
                    <!-- v-if="$route.params.idgestionactual === postValues.id_gestion" -->
                    <td v-if="$route.params.idgestionactual > 0" class="text-center">
                        <router-link :to="`/horario/aula/teorico/${datos.id_grupo}/${gestion.id_gestion}/${materia.id_plan_estudio}/${datos.id_personal}`">
                            <span class="badge rounded-pill bg-info text-dark" title="Asignar Horarios Teorica">
                                ASIG. HORARIO
                            </span>          
                        </router-link>
                    </td>
                    <td v-else></td>
                    <td class="text-center">
                        <router-link :to="`/adicion/grupo/practica/${$route.params.idgestionactual}/${datos.id_grupo}/${datos.num_estudiantes}/${datos.grupo}/${postValues.id_gestion}/${$route.params.idplanmateria}/${materia.id_materia}/${materia.id_plan_estudio}/${carrera}`" 
                                      v-show="practica == 1">
                            <span class="badge rounded-pill bg-warning text-dark" title="Crear Sub-Grupos">
                                DEF. PRÁCTICAS
                            </span>
                        </router-link>
                    </td>   
                    <td class="text-center">
                        <span> 
                            <i class="fas fa-pen mx-2" title="Editar" @click="editDocente(datos)" /> 
                        </span>
                    </td>
                    <td class="text-center">
                        <router-link :to="`/ver/aulas/teoricas/${datos.paterno} ${datos.materno} ${datos.nombres}/${carrera}/${datos.grupo}/${postValues.id_gestion}/${$route.params.idplanmateria}/${materia.cod_materia}/${materia.id_materia}/${datos.id_personal}/${datos.num_estudiantes}/${datos.fecha_inicio}/${datos.fecha_fin}`" >
                            <span class="badge rounded-pill bg-info text-dark" title="Ver el horario de aulas que el docente a tomado para dictar clases">
                                VER HORARIO
                            </span>          
                        </router-link>
                    </td>
                    <!-- <td class="text-center">
                        <router-link :to="`/ver/aulas/practicas/${datos.id_grupo}/${datos.num_estudiantes}/${datos.grupo}/${datos.id_gestion}/${$route.params.idplanmateria}/${materia.id_materia}/${materia.id_plan_estudio}`" 
                                      v-show="practica == 1">
                            <span class="badge rounded-pill bg-warning text-dark" title="Ver el horario de aulas que el docente a tomado para dictar clases">
                                VER AULAS P.
                            </span>          
                        </router-link>
                    </td> -->
                </tr>              
            </tbody>
        </table>
  </div>
</template>

<script>
//{ savePlanificacionSalud, getDetallesPlanificacionById }
import { getDocentesSalud } from '@/services/docentesService.js'
import { getGestiones } from '@/services/gestionService.js'
import { getAllMaterias } from '@/services/materiasCarrera.js'
import * as planificacionService from '@/services/planificacionService.js'
import * as gestionService from '@/services/gestionService.js'
import { getMateriaByIdPlanMateria } from '@/services/materiaActual.js'

export default {
    data() {
        return {
            //tooltipTextContent: 'block',
            practica: this.$route.params.practica,
            carrera: this.$route.params.nombrecarrera,
            docentes: [],
            gestiones: [],
            datosPlanficacion: [],
            materias: [],
            materia: {},
            turnos: [
                {"id_turno" : 1, "descripcion": "MAÑANA"},
                {"id_turno" : 2, "descripcion": "TARDE"},
                {"id_turno" : 3, "descripcion": "NOCHE"},
            ],
            gestion: {},
            postValues: {
                id_plan_estudio: null,
                id_materia: null,
                id_gestion: 0,
                id_tipo_modalidad: 1,
                id_personal: null,
                grupo: null,
                num_estudiantes: null,
                id_confirmante: null,
                id_turno: null,
                id_tipo_materia: 1
            }, 
            post: {},
            showModal: false,
        }
    },
    methods: {
        async getDocentes() {
            try {
                //console.log('el id_materia es: ', this.materia.id_materia)
                let res = await getDocentesSalud(this.materia.id_materia)
                this.docentes = res.data
                //console.log(res.data);
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
                })
                this.postValues.id_gestion = this.gestion.id_gestion
                // console.log(this.$route.params.idgestion);
            } catch (error) {
                console.log(error);
            }
        },
        async savePlanificacion() {  
            if (this.postValues) {
                // if(this.$route.params.idgestionactual === this.postValues.id_gestion){
                    try {
                        let res = await planificacionService.savePlanificacionTeorica({
                            id_plan_estudio: this.materia.id_plan_estudio,
                            id_materia: this.materia.id_materia,
                            id_gestion: this.postValues.id_gestion,
                            id_tipo_modalidad: this.postValues.id_tipo_modalidad,
                            id_personal: this.postValues.id_personal,
                            grupo: this.datosPlanficacion.length + 1,
                            num_estudiantes: this.postValues.num_estudiantes,
                            id_confirmante: null,
                            id_turno: this.postValues.id_turno,
                            id_tipo_materia: this.postValues.id_tipo_materia
                        });
                        this.$swal({
                            position: 'center',
                            icon: 'success',
                            title: 'Nuevo Grupo Creado!',
                            text: `se ha creado el nuevo grupo correctamente`,
                            showConfirmButton: true,
                            // timer: 2000
                        })
                        this.getDetalles()
                        this.clearPostValues()   
                        this.getGestion()
                    } catch (error) {
                        console.log(error);
                    }
                // }else{
                //     this.$swal({
                //         position: 'center',
                //         icon: 'warning',
                //         title: 'Gestion Actual Incorrecta!',
                //         text: `Debe estar en la GESTION ACTUAL = ${this.gestiones.find( item => {return item.id_gestion === this.$route.params.idgestionactual}).descripcion} para crear un nuevo grupo`,
                //         showConfirmButton: true,
                //         // timer: 2000
                //     })
                // }
            }
        },
        async getMaterias(){
            try {
                let res = await getAllMaterias()
                this.materias = res.data
                //console.log(res.data);
            } catch (error) {
                console.log(error);
            }
        },
       /*  currentMat(){  //medio lento
            let id = this.$route.params.id
            const mat = this.materias.reduce((acum, el) => ({
                ...acum,
                [el.id_plan_materia]: el
            }), {})
            return mat[id]
        }, */
        async getDetalles() {  //by id_materia
            try {
                // let id_mat = await this.cargarMateria()                
                //let res = await getDetallesPlanificacion()
                if(this.materia.id_materia > 0){
                    let res = await planificacionService.getDetallesPlanificacionTeoricaById(this.materia.id_materia, this.$route.params.idgestion)
                    this.datosPlanficacion = res.data
                    //console.log('los datos planificacion son: ',this.datosPlanficacion)
                }                
                //console.log('mat', await this.materiaActual[0].id_materia)
            } catch (error) {
                console.log(error);
            }
        },
        async cargarMateria(){
            try {
                this.id = this.$route.params.idplanmateria
                let res = await getMateriaByIdPlanMateria(`${this.id}`)
                this.materia = res.data[0]
                if(this.materia){
                    let res1 = await getDocentesSalud(this.materia.id_materia)
                    this.docentes = res1.data

                    let res2 = await planificacionService.getDetallesPlanificacionTeoricaById(this.materia.id_materia, this.$route.params.idgestion)
                this.datosPlanficacion = res2.data
                }
                //console.log('materia',this.materia);                 
            } catch (error) {
                console.log(error);
            } 
        },
        editDocente(data) {
            this.post = data;
            this.updateModal()   
        },
        async updateGrupo() {
            try {                
                let res = await planificacionService.updatePlanificacionTeorica({
                    id_plan_estudio: this.materia.id_plan_estudio,
                    id_grupo: this.post.id_grupo,
                    id_personal: this.post.id_personal,
                    id_gestion: this.post.id_gestion,
                    fecha_inicio: this.post.fecha_inicio,
                    fecha_fin: this.post.fecha_fin,
                    id_turno: this.post.id_turno
                });

                //console.log(res)
                this.hideModal()
                this.getDetalles()

            } catch (error) {
                console.log(error);
            }
        },
        updateModal() {
            this.showModal = true
        },
        hideModal() {
            this.showModal = false
        },
        clearPostValues() {
            this.postValues = {
                id_plan_estudio: null,
                id_materia: null,
                id_gestion: null,
                id_tipo_modalidad: 1,
                id_personal: null,
                grupo: null,
                num_estudiantes: null,
                id_confirmante: null,
                id_turno: null,
                id_tipo_materia: 1
            }
        }
        
    },
    mounted() {        
        this.cargarMateria()
        this.getGestion()
        this.getMaterias()
        this.getDetalles()        
        //this.getDocentes()
    }
}
</script>

<style lang="scss" scoped>
.form-select, input[type=number], input[type=date] {
    font-size: 12px;
}
.btn-save {
    background-color: #00244e;
    border: none;
    color: white;
}
.btn-save:hover {
    background-color: #ff7300;
}
label{
    margin: 0;
    padding: 0;
}
/*input[type=date], input[type=number]{
    font-size: 10px;
}
 .form-select, input[type=date]{
   font-family: "Roboto", sans-serif;
   font-size: 10px;
}  */
form{
    padding-left:20px;
    padding-right: 20px;
}
.fa-trash-al, .fa-pen {
    color: #00244e; 
}
.fa-trash-alt:hover, .fa-pen:hover {
   color: #ff7300;
}
</style>

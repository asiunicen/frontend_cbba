<template>
    <!-- <h6 class="text-center" v-for="mat in materiaActual" :key="mat.id_materia">
        SUB-GRUPOS "{{mat.nombre}}" - PRÁCTICA 
    </h6>
    <hr>   -->

    <div class="shadow-lg bg-body rounded mt-4">
        <div class="card bg-light" >
            <div class="card-header text-center">
                <div class="container d-flex justify-content-around pt-2">
                    <div>
                        <h5>CARRERA: <strong>{{$route.params.carrera}}</strong></h5>
                    </div>
                    <div>
                        <h5>MATERIA: <strong>{{materiaActual != null ? materiaActual.nombre : ''}}</strong></h5>        
                    </div>
                    <div>
                        <h5>GESTIÓN: <strong>{{gestion.descripcion}}</strong></h5>        
                    </div>
                </div>                
            </div>
            <div class="card-body text-center my-0">
                <h5 class="mt-1">ADICIONAR NUEVO SUBGRUPO - PRÁCTICA</h5>
            </div>   
        </div>
    </div>
    <!-- {{$route.params.idgrupo}} / {{$route.params.cant}} / {{$route.params.idgestion}} /
        {{$route.params.numgrupo}} / {{$route.params.idplanmateria}} -->

    <div class="modal fade show" tabindex="-1" role="dialog" aria-labelledby="deleteModalLabel"
         aria-hidden="true" style="display: block"
         v-show="showModal"
    >
        <div class="modal-dialog" role="document">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="deleteModalLabel">Eliminar</h5>
                <button type="button" @click="hideModal()" class="btn-close"></button>
            </div>
            <div class="modal-body">
                <span> ¿Desea eliminar este sub grupo? </span>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-success btn-sm" @click="deleteSubGrupo()">
                    <i class="far fa-check-circle"></i> CONFIRMAR
                </button>
                <button type="button" class="btn btn-primary btn-sm" @click="hideModal()">
                    <i class="far fa-times-circle"></i> CANCELAR
                </button>
            </div>
            </div>
        </div>
    </div>
  
    <!-- updateModal -->
    <div class="modal fade show" id="deleteModal" tabindex="-1" aria-hidden="true" role="dialog"
            v-show="showUpdateModal">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="deleteModalLabel">Actualizar</h5>
                <button type="button" class="btn-close" @click="hideModal()"></button>
            </div>
                <div class="modal-body">
                    <div class="col-md-12 mb-2">
                        <label class="form-label">Docente Práctica</label>  
                        <select class="form-select form-select-sm" 
                                required
                                v-model="post.id_personal" >
                            <option disabled :value="null">Seleccionar Docente</option>
                            <option v-for="docente in docentes" 
                                    :key="docente.id_personal" 
                                    :value="docente.id_personal">
                                    {{ docente.paterno }} {{ docente.materno }} {{docente.nombres}}
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
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success btn-sm" @click="updateDocenteSubGrupo()">
                        <i class="far fa-check-circle"></i> CONFIRMAR
                    </button>
                    <button type="button" class="btn btn-primary btn-sm" @click="hideModal()">
                        <i class="far fa-times-circle"></i> CANCELAR
                    </button>
                </div>
               
            </div>
        </div>
    </div>

    <!-- Form -->
    <div class="shadow-sm p-3 bg-body rounded">
        <form @submit.prevent="addPlanificacionPractica()">
            <div class="row g-3">
                <div class="col-md-9"> 
                    <label class="form-label">Docente Práctica</label>  
                    <select class="form-select form-select-sm" 
                            id="docentes" required
                            v-model="postValues.id_personal" >
                        <option disabled :value="null">Seleccionar Docente</option>
                        <option v-for="docente in docentes" 
                                :key="docente.id_personal" 
                                :value="docente.id_personal">
                                {{ docente.paterno }} {{ docente.materno }} {{docente.nombres}}
                        </option>
                    </select>  <!-- {{ postValues.id_personal }} -->         
                </div> 
                <div class="col-md-3">
                    <label class="form-label">Cantidad Estimada</label>
                    <input type="number" class="form-control form-control-sm"
                            id="nombre" placeholder="0" required
                            v-model="postValues.cantidad" 
                    >  <!-- {{postValues.cantidad}} -->
                </div>
            </div>
            <div class="row mt-2">
                <div class="col-md-3">
                    <label class="form-label">Sub Grupo</label>
                    <select class="form-select form-select-sm" 
                            id="subgrupo" required
                            v-model="postValues.sub_grupo" >
                        <option disabled :value="null">Seleccionar Sub Grupo</option>
                        <option v-for="(subG, index) in subGrupos" :key="index" :value="subG.numero">{{subG.numero}}</option>                        
                    </select>  <!-- {{ postValues.sub_grupo }} -->     
                </div>
                <div class="col-md-3">
                    <label class="form-label">Nº Rotación</label>
                    <select class="form-select form-select-sm" 
                            id="rotacion" required
                            v-model="postValues.rotacion" >
                        <option disabled :value="null">Seleccionar Rotación</option>
                        <option v-for="rotacion in rotaciones" 
                                :key="rotacion.descripcion" 
                                :value="rotacion.descripcion">
                                {{rotacion.descripcion}}
                        </option>
                    </select>  <!-- {{ postValues.rotacion }} -->    
                </div>
                <div class="col-md-3">
                    <label class="form-label">Fecha Inicio</label>
                    <input type="date" class="form-control form-control-sm" 
                           required id="f_inicio"
                           v-model="postValues.f_inicio_rotacion"
                    >   <!-- {{postValues.f_inicio_rotacion}} -->  
                </div>
                <div class="col-md-3">
                    <label class="form-label">Fecha Fin</label>
                    <input type="date" class="form-control form-control-sm" 
                           required id="f_fin"
                           v-model="postValues.f_fin_rotacion"
                    >   <!-- {{postValues.f_fin_rotacion}} -->  
                </div>    
            </div>
                          
            <div class="row mt-4 justify-content-center">
                <div class="col-auto"> 
                    <button type="submit" class="btn btn-crear btn-sm">CREAR NUEVO SUB GRUPO</button> 
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
                    <th scope="col" >SUB GRUPO</th>
                    <th scope="col" >DOCENTE</th>
                    <th scope="col" >CANT.</th> 
                    <th scope="col" >INICIO</th> 
                    <th scope="col" >FIN</th> 
                    <th scope="col" >ROTACIÓN</th> 
                    <th scope="col" >ROT. INI</th> 
                    <th scope="col" >ROT. FIN</th> 
                    <th scope="col" >H. PRÁCTICA</th> 
                    <th scope="col" >HORARIO/DOCENTE</th> 
                    <th scope="col" >OPCIONES</th> 
                </tr>
            </thead>
            <tbody>
                <tr v-if="subGruposPractica.length === 0">
                    <td colspan="10" class="text-center">
                        <b>No existen registros para esta gestión</b>
                    </td>
                </tr>
                <tr v-for="(grupo, index) in subGruposPractica" :key="index">
                    <td class="text-center">
                        {{$route.params.numgrupo}}.{{ grupo.id_grupo_practica}}.{{ grupo.rotacion }}
                    </td>
                    <td> {{ grupo.paterno }} {{ grupo.materno }} {{grupo.nombres}} </td>
                    <td class="text-center"> {{ grupo.cantidad }}</td>
                    <td class="text-center"> {{ grupo.fecha_inicio}} </td>
                    <td class="text-center"> {{ grupo.fecha_fin}} </td>
                    <td class="text-center"> {{ grupo.rotacion }} </td>
                    <td class="text-center"> {{ grupo.f_inicio_rotacion }} </td>
                    <td class="text-center"> {{ grupo.f_fin_rotacion }} </td>
                    <!-- v-if="$route.params.idgestionactual === $route.params.idgestion" -->
                    <td v-if="$route.params.idgestionactual > 0" class="text-center">
                        <router-link :to="`/horario/aula/practica/${grupo.id_g_practica}/${$route.params.numgrupo}/${gestion.id_gestion}/${grupo.id_personal}/${$route.params.idplanestudio}`" class="link">
                            <span class="badge rounded-pill bg-info text-dark me-1" title="Asignar Horario Practica">
                                ASIG. HORARIO
                            </span>       
                        </router-link>
                    </td>
                    <td v-else></td>
                    <td class="text-center">
                        <router-link :to="`/ver/aulas/practicas/${grupo.id_g_practica}/${$route.params.numgrupo}/${ grupo.paterno } ${ grupo.materno } ${grupo.nombres}/${$route.params.carrera}/${grupo.cantidad}/${grupo.fecha_inicio}/${grupo.fecha_fin}/${grupo.rotacion}/${grupo.f_inicio_rotacion}/${grupo.f_fin_rotacion}/${grupo.id_personal}/${$route.params.idgestion}`" class="link">
                            <span class="badge rounded-pill bg-warning text-dark me-1" title="Asignar Horario Practica">
                                VER HORARIO
                            </span>       
                        </router-link>
                    </td> 
                    <td class="text-center">
                        <span> 
                            <i class="fas fa-pen mx-2" title="Editar" editDocente @click="editDocente(grupo)"/> 
                        </span>   
                        <span>
                            <i class="fas fa-trash-alt mx-2" title="Eliminar"
                               @click="deleteModal(grupo.id_g_practica)"> 
                            </i>
                        </span> 
                        <span>
                        </span>
                    </td>
                </tr>
                <!-- <tr>
                    <th colspan="2">TOTAL ESTUDIANTES</th>
                    <th class="text-center"> {{total}} </th>
                    <th></th>
                </tr> -->
            </tbody>
        </table>
  </div>
 
</template>

<script> 
import { getDocentesSalud } from '@/services/docentesService.js'
import  * as planificacionService from '@/services/planificacionService.js'
import { getMateriaByIdPlanMateria } from '@/services/materiaActual.js'
import Opciones from '../Diat/Opciones.vue'
import * as gestionService from '@/services/gestionService.js'

export default {
    name: 'Practica',
    components: {Opciones},
    data () {
        return {
            docentes: [],
            subGrupos: [{'numero': 1}, {'numero': 2}, {'numero': 3}, {'numero': 4}, {'numero': 5}],
            subGruposPractica: [],
            materiaActual: {},            
            gestion: {},
            postValues: {
                id_grupo: null,
                id_grupo_practica: null,
                id_gestion: null,
                cantidad: null,
                id_personal: null,
                rotacion: null,
                f_inicio_rotacion: null,
                f_fin_rotacion: null,
                sub_grupo: null
            },
            rotaciones: [
                {"id" : 1, "descripcion": "R1"},
                {"id" : 2, "descripcion": "R2"},
                {"id" : 3, "descripcion": "R3"},
                {"id" : 4, "descripcion": "R4"},
            ],
            post: {},
            showModal: false,
            showUpdateModal: false, 
        }
    },
    methods: {
        async getDocentes() {
            try {
                this.id = this.$route.params.idplanmateria
                let res1 = await getMateriaByIdPlanMateria(this.id)
                this.materiaActual = res1.data[0]

                let res = await getDocentesSalud(this.materiaActual.id_materia)
                this.docentes = res.data
                //console.log(res.data);

            } catch (error) {
                console.log(error);
            }
        },
        async addPlanificacionPractica(){
            let total = await this.getDetalleGrupos()
            let cantPermitida = parseInt(this.$route.params.cant)

            if( total < cantPermitida && this.postValues.cantidad < cantPermitida ) {
                // if (this.$route.params.idgestionactual === this.$route.params.idgestion) {
                    try {             
                        let res = await planificacionService.savePlanificacionPractica({
                            id_grupo: this.$route.params.idgrupo,
                            id_grupo_practica: this.postValues.sub_grupo,  //this.subGruposPractica.length +1,
                            id_gestion: this.$route.params.idgestion,
                            cantidad: this.postValues.cantidad,
                            id_personal: this.postValues.id_personal,
                            rotacion: this.postValues.rotacion,
                            f_inicio_rotacion: this.postValues.f_inicio_rotacion,
                            f_fin_rotacion: this.postValues.f_fin_rotacion,
                            id_tipo_modalidad: 1,
                            grupo: this.postValues.sub_grupo,
                            id_turno: 0,
                            id_tipo_materia: 6,
                            id_materia: this.$route.params.idmateria,
                            id_plan_estudio: this.$route.params.idplanestudio
                            //sub_grupo: null
                        })
                        this.$swal({
                            position: 'center',
                            icon: 'success',
                            title: 'Nuevo Sub-Grupo Creado!',
                            text: `se ha creado el nuevo sub-grupo (grupo practica) correctamente.`,
                            showConfirmButton: true,
                            // timer: 2000
                        })
                        this.getDetalleGrupos()
                        this.clearPostValues()
                        //console.log(res);
                    } catch (error) {
                        console.log(error);   
                    }   
                // }else{
                    // this.$swal({
                    //     position: 'center',
                    //     icon: 'warning',
                    //     title: 'Gestion Actual Incorrecta!',
                    //     text: `Debe estar en la GESTION ACTUAL = ${this.gestionActual.descripcion} para crear un nuevo sub grupo (grupo practico)`,
                    //     showConfirmButton: true,
                    //     // timer: 2000
                    // })
                // }              
            } else {
                alert('Ha sobrepasado el limite programado para crear grupos')
            }
        },
        async obtenerGestionActual() {
            try {
                let res = await gestionService.getGestionActual();
                this.gestionActual = res.data.data;
                // console.log(this.gestionActual)
            } catch (error) {
                console.log(error);
            }
        },
        async getGestion() {
            try {
                let res = await gestionService.getGestiones()
                let gestiones = res.data
                this.gestion = gestiones.find( item => {
                  return item.id_gestion === this.$route.params.idgestion
                })                
            } catch (error) {
                console.log(error);
            }
        },
        async getDetalleGrupos() {  //by id_materia
            try {
                let id_grupo = this.$route.params.idgrupo
                this.id_gestion = this.$route.params.idgestion
                
                let res = await planificacionService.getDetallesPlanificacionPractica(id_grupo, this.id_gestion)
                this.subGruposPractica = res.data.data
                this.filtrarSubGrupos()
                console.log(res.data.data);

                let totalGrupos = this.subGruposPractica.reduce((acum, el) => (typeof el.cantidad == "number" ? acum + el.cantidad: acum), 0);
                //console.log('tot',totalEstimado);
                return totalGrupos
            } catch (error) {
                console.log(error);
            }
        },
        filtrarSubGrupos(){            
            this.subGrupos = [{'numero': 1}, {'numero': 2}, {'numero': 3}, {'numero': 4}, {'numero': 5}]
            for (let index = 0; index < this.subGruposPractica.length; index++) {                
                this.subGrupos = this.subGrupos.filter(item => item.numero != this.subGruposPractica[index].id_grupo_practica)
            }
        },
        async materiaBuscada(){
            try {
                this.id = this.$route.params.idplanmateria
                let res = await getMateriaByIdPlanMateria(this.id)
                this.materiaActual = res.data[0]
                //console.log(res.data[0].id_materia); 
            } catch (error) {
                console.log(error);
            } 
        },
        deleteModal(idgpractica) {
            this.showModal = true
            this.postValues = idgpractica
            //console.log(this.postValues)
        },
        updateModal() {
            this.showUpdateModal = true
        },
        hideModal() {
            this.showModal = false;
            this.showUpdateModal = false
            this.clearPostValues()
        },
        async deleteSubGrupo() {  
            //console.log('deleting...', this.postValues)
            try {
                let idDeleted = await planificacionService.deletePlanificacionPractica(this.postValues)                
                this.hideModal()                
                this.getDetalleGrupos()
            } catch (error) {
                console.log(error);
            } 
        }, 
        async updateDocenteSubGrupo() {
            try {
                let idpersonal = await planificacionService.updateDocentePractica(this.post.id_g_practica, {
                    id_personal: this.post.id_personal,
                    fecha_inicio: this.post.fecha_inicio,
                    fecha_fin: this.post.fecha_fin
                })                
                this.hideModal()
                this.getDetalleGrupos()
            } catch (error) {
                console.log(error);
            }
        },
        editDocente(data) {
            this.post = data
            this.updateModal()   
        },
        clearPostValues() {
            this.postValues = {
                id_grupo: null,
                id_grupo_practica: null,
                id_gestion: null,
                cantidad: null,
                id_personal: null,
                rotacion: null,
                f_inicio_rotarion: null,
                f_fin_rotacion: null,
                sub_grupo: null
            }
        }   
    },
    mounted() {
        this.getDocentes()
        this.getDetalleGrupos()
        this.materiaBuscada()
        this.obtenerGestionActual()
        this.getGestion()
    }
}
    
</script>

<style lang="scss" scoped>
.form-select, input[type=number], input[type=date] {
    font-size: 12px;
}
#deleteModal {
    display: block
} 
.btn-crear {
    background-color: #00244e;
    border: none;
    color: white;
}
.btn-crear:hover {
    background-color: #ff7300;
}
.fa-trash-al, .fa-pen {
    color: #00244e; 
}
.fa-trash-alt:hover, .fa-pen:hover {
   color: #ff7300;
} 
label {
    margin: 0;
    padding: 0;
}
/* input[type=date], input[type=number]{
    font-size: 10px;
}
.form-select, input[type=date]{
   font-family: "Roboto", sans-serif;
   font-size: 10px;
} */ 
form{
    padding-left:20px;
    padding-right: 20px;
}
</style>

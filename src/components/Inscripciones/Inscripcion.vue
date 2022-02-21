<template>
  <div class="container text-center"><h1>PRE-INSCRIPCIÓN DE ESTUDIANTES</h1></div>
  
  <!-- Modal que agrega una materia solicitada -->
  <!-- The Modal -->
  <div class="modal fade" id="modalMateriaSolicitada" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Selecionar La Materia Solicitada</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div>
            <select class="form-select" v-model="materia_solicitada">
              <option :value="null" selected>Elija una materia</option>
              <option v-for="(materia_solicitada, index) in materias_solicitadas" :key="index" :value="materia_solicitada">{{materia_solicitada.cod_materia}} - {{materia_solicitada.materia}}</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="agregarMateriaSolicitada()">Si, Confirmar</button>
        </div>
      </div>
    </div>
  </div>
  <!-- fin del modal -->

  <div class="shadow-lg bg-body rounded">
    <div class="card bg-light mb-3" >
    <div class="card-header text-center"><h6 class="mt-1">DETALLE DE LA PRE-INSCRIPCIÓN</h6></div>
      <div class="card-body">
        <div class="container d-flex justify-content-around">
          <div>
            <h6 class="card-title">Estudiante: <strong>{{nombre_completo}}</strong></h6>
            <h6 class="card-text">Carrera: <strong>{{carrera}}</strong></h6>
            <h6 class="card-text">Gestión: <strong>{{descripcion}}</strong></h6>
          </div>
          <div>
            <h6 class="card-text">Materias Ofertadas: <strong>{{materias.length}}</strong></h6>
            <h6 class="card-text">Nivel: <strong>{{semestre}}</strong></h6>
            <h6 class="card-text">Materias Mínimas a Tomar: <strong>{{cant_minima_inscritos}}</strong></h6>
          </div>        
        </div>
      </div>   
    </div>
  </div> 
  <hr>
  <div>
    <div class="accordion" id="accordionExample">
      <div class="accordion-item">
        <h2 class="accordion-header" id="headingOne">
          <button class="accordion-button text" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
            <strong>VER HORARIO DEL ESTUDIANTE</strong>
          </button>
        </h2>
        <div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
          <div class="accordion-body">
            <div>
              <table class="table table-sm table-bordered text-center">
                <thead class="table-dark">
                  <tr>
                    <th scope="col" style="width: 90px">INICIO - FIN</th>
                    <th scope="col" style="width: 100px" 
                        v-for="(dia, id_dia) in dias" :key="id_dia">
                        {{dia.descripcion}}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(horario, index) in horarios_pre_inscritos" :key="index">
                    <th scope="col">{{horario.hora_inicio}} - {{horario.hora_fin}}</th>
                    <!-- <th v-for="( ida, id_dia) in dias" :key="id_dia">{{mostrarTeoricos(horario.id_franja_horaria, ida.id_dia)}} {{mostrarPracticos(horario.id_franja_horaria, ida.id_dia)}}</th> -->
                    <!-- {{horario.miercoles ? mostrarHorarioMiercoles(horario.miercoles) : ''}} -->
                    <th v-html="mostrarHoraClases(horario.lunes)"></th>
                    <th v-html="mostrarHoraClases(horario.martes)"></th>
                    <th v-html="mostrarHoraClases(horario.miercoles)"></th>
                    <th v-html="mostrarHoraClases(horario.jueves)"></th>
                    <th v-html="mostrarHoraClases(horario.viernes)"></th>
                    <th v-html="mostrarHoraClases(horario.sabado)"></th>
                    <th v-html="mostrarHoraClases(horario.domingo)"></th>
                  </tr>
                </tbody>
              </table>
            </div>            
          </div>
        </div>
        
        <!-- {{materias[puntero]}} -->
        <div class="py-2">
          
          <!-- <div class="container-fluid pt-2">
            <div class="d-flex justify-content-end">
              <button type="button" data-bs-toggle="modal" data-bs-target="#modalMateriaSolicitada" @click="obtenerMateriasSolicitadas()" class="btn btn-danger btn-block">AGREGAR MATERIA SOLICITADA</button>
            </div>
          </div> -->

          <h5 class="text-center">MATERIAS Y GRUPOS PARA LA  PRE-INSCRIPCIÓN</h5>
          <table class="table table-hover table-sm table-bordered">
            <thead class="table-dark text-center">
              <tr>
                <th scope="col">Nro</th>
                <th scope="col">COD MATERIA</th>                
                <th scope="col">NOMBRE MATERIA</th>
                <th scope="col">RECURSADA</th>
                <th scope="col">GRUPO TEÓRICO</th>
                <th scope="col">PRÁCTICA</th>
                <th scope="col">GRUPO PRÁCTICO</th>
                <th scope="col">PRE - INSCRITO</th>
                <th scope="col">ACCIÓN</th>
                
              </tr>
            </thead>
            <tbody>
              <tr v-for="(materia, index) in materias" :key="index">                
                <td class="text-center">{{index + 1}}</td>
                <td class="text-center">{{materia.cod_materia}}</td>                
                <td class="text-left">{{materia.materia}}</td>      
                <td v-if="materia.recursada === 0" class="text-center">NO</td>
                <td v-else class="text-center">SI</td>          
                <td class="text-center">
                  <select v-if="materia.estado === 2 || materia.estado === 3 ? true : false" :disabled="materia.estado === 3" class="form-select-sm" style="width: 300px" aria-label="seleccion_grupos" v-model="materia.id_grupo_teorico" @click="elegirGrupoTeorico(materia)" >
                    <option :value="0">Elige un Grupo Teórico</option>
                    <option v-for="(grupo_teorico, index) in materia.grupos_teoricos" :key="index" :value="grupo_teorico.id_grupo">gr: ({{grupo_teorico.grupo}}) - {{grupo_teorico.nombres}} {{grupo_teorico.paterno}} {{grupo_teorico.materno}} - {{grupo_teorico.turno}}</option>
                  </select>
                </td>
                <td class="text-center" v-if="materia.existeGrupoPractico"><span class="colorSI"> SI </span></td>
                <td class="text-center" v-else><span></span></td>
                <td class="text-center">
                  <select v-if="materia.estado === 2 || materia.estado === 3 ? true : false" :disabled="materia.estado === 3" class="form-select-sm" style="width: 300px" aria-label="seleccion_grupos" v-model="materia.id_grupo_practico" @click="elegirGrupoPractico(materia)">
                    <option :value="0">Elige un Grupo Práctico</option>                    
                    <option v-for="(grupo_practico, index) in materia.grupos_practicos" :key="index" :value="grupo_practico.id_g_practica">gr: ({{grupo_practico.grupo_practico}}) - {{grupo_practico.nombres}} {{grupo_practico.paterno}} {{grupo_practico.materno}} </option>
                  </select>
                </td>

                <td class="text-center" v-if="materia.pre_inscrito === 1"></td>
                <td class="text-center" v-else-if="materia.pre_inscrito === 2"><span class="colorSI">SI</span></td>
                <td class="text-center" v-else><span class="colorERROR">ERROR</span></td>
                <td v-if="estado_botones" class="text-center">
                  <button v-if="materia.estado === 1 ? true: false" class="btn btn-warning btn-sm" @click="cambiarEstado(materia, 'PRE-INSCRIBIRSE')">
                    HABILITAR
                 </button>
                  <button v-else-if="materia.estado === 2 ? true: false" class="btn btn-success btn-sm" @click="cambiarEstado(materia, 'ELIMINAR')">
                    PRE-INSCRIBIRSE
                  </button>
                  <button v-else class="btn btn-danger btn-sm" @click="cambiarEstado(materia, 'HABILITAR')">
                    ELIMINAR
                  </button>
                </td>
                <td v-else class="text-center"></td>
              </tr>
            </tbody>            
          </table>
          <div v-if="estado_botones" class="container">
            <!-- {{materias}} -->
            <div v-if="pre_inscripcion_validada" class="d-flex justify-content-end">
              <button class="btn btn-primary" @click="confirmarInscripcion()">CONFIRMAR PRE-INSCRIPCIÓN</button>
            </div>
            <div v-else class="d-flex justify-content-end">              
            </div>
          </div>
          <div v-else class="d-flex justify-content-end">
              <router-link :to="`/listaEstudiantes`" class="link">
                <button class="btn btn-secondary" @click="volverListaEstudiantes()">VOLVER A LA LISTA DE ESTUDIANTES</button>
              </router-link>
          </div>          
          <!-- existeMateriasRecursadas() -->
          <div v-if="existeMateriasRecursadas()" class="alert alert-warning" role="alert">
            <h4 class="alert-heading">Materias Recursadas...?</h4>
            <p>El sistema ha detectado una o mas materias RECURSADAS, por esta razon DEBE tomar como prioridad las materias recursadas, antes de confirmar su pre-inscripcion.</p>
            <hr>
            <p class="mb-0">Toma de materias recursadas</p>
          </div>
          <div v-show="id_plan_vencido > 0" class="alert alert-info" role="alert">
            <h4 class="alert-heading">PLAN ECONOMICO VENCIDO...?</h4>
            <p>Usted ya no tiene su Plan Económico al Contado (PAC) vigente, por tal razón se le inscribrió con el Plan Regular, si cree que existe un error NO SE INSCRIBA, pase por el Departamento de Registros para solucionar el problema.</p>
            <hr>
            <p class="mb-0">Plan Economico al Contado Vencido</p>
          </div>
        </div>

      </div>      
    </div>
  </div>
</template>

<script>

import * as inscripcionService from '@/services/inscripcionService.js'
import * as estudiantesService from '@/services/estudiantes.js'
import * as tomaMaterias from '@/services/tomaMaterias.js'
const moment = require('moment');

export default {
    data() {
      return {        
        id_gestion: this.$route.params.id_gestion,
        descripcion: this.$route.params.descripcion,
        nombre_completo: this.$route.params.nombre_estudiante,
        carrera: this.$route.params.nombre_carrera,
        id_estudiante: this.$route.params.id_estudiante,
        id_plan_estudio: this.$route.params.id_plan_estudio,
        plan_vencido: this.$route.params.planVencido,
        id_datos_personal: localStorage.id,        
        id_plan_vencido: 0,

        estado_botones: true,

        cant_minima_inscritos: 2,
        semestre: '',
        existe_choque_materias: false,
        pre_inscripcion_validada: false,
        recursadasTomadas: true,
        materia_choque: {},
        temporales: [],
        temporal: {
          id_temporal: 0,
          id_estudiante: 0, 
          id_materia: 0,
          id_plan_estudios: 0,
          id_gestion: 0,
          id_grupo: 0,
          id_grupo_practico: 0,
          id_franja_horaria: 0,
          id_dia: 0,
          id_aula: 0,
        },
        horarios_pre_inscritos: [],
        dias: [
          {"id_dia" : 1, "descripcion": "LUNES"},
          {"id_dia" : 2, "descripcion": "MARTES"},
          {"id_dia" : 3, "descripcion": "MIÉRCOLES"},
          {"id_dia" : 4, "descripcion": "JUEVES"},
          {"id_dia" : 5, "descripcion": "VIERNES"},
          {"id_dia" : 6, "descripcion": "SÁBADO"},
          {"id_dia" : 7, "descripcion": "DOMINGO"},
        ],

        colores: [
          {'color': 'rojo'},
          {'color': 'azul'},
          {'color': 'verde'},
          {'color': 'amarillo'},
          {'color': 'naranja'},
          {'color': 'morado'},
          {'color': 'negro'},
          {'color': 'cafe'},
          {'color': 'blanco'},
          {'color': 'fuxia'},
        ],

        materias_solicitadas: [],
        id_materia_solicitada: 0,
        materia_solicitada: {},

        puntero: -1,
        materias: [],
        materia: { 
          indice: 0,         
          id_materia: 0,
          cod_materia: '',
          materia: '',
          creditos: 0,
          horas_teoria: 0,
          horas_practica: 0,
          semestre: '',
          id_semestre: 0,
          recursada: 0,
          cantidad_max_materias: 0,          
          id_grupo_teorico: 0,
          id_grupo_practico: 0,
          grupos_teoricos: [],               
          grupos_practicos: [],
          existeGrupoPractico: false,
          asignacion_grupos_teoricos: [],
          asignacion_grupos_practicos: [],
          pre_inscrito: 1,
          estado: 1,
          color: ''
        },        
        gruposTeoricos: [],
        gruposPracticos: [],        
      }
    },
    methods:{        
      async eliminarHorario(){
        try {
          let res = await inscripcionService.deleteHorario(this.id_estudiante, this.id_plan_estudio, this.id_gestion)
          // console.log(res)
        } catch (error) {
          console.log(error)
        }
      },
      async obtenerMateriasSolicitadas(){
        try {
          this.materia_solicitada = null          
          let res = await tomaMaterias.getMateriasSolicitadas(this.id_estudiante, this.id_plan_estudio, this.id_gestion)
          this.materias_solicitadas = res.data
          if(this.materias){
            this.materias_solicitadas = this.materias_solicitadas.filter( item => {
              let contador = 0
              let encontrado = false
              while(contador < this.materias.length && !encontrado){
                let materia = this.materias[contador]
                if(materia.id_materia === item.id_materia)
                  encontrado = true
                contador++
              }
              if(!encontrado)
                return item
            })
          }       
          // console.log(this.materias_solicitadas)
        } catch (error) {
          console.log(error)
        }
      },
      async getMateriasOfertadas(){
        try {
          let resp = await inscripcionService.getAllMateriasOfertadas(this.id_estudiante, this.id_plan_estudio, this.id_gestion)
          this.materias = resp.data.data          

	  this.materias = this.materias.filter( (data, index) => {
            return index < data.cantidad_max_materias
          })

          this.materias.length > 0 ? this.semestre = this.materias[0].semestre : ''
          this.materias.forEach(async(item, index) => {
            let res = await inscripcionService.getAllGruposTeoricos(item.id_materia, this.id_plan_estudio, this.id_gestion)
            let datos = res.data.data
            item.indice = index
            item.grupos_teoricos = datos.filter( item => item.inscritos < item.capacidad)
            item.id_grupo_teorico = 0
            item.asignacion_grupos_teoricos = []
            item.asignacion_grupos_practicos = []
            this.temporal = {}
            this.puntero = -1
            item.estado = 1
            item.pre_inscrito = 1
            index < this.colores.length ? item.color = this.colores[index].color : item.color = 'fondo'
            // console.log(this.plan_vencido)
          })
        } catch (error) {
          console.log(error)
        }
      },
      async cargarPlanVencido(){
        try {          
          if(this.plan_vencido >= 0){
            let res = await tomaMaterias.getPlanVencidoEstudiante(this.id_estudiante, this.id_gestion)
            let datos = res.data.data
            if(datos[0].cant > 0)
              this.id_plan_vencido = datos[0].cant
          }
        } catch (error) {
          console.log(error)
        }
      },
      async elegirGrupoTeorico(materia){
        try {
          let respGrupoPracticos = await inscripcionService.getAllGruposPracticos(materia.id_materia, materia.id_grupo_teorico, this.id_gestion)
          let gruposPracticos = respGrupoPracticos.data.data
          // console.log(gruposPracticos)
          let respAsignacionGruposTeoricos = await inscripcionService.getAsignacionHorario(materia.id_grupo_teorico, this.id_gestion)                              
          let asignacionTeoricos = respAsignacionGruposTeoricos.data.data
          
          materia.grupos_practicos = gruposPracticos.filter( item => item.inscritos < item.capacidad)
          console.log(materia.grupos_practicos)
          materia.id_grupo_practico = 0
          materia.asignacion_grupos_teoricos = asignacionTeoricos
          // console.log(asignacionTeoricos)
          this.puntero = materia.indice
          this.gruposTeoricos = asignacionTeoricos
          this.gruposPracticos = []
          
          if(materia.id_grupo_teorico > 0){
            materia.grupos_practicos.find( grup => materia.id_grupo_teorico === grup.id_grupo ? materia.existeGrupoPractico = true : materia.existeGrupoPractico = false)
            this.gruardarGruposTeorico()
          }else{
            materia.existeGrupoPractico = false
            this.eliminarGrupos(materia.id_materia)
            setTimeout(() => {              
              this.cargarHorarioPreInscritos()
            }, 100);
          }

        } catch (error) {
          console.log(error)
        }
      },
      async eliminarGrupos(id_materia){
        try {          
          // alert(id_materia)
          let res = await inscripcionService.deleteGrupos(id_materia)          
        } catch (error) {
          console.log(error)
        }
      },
      async eliminarGrupoTeorico(id_materia){
        try {
          let res = await inscripcionService.deleteGrupoTeorico(id_materia, this.id_estudiante, this.id_plan_estudio, this.id_gestion)                     
          // console.log(res)
        } catch (error) {
          console.log(error)
        }
      },
      async eliminarGrupoPractico(id_materia){
        try {
          let res = await inscripcionService.deleteGrupoPractico(id_materia, this.id_estudiante, this.id_plan_estudio, this.id_gestion)
        } catch (error) {
          console.log(error)
        }
      },
      async gruardarGruposTeorico(){
        
        let pre = []
        let materia = this.materias[this.puntero]
        // console.log(materia.id_materia, materia.id_grupo_teorico)
        await this.eliminarGrupos(materia.id_materia)

        if(materia.asignacion_grupos_teoricos.length > 0){
          let asigGrupTeo = materia.asignacion_grupos_teoricos
          // console.log(asigGrupTeo)
          asigGrupTeo.forEach(item => {
            pre.push({
              id_temporal: 0,
              id_estudiante: this.id_estudiante,
              id_materia: materia.id_materia,
              cod_materia: materia.cod_materia,              
              id_plan_estudio: this.id_plan_estudio,
              id_gestion: this.id_gestion,
              id_grupo: item.id_grupo,
              id_grupo_practico: 0,
              id_franja_horaria: item.id_franja_horaria,
              id_dia: item.id_dia,
              id_aula: item.id_aula,
              nombre: materia.materia,
              color: materia.color
            })
          })          
        } 
        pre.forEach( async item => {
          try {
            let resp = await inscripcionService.savePreInscritos(item)
            // console.log(resp) 
          } catch (error) {
            console.log(error)
          }
        })        
        setTimeout(() => {
          this.cargarHorarioPreInscritos()
        }, 100);
      },
      async guardarGrupoPractico(){
        let pre = []
        let materia = this.materias[this.puntero]
        this.eliminarGrupoPractico(materia.id_materia)
        
        if(materia.asignacion_grupos_practicos.length > 0){
          let asigGrupPra = materia.asignacion_grupos_practicos
          asigGrupPra.forEach(item => {
            pre.push({
              id_temporal: 0,
              id_estudiante: this.id_estudiante,
              id_materia: materia.id_materia,
              cod_materia: materia.cod_materia,
              id_plan_estudio: this.id_plan_estudio,
              id_gestion: this.id_gestion,
              id_grupo: 0,
              id_grupo_practico: item.id_g_practica,
              id_franja_horaria: item.id_franja_horaria,
              id_dia: item.id_dia,
              id_aula: item.id_aula,
              nombre: materia.materia,
              color: materia.color
            })
          })
        }        
        pre.forEach( async item => {
          try {
            let resp = await inscripcionService.savePreInscritos(item)  
            // console.log(resp) 
          } catch (error) {
            console.log(error)
          }
        })
        // console.log(pre)
        this.grupos_teoricos = []
        this.grupos_practicos = []

        setTimeout(() => {
          this.cargarHorarioPreInscritos()
        }, 100);
      },
      async elegirGrupoPractico(materia){
        this.puntero = materia.indice
        try {   
          if(materia.id_grupo_practico > 0){            
            let res = await inscripcionService.getAsignacionPracticos(materia.id_grupo_practico)
            let asignacionPracticos = res.data.data
            // console.log(asignacionPracticos)
            this.gruposPracticos = asignacionPracticos
            
            // this.materias[this.puntero].asignacion_grupos_practicos = asignacionPracticos
            materia.asignacion_grupos_practicos = asignacionPracticos
            this.guardarGrupoPractico()
            // console.log(asignacionPracticos)
          }else{
            this.gruposPracticos = []
            // materia.grupos_practicos = []
            this.eliminarGrupoPractico(materia.id_materia)
            setTimeout(() => {
              this.cargarHorarioPreInscritos()
            }, 100);
          }
        } catch (error) {
          console.log(error)
        }
      },      
      async cargarHorarioPreInscritos(){
        try {

          let resp = await inscripcionService.getHorarioPreInscritos(this.id_estudiante, this.id_plan_estudio, this.id_gestion)
          let datos1 = resp.data.data
          let preinscritos = datos1

          let res = await inscripcionService.getFranjaHoraria()
          let franjaHoraria = res.data.data          

          //busca la materia con choque de horarios
          let encontro = false          
          let i = 0
          while(!encontro && i < preinscritos.length){
            for (let index = i; index < preinscritos.length - 1; index++) {
              const element = preinscritos[index + 1];
              if( preinscritos[i].id_franja_horaria === element.id_franja_horaria && preinscritos[i].id_dia === element.id_dia){
                this.materia_choque = element
                encontro = true                
                this.cambiarEstado(this.materias[this.puntero], 'ERROR')
              }
            }
            i++
          }
          setTimeout(() => {
            this.horarios_pre_inscritos = []
                      
            franjaHoraria.forEach( (franja) => { 
              this.horarios_pre_inscritos.push({
                id_franja_horaria: franja.id_franja_horaria,
                hora_inicio: franja.hora_inicio.substring(0, 5),
                hora_fin: franja.hora_fin.substring( 0, 5),
                lunes: preinscritos.find(temporal => temporal.id_franja_horaria === franja.id_franja_horaria && temporal.id_dia === 1),
                martes: preinscritos.find(temporal => temporal.id_franja_horaria === franja.id_franja_horaria && temporal.id_dia === 2),
                miercoles: preinscritos.find(temporal => temporal.id_franja_horaria === franja.id_franja_horaria && temporal.id_dia === 3),
                jueves: preinscritos.find(temporal => temporal.id_franja_horaria === franja.id_franja_horaria && temporal.id_dia === 4),
                viernes: preinscritos.find(temporal => temporal.id_franja_horaria === franja.id_franja_horaria && temporal.id_dia === 5),
                sabado: preinscritos.find(temporal => temporal.id_franja_horaria === franja.id_franja_horaria && temporal.id_dia === 6),
                domingo: preinscritos.find(temporal => temporal.id_franja_horaria === franja.id_franja_horaria && temporal.id_dia === 7),                
              })
            })
          }, 100);
          if(encontro){            
            this.existe_choque_materias = true
            // alert('tiene choque de horarios con el grupo que ha escogido.   id_franja_horaria = ' + this.materia_choque.id_franja_horaria + '  id_dia = '+this.materia_choque.id_dia)
            this.$swal({
              position: 'center',
              icon: 'error',
              title: 'CHOQUE DE HORARIOS!',
              text: 'tiene un choque de horarios con la materia - grupo que ha elegido.!',
              showConfirmButton: true,
            })
          }else{
            this.existe_choque_materias = false
          }
        } catch (error) {
          console.log(error)
        }
      },  
      existeMateriasRecursadas(){
        let encontro = false
        let contador = 0
        while(contador < this.materias.length && !encontro){
          let materia = this.materias[contador]
          
          if(materia.recursada === 1 && materia.pre_inscrito !== 2){
            encontro = true
          }
          // console.log('materia recursada: ', materia.recursada, ' pre_inscrito: ', materia.pre_inscrito, ' encontro = ', encontro)
          contador++
        }
        return encontro
      },  
      validarInscripcion(){
        let error = false
        let contador = 0
        while(contador < this.materias.length && !error){
          let materia = this.materias[contador]
          if(materia.pre_inscrito === 3){
            error = true
          }
          contador++
        }
        if(error){
          this.pre_inscripcion_validada = false          
        }else{
          //verificar si se ha preinscrito la cantidad necesaria
          let cant_inscritos = 0
          for (let index = 0; index < this.materias.length; index++) {
            const materia = this.materias[index];
            if(materia.pre_inscrito === 2){
              cant_inscritos++
            }
          }

          //las materias recursadas se ha tomado todas...? verificando...!          
          let veces = 0
          // let materiasRecursadasTomadas = true
          while(veces < this.materias.length && this.recursadasTomadas){
            let materia = this.materias[veces]
            if(materia.recursada === 1 && materia.pre_inscrito !== 2 ){
              this.recursadasTomadas = false
            }
            veces++
          }
          
          if(cant_inscritos >= this.cant_minima_inscritos){            
            this.pre_inscripcion_validada = true
          }else{
            this.pre_inscripcion_validada = false
          }

          if(this.existeMateriasRecursadas()){
            this.pre_inscripcion_validada = false
          }          
        }
      },
      confirmarInscripcion(){
        
        const swalWithBootstrapButtons = this.$swal.mixin({
          customClass: {
            confirmButton: 'btn btn-success mx-4',
            cancelButton: 'btn btn-danger mx-4'
          },
          buttonsStyling: false
        })

        swalWithBootstrapButtons.fire({
          title: 'Esta Seguro Confirmar la Inscripcion?',
          text: "No podra revertir la inscripcion!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Si, confirmar!',
          cancelButtonText: 'No, cancelar!',
          reverseButtons: true
        }).then((result) => {
          if (result.isConfirmed) {
            this.estado_botones = false
            this.saveInscripcion()            
            swalWithBootstrapButtons.fire(
              'Correcto!',
              'Se ha guardado la Inscripcion Correctamente.',
              'success'
            )            
          } else if (
            /* Read more about handling dismissals below */
            result.dismiss === this.$swal.DismissReason.cancel
          ) {
            swalWithBootstrapButtons.fire(
              'Cancelado',
              'Se ha cancelado la confirmacion de inscripcion :)',
              'error'
            )
          }
        })        
      },
      volverListaEstudiantes(){
        this.eliminarHorario()
        this.$swal({
          position: 'center',
          icon: 'success',
          title: 'Adios...!',
          text: 'ha ABANDONADO la toma de materias!',
          showConfirmButton: false,
          timer: 1500
        })
      },
      async saveInscripcion(){
        try {
          if(this.pre_inscripcion_validada){

            let resp = await estudiantesService.getIdInscripcionUltimo()
            let idInscripcion = resp.data.data[0]
            // console.log(idInscripcion)

            let res2 = await estudiantesService.getIdPersonal(this.id_datos_personal)
            let idPersonal = res2.data.data[0]
            // console.log(idPersonal)
            
            let res3 = await estudiantesService.postInscripcion({
              id_inscripcion: idInscripcion.id_inscripcion,
              id_estudiante: parseInt(this.id_estudiante),
              fecha_transaccion: moment(new Date()).local().format('YYYY-MM-DD'),
              id_gestion: this.id_gestion,
              id_visible: '1',
              id_personal: idPersonal.id_personal,
              id_turno: 1,
              estado: 0,
              baja: null
            })            
            // console.log(res3)

            let res4 = await estudiantesService.getIdInscripPmgdUltimo()
            let pmgd = res4.data[0]            
            let idPMGD = pmgd.id_inscrip
            // console.log(idPMGD)

            for (let index = 0; index < this.materias.length; index++) {
              const materia = this.materias[index];
              if(materia.pre_inscrito === 2){
                
                let id_plan_materia_gestion_docente = this.findIdPMGD(materia.id_grupo_teorico, materia.grupos_teoricos)
            
                let save_inscrip_pmgd = await estudiantesService.create_inscrip_plan_materia_gestion_docente({
                  id_inscrip_pmgd: idPMGD,
                  id_plan_materia_gestion_docente: id_plan_materia_gestion_docente,
                  id_inscripcion: idInscripcion.id_inscripcion,                  
                  fecha_transaccion: moment(new Date()).local().format('YYYY-MM-DD'),
                  id_personal: idPersonal.id_personal,
                  estado_final: 'A',
                  recursado: materia.recursada === 0 ? 'NO': 'SI',
                  tipo_materia: 0,
                })                
                idPMGD++ 
                // console.log(save_inscrip_pmgd)

                if(materia.id_grupo_practico > 0){
                  let id_plan_materia_gestion_docente = this.findIDPMGDPractica(materia.id_grupo_practico, materia.grupos_practicos)
                  let save_inscrip_pmgd = await estudiantesService.create_inscrip_plan_materia_gestion_docente({
                    id_inscrip_pmgd: idPMGD,
                    id_plan_materia_gestion_docente: id_plan_materia_gestion_docente,
                    id_inscripcion: idInscripcion.id_inscripcion,
                    fecha_transaccion: moment(new Date()).local().format('YYYY-MM-DD'),
                    id_personal: idPersonal.id_personal,
                    estado_final: 'A',
                    recursado: materia.recursada === 0 ? 'NO': 'SI',
                    tipo_materia: 1,
                  })                
                  idPMGD++ 
                  // console.log(save_inscrip_pmgd)
                }                
              }
            } 
            let createDeuda = await tomaMaterias.saveDeudaInscripcion({
              id_estudiante: this.id_estudiante,
              id_gestion: this.id_gestion
            }) 

          }
        } catch (error) {
          console.log(error)
        }
      },//"id_g_practica": "134", "id_personal": "A0002-95", "id_grupo": 30797, "id_grupo_practica": 3, "paterno": "ACUÑA", "materno": "ZEBALLOS", "nombres": "HUGO", "id_plan_materia_gestion_docente": 64613 
      findIdPMGD(id_grupo, grupos_teoricos){  
        // console.log(id_grupo, grupos_teoricos)
        let grupo = grupos_teoricos.find( item => item.id_grupo === id_grupo)
        return grupo.id_pmgd
      },
      findIDPMGDPractica(id_g_practica, grupos_practicas){
        let grupo = grupos_practicas.find( item => item.id_g_practica === id_g_practica)        
        return grupo.id_plan_materia_gestion_docente
      },
      cambiarEstado(materia, opcion){
        if(materia){
          switch (opcion) {
            case 'PRE-INSCRIBIRSE':
              this.materias[materia.indice].estado = 2
            break;
            
            case 'HABILITAR':              
              materia.estado = 1
              materia.pre_inscrito = 1
              materia.asignacion_grupos_teoricos = []
              materia.asignacion_grupos_practicos = []
              materia.id_grupo_practico = 0
              materia.id_grupo_teorico = 0
              materia.existeGrupoPractico = false
              materia.pre_inscrito = 1
              this.puntero = materia.indice

              this.eliminarGrupos(materia.id_materia)

              this.validarInscripcion()
              setTimeout(()=>{
                this.cargarHorarioPreInscritos()
              },200);
            break;

            case 'ELIMINAR':
              if(materia.id_grupo_teorico > 0 ){
                this.$swal({
                  position: 'center',
                  icon: 'success',
                  title: 'PRE-INSCRITO correctamente...!',
                  showConfirmButton: false,
                  timer: 1500
                })
                materia.pre_inscrito = 2
                materia.estado = 3
                if(materia.id_grupo_teorico > 0){
                  if(this.gruposTeoricos){
                    materia.asignacion_grupos_teoricos = this.gruposTeoricos          
                  }
                }          
                if(materia.id_grupo_practico > 0){
                  if(this.gruposPracticos){
                    materia.asignacion_grupos_practicos = this.gruposPracticos
                  }
                }
                this.validarInscripcion()
                setTimeout(() => {
                  this.cargarHorarioPreInscritos()
                }, 200);
              }else{
                this.$swal({
                  position: 'center',
                  icon: 'warning',
                  title: 'FALLO!',
                  text: 'Debe elegir un GRUPO TEORICO al menos.!',
                  showConfirmButton: false,
                })
                this.validarInscripcion()
                materia.estado = 1
                materia.pre_inscrito = 1
              }
            break;

            case 'ERROR':              
              if(materia.id_grupo_teorico > 0 ){
                materia.pre_inscrito = 3
                materia.estado = 3
                this.validarInscripcion()
              }
            break;

            default:
              break;
          }
        }        
      },
      async existeChoqueMaterias(){
        let resp = await inscripcionService.getHorarioPreInscritos(this.id_estudiante, this.id_plan_estudio, this.id_gestion)
        let datos1 = resp.data.data
        let preinscritos = datos1

        //busca la materia con choque de horarios
        let encontro = false
        let materia_choque = null
        let i = 0
        while(!encontro && i < preinscritos.length){
          for (let index = i; index < preinscritos.length - 1; index++) {
            const element = preinscritos[index + 1];
            if( preinscritos[i].id_franja_horaria === element.id_franja_horaria && preinscritos[i].id_dia === element.id_dia){
              materia_choque = element
              encontro = true
            }
          }
          i++
        }
        return materia_choque
      },
      mostrarHoraClases(dia){        
        let plantilla_horaria  = ''
        if(dia){
          switch (dia.id_dia) {            
            case 1:
              dia.id_grupo === 0 ?
              plantilla_horaria = `<strong class="${dia.color}">mat: ${dia.nombre} - gr: (${dia.grupo_practico}) - lugar: ${dia.bloque}</strong>`
              :
              plantilla_horaria = `<strong class="${dia.color}">mat: ${dia.nombre} - gr: (${dia.grupo}) - aula: ${dia.aula}</strong>`
            break;

            case 2:
              dia.id_grupo === 0 ?
              plantilla_horaria = `<strong class="${dia.color}">mat: ${dia.nombre} - gr: (${dia.grupo_practico}) - lugar: ${dia.bloque}</strong>`
              :
              plantilla_horaria = `<strong class="${dia.color}">mat: ${dia.nombre} - gr: (${dia.grupo}) - aula: ${dia.aula}</strong>`
            break;

            case 3:              
              dia.id_grupo === 0 ?
              plantilla_horaria = `<strong class="${dia.color}">mat: ${dia.nombre} - gr: (${dia.grupo_practico}) - lugar: ${dia.bloque}</strong>`
              :
              plantilla_horaria = `<strong class="${dia.color}">mat: ${dia.nombre} - gr: (${dia.grupo}) - aula: ${dia.aula}</strong>`
            break;

            case 4:              
              dia.id_grupo === 0 ?
              plantilla_horaria = `<strong class="${dia.color}">mat: ${dia.nombre} - gr: (${dia.grupo_practico}) - lugar: ${dia.bloque}</strong>`
              :
              plantilla_horaria = `<strong class="${dia.color}">mat: ${dia.nombre} - gr: (${dia.grupo}) - aula: ${dia.aula}</strong>`
            break;

            case 5:              
              dia.id_grupo === 0 ?
              plantilla_horaria = `<strong class="${dia.color}">mat: ${dia.nombre} - gr: (${dia.grupo_practico}) - lugar: ${dia.bloque}</strong>`
              :
              plantilla_horaria = `<strong class="${dia.color}">mat: ${dia.nombre} - gr: (${dia.grupo}) - aula: ${dia.aula}</strong>`
            break;

            case 6:              
              dia.id_grupo === 0 ?
              plantilla_horaria = `<strong class="${dia.color}">mat: ${dia.nombre} - gr: (${dia.grupo_practico}) - lugar: ${dia.bloque}</strong>`
              :
              plantilla_horaria = `<strong class="${dia.color}">mat: ${dia.nombre} - gr: (${dia.grupo}) - aula: ${dia.aula}</strong>`

            case 7:              
              dia.id_grupo === 0 ?
              plantilla_horaria = `<strong class="${dia.color}">mat: ${dia.nombre} - gr: (${dia.grupo_practico}) - lugar: ${dia.bloque}</strong>`
              :
              plantilla_horaria = `<strong class="${dia.color}">mat: ${dia.nombre} - gr: (${dia.grupo}) - aula: ${dia.aula}</strong>`
            break;
          
            default:
              break;
          }
        }
        if(this.existe_choque_materias){
          try {
            if(this.materia_choque && dia){
              if(this.materia_choque.id_franja_horaria === dia.id_franja_horaria && this.materia_choque.id_dia === dia.id_dia) {
                this.materia_choque.id_grupo === 0 ?
                plantilla_horaria = plantilla_horaria + `<br><strong class="choque">mat: ${this.materia_choque.nombre} - gr: ${this.materia_choque.id_grupo_practico} - aula: ${this.materia_choque.aula}</strong>`
                :
                plantilla_horaria = plantilla_horaria + `<br><strong class="choque">mat: ${this.materia_choque.nombre} - gr: ${this.materia_choque.id_grupo} - aula: ${this.materia_choque.aula}</strong>`                
              }              
            }
            return plantilla_horaria

          } catch (error) {
            console.log(error)
          }          
        }else{
          return plantilla_horaria
        }       
      },
      async agregarMateriaSolicitada(){
        if(this.materia_solicitada){
          try {          
            let res = await inscripcionService.getAllGruposTeoricos(this.materia_solicitada.id_materia, this.id_plan_estudio, this.id_gestion)
            let gruposTeoricosSolicitados = res.data.data
            
            let materia = {
              id_materia: this.materia_solicitada.id_materia,
              cod_materia: this.materia_solicitada.cod_materia,
              materia: this.materia_solicitada.materia,
              indice : this.materias.length,
              grupos_teoricos : gruposTeoricosSolicitados,
              id_grupo_teorico : 0,
              asignacion_grupos_teoricos : [],
              asignacion_grupos_practicos : [],
              temporal : {},
              puntero : -1,
              estado : 1,
              recursada: 0,
              pre_inscrito : 1,
              color: 'fondo'            
            }          
            setTimeout(() => {
              this.materias.push(materia)
            }, 200);
          } catch (error) {
            console.log(error)
          }
        }                
      }
    },
    computed:{      
    },    
    mounted(){
      this.getMateriasOfertadas()      
      this.eliminarHorario()     
      this.cargarHorarioPreInscritos() 
      this.cargarPlanVencido()      
    }
}
</script>

<style lang="scss" scoped>

  .colorSI {
    font-size: 1.2rem; 
    font-weight: 500;
    color: #00244e;
    background-color: #ff7300;
    padding-left: 20px;
    padding-right: 20px;
    border-radius: 20px;
  }
  .fondo {
    color: #00244e;
    background-color: #ff7300;
    padding: 3px;
    border-radius: 60px;
  }
  .colorERROR{
    font-size: 1.2rem; 
    font-weight: 500;
    color: #ad1010;
  }
  .choque{
    color: #ffffff;
    background-color: #000000d5;
    padding: 3px;
    border-radius: 60px;    
  }
  .rojo{
    color: #b10303;
    background-color: #f0ff23;
    padding: 3px;
    border-radius: 60px;    
  }       
  .azul{
    color: #00244e;
    background-color: #72c740;
    padding: 3px;
    border-radius: 60px;    
  }
  .verde{
    color: #d2ffb5;
    background-color: #4a379ec2;
    padding: 3px;
    border-radius: 60px;    
  }
  .amarillo{
    color: #dbcd00;
    background-color: #1d4075;
    padding: 3px;
    border-radius: 60px;    
  }       
  .naranja{
    color: #f57104;
    background-color: #f1ece0;
    padding: 3px;
    border-radius: 60px;    
  }
  .morado{
    color: #3e0992;
    background-color: #fd4f4fb9;
    padding: 3px;
    border-radius: 60px;    
  }
  .negro{
    color: #1f1919;
    background-color: #1eff00e0;
    padding: 3px;
    border-radius: 60px;    
  }
  .cafe{
    color: #413a28;
    background-color: #caecf7;
    padding: 3px;
    border-radius: 60px;    
  }
  .blanco{
    color: #f7f7f7;
    background-color: #1000a5;
    padding: 3px;
    border-radius: 60px;    
  }
  .fuxia{
    color: #770071;
    background-color: #5eff00;
    padding: 3px;
    border-radius: 60px;    
  }

</style>
